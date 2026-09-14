import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {loadEnv} from 'vite';
import {STATIC_DATA_ID,STATIC_FOLDERS,validatePage} from '../src/public/staticData.js';
import {DEFAULT_SITE_URL,entityMeta,publicMeta} from '../src/public/publicMeta.js';
import {canonicalDynastySlug} from '../src/data/dynastyAliases.js';
import {routesFromSitemap,assetGraph,escapeHtml} from './ssg-utils.mjs';

// Comprueba el artefacto escrito, sin confiar en el informe del generador.
export function auditDocument(html,page,assets,siteUrl=DEFAULT_SITE_URL) {
 const errors=[];
 const head=html.match(/<head>([\s\S]*?)<\/head>/i)?.[1]||'';
 const meta=publicMeta(entityMeta(page.kind,page.data,page.slug),siteUrl);
 const exactly=(pattern,n=1)=>[...head.matchAll(pattern)].length===n;
 if(!exactly(/<title\b/g)||!head.includes(`<title>${escapeHtml(meta.title)}</title>`))errors.push('Título ausente, duplicado o incorrecto');
 if(!exactly(/<link\b[^>]*rel="canonical"/g)||!head.includes(`rel="canonical" href="${escapeHtml(meta.canonical)}"`))errors.push('Canonical incorrecto');
 for(const [attribute,key,value] of meta.meta) {
  const tags=[...head.matchAll(/<meta\b[^>]*>/g)].map(m=>m[0]).filter(t=>t.includes(`${attribute}="${key}"`));
  if(tags.length!==1||!tags[0].includes(`content="${escapeHtml(value)}"`))errors.push(`Metadato incorrecto: ${key}`);
 }
 for(const {hreflang,href} of meta.alternates)if(!head.includes(`hreflang="${hreflang}" href="${escapeHtml(href)}"`))errors.push(`Falta alternate ${hreflang}`);
 const body=html.slice(html.indexOf('<body'));
 if(!/<div id="root">\s*</.test(body)||[...body.matchAll(/<h1\b/g)].length!==1)errors.push('La ficha no contiene una raíz renderizada y un único H1');
 const reactEscape=s=>escapeHtml(s).replaceAll('&#39;','&#x27;');
 if(!body.includes(`<h1>${reactEscape(page.data.nombre)}</h1>`))errors.push('El H1 no corresponde a la entidad');
 if(/Cargando ficha|Preparando ficha histórica|Cargando historia…|Ficha no disponible|role="alert"/.test(body))errors.push('Se ha renderizado una carga o un error');
 const scripts=[...body.matchAll(new RegExp(`<script id="${STATIC_DATA_ID}" type="application/json">([\\s\\S]*?)<\\/script>`,'g'))];
 try {
  if(scripts.length!==1)throw new Error();
  const raw=scripts[0][1],embedded=JSON.parse(raw);
  if(/[<>&\u2028\u2029]/.test(raw)||!validatePage(embedded)||JSON.stringify(embedded)!==JSON.stringify(page))throw new Error();
 } catch {errors.push('Datos iniciales ausentes, inseguros o distintos del JSON fuente');}
 const links=[...head.matchAll(/<link\b[^>]*>/g)].map(m=>m[0]);
 for(const css of assets.css)if(!links.some(tag=>tag.includes('rel="stylesheet"')&&tag.includes(`href="/${css}"`)))errors.push(`CSS ausente: ${css}`);
 for(const js of assets.js)if(!head.includes(`src="/${js}"`)&&!head.includes(`rel="modulepreload" href="/${js}"`))errors.push(`Módulo ausente: ${js}`);
 if(!body.includes('?atlas=1'))errors.push('Falta el acceso al Atlas');
 return errors;
}

export async function auditBuild(root=process.cwd()) {
 const dist=path.join(root,'dist');
 const siteUrl=loadEnv('production',root,'VITE_').VITE_SITE_URL||DEFAULT_SITE_URL;
 const routes=routesFromSitemap(await fs.readFile(path.join(dist,'sitemap-full.xml'),'utf8'),siteUrl);
 const assets=assetGraph(JSON.parse(await fs.readFile(path.join(dist,'.vite/manifest.json'),'utf8')),'src/public/StaticPublicPage.jsx');
 for(const asset of [...assets.css,...assets.js])await fs.access(path.join(dist,asset));
 const shell=await fs.readFile(path.join(dist,'index.html'),'utf8');
 if(!shell.includes('<div id="root"></div>')||shell.includes(STATIC_DATA_ID))throw new Error('El shell del Atlas ha sido reemplazado');
 const counts={persona:0,dinastia:0,territorio:0},errors=[];
 for(const route of routes) {
  try {
   const data=JSON.parse(await fs.readFile(path.join(dist,STATIC_FOLDERS[route.kind],`${route.slug}.json`),'utf8'));
   const page={schema:1,...route,data};
   if(!validatePage(page))throw new Error('JSON fuente incompleto');
   if(route.kind==='dinastia'&&canonicalDynastySlug(route.slug)!==data.slug)throw new Error('Alias no registrado');
   const html=await fs.readFile(path.join(dist,route.path.slice(1),'index.html'),'utf8');
   errors.push(...auditDocument(html,page,assets,siteUrl).map(e=>`${route.path}: ${e}`));
   counts[route.kind]++;
  } catch(error) {errors.push(`${route.path}: ${error.message}`);}
 }
 const expected=new Set(routes.map(r=>r.path));
 // Detecta fichas obsoletas y páginas dinámicas generadas accidentalmente.
 async function inspect(dir,prefix='/es') {
  for(const entry of await fs.readdir(dir,{withFileTypes:true})) {
   const url=`${prefix}/${entry.name}`;
   if(entry.isDirectory())await inspect(path.join(dir,entry.name),url);
   else if(entry.name==='index.html'&&!expected.has(prefix))errors.push(`HTML fuera del alcance SSG: ${prefix}`);
  }
 }
 await inspect(path.join(dist,'es'));
 const report={version:JSON.parse(await fs.readFile(path.join(root,'package.json'),'utf8')).version,expected:routes.length,counts,errors};
 await fs.writeFile(path.join(dist,'ssg-audit.json'),JSON.stringify(report,null,2));
 if(errors.length)throw new Error(`Auditoría SSG: ${errors.length} errores\n${errors.slice(0,25).join('\n')}`);
 console.log(`Auditoría SSG: ${routes.length} fichas comprobadas; 0 errores; shell dinámico conservado.`);
 return report;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)await auditBuild();
