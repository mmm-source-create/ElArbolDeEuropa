import fs from 'node:fs';
import {PERSONAS} from '../../src/data/personas.js';
import {conyugesDe} from '../../src/domain/genealogy/personAccessors.js';

// A catalogue of research candidates, never an inference of marriage or parentage.
export function familyGaps(people) {
  const children=new Map(), byId=new Map(people.map(p=>[p.id,p]));
  for(const child of people)for(const id of [child.padre,child.madre].filter(Boolean)){
    if(!children.has(id))children.set(id,[]);
    children.get(id).push(child);
  }
  const caucasus=p=>/Bagration|Dadian|Guriel|Jakeli|Hetúmida|Shirvan|Georgia|Kartli|Kajetia|Imericia|Armenia/i.test([p.dinastia,...p.reinos||[]].join(' '));
  const row=p=>({id:p.id,name:p.nombre,dynasty:p.dinastia||null,caucasus:caucasus(p),birth:p.nac??null,death:p.muer??null,
    children:(children.get(p.id)||[]).map(c=>({id:c.id,name:c.nombre,father:c.padre||null,mother:c.madre||null})),
    partners:conyugesDe(p),father:p.padre||null,mother:p.madre||null});
  const sort=(a,b)=>Number(b.caucasus)-Number(a.caucasus)||b.children.length-a.children.length||a.id.localeCompare(b.id);
  const parentsWithoutSpouse=people.filter(p=>children.has(p.id)&&!conyugesDe(p).length).map(row).sort(sort);
  const singleParentChildren=people.filter(p=>Boolean(p.padre)!==Boolean(p.madre)).map(p=>({...row(p),knownParentName:byId.get(p.padre||p.madre)?.nombre||null})).sort(sort);
  const rootsMissingDates=people.filter(p=>!p.padre&&!p.madre&&(!Number.isInteger(p.nac)||!Number.isInteger(p.muer))).map(row).sort(sort);
  return {counts:{people:people.length,parentsWithoutSpouse:parentsWithoutSpouse.length,singleParentChildren:singleParentChildren.length,rootsMissingDates:rootsMissingDates.length},parentsWithoutSpouse,singleParentChildren,rootsMissingDates};
}
if(process.argv[1]===new URL(import.meta.url).pathname){
 const report=familyGaps(PERSONAS),target=process.argv.find(x=>x.startsWith('--output='))?.slice(9);
 if(target){fs.mkdirSync(new URL('../../docs/audits/',import.meta.url),{recursive:true});fs.writeFileSync(target,JSON.stringify(report,null,2)+'\n');}
 console.log(JSON.stringify(report.counts,null,2));
}
