import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {PERSONAS} from '../../src/data/personas.js';
import {reinadosActivos} from '../../src/domain/government/reigns.js';
import {authorityKind} from '../../src/domain/government/authorityKind.js';
import {agrupacionesPoliticasEnMapa,politicalGroupingReview} from '../../src/cartography/kingdomMaps.js';

export function auditPoliticalUnions(people=PERSONAS) {
 const inventory=politicalGroupingReview(),registry=new Map(inventory.map(g=>[g.id,g]));
 assert.equal(registry.size,inventory.length,'Identificadores de agrupación duplicados');
 for(const rule of inventory) {
  assert(rule.source&&rule.note&&rule.reason,`Falta justificación o fuente: ${rule.id}`);
  assert(new URL(rule.source).protocol==='https:',rule.id);
 }
 const before=JSON.stringify(people),counts={years:0,personYears:0,panoramaGroups:0,personalGroups:0,memberships:0};
 for(let year=1200;year<=1800;year++) {
  counts.years++;
  for(const person of people) {
   const active=reinadosActivos(person,year,{soloEfectivos:true});
   if(!active.length)continue;
   counts.personYears++;
   for(const view of ['personal','panorama']) {
    const eligible=new Set(active.filter(m=>authorityKind(m,year)==='sovereign').map(m=>m.territorio));
    const seen=new Set();
    for(const group of agrupacionesPoliticasEnMapa(person,year,{view})) {
     const rule=registry.get(group.id);assert(rule,group.id);
     assert(rule.from<=year&&year<=rule.through,`${group.id}: fecha fuera de regla`);
     if(view==='personal')assert(rule.personal,`${group.id}: unión exterior en mapa personal`);
     counts[view==='personal'?'personalGroups':'panoramaGroups']++;
     for(const member of group.territorios) {
      assert(eligible.has(member),`${person.id}/${year}/${member}: sin gobierno soberano efectivo`);
      assert(!seen.has(member),`${person.id}/${year}/${member}: doble agrupación`);
      assert(!['Alemania','Sacro Imperio'].includes(member),'El título imperial no es dominio directo');
      seen.add(member);counts.memberships++;
     }
    }
   }
  }
 }
 assert.equal(JSON.stringify(people),before,'La presentación ha alterado los mandatos');
 return {rules:inventory.length,...counts};
}
if(import.meta.url===pathToFileURL(process.argv[1]).href)console.log('Uniones políticas: '+JSON.stringify(auditPoliticalUnions()));
