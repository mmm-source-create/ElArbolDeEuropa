import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {pilotJurisdictionsFor,mapLocationsForGovernment,pilotLocationsFor,reviewedLayerNamed} from '../src/cartography/locationMapPilot.js';
import {ARCHDUCAL_LINGEN_PHASE,ARCHDUCAL_LINGEN_SOURCE,archducalLingenAt} from '../src/cartography/archducalLingen638.js';
const data=JSON.parse(fs.readFileSync('data/cartography/corridor-locations.json'));
test('638: the existing joint Netherlands governments reach Lingen only after the reconquest and before reversion',()=>{
 for(const id of ['ALB7AUST','ISABCLARAEUG']){
  const p=PERSONAS.find(p=>p.id===id),government=p.gobiernos.find(g=>g.territorio==='Países Bajos'&&g.desde===1598);
  for(const year of [1598,1604,1622]){
   assert(!pilotJurisdictionsFor('Países Bajos',year,id).includes(ARCHDUCAL_LINGEN_PHASE),`${id} ${year}`);
   assert(!mapLocationsForGovernment(data,government,year,id).includes('Lingen'),`${id} ${year}`);
  }
  for(const year of [1605,1609,1620,1621]){
   assert(pilotJurisdictionsFor('Países Bajos',year,id).includes(ARCHDUCAL_LINGEN_PHASE));
   assert(mapLocationsForGovernment(data,government,year,id).includes('Lingen'),`${id} ${year}`);
   assert(pilotLocationsFor(data,'Países Bajos',year,id).includes('Lingen'));
  }
 }
});
test('638: Lingen scope cannot spread to another person, territory or date',()=>{
 for(const [territory,year,id]of [['Países Bajos',1600,'ALB7AUST'],['Países Bajos',1622,'ISABCLARAEUG'],['Países Bajos',1609,'FEL3ESP'],['Austria',1609,'ALB7AUST'],['Sacro Imperio',1609,'ALB7AUST']]){
  assert.equal(archducalLingenAt(territory,year,id),false);
  assert(!pilotJurisdictionsFor(territory,year,id).includes(ARCHDUCAL_LINGEN_PHASE));
 }
 assert(ARCHDUCAL_LINGEN_SOURCE.locator.includes('Urk. 17'));assert(ARCHDUCAL_LINGEN_SOURCE.locatorEn.includes('1609 charter'));
});

test('638: the documented archducal interval keeps the same identity and geometry without a generic occupation hatch',()=>{
 const review=JSON.parse(fs.readFileSync('data/cartography/germany-completion-review.json'));
 const phases=review.assignments.filter(p=>p.identity==='Condado de Lingen · dominio disputado');
 assert.deepEqual(phases.map(p=>[p.from,p.through]),[[1597,1604],[1605,1621],[1622,1647]]);
 assert(phases.every(p=>p.ids.length===1&&p.ids[0]==='Lingen'));
 assert.equal(phases[1].authorityCondition,undefined);assert.equal(reviewedLayerNamed(data,ARCHDUCAL_LINGEN_PHASE).authorityCondition,undefined);
 assert.equal(phases[0].authorityCondition,'control disputado');assert.equal(phases[2].authorityCondition,'control disputado');
 assert(phases[0].governmentTerritories.length===0&&phases[2].governmentTerritories.length===0);
});
