import test from 'node:test';
import assert from 'node:assert/strict';
import {PERSONAS} from '../src/personas.jsx';
import {RELEVOS,CRISIS} from '../src/content/sucesiones/index.js';
import {TERRITORIOS} from '../src/data/territorios.js';
import {SOURCES} from '../src/content/sources.js';
import {auditarSucesiones,parentescoRegistrado,prepararSucesiones,coincideMandato} from '../src/data/successionHistory.js';
import {sucesionDe} from '../src/data/sucesion.js';
import {slugBasePersona} from '../src/utils/personPresentation.js';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import Sucesion from '../src/explorer/Sucesion.jsx';
import {RelevoExplicado} from '../src/explorer/SuccessionContext.jsx';
const audit=(r=RELEVOS,c=CRISIS)=>auditarSucesiones(PERSONAS,r,c,TERRITORIOS,SOURCES);
const ref=p=>({id:p.id,nombre:p.nombre,slug:slugBasePersona(p),dinastia:p.dinastia});
const prepared=prepararSucesiones(PERSONAS,RELEVOS,CRISIS,ref,SOURCES);

test('los relevos y las reclamaciones remiten a mandatos, filiaciones y fuentes existentes',()=>assert.deepEqual(audit(),[]));
test('el auditor rechaza un mandato inexistente, agrupaciones y fuentes huérfanas',()=>{
 const r=structuredClone(RELEVOS[0]);r.sucesor.desde=1259;r.territorio='Países Bajos y Flandes';r.fuentes=['https://invalid.example'];
 const codes=audit([r],[]).map(x=>x.code);
 for(const c of ['SUCCESSION_TERM','SUCCESSION_TERRITORY','SUCCESSION_SOURCE'])assert.ok(codes.includes(c));
});
test('el auditor impide inventar genealogías, motivos, fechas y crisis',()=>{
 const r=structuredClone(RELEVOS[0]);r.motivos=['automático'];r.fechas=[{tipo:'coronación',anio:3000,nota:'Error'}];r.crisis='missing';
 const c=structuredClone(CRISIS[0]);c.candidatos[0].ascendencia=['CARLOS5','JOHN1AVES'];
 const codes=audit([r],[c]).map(x=>x.code);
 for(const code of ['SUCCESSION_REASON','SUCCESSION_DATE','SUCCESSION_CRISIS','CRISIS_LINEAGE'])assert.ok(codes.includes(code));
});
test('un mandato restaurado conserva su explicación propia aunque sea en el mismo año',()=>{
 const r=RELEVOS.find(r=>r.sucesor.persona==='REIN3GUELD'&&r.motivos.includes('restauración'));
 const terms=PERSONAS.find(p=>p.id==='REIN3GUELD').gobiernos;
 assert.equal(terms.filter(g=>coincideMandato(g,r.sucesor,r.territorio)).length,1);
 assert.equal(r.sucesor.desde,1371);
});
test('el parentesco diferencia generaciones, primos y ausencia de información',()=>{
 assert.match(parentescoRegistrado('ROB3FLAND','LUIS1FLA',PERSONAS).texto,/2 generaciones/);
 assert.match(parentescoRegistrado('PHILSTPOL','FEL3BORG',PERSONAS).texto,/Primos hermanos/);
 assert.match(parentescoRegistrado('ADOLFEGMOND','ARNOLDEGMOND',PERSONAS).texto,/Padre o madre/);
 assert.match(parentescoRegistrado('X','Y',[]).texto,/Sin parentesco identificado/);
 const cyclic=[{id:'a',padre:'b',nombre:'A'},{id:'b',padre:'a',nombre:'B'}];
 assert.doesNotThrow(()=>parentescoRegistrado('a','unknown',cyclic));
});
test('la regencia y el acceso al título de Alberto conservan fechas diferentes',()=>{
 const r=prepared.relevos.find(r=>r.sucesor.persona.id==='ALB1BAV');
 assert.deepEqual(r.fechas.map(f=>[f.tipo,f.anio]),[['gobierno',1358],['acceso',1389]]);
 const html=renderToStaticMarkup(React.createElement(RelevoExplicado,{relevo:r}));
 assert.match(html,/Gobierno efectivo · 1358/);assert.match(html,/Acceso al título · 1389/);
 assert.doesNotMatch(html,/Coronación/);
});
test('el render de la ficha incluye crisis y enlaces utilizables sin cargar el Atlas',()=>{
 const nombre='Henao';
 const territorio={nombre,naturaleza:'entidad',gobiernos:PERSONAS.flatMap(p=>(p.gobiernos||[]).filter(g=>g.territorio===nombre).map(g=>({...g,persona:ref(p)}))),sucesiones:{relevos:prepared.relevos.filter(r=>r.territorio===nombre),crisis:prepared.crisis.filter(c=>c.territorios.includes(nombre))}};
 const html=renderToStaticMarkup(React.createElement(Sucesion,{territorio}));
 assert.match(html,/id="crisis-jacoba-1417"/);assert.match(html,/href="\/es\/persona\/jacoba-de-baviera"/);
 assert.match(html,/atlas=1&amp;persona=JACOBA/);assert.match(html,/Por qué cambió el gobierno/);
 assert.doesNotMatch(html,/undefined|NaN/);
 assert.match(html,/type="checkbox"/);
});
test('una serie sin explicación o vacía no inventa un motivo de sucesión',()=>{
 const territorio={nombre:'Holanda',naturaleza:'entidad',gobiernos:[]};
 const html=renderToStaticMarkup(React.createElement(Sucesion,{territorio}));
 assert.match(html,/No hay gobiernos registrados/);assert.doesNotMatch(html,/Por qué cambió el gobierno/);
});
test('el filtro distingue la reclamación de Felipe II tras la abjuración',()=>{
 const terms=sucesionDe(PERSONAS,'Holanda').filter(r=>r.persona.id==='FEL2ESP');
 assert.equal(terms.length,1);assert.equal(terms[0].gobierno.hasta,1581);
 assert.equal(sucesionDe(PERSONAS,'Holanda',{disputas:true}).filter(r=>r.persona.id==='FEL2ESP').length,2);
});
