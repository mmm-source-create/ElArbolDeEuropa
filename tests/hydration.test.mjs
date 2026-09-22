import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {JSDOM} from 'jsdom';
import {act} from 'react';
import {build} from 'vite';
import {person,dynasty,territory} from './fixtures/static-pages.mjs';
import {makeStaticDocument} from '../scripts/ssg-utils.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const dom=new JSDOM('<!doctype html><html><head></head><body></body></html>',{url:'https://www.treeofeurope.eu/es/'});
for(const name of ['window','document','navigator','HTMLElement','HTMLInputElement','Event','MouseEvent'])Object.defineProperty(globalThis,name,{value:name==='window'?dom.window:dom.window[name],configurable:true,writable:true});
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
dom.window.HTMLElement.prototype.scrollIntoView=function(){this.dataset.scrolled='true';};
let runtime,temp,publicCss,requests=[];
const originalFetch=globalThis.fetch;
before(async()=>{
 publicCss=await fs.readFile(path.join(root,'src/public/public.css'),'utf8');
 const nodeEnv=process.env.NODE_ENV;
 temp=await fs.mkdtemp(path.join(root,'.ssg-build-test-'));
 await build({root,configFile:false,publicDir:false,logLevel:'error',plugins:[{
  name:'fixture-generated-home',enforce:'pre',
  resolveId(id){if(/generated\/(home|siteMeta)\.json$/.test(id))return '\0ssg-fixture:'+id+'.js';},
  load(id){if(id.startsWith('\0ssg-fixture:'))return 'export default {buildVersion:"test"};';},
 }],build:{ssr:'tests/fixtures/hydration-entry.jsx',outDir:temp,emptyOutDir:false,minify:false,rolldownOptions:{output:{entryFileNames:'entry.mjs'}}}});
 if(nodeEnv===undefined)delete process.env.NODE_ENV;else process.env.NODE_ENV=nodeEnv;
 runtime=await import(pathToFileURL(path.join(temp,'entry.mjs')).href);
});
after(async()=>{dom.window.close();globalThis.fetch=originalFetch;if(temp)await fs.rm(temp,{recursive:true,force:true});});

async function hydrated(page,check,{dismissed=false,hash='',html}={}) {
 const errors=[];requests=[];
 globalThis.fetch=async url=>{requests.push(url);throw new Error('La ficha SSG no debe descargar su JSON');};
 dom.reconfigure({url:'https://www.treeofeurope.eu'+page.path+hash});
 window.sessionStorage.clear();if(dismissed)window.sessionStorage.setItem('eade:screen-notice-dismissed','1');
 const rendered=runtime.renderPage(page);
 if(!html)html=makeStaticDocument('<!doctype html><html lang="es"><head><title>Inicio</title></head><body><div id="root"></div></body></html>',rendered,page,{css:[],js:[]});
 const parsed=new JSDOM(html);
 document.head.innerHTML=parsed.window.document.head.innerHTML;
 document.body.innerHTML=parsed.window.document.body.innerHTML;parsed.window.close();
 const style=document.createElement('style');style.textContent=publicCss;document.head.appendChild(style);
 // jsdom no ejecuta scripts de módulos. La preferencia se evalúa como en el head del documento.
 document.documentElement.removeAttribute('data-eade-screen-notice');
 if(dismissed)document.documentElement.dataset.eadeScreenNotice='dismissed';
 const container=document.getElementById('root'),heading=container.querySelector('h1'),first=container.firstElementChild;
 assert.equal(heading.textContent,page.data.nombre);
 const originalError=console.error;console.error=(...args)=>errors.push(args.map(String).join(' '));
 let app;
 try {
  await act(async()=>{app=runtime.hydratePage(container,page,{onRecoverableError:error=>errors.push(error.message)});});
  assert.equal(container.firstElementChild,first,'React no debe sustituir la ficha');
  assert.equal(container.querySelector('h1'),heading,'Debe conservarse el H1 del servidor');
  assert.equal(container.querySelector('.public-loading,[role="alert"]'),null);
  assert.equal(document.querySelectorAll('link[rel="canonical"]').length,1);
  assert.equal(document.title,rendered.meta.title);
  assert.ok(container.querySelector('a[href*="?atlas=1"]'));
  await check?.(container);
  assert.deepEqual(requests,[],'Los datos iniciales evitan repetir fetch');
  assert.deepEqual(errors,[],'Sin avisos ni errores de hidratación');
 } finally {if(app)await act(async()=>app.unmount());console.error=originalError;}
}

