import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {build,loadEnv} from 'vite';
import {STATIC_SCHEMA,STATIC_FOLDERS,validatePage} from '../src/public/staticData.js';
import {resolveSiteUrl} from '../src/siteConfig.js';
import {canonicalDynastySlug} from '../src/data/dynastyAliases.js';
import {routesFromSitemap,assetGraph,makeStaticDocument} from './ssg-utils.mjs';

const root=process.cwd(),dist=path.resolve(root,'dist');
const siteUrl=resolveSiteUrl(loadEnv('production',root,'VITE_').VITE_SITE_URL);
const sample=process.argv.includes('--sample');
const shell=await fs.readFile(path.join(dist,'index.html'),'utf8');
const manifest=JSON.parse(await fs.readFile(path.join(dist,'.vite/manifest.json'),'utf8'));
const assets=assetGraph(manifest,'src/public/StaticPublicPage.jsx');
for(const file of [...assets.css,...assets.js])await fs.access(path.join(dist,file));
const allRoutes=routesFromSitemap(await fs.readFile(path.join(dist,'sitemap-full.xml'),'utf8'),siteUrl);
const examples={persona:['carlos-v','isabel-i-de-castilla','fernando-iii','margarita-i-de-dinamarca','juana-de-brabante','jacoba-de-baviera','alix-de-thouars','jelena-zrinski','ruxandra-rares','francisco-i-rakoczi','alejo-iv-de-trebisonda','petar-iv-zrinski'],dinastia:['habsburgo','borbon','zrinski','gran-comneno'],territorio:['castilla','croacia','herzegovina','trebisonda']};
function selectSample(routes) {
 const out=[];
 for(const [kind,limit] of [['persona',12],['dinastia',4],['territorio',4]]) {
  const pool=routes.filter(r=>r.kind===kind),preferred=pool.filter(r=>examples[kind].includes(r.slug));
  out.push(...[...preferred,...pool.filter(r=>!preferred.includes(r))].slice(0,limit));
 }
 if(out.length!==20)throw new Error('Muestra insuficiente');return out;
}
const routes=sample?selectSample(allRoutes):allRoutes;
const temp=await fs.mkdtemp(path.join(root,'.ssg-build-'));
const target=sample?path.join(root,'.ssg-sample'):dist;
if(sample)await fs.rm(target,{recursive:true,force:true});
const stats={version:JSON.parse(await fs.readFile('package.json','utf8')).version,mode:sample?'sample':'full',counts:{persona:0,dinastia:0,territorio:0,historia:0,english:0},pages:[],css:assets.css};
try {
 await build({configFile:false,root,publicDir:false,logLevel:'error',build:{ssr:'src/public/ssg-entry.jsx',outDir:path.join(temp,'renderer'),emptyOutDir:true,minify:false,rolldownOptions:{output:{entryFileNames:'entry.mjs'}}}});
 const {renderPage}=await import(pathToFileURL(path.join(temp,'renderer/entry.mjs')).href);
 for(const route of routes) {
  const data=JSON.parse(await fs.readFile(path.join(dist,STATIC_FOLDERS[route.kind],`${route.slug}${route.chapter?`/capitulo/${route.chapter}`:""}.json`),'utf8'));
  if(route.kind==='dinastia'&&canonicalDynastySlug(route.slug)!==data.slug)throw new Error(`Alias dinástico no reconocido: ${route.path}`);
  const page={schema:STATIC_SCHEMA,...route,data};
  if(!validatePage(page))throw new Error(`Metadatos incompletos: ${route.path}`);
  const rendered=renderPage(page,siteUrl);
  if(!/<h1\b/.test(rendered.html)||/role="alert"/.test(rendered.html)||/Cargando ficha|Preparando ficha histórica|Cargando historia…/.test(rendered.html))throw new Error(`Contenido no disponible: ${route.path}`);
  const html=makeStaticDocument(shell,rendered,page,assets);
  const out=path.join(target,route.path.slice(1),'index.html');
  await fs.mkdir(path.dirname(out),{recursive:true});await fs.writeFile(out,html);
  stats.counts[route.kind]++;stats.pages.push({path:route.path,canonical:rendered.meta.canonical,bytes:Buffer.byteLength(html)});
 }
 if(await fs.readFile(path.join(dist,'index.html'),'utf8')!==shell)throw new Error('Se ha alterado el shell dinámico');
 await fs.writeFile(path.join(sample?target:dist,sample?'report.json':'ssg-report.json'),JSON.stringify(stats,null,2));
 console.log(`SSG ${stats.mode}: ${stats.pages.length} fichas · ${Object.entries(stats.counts).map(([k,n])=>`${n} ${k}`).join(' · ')} · sin solicitudes de red`);
} finally {await fs.rm(temp,{recursive:true,force:true});}
