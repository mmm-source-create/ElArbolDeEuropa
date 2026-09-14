import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {PERSONAS} from '../src/personas.jsx';
import {ADRIATICO_V214} from '../src/content/personas/adriatico-v214.js';
import {CASAS_ADRIATICO,CONEXIONES_ADRIATICO} from '../src/content/dinastias/adriatico-v214.js';
import {HISTORIA_TERRITORIOS} from '../src/content/territorios/index.js';
import {ADRIATICO_SOURCES} from '../src/content/sources-adriatico-v214.js';
import {SOURCES,SOURCE_PUBLICATIONS,sourcesForPerson,FUENTES_TERRITORIOS} from '../src/content/sources.js';
import {RELEVOS_ADRIATICO} from '../src/content/sucesiones/adriatico-v214.js';
import {TERRITORIOS} from '../src/data/territorios.js';
import {auditarTerritorios} from '../src/data/auditTerritorios.js';
import {auditDynasties,buildDynastyPages} from '../src/data/dynastyModel.js';
import {auditarSucesiones,prepararSucesiones,coincideMandato} from '../src/data/successionHistory.js';
import {sucesionDe} from '../src/data/sucesion.js';
import {RelevoExplicado} from '../src/explorer/SuccessionContext.jsx';
import {auditDocumentation,documentaryBounds} from '../src/utils/documentaryDates.js';
import {REINO_A_IDS,TERRITORIOS_SUB} from '../src/Territorios.jsx';
const by=Object.fromEntries(PERSONAS.map(p=>[p.id,p]));

test('la ampliación adriática aporta contenido referenciado sin duplicar publicaciones',()=>{
 assert.equal(Object.keys(ADRIATICO_V214).length,45);
 for(const [id,c]of Object.entries(ADRIATICO_V214)){
  assert.ok(by[id],id);assert.ok(c.biografia.length>150,id);assert.ok(sourcesForPerson(id).length,id);
 }
 assert.equal(new Set(SOURCES.map(s=>s.url)).size,SOURCES.length);
 for(const s of ADRIATICO_SOURCES.filter(s=>s.general))assert.equal(SOURCE_PUBLICATIONS.filter(p=>p.url===s.url).length,1);
 for(const s of ADRIATICO_SOURCES)for(const id of s.personas)assert.ok(by[id],id);
});

test('las madres Rareș y Kosača conservan las filiaciones de cada unión',()=>{
 assert.equal(by.CHIAJNARARES.padre,'PETRURARESMOLD');assert.equal(by.CHIAJNARARES.madre,undefined);
 assert.equal(by.RUXANDRARARES.madre,'ELENABRANKRARES');assert.equal(by.ELENABRANKRARES.padre,'JOVANBRANK');
 assert.equal(by.PETRUTANAR.padre,'MIRCEACIOBAN');assert.equal(by.PETRUTANAR.madre,'CHIAJNARARES');
 assert.equal(by.BOGDAN4LAPU.madre,'RUXANDRARARES');
 assert.equal(by.ISABBOS.padre,'STEPHEN2BOS');assert.equal(by.KATARINAKOSACABOS.padre,'STJEPANVUKKOS');
 assert.notEqual(by.STEPHENTOMASEVICBOS.madre,'KATARINAKOSACABOS');
 assert.equal(by.STEPHEN2BOS.padre,by.VLADISLAVBOS.padre);
});

test('las conexiones de Zrinski y Trebisonda atraviesan personas y matrimonios reales',()=>{
 assert.equal(by.FERENC2RAK.madre,'JELENAZRIN');assert.equal(by.JELENAZRIN.padre,'PETAR4ZRIN');
 assert.equal(by.FERENC1RAK.padre,'GEORGE2RAKOCZI');assert.equal(by.GEORGE2RAKOCZI.padre,'GEORGE1RAKOCZI');
 assert.equal(by.JURAJ5ZRIN.padre,'JURAJ4ZRIN');assert.equal(by.JURAJ4ZRIN.padre,'NIKOLA4ZRIN');
 assert.equal(by.ALEXIOS4TREB.madre,'GULKHANEUDOKIA');assert.equal(by.GULKHANEUDOKIA.padre,'DAVID9GEO');
 assert.equal(by.JOHN4TREB.padre,by.DAVIDTREB.padre);assert.equal(by.JOHN4TREB.madre,'THEODORAALEX4');
 const pages=buildDynastyPages(PERSONAS);
 assert.deepEqual(auditDynasties(PERSONAS),[]);
 for(const name of Object.keys(CASAS_ADRIATICO))assert.ok(pages.find(p=>p.nombre===name)?.editorial,name);
 for(const link of CONEXIONES_ADRIATICO){
  const branch=pages.flatMap(p=>p.ramas).find(r=>r.id===link.id);
  assert.equal(branch.etiqueta,'Alianza matrimonial');assert.ok(branch.arbol.ids.length>=3,link.id);
 }
});

