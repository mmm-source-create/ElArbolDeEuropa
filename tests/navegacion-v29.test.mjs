import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { layoutRows, visibleRowRange, centeredScroll } from '../src/explorer/virtualRows.js';
import { sanitizeSession, readAtlasSession, writeAtlasSession, shouldResumeAtlas, ATLAS_SESSION_KEY } from '../src/explorer/atlasSession.js';
import { SOURCES, sourcesForPerson, FUENTES_TERRITORIOS } from '../src/content/sources.js';
import { TERRITORIOS } from '../src/data/territorios.js';
import { responsiveImage } from '../src/utils/responsiveImage.js';

test('el centrado usa el zoom actual y el espacio real de cada panel', () => {
  const person = {x: 1000, y: 2400, w: 190, h: 70};
  for (const zoom of [.4,.8,1.4]) for (const width of [320,750,1400]) {
    const view = {clientWidth: width, clientHeight: 600};
    const scroll = centeredScroll(person, zoom, view);
    assert.equal(scroll.left, Math.max(0,1095*zoom-width/2));
    assert.equal(scroll.top,2435*zoom-300);
  }
  assert.deepEqual(centeredScroll({x:0,y:0,w:100,h:50},.4,{clientWidth:700,clientHeight:400}),{left:0,top:0});
});
test('la cronología virtual permite saltos lejanos y recalcula alturas sin omitir filas', () => {
  const rows = Array.from({length:2172},(_,i)=>({key:`person:${i}`,estimatedSize:48}));
  let layout = layoutRows(rows);
  for (const top of [0,18000,60000,103700]) {
    const [start,end] = visibleRowRange(layout.items,top,300);
    const visible=layout.items.slice(start,end);
    assert.ok(visible.length<25);
    assert.ok(visible.some(row=>row.start<=top && row.start+row.size>=top));
  }
  layout=layoutRows(rows,new Map([['person:0',90],['person:700',110]]));
  assert.equal(layout.byKey.get('person:701').start,701*48+42+62);
  assert.equal(layout.total,2172*48+104);
  assert.deepEqual(visibleRowRange([],0,300),[0,0]);
  assert.equal(layoutRows(rows.filter(row=>row.key==='person:2000')).byKey.get('person:2000').start,0);
});
test('la sesión conserva selección, filtros, búsqueda, año y posiciones al volver', () => {
  const memory=new Map();const storage={getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)};
  const state={selectedId:'CARLOS5',query:'Carlos',territorios:['Castilla'],zoom:1.1,anioGlobal:1540,treeCenter:{x:1234,y:5000},timelineScroll:{left:750,top:40000},timelineAnchor:{key:'person:CARLOS5',offset:12},mapViewport:{x:-10,y:40,width:800,height:500},vistasActivas:{arbol:true,mapa:false},panelesVisibles:{filtros:false,biografia:true,cronologia:true},personHistory:{ids:['FERN3','CARLOS5'],index:1}};
  writeAtlasSession(storage,state);const restored=readAtlasSession(storage);
  for(const [key,value] of Object.entries(state))assert.deepEqual(restored[key],value,key);
  memory.set(ATLAS_SESSION_KEY,'broken JSON');assert.equal(readAtlasSession(storage),null);
  assert.equal(readAtlasSession({getItem(){throw Error('blocked')}}),null);
  assert.doesNotThrow(()=>writeAtlasSession({setItem(){throw Error('full')}},state));
});
test('una URL explícita manda sobre la sesión y se descarta almacenamiento inválido', () => {
  assert.equal(shouldResumeAtlas('/es/?atlas=1&continuar=1'),true);
  for(const url of ['/es/persona/carlos-v?atlas=1&continuar=1','/es/?atlas=1','/es/?continuar=1&persona=CARLOS5','/es/?continuar=1&anio=1500','/es/?continuar=1&q=Tamar','/es/?continuar=1&territorio=Georgia'])assert.equal(shouldResumeAtlas(url),false,url);
  assert.equal(sanitizeSession({version:99}),null);
  const state=sanitizeSession({version:1,zoom:Infinity,territorios:['Georgia','Georgia',9],vistasActivas:{arbol:false,mapa:false},treeCenter:{x:-2,y:0}});
  assert.equal(state.zoom,.8);assert.deepEqual(state.territorios,['Georgia']);assert.equal(state.vistasActivas.arbol,true);assert.equal(state.treeCenter,undefined);
});
test('las fuentes son únicas y las asignaciones biográficas y territoriales existen', async () => {
  const {PERSONAS}=await import('data:text/javascript;base64,'+fs.readFileSync(new URL('../src/personas.jsx',import.meta.url)).toString('base64'));
  const ids=new Set(PERSONAS.map(p=>p.id));assert.equal(new Set(SOURCES.map(s=>s.url)).size,SOURCES.length);
  for(const source of SOURCES){assert.equal(new URL(source.url).protocol,'https:');assert.ok(source.titulo);for(const id of source.personas)assert.ok(ids.has(id),id);for(const territory of source.territorios)assert.ok(TERRITORIOS[territory],territory);}
  assert.ok(sourcesForPerson('GRACEOMALLEY').some(s=>s.url.includes('a6886')));
  assert.ok(FUENTES_TERRITORIOS.Chipre.some(s=>s.url.includes('cambridge.org')));
  assert.deepEqual(sourcesForPerson('MISSING'),[]);
});
test('las imágenes adaptables conservan proporciones y funcionan sin variante registrada', () => {
  const image=responsiveImage('/personas-img/ISAB1CAST.webp','58px');
  assert.ok(image.srcSet.includes('96w'));assert.equal(image.sizes,'58px');assert.equal(image.width,1270);assert.equal(image.height,1600);
  assert.deepEqual(responsiveImage('/sin-variante.webp','58px'),{src:'/sin-variante.webp'});
});
test('al reanudar una historia también se conserva el estado al que volver al salir',()=>{
  const state=sanitizeSession({version:1,historiaActivaId:'test',historiaSnapshot:{seleccionId:'CARLOS5',territorios:['Castilla'],anioGlobal:1530,rutaAnterior:'/es/?atlas=1',vistasActivas:{arbol:true,mapa:false}}});
  assert.equal(state.historiaSnapshot.seleccionId,'CARLOS5');assert.deepEqual(state.historiaSnapshot.territorios,['Castilla']);
  assert.equal(state.historiaSnapshot.anioGlobal,1530);assert.equal(state.historiaSnapshot.rutaAnterior,'/es/?atlas=1');
  assert.equal(sanitizeSession({version:1,historiaSnapshot:{rutaAnterior:'//externo.example'}}).historiaSnapshot.rutaAnterior,'/es/?atlas=1');
});
