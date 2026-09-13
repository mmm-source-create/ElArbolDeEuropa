import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {PERSONAS} from '../src/personas.jsx';
import {TERRITORIOS} from '../src/data/territorios.js';
import {SOURCES} from '../src/content/sources.js';
import {ACCESOS_CORONAS,UNIONES_CORONAS} from '../src/content/coronas/index.js';
import {RELEVOS,CRISIS} from '../src/content/sucesiones/index.js';
import {etapasCoronas,coronasEn,accesosDe,auditarCoronas,prepararUniones,agruparAccesos} from '../src/data/crowns.js';
import {europaEnAnio,vidaEnAnio} from '../src/data/europeYear.js';
import CrownTimeline from '../src/components/CrownTimeline.jsx';
import HistoricalUnions from '../src/components/HistoricalUnions.jsx';
import {EuropeYearContent} from '../src/explorer/EuropeYearDialog.jsx';
import {resolverRuta} from '../src/routing.js';
import {ESCANDINAVIA_V212} from '../src/content/personas/escandinavia-v212.js';
import {EVENTOS_HISTORICOS} from '../src/historiaData.jsx';
import {territorioCoincideConFiltro} from '../src/Territorios.jsx';
import {slugBasePersona} from '../src/utils/personLabels.js';
const by=Object.fromEntries(PERSONAS.map(p=>[p.id,p]));
const g=(territorio,desde,hasta,condicion='efectivo')=>({territorio,desde,hasta,condicion,titulo:'Rey',clase:'reinado'});
const audit=(a=ACCESOS_CORONAS,u=UNIONES_CORONAS)=>auditarCoronas(PERSONAS,a,u,TERRITORIOS,SOURCES);
const context=(personas,anio,extra={})=>europaEnAnio({personas,anio,eventos:EVENTOS_HISTORICOS,crisis:CRISIS,uniones:UNIONES_CORONAS,...extra});

