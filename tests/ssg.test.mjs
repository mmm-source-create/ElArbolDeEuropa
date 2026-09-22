import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {staticRoute,validatePage,initialPageForLocation,readInitialPage,serializePage} from '../src/public/staticData.js';
import {entityMeta,publicMeta} from '../src/public/publicMeta.js';
import {routesFromSitemap,assetGraph,makeStaticDocument} from '../scripts/ssg-utils.mjs';
import {auditDocument} from '../scripts/audit-ssg.mjs';
import {person,dynasty,territory} from './fixtures/static-pages.mjs';
const shell='<!doctype html><html lang="es"><head><title>Portada</title><meta name="description" content="Inicio"><meta property="og:title" content="Portada"><link rel="canonical" href="https://example.org"><link rel="alternate" href="https://example.org"></head><body><div id="root"></div></body></html>';
const assets={css:['assets/ficha.css'],js:['assets/ficha.js']};
const sitemap=urls=>`<urlset>${urls.map(url=>`<url><loc>https://www.treeofeurope.eu${url}</loc></url>`).join('')}</urlset>`;
const htmlFor=page=>makeStaticDocument(shell,{html:`<h1>${page.data.nombre}</h1><a href="${page.path}?atlas=1">Atlas</a>`,meta:publicMeta(entityMeta(page.kind,page.data,page.slug))},page,assets);

test('SSG admite solo fichas públicas y conserva el escape hacia el Atlas',()=>{
 for(const page of [person,dynasty,territory]) {
  assert.equal(validatePage(page),true);
  assert.equal(initialPageForLocation(page,page.path+'/', '?ref=prueba'),page);
  assert.equal(initialPageForLocation(page,page.path,'?atlas=1&anio=1230'),null);
  assert.equal(initialPageForLocation(page,'/es/persona/otra'),null);
 }
 for(const url of ['/es/','/es/desafio','/es/personas','/en/persona/a','/es/persona/../../a'])assert.equal(staticRoute(url),null);
 for(const broken of [null,{}, {...person,schema:2},{...person,data:{...person.data,reinados:null}},{...person,slug:'otra'}])assert.equal(validatePage(broken),false);
});
test('el sitemap determina el alcance y rechaza duplicados y URLs ajenas',()=>{
 assert.equal(routesFromSitemap(sitemap([person.path,'/es/historia/a','/es/desafio',dynasty.path]),'https://www.treeofeurope.eu').length,3);
 for(const xml of [sitemap([person.path,person.path+'/']),sitemap([person.path+'?atlas=1']),sitemap([person.path]).replace('www.treeofeurope.eu','example.org'),'<urlset>',sitemap(['/es/'])])assert.throws(()=>routesFromSitemap(xml,'https://www.treeofeurope.eu'));
});
test('los estilos y preloads recorren imports comunes, sin cargar el motor dinámico del Atlas',()=>{
 const manifest={ficha:{file:'ficha.js',css:['ficha.css'],imports:['shared'],dynamicImports:['atlas']},shared:{file:'shared.js',css:['shared.css'],imports:['ficha']},atlas:{file:'atlas.js'}};
 assert.deepEqual(assetGraph(manifest,'ficha'),{css:['ficha.css','shared.css'],js:['ficha.js','shared.js']});
 delete manifest.shared;assert.throws(()=>assetGraph(manifest,'ficha'),/manifest/);
});
test('el HTML contiene metadatos únicos, contenido y JSON seguro incluso con texto hostil',()=>{
 const page=structuredClone(person);page.data.biografia='</script><img src=x onerror=alert(1)> & $& \u2028 \u2029';
 const dom=new JSDOM(htmlFor(page),{url:'https://www.treeofeurope.eu'+page.path});
 const doc=dom.window.document;
 assert.equal(doc.querySelectorAll('title').length,1);
 assert.equal(doc.querySelectorAll('link[rel="canonical"]').length,1);
 assert.equal(doc.querySelectorAll('meta[name="description"]').length,1);
 assert.equal(doc.querySelector('meta[name="description"]').content,entityMeta('persona',page.data,page.slug).description);
 assert.equal(doc.querySelector('img'),null);
 assert.deepEqual(readInitialPage(doc,dom.window.location),page);
 assert.deepEqual(JSON.parse(serializePage(page)),page);
 assert.equal(doc.querySelector('link[rel="stylesheet"]').getAttribute('href'),'/assets/ficha.css');
 doc.getElementById('eade-initial-page').textContent='{';assert.equal(readInitialPage(doc,dom.window.location),null);
 dom.window.close();
 assert.throws(()=>makeStaticDocument('<head></head><div></div>',{},page,assets));
});
test('el auditor detecta contenido de carga, CSS ausente, canonical falso y divergencia del JSON',()=>{
 const html=htmlFor(person);assert.deepEqual(auditDocument(html,person,assets),[]);
 for(const bad of [html.replace('<h1>Persona 1</h1>','Preparando ficha histórica…'),html.replace('/assets/ficha.css','/otro.css'),html.replace('rel="canonical"','rel="otro"'),html.replace('"schema":1','"schema":2')])assert.ok(auditDocument(bad,person,assets).length>0);
});
test('las reglas de alojamiento priorizan atlas=1 y preservan las rutas de historias y catálogos',async()=>{
 const {rewrites}=JSON.parse(await fs.readFile(new URL('../vercel.json',import.meta.url)));
 const page=rewrites.findIndex(r=>r.destination==='/es/:kind/:slug/index.html');
 const atlas=rewrites.findIndex(r=>r.has?.some(x=>x.key==='atlas'&&x.value==='1'));
 assert.ok(atlas>=0&&atlas<page);
 assert.ok(rewrites.some(r=>r.source==='/es/historia/:slug'&&r.destination==='/index.html'));
 assert.ok(rewrites.some(r=>r.source.includes('desafio')&&r.destination==='/index.html'));
 assert.ok(!rewrites.some(r=>r.source==='/(.*)'));
});
