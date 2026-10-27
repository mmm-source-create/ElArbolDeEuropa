import test, {after,before} from 'node:test';
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
import fs from 'node:fs';
import React,{act} from 'react';
import {JSDOM} from 'jsdom';
import {homeSearchResults,featuredPeopleForLocale} from '../src/features/public/homeSearch.js';
import {TRANSLATED_PEOPLE} from '../src/features/english/routes.js';
import {IMAGENES_PERSONAS} from '../src/data/imagenesPersonas.js';
import {ENGLISH_PROFILE_PORTRAITS} from '../src/features/english/profilePortraits.js';
import {escudoDe} from '../src/content/dinastias/escudos.js';
registerHooks({resolve(specifier,context,nextResolve){if(specifier.endsWith('/generated/siteMeta.json'))return{url:'data:text/javascript,export default {buildVersion:"home-search-test"};',shortCircuit:true};return nextResolve(specifier,context);}});
const {default:HomeSearch}=await import('../src/features/public/HomeSearch.jsx');
const dom=new JSDOM('<div id="root"></div>',{url:'https://treeofeurope.eu/es/'});
for(const key of ['window','document','navigator','HTMLElement','Event','MouseEvent','KeyboardEvent'])Object.defineProperty(globalThis,key,{value:key==='window'?dom.window:dom.window[key],configurable:true,writable:true});
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
let createRoot,app;
before(async()=>{({createRoot}=await import('react-dom/client'));});
after(async()=>{if(app)await act(async()=>app.unmount());dom.window.close();});
async function mount(locale){if(app)await act(async()=>app.unmount());await act(async()=>{app=createRoot(document.getElementById('root'));app.render(React.createElement(HomeSearch,{locale}));});}
async function type(text){const input=document.querySelector('input');await act(async()=>{Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set.call(input,text);input.dispatchEvent(new Event('input',{bubbles:true}));});}
test('home search matches spelling variants, accents and all query words, ranking exact identities first',()=>{
 const items=[{name:'Juan Amor Tarnowski',type:'person',path:'/es/persona/juan-amor-tarnowski',aliases:['Jan Amor Tarnowski']},{name:'Tadeo Kościuszko',type:'person',path:'/es/persona/tadeo-kosciuszko',aliases:['Tadeusz Kościuszko']},{name:'O’Neill',type:'dynasty',path:'/es/dinastia/oneill'},{name:'Juan de Castro',type:'person',path:'/es/persona/juan-de-castro'},{name:'Castro',type:'dynasty',path:'/es/dinastia/castro'}];
 assert.equal(homeSearchResults(items,'jan tarnowski')[0].name,'Juan Amor Tarnowski');assert.equal(homeSearchResults(items,'kosciuszko')[0].name,'Tadeo Kościuszko');assert.equal(homeSearchResults(items,"O'Neill")[0].name,'O’Neill');assert.equal(homeSearchResults(items,'Castro')[0].type,'dynasty');assert.deepEqual(homeSearchResults(items,'Juan Kościuszko'),[]);assert.deepEqual(homeSearchResults(items,'j'),[]);assert.equal(homeSearchResults(items,'castro',1).length,1);
});
test('English home uses exactly the Spanish twenty people, in the same order, without shrinking the full catalogue',()=>{
 const home=JSON.parse(fs.readFileSync(new URL('../src/generated/home.json',import.meta.url))),cards=featuredPeopleForLocale(home.personasDestacadas,TRANSLATED_PEOPLE);
 assert.equal(cards.length,20);assert.deepEqual(cards.map(p=>p.id),home.personasDestacadas.map(p=>p.id));assert(TRANSLATED_PEOPLE.length>cards.length);assert.throws(()=>featuredPeopleForLocale(home.personasDestacadas,[]),/Missing featured/);
});
test('search loads lazily, preserves real links and keyboard clearing, and retries failed downloads in English',async()=>{
 let requests=0;globalThis.fetch=async()=>{requests++;return{ok:true,text:async()=>JSON.stringify({items:[{name:'Tadeo Kościuszko',type:'person',path:'/es/persona/tadeo-kosciuszko',aliases:['Tadeusz Kosciuszko']}]})};};
 await mount('es');assert.equal(requests,0);await type('k');assert.equal(requests,0);await type('kosciuszko');assert.equal(requests,1);assert.equal(document.querySelector('.home-search-results a').getAttribute('href'),'/es/persona/tadeo-kosciuszko');await type('tadeusz');assert.equal(requests,1);await act(async()=>document.querySelector('button[aria-label="Borrar búsqueda"]').click());assert.equal(document.querySelector('input').value,'');assert.equal(document.activeElement,document.querySelector('input'));
 let fail=true;globalThis.fetch=async()=>{requests++;if(fail)throw Error('offline');return{ok:true,text:async()=>JSON.stringify({items:[{name:'Castro',type:'dynasty',path:'/en/dynasty/castro'}]})};};await mount('en');await type('castro');assert.match(document.querySelector('[role=status]').textContent,/could not load/);fail=false;await act(async()=>document.querySelector('.home-search-results button').click());assert.equal(document.querySelector('.home-search-results a').textContent.includes('Dynasty'),true);await act(async()=>document.querySelector('input').dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})));assert.equal(document.querySelector('input').value,'');
});
test('selected portraits keep bilingual attribution uncertainty and five shields retain their licences',()=>{
 for(const id of ['FELIPESUABIA','FED1BARBARROJA','GIANGALSFOR','CATASFOR','LUCRECIABORJA','BIANSFOR','FELMARVISC','BERNVISC']){const p=IMAGENES_PERSONAS[id],en=ENGLISH_PROFILE_PORTRAITS[id];assert(p&&en);assert(p.fuenteUrl&&p.derechosUrl&&p.autor&&en.autor);assert(fs.existsSync(new URL('../public'+p.archivo,import.meta.url)));}
 assert.match(IMAGENES_PERSONAS.CATASFOR.obra,/jazmín/);assert.match(IMAGENES_PERSONAS.BIANSFOR.tipo,/discutidas/);assert.match(IMAGENES_PERSONAS.LUCRECIABORJA.tipo,/desconocida/);assert.match(IMAGENES_PERSONAS.GIANGALSFOR.autor,/Marco d’Oggiono/);assert.match(IMAGENES_PERSONAS.FELMARVISC.autor,/Cristofano/);assert.match(IMAGENES_PERSONAS.BERNVISC.tipo,/Efigie/);
 for(const key of ['Beaufort','Neville','O’Neill','Castro','Shishman']){const p=escudoDe(key);assert(p.imagen.fuente&&p.imagen.licenciaUrl&&p.en.blazon&&p.en.note);assert(fs.existsSync(new URL('../public'+p.imagen.archivo,import.meta.url)));}assert.equal(escudoDe('Shishman').tipo,'emblema');
});