test('los accesos explicados y las uniones remiten a gobiernos, personas y fuentes reales',()=>assert.deepEqual(audit(),[]));
test('el auditor detecta mandatos falsos, fuentes ajenas y uniones desordenadas',()=>{
 const a=structuredClone(ACCESOS_CORONAS[0]);a.desde=900;a.motivos=['intuición'];a.fuentes=['https://invalid.example'];
 const u=structuredClone(UNIONES_CORONAS[0]);u.etapas.reverse();u.etapas[0].personas=['MISSING'];u.hasta=1200;
 assert.ok(audit([a],[u]).length>=6);
 assert.ok(audit([ACCESOS_CORONAS[0],ACCESOS_CORONAS[0]],[]).some(x=>/duplicado/.test(x.message)));
});
test('las etapas conservan huecos y distinguen títulos efectivos, nominales y regencias',()=>{
 const p={gobiernos:[g('Castilla',1200,1202),g('León',1202,1203),g('Francia',1201,1203,'pretensión'),{...g('Aragón',1208,1209,'regencia'),clase:'regencia',titulo:'Regente'}]};
 assert.deepEqual(etapasCoronas(p).map(e=>[e.desde,e.hasta]),[[1200,1200],[1201,1201],[1202,1202],[1203,1203],[1208,1209]]);
 assert.equal(coronasEn(p,1202).efectivos.length,2);assert.equal(coronasEn(p,1202).nominales.length,1);
 assert.equal(coronasEn(p,1207).efectivos.length,0);assert.equal(coronasEn(p,null).efectivos.length,0);
 assert.equal(coronasEn(p,1208).efectivos[0].titulo,'Regente');
});
test('los accesos editoriales tienen prioridad sobre un relevo sin duplicarlo',()=>{
 const p=by.FERN3,custom=ACCESOS_CORONAS.filter(a=>a.persona===p.id);
 const fake=custom.map(a=>({territorio:a.territorio,sucesor:{persona:p.id,desde:a.desde},motivos:['herencia'],explicacion:'Fallback',fuentes:a.fuentes}));
 const result=accesosDe(p,custom,fake);assert.equal(result.length,2);assert.ok(result.every(a=>a.explicacion!=='Fallback'));
});
test('vida incompleta: no se convierte una fecha de nacimiento en una vida sin fin',()=>{
 assert.equal(vidaEnAnio({nac:1200},1500),null);
 assert.equal(vidaEnAnio({nac:1200},1200),'Fecha vital registrada');
 assert.equal(vidaEnAnio({muer:1250},1250),'Fecha vital registrada');
 assert.equal(vidaEnAnio({},1500),null);
 assert.equal(vidaEnAnio({nac:1200,muer:1250},1300),null);
 assert.equal(vidaEnAnio({nac:1200,muer:1250,nacAprox:true},1220),'Fechas aproximadas');
 assert.equal(vidaEnAnio({gobiernos:[g('Suecia',1200,1220)]},1210),'Documentada por un gobierno');
 assert.equal(vidaEnAnio({gobiernos:[g('Suecia',1200,1220,'titular')]},1210),null);
 const p={nac:1201,muer:1251,documentacion:{fechas:{nac:{tipo:'intervalo',desde:1200,hasta:1202},muer:{tipo:'intervalo',desde:1250,hasta:1252}}}};
 assert.equal(vidaEnAnio(p,1201),'Compatible con el intervalo');assert.equal(vidaEnAnio(p,1220),'Vida registrada');assert.equal(vidaEnAnio(p,1252),'Compatible con el intervalo');assert.equal(vidaEnAnio(p,1253),null);
});
test('los filtros limitan también los gobiernos, sin arrastrar otras coronas de la persona',()=>{
 const r=context([by.CARLOS5],1520,{alcanceCompleto:false,territorioIncluido:t=>territorioCoincideConFiltro(t,'Castilla')});
 assert.deepEqual(r.gobiernos.map(g=>g.territorio),['Castilla']);assert.equal(r.nominales.length,0);
 const vacio=context([],1397,{alcanceCompleto:false});assert.equal(vacio.gobiernos.length,0);assert.equal(vacio.eventos.length,0);assert.equal(vacio.uniones.length,0);
});
test('Europa usa el año exacto, incluye los relevos anuales y excluye acontecimientos ajenos al filtro',()=>{
 const ps=[{id:'A',nombre:'Anterior',gobiernos:[g('Suecia',1200,1210)]},{id:'B',nombre:'Siguiente',gobiernos:[g('Suecia',1210,1220)]}];
 const r=europaEnAnio({personas:ps,anio:1210,alcanceCompleto:false,eventos:[{id:'a',anio:1210,personas:['A']},{id:'b',anio:1210,personas:['X']},{id:'c',anio:1209,personas:['A']},{id:'d',desde:1209,hasta:1211,territorios:['Suecia']},{id:'e',anio:1210}]});
 assert.equal(r.gobiernos.length,2);assert.deepEqual(r.eventos.map(e=>e.id),['a','d']);
 const html=renderToStaticMarkup(React.createElement(EuropeYearContent,{resultado:r}));assert.match(html,/relevo dentro del año/);
});
test('Kalmar conserva la autoridad de Margarita y la ruptura del gobierno sueco de Erik',()=>{
 const r=context([by.ERICOPOMERANIA,by.MARGARITA1NORD],1397);
 assert.ok(r.eventos.some(e=>e.id==='KALMAR_1397'));assert.equal(new Set(r.gobiernos.map(g=>g.persona.id)).size,2);
 const crisis=context([by.ERICOPOMERANIA],1435);assert.ok(crisis.nominales.some(g=>g.territorio==='Suecia'));assert.ok(!crisis.gobiernos.some(g=>g.territorio==='Suecia'));
 assert.ok(context([by.ERICOPOMERANIA],1523).uniones.some(u=>u.id==='kalmar'));assert.ok(!context([by.ERICOPOMERANIA],1524).uniones.some(u=>u.id==='kalmar'));
});
test('las crisis fechadas entran y salen del año global sin interpretar textos de periodos',()=>{
 assert.ok(context(PERSONAS,1417).crisis.some(c=>c.id==='jacoba-1417'));
 assert.ok(!context(PERSONAS,1434).crisis.some(c=>c.id==='jacoba-1417'));
});
test('las fichas renderizan condición, precisión anual y explicación, y omiten el bloque sin varios territorios',()=>{
 const p=by.CARLOS5;
 const html=renderToStaticMarkup(React.createElement(CrownTimeline,{persona:p,anio:1520,accesos:accesosDe(p,ACCESOS_CORONAS,RELEVOS),fuentes:SOURCES}));
 assert.match(html,/Cómo reunió estos títulos/);assert.match(html,/titular/);assert.match(html,/coincidir en un año/);assert.match(html,/1530/);assert.match(html,/Borgoña/);
 assert.equal(renderToStaticMarkup(React.createElement(CrownTimeline,{persona:by.HAAKON5NOR})), '');
});
test('las uniones incluyen enlaces a personas, territorios y la vista anual del Atlas',()=>{
 const u=prepararUniones(UNIONES_CORONAS,id=>by[id]?{id,nombre:by[id].nombre,slug:slugBasePersona(by[id])}:null,SOURCES);
 const html=renderToStaticMarkup(React.createElement(HistoricalUnions,{uniones:u}));
 assert.match(html,/union-kalmar/);assert.match(html,/panel=europa/);assert.match(html,/instituciones/i);assert.match(html,/margarita/);
 const ruta=resolverRuta('/','?atlas=1&panel=europa&anio=1397');assert.equal(ruta.view,'explorer');assert.equal(ruta.panel,'europa');
});
test('la ampliación conecta tres generaciones de Kalmar y la ruptura Vasa sin duplicar personas',()=>{
 assert.equal(Object.keys(ESCANDINAVIA_V212).length,47);
 for(const [id,b] of Object.entries(ESCANDINAVIA_V212)){assert.ok(by[id],id);assert.ok(b.biografia.length>120,id);assert.ok(SOURCES.some(s=>s.personas.includes(id)),id);}
 assert.equal(by.ERICOPOMERANIA.madre,'MARIAMECKPOM');assert.equal(by.MARIAMECKPOM.madre,'INGEBORGVALDEMAR');assert.equal(by.INGEBORGVALDEMAR.padre,'VALDEMAR4DIN');
 assert.equal(by.OLAF2NORD.madre,'MARGARITA1NORD');assert.equal(by.CRISTOBALBAVSUE.madre,'CATHPOMNEUMARK');assert.equal(by.GUSTAV1VASA.padre,'ERIKJOHVASA');
 assert.equal(slugBasePersona(by.JUAN2NORD),'juan-ii-de-dinamarca');assert.ok(by.JUAN2NORD.aliases.includes('Hans de Dinamarca'));
});

test('la acumulación de Carlos V explica todos sus títulos y agrupa transmisiones idénticas',()=>{
 const accesos=accesosDe(by.CARLOS5,ACCESOS_CORONAS,RELEVOS);
 assert.equal(accesos.length,by.CARLOS5.gobiernos.length);
 const grupos=agruparAccesos(accesos);
 assert.ok(grupos.length<accesos.length);
 assert.equal(grupos.flatMap(g=>g.mandatos).length,accesos.length);
 const nominal=grupos.find(g=>g.territorios.includes('Borgoña'));
 assert.deepEqual(nominal.territorios,['Borgoña']);
});