test('banes y reyes de Croacia conviven sin cambiar el rango del territorio',()=>{
 assert.equal(TERRITORIOS.Croacia.clase,'reino');
 const ban=by.PETAR4ZRIN.gobiernos[0];assert.equal(ban.clase,'banato');assert.equal(ban.hasta,1670);
 assert.ok(sucesionDe(PERSONAS,'Croacia').some(r=>r.gobierno.clase==='reinado'));
 assert.deepEqual(auditarTerritorios(PERSONAS).filter(i=>i.severity==='ERROR'),[]);
 const invalid={id:'test',gobiernos:[{...ban,titulo:'Rey'}]};
 assert.ok(auditarTerritorios([invalid]).some(i=>i.code==='TITLE_CLASS_MISMATCH'));
 invalid.gobiernos[0]={...ban,territorio:'Balcanes'};
 assert.ok(auditarTerritorios([invalid]).some(i=>i.code==='GROUP_GOVERNMENT'));
});

test('los títulos nominales y las interrupciones no producen gobiernos territoriales continuos',()=>{
 for(const id of ['DJORDJEMAKSIM','JOVANBRANK']){
  assert.ok(!sucesionDe(PERSONAS,'Serbia').some(r=>r.persona.id===id));
  assert.ok(sucesionDe(PERSONAS,'Serbia',{disputas:true}).some(r=>r.persona.id===id));
 }
 assert.ok(!sucesionDe(PERSONAS,'Transilvania').some(r=>r.persona.id==='FERENC1RAK'));
 assert.ok(!sucesionDe(PERSONAS,'Serbia').some(r=>r.persona.id==='DJURADJBRANKOVIC'&&r.gobierno.desde<1440&&r.gobierno.hasta>1440));
 assert.deepEqual(by.MIRCEACIOBAN.gobiernos.map(g=>[g.desde,g.hasta]),[[1545,1552],[1553,1554],[1558,1559]]);
 assert.deepEqual(by.TVRTKO1BOS.gobiernos.filter(g=>g.clase==='banato').map(g=>[g.desde,g.hasta]),[[1353,1366],[1367,1377]]);
});

test('el nombramiento del ban se renderiza distinto de la toma de posesión',()=>{
 assert.deepEqual(auditarSucesiones(PERSONAS,RELEVOS_ADRIATICO,[],TERRITORIOS,SOURCES),[]);
 for(const r of RELEVOS_ADRIATICO)for(const kind of ['predecesor','sucesor'])assert.equal(by[r[kind].persona].gobiernos.filter(g=>coincideMandato(g,r[kind],r.territorio)).length,1,r.id);
 const ref=p=>({id:p.id,nombre:p.nombre,slug:p.id.toLowerCase()});
 const data=prepararSucesiones(PERSONAS,RELEVOS_ADRIATICO,[],ref,SOURCES);
 const relevo=data.relevos.find(r=>r.territorio==='Croacia');
 const html=renderToStaticMarkup(React.createElement(RelevoExplicado,{relevo}));
 assert.match(html,/nombramiento/);assert.match(html,/Acceso al título · 1665/);assert.match(html,/Toma de posesión · 1668/);
 assert.doesNotMatch(html,/Gobierno efectivo · 1668|Coronación|undefined|NaN/);
});

test('las fichas enriquecidas conservan hitos anteriores y Herzegovina queda en los filtros',()=>{
 for(const name of ['Croacia','Bosnia','Herzegovina','Serbia','Valaquia','Moldavia','Transilvania','Trebisonda']){
  const h=HISTORIA_TERRITORIOS[name];assert.ok(h.resumen.length>100);assert.ok(h.evolucion.length>=4);assert.ok(FUENTES_TERRITORIOS[name]?.length);
  const years=h.evolucion.map(e=>e.anio);assert.deepEqual(years,[...years].sort((a,b)=>a-b));assert.equal(new Set(years).size,years.length);
 }
 for(const year of [1526,1568,1570,1657,1691,1704,1711])assert.ok(HISTORIA_TERRITORIOS.Transilvania.evolucion.some(e=>e.anio===year));
 assert.equal(TERRITORIOS.Herzegovina.naturaleza,'entidad');assert.equal(TERRITORIOS.Herzegovina.clase,'ducado');
 assert.ok(TERRITORIOS_SUB.Balcanes.includes('Herzegovina'));assert.equal(REINO_A_IDS.Herzegovina,undefined);
});

test('las fechas discutidas se conservan como límites, no como años exactos inventados',()=>{
 assert.deepEqual(auditDocumentation(PERSONAS),[]);
 assert.deepEqual(documentaryBounds(by.ALEXIOS4TREB,'nac'),[1379,1382]);
 assert.equal(by.STJEPAN1BOS.muer,undefined);assert.equal(by.CHIAJNARARES.muer,undefined);
 assert.ok(by.CHIAJNARARES.documentacion.notas.some(n=>n.campo==='madre'));
 assert.equal(by.JOHN4TREB.muer,1460);assert.equal(by.DAVIDTREB.gobiernos[0].hasta,1461);assert.equal(by.DAVIDTREB.muer,1463);
});