test('la ficha personal conserva su HTML y permite cambiar de etapa de coronas',async()=>{
 await hydrated(person,async node=>{
  const atlas=node.querySelector('.public-person-actions .public-primary');
  assert.equal(window.getComputedStyle(atlas).color,'rgb(255, 248, 232)');
  const select=node.querySelector('.crown-year select'),before=node.querySelector('.crown-timeline h3').textContent;
  assert.ok(select.options.length>1);
  await act(async()=>{select.value=select.value==='0'?'1':'0';select.dispatchEvent(new window.Event('change',{bubbles:true}));});
  assert.notEqual(node.querySelector('.crown-timeline h3').textContent,before);
  assert.equal(node.querySelector('.site-nav [aria-current="page"]').textContent,'Personas');
 });
});
test('la dinastía conserva el primer render y activa paginación, búsqueda y nombres alternativos',async()=>{
 const page=structuredClone(dynasty);page.data.miembros[39].aliases=['Nombre alternativo único'];
 await hydrated(page,async node=>{
  assert.equal(node.querySelectorAll('#miembros .public-person-card').length,36);
  await act(async()=>node.querySelector('.dynasty-more').click());
  assert.equal(node.querySelectorAll('#miembros .public-person-card').length,40);
  const input=node.querySelector('input[aria-label="Buscar personas de esta casa"]');
  await act(async()=>{Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set.call(input,'Nombre alternativo único');input.dispatchEvent(new window.Event('input',{bubbles:true}));});
  assert.equal(node.querySelectorAll('#miembros .public-person-card').length,1);
  assert.match(node.querySelector('#miembros .public-person-card').textContent,/Persona 40/);
  assert.equal(node.querySelector('.site-nav [aria-current="page"]').textContent,'Dinastías');
 });
});
test('Sucesión activa el filtro de pretensiones después de hidratar',async()=>{
 await hydrated(territory,async node=>{
  const count=()=>node.querySelector('.territory-succession-count').textContent;
  assert.match(count(),/1 mandatos/);
  await act(async()=>node.querySelector('.territory-succession-filter input').click());
  assert.match(count(),/2 mandatos/);
  assert.equal(node.querySelector('.site-nav [aria-current="page"]').textContent,'Territorios');
 });
});
test('el aviso móvil respeta la sesión sin desajustar la hidratación',async()=>{
 await hydrated(person,node=>assert.equal(node.querySelector('.site-screen-notice'),null),{dismissed:true});
 await hydrated(person,async node=>{
  assert.ok(node.querySelector('.site-screen-notice'));
  await act(async()=>node.querySelector('[aria-label="Cerrar aviso"]').click());
  assert.equal(node.querySelector('.site-screen-notice'),null);
  assert.equal(window.sessionStorage.getItem('eade:screen-notice-dismissed'),'1');
 });
});
test('el enlace a una unión abre el desplegable tras la hidratación',async()=>{
 const page=structuredClone(territory);
 page.data.uniones=[{id:'prueba',titulo:'Unión de prueba',resumen:'Contexto',instituciones:'Instituciones propias',territorios:['Castilla','León'],etapas:[],fuentes:[]}];
 await hydrated(page,node=>{
  assert.equal(node.querySelector('#union-prueba').open,true);
  assert.equal(node.querySelector('#union-prueba').dataset.scrolled,'true');
 },{hash:'#union-prueba'});
});
test('sin datos iniciales la ficha dinámica sigue descargando y mostrando el JSON',async()=>{
 dom.reconfigure({url:'https://www.treeofeurope.eu'+dynasty.path});
 document.body.innerHTML='<div id="root"></div>';requests=[];
 globalThis.fetch=async url=>{requests.push(url);return {ok:true,text:async()=>JSON.stringify(dynasty.data)};};
 let app;
 try {
  await act(async()=>{app=runtime.mountDynamicDynasty(document.getElementById('root'),dynasty.slug);});
  assert.equal(document.querySelector('h1').textContent,dynasty.data.nombre);
  assert.ok(requests.some(url=>url.includes(`/dinastias-meta/${dynasty.slug}.json`)));
 } finally {if(app)await act(async()=>app.unmount());}
});
// Opcional: mismo contrato sobre la muestra real, generada después de Vite.
if(process.env.EADE_SSG_SAMPLE) {
 const sample=path.resolve(process.env.EADE_SSG_SAMPLE);
 const {pages}=JSON.parse(await fs.readFile(path.join(sample,'report.json'),'utf8'));
 for(const item of pages)test(`HTML real e hidratación: ${item.path}`,async()=>{
  const html=await fs.readFile(path.join(sample,item.path.slice(1),'index.html'),'utf8');
  const document=new JSDOM(html);const page=JSON.parse(document.window.document.getElementById('eade-initial-page').textContent);document.window.close();
  await hydrated(page,undefined,{html});
 });
}


test('el capítulo conserva el HTML inicial y permite consultar una persona sin abandonar la lectura',async()=>{
 const page={schema:1,kind:'historia',slug:'historia-prueba',chapter:1,path:'/es/historia/historia-prueba/capitulo/1',data:{id:'story-test',slug:'historia-prueba',chapter:1,nombre:'Un primer capítulo',storyTitle:'Historia de prueba',descripcion:'Premisa',pasos:[{anio:1500,titulo:'Un primer capítulo',texto:'Texto del capítulo',personas:['A']}],protagonists:[{id:'A',nombre:'Persona A',slug:'persona-a',resumen:'Una ficha breve'}],fuentes:[]}};
 await hydrated(page,async node=>{
  assert.match(node.textContent,/Texto del capítulo/);
  const summary=node.querySelector('.story-people summary');
  await act(async()=>summary.click());
  assert.equal(summary.parentElement.open,true);
  assert.equal(window.location.pathname,page.path);
  assert.match(node.querySelector('.story-progress').textContent,/1 de 1 capítulos visitados/);
  const atlas=new URL(node.querySelector('article .public-primary').href);
  assert.equal(atlas.searchParams.get('regreso'),page.path);
  assert.equal(atlas.searchParams.get('seleccion'),'A');
 });
});
