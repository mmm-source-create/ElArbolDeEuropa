import {SCREEN_NOTICE_SCRIPT} from '../../src/features/public/screenNotice.js';
import {gzipSync} from 'node:zlib';
import {STATIC_DATA_ID,serializePage,staticRoute} from '../../src/features/public/staticData.js';
export const escapeHtml = value => String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const unescapeXml = value => value.replace(/&(?:amp|lt|gt|quot|apos);/g,x=>({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&apos;':"'"}[x]));
export function routesFromSitemap(xml,siteUrl) {
 if(!/<urlset\b/.test(xml)||!/<\/urlset>/.test(xml))throw new Error('Sitemap incompleto o no soportado');
 const seen=new Set(),routes=[];
 for(const match of xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)) {
  const url=new URL(unescapeXml(match[1]));
  if(url.origin!==new URL(siteUrl).origin||url.search||url.hash)throw new Error(`URL ajena o no canónica: ${url}`);
  const route=staticRoute(url.pathname);
  if(!route)continue;
  if(seen.has(route.path))throw new Error(`Ruta duplicada: ${route.path}`);seen.add(route.path);routes.push(route);
 }
 if(!routes.length)throw new Error('El sitemap no contiene fichas estáticas');
 return routes;
}
export function assetGraph(manifest,entry) {
 const seen=new Set(),css=new Set(),js=new Set();
 function visit(key) {
  if(seen.has(key))return;seen.add(key);
  const item=manifest[key];if(!item)throw new Error(`Entrada ausente del manifest: ${key}`);
  if(item.file.endsWith('.js'))js.add(item.file);
  for(const file of item.css||[])css.add(file);
  for(const key of item.imports||[])visit(key);
 }
 visit(entry);
 return {css:[...css],js:[...js]};
}
const STATIC_PAGE_ENTRIES=Object.freeze({
 english:'src/features/english/EnglishPage.jsx',
 historia:'src/features/stories/StoryPage.jsx',
 persona:'src/features/public/PublicSite.jsx',
 dinastia:'src/features/public/DynastyPage.jsx',
 territorio:'src/features/public/TerritoryPage.jsx',
 catalogo:'src/features/public/CatalogStaticPage.jsx',
});
const STATIC_PAGE_NAMES=Object.freeze({english:'EnglishPage',historia:'StoryPage',persona:'PublicSite',dinastia:'DynastyPage',territorio:'TerritoryPage',catalogo:'CatalogStaticPage'});
export function assetsForStaticPage(manifest,kind,pathname='') {
 let entry=STATIC_PAGE_ENTRIES[kind];
 if(!entry)throw new Error(`Tipo de ficha sin punto de entrada: ${kind}`);
 if(!manifest[entry])entry=Object.entries(manifest).find(([,item])=>item.name===STATIC_PAGE_NAMES[kind]&&item.file?.endsWith('.js'))?.[0];
 if(!entry)throw new Error(`Entrada dinámica ausente del manifest: ${kind}`);
 const assets=assetGraph(manifest,entry);
 // Challenge HTML is rendered on the server while its interaction code stays lazy.
 // Include its complete stylesheet graph before the first paint as well.
 if(kind==='english'&&/^\/en\/challenge\/?$/.test(pathname)) {
  const challenge=Object.entries(manifest).find(([key,item])=>key==='src/features/english/EnglishChallenge.jsx'||item.name==='EnglishChallenge')?.[0];
  if(!challenge)throw new Error('Missing challenge stylesheet entry');
  assets.css=[...new Set([...assets.css,...assetGraph(manifest,challenge).css])];
 }
 return assets;
}
export function makeStaticDocument(shell,{html,meta},page,assets) {
 if(!/<div id="root"><\/div>/.test(shell))throw new Error('El shell no contiene una raíz vacía');
 const metaKeys=new Set(meta.meta.map(([a,key])=>`${a}:${key}`));
 let head=shell.match(/<head>([\s\S]*?)<\/head>/i)?.[1];
 if(!head)throw new Error('Shell sin cabecera');
 head=head.replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi,'').replace(/<meta\b[^>]*>/gi,tag=>{
  const key=tag.match(/\b(name|property)=["']([^"']+)["']/i);
  return key&&metaKeys.has(`${key[1]}:${key[2]}`)?'':tag;
 }).replace(/<link\b[^>]*>/gi,tag=>/\brel=["'](?:canonical|alternate)["']/i.test(tag)?'':tag);
 const metadata=[`<title>${escapeHtml(meta.title)}</title>`,...meta.meta.map(([attr,key,value])=>`<meta ${attr}="${key}" content="${escapeHtml(value)}">`),...(meta.canonical?[`<link rel="canonical" href="${escapeHtml(meta.canonical)}">`]:[]),...(meta.alternates||[]).map(a=>`<link rel="alternate" data-eade-hreflang="1" hreflang="${a.hreflang}" href="${escapeHtml(a.href)}">`),...(meta.jsonLd?[`<script type="application/ld+json">${JSON.stringify(meta.jsonLd).replace(/</g,'\\u003c')}</script>`]:[])];
 // 6.1.0: with a bundle, one blocking stylesheet. The separate files stay as
 // links that do not apply (media="not all"): Vite finds them when the page code
 // loads and does not fetch them again or wait for them before hydrating.
 const cssLinks=assets.cssBundle?[`<link rel="stylesheet" href="/${assets.cssBundle}">`,...assets.css.map(file=>(assets.cssBundled||assets.css).includes(file)?`<link rel="stylesheet" href="/${file}" media="not all">`:`<link rel="stylesheet" href="/${file}">`)]:assets.css.map(file=>`<link rel="stylesheet" href="/${file}">`);
 // 6.3.0: no module preloads. The page is complete without JavaScript; up to
 // 1.4 MB of preloaded modules delayed the portrait (LCP 6 s on a slow phone).
 // main.jsx loads the hydration code once the page has loaded.
 const links=[...(assets.preload||[]),...cssLinks].filter(tag=>!/href="[^"]+"/.test(tag)||!head.includes(tag.match(/href="([^"]+)"/)[1]));
 // La preferencia no cambia el HTML que React hidrata. Se aplica antes del primer dibujo.
 const notice=`<script>${SCREEN_NOTICE_SCRIPT}</script>`;
 head+='\n'+metadata.join('\n')+'\n'+links.join('\n')+'\n'+notice+'\n';
 const documentFor=payload=>{
  const data=payload?`<script id="${STATIC_DATA_ID}" type="application/json">${payload}</script>`:'';
  return shell.replace(/<html\b[^>]*>/i,`<html lang="${meta.lang}">`).replace(/<head>[\s\S]*?<\/head>/i,()=>`<head>${head}</head>`).replace('<div id="root"></div>',()=>`<div id="root">${html}</div>\n${data}`);
 };
 if(!page)return documentFor('');
 const plain=serializePage(page,false),packed=serializePage(page);
 const ordinary=documentFor(plain);
 if(plain===packed)return ordinary;
 const compact=documentFor(packed);
 // Compare complete documents, including the rendered text. On short pages
 // gzip already shares repetitions; the dictionary must earn its overhead.
 return gzipSync(compact).length<gzipSync(ordinary).length?compact:ordinary;
}

// 6.1.0: the page's stylesheets (6–7 render-blocking requests) joined in one
// file named after its content. The shell's own stylesheet is not included.
export async function withCssBundle(dist,assets,{write=false,shell=''}={}) {
 const own=assets.css.filter(file=>!shell.includes(`/${file}"`));
 if(own.length<2)return assets;
 const {createHash}=await import('node:crypto');
 const fsp=await import('node:fs/promises');const {join}=await import('node:path');
 const parts=await Promise.all(own.map(file=>fsp.readFile(join(dist,file),'utf8')));
 const text=parts.map((css,i)=>`/* ${own[i].replace(/^assets\//,'')} */\n${css}`).join('\n');
 const file=`assets/page-${createHash('sha256').update(text).digest('hex').slice(0,10)}.css`;
 if(write)await fsp.writeFile(join(dist,file),text);
 else await fsp.access(join(dist,file));
 return {...assets,cssBundle:file,cssBundled:own};
}
