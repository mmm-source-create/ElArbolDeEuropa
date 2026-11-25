// 6.3.2: el modelo de «Sus títulos en el tiempo», separado de su vista.
import {etapasCoronas,coronasEn,claveMandato,agruparAccesos} from './crowns.js';
import {gobiernosDe} from '../genealogy/personAccessors.js';
import {governmentGroupsAt} from './governmentPresentation.js';

const mandate=g=>({key:claveMandato(g),territorio:g.territorio,titulo:g.titulo,condicion:g.condicion,ambito:g.ambito,desde:g.desde,hasta:g.hasta,nota:g.nota});
const groupsAt=(persona,year)=>governmentGroupsAt(persona,year).map(group=>({key:group.key,label:group.label,note:group.note,source:group.source,mandates:group.mandates.map(mandate)}));
const situationAt=(persona,year)=>{const {efectivos,nominales}=coronasEn(persona,year);return {effective:efectivos.length,nominales:nominales.map(mandate),grouped:groupsAt(persona,year)};};

// 6.3.2: el modelo de la línea de coronas. Sin etapas, o con un solo
// territorio, no hay línea. `crownTimelineData` es serializable: va en los
// datos de la ficha pública, una situación por cada comienzo de etapa.
export function crownTimelineModel(persona,accesos=[]) {
 const etapas=etapasCoronas(persona);
 if(new Set(gobiernosDe(persona).map(g=>g.territorio)).size<2||!etapas.length)return null;
 return {
  initial:etapas.reduce((a,b)=>b.efectivos.length>a.efectivos.length?b:a).desde,
  stages:etapas.map(e=>({desde:e.desde,hasta:e.hasta,entities:new Set(governmentGroupsAt(persona,e.desde).map(g=>g.id)).size})),
  accesos:agruparAccesos(accesos).map(a=>({...a,key:claveMandato(a)})),
  at:year=>situationAt(persona,year),
 };
}
// Cada mandato se guarda una vez; las etapas lo citan por su posición.
export function crownTimelineData(persona,accesos=[]) {
 const model=crownTimelineModel(persona,accesos);
 if(!model)return null;
 const {at,...data}=model;
 const mandates=[],index=new Map();
 const ref=m=>{const id=JSON.stringify(m);if(!index.has(id)){index.set(id,mandates.length);mandates.push(m);}return index.get(id);};
 return {...data,mandates,stages:data.stages.map(stage=>{const {effective,nominales,grouped}=at(stage.desde);
  return {...stage,effective,nominales:nominales.map(ref),grouped:grouped.map(group=>({...group,mandates:group.mandates.map(ref)}))};})};
}
