import {governmentGroupsAt} from './governmentPresentation.js';
import {vidaEnAnio} from './europeYear.js';
import {atlasPoliticalMosaicAt,atlasMosaicPalette} from '../../prototypes/euv-locations/atlas-mosaic.js';
import {pilotJurisdictionsFor,mapLocationsForGovernment} from './locationMapPilot.js';
import {REINO_COLOR,idsDeGobiernoEnAño} from '../Territorios.jsx';
import {territorialIdentity} from './territorialIdentity.js';

export function governmentTableAt(people,year,collectives=[]) {
 const rows=new Map();
 for(const person of people) for(const group of governmentGroupsAt(person,year)) {
  const key=group.id;
  if(!rows.has(key)) rows.set(key,{id:key,label:group.label,color:group.color,governments:[]});
  const existing=rows.get(key).governments.find(g=>g.person.id===person.id);
  if(existing){existing.mandates.push(...group.mandates);existing.kinds=[...new Set([...existing.kinds,group.kind])];}
  else rows.get(key).governments.push({...group,mandates:[...group.mandates],kinds:[group.kind]});
 }
 for(const collective of collectives.filter(c=>c.desde<=year&&year<=c.hasta)) {
  const row=[...rows.values()].find(r=>r.governments.some(g=>g.mandates.some(m=>m.territorio===collective.territorio)));
  const key=row?.id||collective.territorio;
  if(!rows.has(key))rows.set(key,{id:key,label:collective.territorio,color:REINO_COLOR[collective.territorio]||'#907085',governments:[]});
  (rows.get(key).collectives||= []).push(collective);
 }
 return [...rows.values()].sort((a,b)=>a.label.localeCompare(b.label,'es'));
}

// A transparent editorial selection: current story steps and recorded events,
// filtered by documentary life or an effective government in the chosen year.
export function protagonistsAt(people,year,stories=[],events=[]) {
 const byId=new Map(people.map(p=>[p.id,p])), candidates=new Map();
 const add=(id,reason,story=null)=>{
  const person=byId.get(id);if(!person||!vidaEnAnio(person,year))return;
  if(!candidates.has(id))candidates.set(id,{person,reasons:new Set(),stories:new Map(),score:0});
  const entry=candidates.get(id);entry.reasons.add(reason);entry.score++;
  if(story)entry.stories.set(story.id,story);
 };
 for(const story of stories) {
  if(story.disponible===false)continue;
  const steps=(story.pasos||[]).filter(s=>Number.isInteger(s.anio)).toSorted((a,b)=>a.anio-b.anio);
  if(!steps.length||year<steps[0].anio||year>steps.at(-1).anio)continue;
  const active=steps.findLast(s=>s.anio<=year);
  for(const id of new Set([active.persona,...(active.personas||[])].filter(Boolean)))add(id,active.titulo||story.titulo,story);
 }
 for(const event of events) for(const id of event.personas||[])add(id,event.titulo);
 // Fill a sparse editorial year with named sovereigns already recorded in the
 // Atlas. The card states its government-based reason instead of a story link.
 if(candidates.size<8) {
  const rulers=people.filter(p=>!candidates.has(p.id)&&vidaEnAnio(p,year)).map(person=>({person,groups:governmentGroupsAt(person,year).filter(g=>g.kind==='sovereign')}))
   .filter(e=>e.groups.length&&/\b(rey|reina|emperador|emperatriz|sult[aá]n|zar|papa)\b/i.test(e.person.titulo||''))
   .sort((a,b)=>b.groups.length-a.groups.length||a.person.nombre.localeCompare(b.person.nombre,'es'));
  for(const {person,groups} of rulers.slice(0,8-candidates.size)){add(person.id,`Gobierno registrado: ${groups.map(g=>g.label).join(' · ')}`);candidates.get(person.id).score=0;}
 }
 return [...candidates.values()].sort((a,b)=>b.score-a.score||a.person.nombre.localeCompare(b.person.nombre,'es'))
  .map(e=>({...e,reasons:[...e.reasons],stories:[...e.stories.values()]}));
}

// Keep the laboratory's researched geometry and precedence exactly intact.
// Only a dated, matching mandate can give its political group a shared color.
export function europeMosaicAt(data,year,people) {
 const mosaic=atlasPoliticalMosaicAt(data,year,atlasMosaicPalette(data,people),people);
 const routes=new Map();
 for(const person of people) for(const group of governmentGroupsAt(person,year)) {
  if(group.kind!=='sovereign'&&group.kind!=='disputed')continue;
  for(const mandate of group.mandates) {
   const candidate={...group,ids:new Set(mapLocationsForGovernment(data,mandate,year,person.id,idsDeGobiernoEnAño(mandate,year,person.id)))};
   for(const name of pilotJurisdictionsFor(mandate.territorio,year,person.id)) {
   if(!routes.has(name))routes.set(name,[]);
   routes.get(name).push(candidate);
   }
  }
 }
 const layers=mosaic.layers.map(layer=>{
  const candidates=(layer.memberNames||[layer.name]).flatMap(n=>routes.get(n)||[]);
  const unique=[...new Map(candidates.map(g=>[g.id,g])).values()];
  const shared=unique.length===1?unique[0]:null;
  const identity=territorialIdentity(layer.name);
  const baseColor=REINO_COLOR[identity] || layer.mosaicColor;
  return {...layer,mosaicColor:shared?.color || REINO_COLOR[identity] || layer.mosaicColor,
   politicalLabel:shared?.label || layer.displayName || layer.name,candidates,baseColor};
 });
 const byLocation=new Map();
 for(const layer of layers)for(const id of layer.ids){
  if(!byLocation.has(id))byLocation.set(id,[]);
  const applicable=[...new Map(layer.candidates.filter(g=>g.ids.has(id)).map(g=>[g.id,g])).values()];
  const color=applicable.length===1?applicable[0].color:layer.baseColor;
  byLocation.get(id).push({...layer,mosaicColor:color,politicalLabel:applicable.length===1?applicable[0].label:layer.displayName||layer.name});
 }
 return {...mosaic,layers,byLocation};
}
