import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import review from '../data/cartography/germany-completion-review.json' with {type:'json'};
import geography from '../data/cartography/germany-completion-geographic-cells.json' with {type:'json'};
import baseline from '../data/cartography/germany-completion-baseline.json' with {type:'json'};
import {validateGermanyCompletion} from '../scripts/audits/audit-germany-completion.mjs';
import {atlasPoliticalMosaicAt} from '../src/cartography/atlasMosaic.js';
import {buildPoliticalMapIndex} from '../src/cartography/politicalMapIndex.js';
import {TERRITORIOS} from '../src/data/territorios.js';
import {PERSONAS} from '../src/data/personas.js';
import {HISTORIA_TERRITORIOS,FUENTES_TERRITORIOS} from '../src/content/territorios/index.js';
const data=JSON.parse(fs.readFileSync(new URL('../data/cartography/corridor-locations.json',import.meta.url)));
const cache=new Map();
const names=(year,id)=>{if(!cache.has(year))cache.set(year,atlasPoliticalMosaicAt(data,year));return(cache.get(year).byLocation.get(id)||[]).map(layer=>layer.entityId);};
test('every new interval fills exactly one recorded vacancy across all 601 years',()=>{
 assert.equal(validateGermanyCompletion(review,geography,baseline).size,1002);
 const missing=baseline.cells.reduce((sum,cell)=>sum+cell.gaps.reduce((n,gap)=>n+gap.through-gap.from+1,0),0);
 assert.equal(missing,226635);
 const invalid=structuredClone(review);invalid.assignments[0].ids.push('Prague');
 assert.throws(()=>validateGermanyCompletion(invalid,geography,baseline),/replace an existing attribution/);
 const omitted=structuredClone(review);omitted.scope.ids.pop();
 assert.throws(()=>validateGermanyCompletion(omitted,geography,baseline),/geographic cell/);
 const hole=structuredClone(review);hole.assignments.pop();
 assert.throws(()=>validateGermanyCompletion(hole,geography,baseline),/gap or overlap/);
});
test('the four geographic anchors are covered at every boundary and representative date',()=>{
 for(const year of [1200,1247,1264,1268,1294,1415,1525,1567,1648,1746,1794,1800])
  for(const id of ['Ragnit','Cochem','St_Johann','Ribe'])assert.equal(names(year,id).length,1,id+'/'+year);
 assert.deepEqual(names(1200,'Ribe'),['Dinamarca']);
 assert.deepEqual(names(1293,'Cochem'),['Dominio imperial de Cochem']);
 assert.deepEqual(names(1294,'Cochem'),['Electorado de Tréveris']);
 assert.deepEqual(names(1794,'Cochem'),['Francia']);
 assert.deepEqual(names(1200,'Ragnit'),['Escalvios']);
 assert.deepEqual(names(1525,'Ragnit'),['Prusia']);
 assert.deepEqual(names(1800,'St_Johann'),['Arzobispado de Salzburgo']);
});
test('Hesse, Swabian institutions and the Swiss predecessors retain their transitions',()=>{
 assert.deepEqual(names(1200,'Kassel'),['Turingia']);
 assert.deepEqual(names(1264,'Kassel'),['Hesse']);
 assert.deepEqual(names(1567,'Marburg'),['Hesse-Marburgo']);
 assert.deepEqual(names(1648,'Marburg'),['Hesse-Kassel']);
 assert.deepEqual(names(1700,'Heidenheim'),['Württemberg']);
 assert.deepEqual(names(1700,'Welzheim'),['Limpurg']);
 assert.deepEqual(names(1525,'Heidenheim'),['Ciudad imperial de Ulm']);
 assert.deepEqual(names(1330,'Schaffhausen'),['Austria Anterior']);
 assert.deepEqual(names(1264,'Kyburg'),['Habsburgo']);
 assert.deepEqual(names(1746,'Munich'),['Baviera']);
 assert.equal(TERRITORIOS['Confederación Suiza'].naturaleza,'agrupacion');
 assert.ok(TERRITORIOS['Confederación Suiza'].componentes.includes('Zúrich'));
});
test('ambiguous identifiers use their actual geography and institutional evidence is inspectable',()=>{
 assert.deepEqual(names(1700,'Neuhaus'),['Ducados de Bremen-Verden']);
 assert.deepEqual(names(1700,'Rotenburg'),['Hesse-Rotenburg']);
 assert.deepEqual(names(1700,'Gryfow'),['Pomerania de Brandeburgo']);
 const index=buildPoliticalMapIndex(PERSONAS,1700,data);
 for(const id of ['Cochem','St_Johann'])
  assert.ok(index.get(id)?.some(entry=>entry.regionalEvidence&&entry.mapSources.length),id);
 // A phase naming a documented ruler's jurisdiction goes to that ruler, with its evidence.
 for(const [id,person] of [['Ragnit','FRED1PRUSSIA'],['Ribe','FRED4DEN'],['Marburg','CHARLESHESSEKASS'],['Neuhaus','CARLOS12SUE']])
  assert.ok(index.get(id)?.some(entry=>entry.person?.id===person&&entry.kind==='sovereign'&&entry.mapSources.length),id);
});
test('every new public identity has a history and its own bibliography',()=>{
 for(const [name,entity] of Object.entries(review.entities)) {
  assert.ok(TERRITORIOS[name],name);
  assert.ok(HISTORIA_TERRITORIOS[name]?.resumen,name);
  assert.ok(HISTORIA_TERRITORIOS[name]?.evolucion.length,name);
  assert.ok(FUENTES_TERRITORIOS[name]?.length,name);
  for(const key of entity.sourceKeys)assert.ok(review.sources[key]?.locator,name+'/'+key);
 }
});
