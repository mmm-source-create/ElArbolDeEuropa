import {pathToFileURL} from 'node:url';
import {PERSONAS} from '../../src/data/personas.js';
import register from '../../src/content/royalSuccessionRegister.json' with {type:'json'};

// This frozen editorial register is independent of the production person
// array. Annual coverage alone cannot detect a lost five-day king.
export function auditRoyalSuccessions(people=PERSONAS,reference=register) {
 const byId=new Map(people.map(p=>[p.id,p])),errors=[];
 let offices=0,years=0,explainedVacancies=0;
 for(const crown of reference.crowns) {
  if(!crown.reigns.length)errors.push(`${crown.realm}: registro vacío`);
  for(const expected of crown.reigns) {
   offices++;
   const p=byId.get(expected.personId);
   if(!p){errors.push(`${crown.realm}: falta ${expected.personId}`);continue;}
   if(!(p.gobiernos||[]).some(g=>g.territorio===expected.territory&&g.titulo===expected.title
     &&g.desde===expected.from&&g.hasta===expected.through))
    errors.push(`${expected.personId}: falta título ${expected.title} de ${expected.territory}, ${expected.from}–${expected.through}`);
   if(!p.reinos?.includes(expected.territory))errors.push(`${expected.personId}: título ausente de sus territorios`);
  }
  for(let year=crown.from;year<=crown.through;year++) {
   years++;
   const active=crown.reigns.some(g=>g.from<=year&&year<=g.through);
   const vacancy=crown.exceptions.find(e=>e.from<=year&&year<=e.through);
   if(!active&&!vacancy)errors.push(`${crown.realm}: año ${year} sin titular ni vacancia explicada`);
   if(!active&&vacancy){explainedVacancies++;if(!vacancy.note||!vacancy.url?.startsWith('https://'))errors.push(`${crown.realm}: excepción sin evidencia`);}
  }
 }
 // Also catch newly added sovereign descriptions that accidentally lack any
 // office. Consorts, heirs and claimants are not reigning kings by default.
 for(const p of people)if(/^(Rey|Reina|Zar|Emperador|Emperatriz|Sultán)$/.test(p.titulo||'')
   &&p.nac<=1800&&(p.muer??1800)>=1200&&!(p.gobiernos||[]).length)
  errors.push(`${p.id}: soberano sin gobierno asignado`);
 return {crowns:reference.crowns.length,offices,years,explainedVacancies,errors};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const report=auditRoyalSuccessions();
 console.log(`Sucesiones regias: ${report.crowns} series · ${report.offices} títulos · ${report.years} años territoriales · ${report.explainedVacancies} años sin rey explicados`);
 report.errors.forEach(e=>console.error(e));if(report.errors.length)process.exitCode=1;
}
