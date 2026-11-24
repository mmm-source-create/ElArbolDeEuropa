import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {JSDOM} from 'jsdom';
import {build} from 'vite';
import {createEuropeYearUrlSync} from '../src/features/atlas/europeYearUrl.js';

function fakeBrowser(href='https://www.treeofeurope.eu/es/?atlas=1&anio=1200') {
  let url=new URL(href),next=0;const timers=new Map(),visits=[];
  const browser={location:{},history:{state:{eade:'atlas',retained:'state'},replaceState(state,unused,path){visits.push({state,path});url=new URL(path,url);this.state=state;}},setTimeout(fn){timers.set(++next,fn);return next;},clearTimeout(id){timers.delete(id);}};
  for(const key of ['href','pathname','search','hash'])Object.defineProperty(browser.location,key,{get:()=>url[key]});
  return {browser,visits,timers,settle(){for(const [id,fn] of [...timers]){timers.delete(id);fn();}}};
}
const frame=year=>({ready:true,scene:'europa',year,playing:true});

test('600 animation steps write no intermediate URL; stopping records only the visible year',()=>{
  const fake=fakeBrowser(),sync=createEuropeYearUrlSync(fake.browser);
  for(let year=1201;year<=1800;year++)sync.update(frame(year));
  fake.settle();assert.equal(fake.visits.length,0);assert.equal(fake.timers.size,0);
  sync.update({...frame(1800),playing:false});fake.settle();
  assert.equal(fake.visits.length,1);assert.match(fake.browser.location.search,/anio=1800/);
  assert.equal(fake.visits[0].state.retained,'state');
});

test('rapid manual changes settle once and duplicate years create no visit',()=>{
  const fake=fakeBrowser(),sync=createEuropeYearUrlSync(fake.browser);
  for(const year of [1201,1250,1400,1600])sync.update({...frame(year),playing:false});
  assert.equal(fake.timers.size,1);assert.equal(fake.visits.length,0);fake.settle();
  assert.equal(fake.visits.length,1);assert.match(fake.browser.location.search,/anio=1600/);
  sync.update({...frame(1600),playing:false});fake.settle();assert.equal(fake.visits.length,1);
});

test('starting playback cancels a pending year and leaving records the latest frame',()=>{
  const fake=fakeBrowser(),sync=createEuropeYearUrlSync(fake.browser);
  sync.update({...frame(1300),playing:false});sync.update(frame(1301));fake.settle();
  assert.equal(fake.visits.length,0);sync.flush();assert.match(fake.browser.location.search,/anio=1301/);
});

test('year sync preserves selection, filters, anchors and unrelated panels',()=>{
  const fake=fakeBrowser('https://www.treeofeurope.eu/en/person/charles-v?atlas=1&escena=europa&persona=CARLOS5&territorio=Francia&panel=biografia#details');
  const sync=createEuropeYearUrlSync(fake.browser);sync.update({...frame(1530),playing:false});fake.settle();
  const result=new URL(fake.browser.location.href);
  assert.equal(result.pathname,'/en/person/charles-v');assert.equal(result.hash,'#details');
  assert.equal(result.searchParams.get('persona'),'CARLOS5');assert.equal(result.searchParams.get('territorio'),'Francia');
  assert.equal(result.searchParams.get('panel'),'biografia');assert.equal(result.searchParams.has('escena'),false);
});

test('inactive scenes, incomplete years and disposed controllers cannot rewrite navigation',()=>{
  const fake=fakeBrowser(),sync=createEuropeYearUrlSync(fake.browser);
  for(const snapshot of [{...frame(1500),ready:false},{...frame(1500),scene:'atlas'},frame(null),frame(1500.5)]){sync.update(snapshot);sync.flush();fake.settle();}
  assert.equal(fake.visits.length,0);
  sync.update({...frame(1500),playing:false});sync.dispose();fake.settle();assert.equal(fake.visits.length,0);assert.equal(sync.flush(),false);
});

let components,temp;
before(async()=>{
  temp=fs.mkdtempSync(new URL('../.ssg-build-v614-',import.meta.url));const environment=process.env.NODE_ENV;
  await build({configFile:false,publicDir:false,logLevel:'error',build:{ssr:'tests/fixtures/v614-entry.jsx',outDir:temp,emptyOutDir:false,minify:false,rolldownOptions:{output:{entryFileNames:'entry.mjs'}}}});
  if(environment===undefined)delete process.env.NODE_ENV;else process.env.NODE_ENV=environment;
  components=await import(pathToFileURL(temp+'/entry.mjs'));
});
after(()=>{if(temp)fs.rmSync(temp,{recursive:true,force:true});});

test('house record action stays last, after tree connections, in both languages',()=>{
  for(const locale of ['es','en'])for(const connected of [false,true]){
    const label=locale==='en'?'Read the record':'Ver ficha';
    const node=React.createElement(components.DynastyCard,{locale,item:{nombre:'Anjou',key:'Anjou',slug:'anjou',path:locale==='en'?'/en/dynasty/anjou':'/es/dinastia/anjou',total:11},children:connected?React.createElement('a',{href:'/es/?atlas=1&conectar=A,B'},locale==='en'?'View the connection in the tree':'Ver la conexión en el árbol'):null});
    const doc=new JSDOM(renderToStaticMarkup(node)).window.document;
    const card=doc.querySelector('article'),last=card.lastElementChild;
    assert.equal(last.tagName,'A');assert.ok(last.classList.contains('dynasty-card-record'));assert.ok(last.textContent.includes(label));
    if(connected)assert.ok(card.querySelector('.dynasty-card-connections a'));
  }
});

test('empty and populated Atlas search keep the same navigation controls in the DOM',()=>{
  for(const locale of ['es','en'])for(const query of ['','Galileo']){
    const vm={locale,query,queryTrim:query,searchMatchIds:query?['GALILEO']:[],currentSearchIndex:0,anioGlobal:1500,anioInput:'1500',atlasScene:'atlas',positions:{},gobernantesActivosEnAnio:[],personasVivasEnAnio:[]};
    const html=renderToStaticMarkup(React.createElement(components.AtlasTopbar,{vm,searchOpen:false,searchResults:{people:[],dynasties:[],territories:[],stories:[],events:[],total:0},setSearchOpen(){}}));
    const doc=new JSDOM(html).window.document,nav=doc.querySelector('.toolbar-search-nav');
    assert.equal(nav.hidden,!query);assert.equal(nav.querySelectorAll('button').length,3);
    assert.ok(doc.querySelector('#atlas-person-search'));
  }
});
