import {SCREEN_NOTICE_SCRIPT} from '../src/public/screenNotice.js';
import {STATIC_DATA_ID,serializePage,staticRoute} from '../src/public/staticData.js';
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
export function makeStaticDocument(shell,{html,meta},page,assets) {
 if(!/<div id="root"><\/div>/.test(shell))throw new Error('El shell no contiene una raíz vacía');
 const metaKeys=new Set(meta.meta.map(([a,key])=>`${a}:${key}`));
 let head=shell.match(/<head>([\s\S]*?)<\/head>/i)?.[1];
 if(!head)throw new Error('Shell sin cabecera');
 head=head.replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi,'').replace(/<meta\b[^>]*>/gi,tag=>{
  const key=tag.match(/\b(name|property)=["']([^"']+)["']/i);
  return key&&metaKeys.has(`${key[1]}:${key[2]}`)?'':tag;
 }).replace(/<link\b[^>]*>/gi,tag=>/\brel=["'](?:canonical|alternate)["']/i.test(tag)?'':tag);
 const metadata=[`<title>${escapeHtml(meta.title)}</title>`,...meta.meta.map(([attr,key,value])=>`<meta ${attr}="${key}" content="${escapeHtml(value)}">`),`<link rel="canonical" href="${escapeHtml(meta.canonical)}">`,...meta.alternates.map(a=>`<link rel="alternate" data-eade-hreflang="1" hreflang="${a.hreflang}" href="${escapeHtml(a.href)}">`)];
 const links=[...assets.css.map(file=>`<link rel="stylesheet" href="/${file}">`),...assets.js.map(file=>`<link rel="modulepreload" href="/${file}">`)].filter(tag=>!head.includes(tag.match(/href="([^"]+)"/)[1]));
 // La preferencia no cambia el HTML que React hidrata. Se aplica antes del primer dibujo.
 const notice=`<script>${SCREEN_NOTICE_SCRIPT}</script>`;
 head+='\n'+metadata.join('\n')+'\n'+links.join('\n')+'\n'+notice+'\n';
 const data=page?`<script id="${STATIC_DATA_ID}" type="application/json">${serializePage(page)}</script>`:'';
 return shell.replace(/<html\b[^>]*>/i,`<html lang="${meta.lang}">`).replace(/<head>[\s\S]*?<\/head>/i,()=>`<head>${head}</head>`).replace('<div id="root"></div>',()=>`<div id="root">${html}</div>\n${data}`);
}
