import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React,{act} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createRoot} from 'react-dom/client';
import {JSDOM} from 'jsdom';
import {TERRITORIOS} from '../src/data/territorios.js';
import regions from '../src/content/territoryRegions.json' with {type:'json'};
import {repairEnglishPresentation} from '../src/features/english/nameCorrections.js';
import {territoryCatalogMetadata} from '../scripts/generate/territory-catalog.mjs';
import {TERRITORY_CLASSES,TERRITORY_NATURES,TERRITORY_REGIONS,filterTerritories,territoryDirectory,territoryExcerpt,territoryFeaturedOrder} from '../src/features/public/territoryCatalog.js';
import {catalogPreview,CATALOG_PREVIEW} from '../src/features/public/catalogPreview.js';
import {build} from 'vite';
import {pathToFileURL} from 'node:url';
let TerritoryCatalog,temp;
before(async()=>{
  temp=fs.mkdtempSync(new URL('../.ssg-build-territories-',import.meta.url));
  const nodeEnv=process.env.NODE_ENV;
  await build({configFile:false,publicDir:false,logLevel:'error',build:{ssr:'tests/fixtures/territory-catalog-entry.jsx',outDir:temp,emptyOutDir:false,minify:false,rolldownOptions:{output:{entryFileNames:'entry.mjs'}}}});
  if(nodeEnv===undefined)delete process.env.NODE_ENV;else process.env.NODE_ENV=nodeEnv;
  TerritoryCatalog=(await import(pathToFileURL(temp+'/entry.mjs'))).TerritoryCatalog;
});
after(()=>{if(temp)fs.rmSync(temp,{recursive:true,force:true});});
const read=path=>JSON.parse(fs.readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const es=read('public/catalogos/territorios.json');

test('every canonical territory has a deliberate geographic assignment and bilingual categories',()=>{
  const names=Object.values(regions.regions).flat();
  assert.equal(new Set(names).size,names.length);
  assert.deepEqual(names.slice().sort(),Object.keys(TERRITORIOS).sort());
  for(const [name,t] of Object.entries(TERRITORIOS)){
    for(const labels of [TERRITORY_CLASSES[t.clase],TERRITORY_NATURES[t.naturaleza]])assert.ok(labels?.length===2&&labels.every(Boolean),name);
  }
  for(const [region,names] of Object.entries(regions.regions)){assert.ok(TERRITORY_REGIONS[region]);assert.ok(names.length);}
  for(const [name,extra] of Object.entries(regions.additional)){assert.ok(TERRITORIOS[name]);for(const region of extra)assert.ok(TERRITORY_REGIONS[region]);}
});

test('translation repairs preserve canonical identity and native search aliases',()=>{
  const result=repairEnglishPresentation({key:'Gregorio IX',nombre:'Gregorio IX',searchAliases:['Gregorio IX']});
  assert.equal(result.key,'Gregorio IX');assert.equal(result.nombre,'Gregory IX');assert.deepEqual(result.searchAliases,['Gregorio IX']);
});

test('combined filters find aliases and preserve holes between recorded governments',()=>{
  const burgundy=filterTerritories(es.items,{query:'Franche-Comté',region:'france-low-countries',nature:'entidad',type:'condado',year:'1500',history:true});
  assert.equal(burgundy.length,1);assert.equal(burgundy[0].key,'Condado de Borgoña');
  assert.equal(filterTerritories(burgundy,{year:'1485'}).length,0);
  assert.equal(filterTerritories(burgundy,{year:'not a year'}).length,0);
  assert.equal(filterTerritories(burgundy,{region:'italy'}).length,0);
  assert.equal(filterTerritories(burgundy,{region:'central-alps'}).length,1);
});

test('coverage uses recorded mandates and respects the start of a composite polity',()=>{
  const people=[{id:'A',gobiernos:[{territorio:'X',desde:1400,hasta:1500}]},{id:'B',gobiernos:[{territorio:'X',desde:1550,hasta:1570}]}];
  const metadata=territoryCatalogMetadata('Polonia-Lituania',{naturaleza:'compuesta',clase:'union_compuesta',desde:1569},{},people,['X']);
  assert.deepEqual(metadata.intervalos,[[1569,1570]]);assert.equal(metadata.gobernantes,1);
  const empty=territoryCatalogMetadata('Venecia',{naturaleza:'entidad',clase:'republica',desde:1651,hasta:1796},{},[],['Venecia']);
  assert.deepEqual(empty.intervalos,[],'Map dates cannot manufacture historical lifespan or government coverage');
  assert.equal(filterTerritories([{...empty,nombre:'Venecia'}],{year:'1700'}).length,0);
});

test('regional previews retain every region, complete facet counts and every A–Z link',()=>{
  const preview=catalogPreview(es,{tipo:'territorios',full:'/catalogos/territorios.json'});
  assert.equal(preview.items.length,CATALOG_PREVIEW);
  assert.equal(preview.directory.length,Object.keys(TERRITORIOS).length);
  for(const region of Object.keys(TERRITORY_REGIONS)){
    assert.ok(preview.items.some(t=>t.regiones.includes(region)),region);
    assert.equal(preview.territoryFacets.regiones[region],es.items.filter(t=>t.regiones.includes(region)).length);
  }
  assert.deepEqual(territoryFeaturedOrder(es.items.filter(t=>t.regiones.includes('italy')),'es','italy').slice(0,6).map(t=>t.key),['Estados Italianos','Estados Pontificios','Venecia','Milán','Nápoles','Sicilia']);
});

test('both editions retain the same identities, filters and native HTML directory',()=>{
  const en=read('public/catalogos/territories-en.json');
  assert.deepEqual(en.items.map(t=>t.key).sort(),es.items.map(t=>t.key).sort());
  for(const item of en.items){
    const original=es.items.find(t=>t.key===item.key);
    assert.deepEqual(item.regiones,original.regiones);assert.deepEqual(item.intervalos,original.intervalos);
    assert.equal(item.editorial,original.editorial);assert.equal(item.gobernantes,original.gobernantes);
    assert.ok(item.path.startsWith('/en/territory/'));
  }
  assert.equal(filterTerritories(en.items,{query:'Franco Condado'})[0].key,'Condado de Borgoña');
  for(const [locale,data] of [['es',es],['en',en]]){
    const preview=catalogPreview(data,{tipo:'territorios',locale,full:'/unused.json'});
    const doc=new JSDOM(renderToStaticMarkup(React.createElement(TerritoryCatalog,{locale,initialData:preview,embedded:true}))).window.document;
    assert.equal(doc.querySelectorAll('h1').length,1);
    assert.equal(doc.querySelectorAll('#territory-directory li a').length,1033); // 6.3.4–6.3.5: eight duplicates merged
    assert.equal(new Set([...doc.querySelectorAll('#territory-directory li a')].map(a=>a.getAttribute('href'))).size,1033);
    // 6.3.5: region and entity kind are chips; only the type stays a select, inside «More filters».
    assert.equal(doc.querySelectorAll('select').length,1);
    assert.ok(doc.querySelector('.territory-catalog-more select'));
    assert.equal(doc.querySelectorAll('.territory-catalog-region').length,10);
    if(locale==='en')assert.doesNotMatch(doc.querySelector('.territory-catalog-controls').textContent,/Naturaleza|Península|Con gobierno|Quitar filtros/);
  }
});

test('card summaries stay brief and retain the detailed record as their destination',()=>{
  const long='Una primera explicación bastante extensa del territorio y de sus principales características históricas. '+ 'Segunda frase. '.repeat(30);
  assert.ok(territoryExcerpt(long).startsWith('Una primera explicación'));
  assert.ok(territoryExcerpt(long).length<=240);
  assert.ok(territoryExcerpt(long).endsWith('.'));
  assert.ok(territoryExcerpt('Una frase sin punto '.repeat(40)).length<=241);
  assert.deepEqual(territoryDirectory([{nombre:'Óblast',path:'/en/x'},{nombre:'Álava',path:'/en/y'}],'es').map(i=>i.n),['Álava','Óblast']);
});

test('a failed extended list remains recoverable and filters use the loaded full list',async()=>{
  const dom=new JSDOM('<!doctype html><html><head></head><body><div id="root"></div></body></html>',{url:'https://www.treeofeurope.eu/es/territorios'});
  const originals=Object.fromEntries(['window','document','navigator','HTMLElement','Event','fetch','IS_REACT_ACT_ENVIRONMENT'].map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]));
  for(const key of ['window','document','navigator','HTMLElement','Event'])Object.defineProperty(globalThis,key,{value:key==='window'?dom.window:dom.window[key],configurable:true,writable:true});
  globalThis.IS_REACT_ACT_ENVIRONMENT=true;
  const source=es.items.find(t=>t.key==='Condado de Borgoña');
  const partial={items:[es.items[0]],partial:{total:2,full:'/v611-retry-test.json'},directory:territoryDirectory([es.items[0],source])};
  let calls=0;globalThis.fetch=async()=>{calls++;if(calls===1)throw Error('offline');return {ok:true,text:async()=>JSON.stringify({items:[es.items[0],source]})};};
  const app=createRoot(document.getElementById('root'));
  try{
    await act(async()=>app.render(React.createElement(TerritoryCatalog,{initialData:partial,embedded:true})));
    assert.match(document.querySelector('.territory-catalog-load').textContent,/No se ha podido/);
    assert.equal(document.querySelectorAll('#territory-directory li a').length,2);
    await act(async()=>document.querySelector('.territory-catalog-load button').click());
    assert.equal(document.querySelector('.territory-catalog-load'),null);assert.equal(calls,2);
    // 6.3.5: type is the folded filter's only select; clearing is the facets' link.
    const select=document.querySelector('.territory-catalog-select');
    await act(async()=>{select.value='condado';select.dispatchEvent(new dom.window.Event('change',{bubbles:true}));});
    assert.equal(document.querySelector('.territory-catalog-results-head p').textContent,'1 territorio');
    assert.equal(document.querySelector('.territory-catalog-card h3').textContent,'Condado de Borgoña');
    await act(async()=>document.querySelector('.people-facets-clear').click());
    assert.equal(document.querySelector('.territory-catalog-results-head p').textContent,'2 territorios');
  }finally{
    await act(async()=>app.unmount());dom.window.close();
    for(const [key,descriptor] of Object.entries(originals)){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}
  }
});
