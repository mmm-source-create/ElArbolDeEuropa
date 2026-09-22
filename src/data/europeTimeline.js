import {gobiernosDe} from './crowns.js';
export function nextRecordedYear(year,{personas=[],eventos=[],min=1200,max=1800}={}) {
 const years=[...eventos.flatMap(e=>[e.anio,e.desde,e.hasta]),...personas.flatMap(p=>gobiernosDe(p).flatMap(g=>[g.desde,g.hasta]))].filter(y=>Number.isInteger(y)&&y>year&&y>=min&&y<=max);
 return years.length?Math.min(...years):null;
}
const governmentKey=g=>[g.persona.id,g.territorio,g.desde,g.hasta,g.titulo,g.condicion].join('|');
export function changesBetween(before,after) {
 const previous=new Set(before.gobiernos.map(governmentKey)),current=new Set(after.gobiernos.map(governmentKey));
 return {added:after.gobiernos.filter(g=>!previous.has(governmentKey(g))),removed:before.gobiernos.filter(g=>!current.has(governmentKey(g))),newEvents:after.eventos.filter(e=>!before.eventos.some(p=>p.id===e.id))};
}
export function sharedGovernments(governments) {
 const groups=new Map();
 for(const g of governments){if(!groups.has(g.persona.id))groups.set(g.persona.id,{persona:g.persona,territorios:new Set()});groups.get(g.persona.id).territorios.add(g.territorio);}
 return [...groups.values()].filter(g=>g.territorios.size>1).sort((a,b)=>b.territorios.size-a.territorios.size||a.persona.nombre.localeCompare(b.persona.nombre,'es'));
}
export const EUROPE_REGIONS=[
 ['Península ibérica',['España','Portugal','Navarra']],
 ['Islas británicas e Irlanda',['Inglaterra','Escocia','Irlanda']],
 ['Francia y Países Bajos',['Francia','Países Bajos y Flandes']],
 ['Italia',['Estados Italianos']],
 ['Europa central',['Sacro Imperio','Hungría','Polonia-Lituania','Prusia']],
 ['Escandinavia',['Escandinavia']],
 ['Europa oriental y Mediterráneo oriental',['Rusia','Balcanes','Bizancio y Oriente latino','Georgia y Cáucaso','Armenia','Imperio otomano','Siria','Egipto']],
];
export function governmentRegions(governments,matches=(a,b)=>a===b) {
 const groups=new Map();
 for(const g of governments){const region=EUROPE_REGIONS.find(([,roots])=>roots.some(root=>matches(g.territorio,root)))?.[0]||'Otros territorios registrados';if(!groups.has(region))groups.set(region,[]);groups.get(region).push(g);}
 return [...groups];
}
