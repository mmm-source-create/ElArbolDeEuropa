export function dynastyBranchSelection(branch, people) {
 const byId=new Map(people.map(p=>[p.id,p])),founder=byId.get(branch.fundador);
 if(!founder)return {ids:[],criterion:'sangre'};
 const children=people.filter(p=>p.padre===founder.id||p.madre===founder.id).sort((a,b)=>Number(!branch.personas.includes(a.id))-Number(!branch.personas.includes(b.id))||(a.nac??9999)-(b.nac??9999));
 const ids=[founder.id,founder.padre,founder.madre,...children.slice(0,2).map(p=>p.id)].filter(id=>byId.has(id));
 // Los matrimonios relevantes se indican explícitamente en las ramas patrimoniales.
 const spouse=branch.tipo!=='rama_cadete'?[founder.conyuge,founder.conyuge2,...founder.conyuges||[]].find(id=>branch.personas.includes(id)&&byId.has(id)):null;
 if(spouse)ids.splice(1,0,spouse);
 return {ids:[...new Set(ids)].slice(0,5),criterion:spouse?'matrimonio':'sangre'};
}
