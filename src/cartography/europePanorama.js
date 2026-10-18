import {frenchCrownRelation,englishCrownLayer} from './frenchCrownRelations.js';
import {aragonCrownRelation} from './aragonCrownRelations.js';
import {ORANGE_NASSAU,ENGLISH_CROWN_COLOR,frenchFiefColor,aragonVassalColor} from './mapColors.js';
import {franceLowCountriesPoliticalKeys} from './regions/franceLowCountriesRoutes.js';
import {governmentGroupsAt} from '../domain/government/governmentPresentation.js';
import {vidaEnAnio} from '../domain/time/europeYear.js';
import {atlasPoliticalMosaicAt,atlasMosaicPalette} from './atlasMosaic.js';
import {pilotJurisdictionsFor,mapLocationsForGovernment} from './locationMapPilot.js';
import {REINO_COLOR, idsDeGobiernoEnAño} from './kingdomMaps.js';
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
  const key=row?.id||(collective.territorio==='Provincias Unidas'?'provincias-unidas':collective.territorio);
  if(!rows.has(key))rows.set(key,{id:key,label:collective.territorio,color:collective.territorio==='Provincias Unidas'?ORANGE_NASSAU:REINO_COLOR[collective.territorio]||'#907085',governments:[]});
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

const POLITY_GROUPS=new Set(['herencia-borgonona','paises-bajos']);

// Keep the laboratory's researched geometry and precedence exactly intact.
// Only a dated, matching mandate can give its political group a shared color.
export function europeMosaicAt(data,year,people) {
 const mosaic=atlasPoliticalMosaicAt(data,year,atlasMosaicPalette(data,people),people);
 const routes=new Map();
 for(const person of people) for(const group of governmentGroupsAt(person,year)) {
  if(group.kind!=='sovereign'&&group.kind!=='disputed')continue;
  for(const mandate of group.mandates) {
   const candidate={...group,ids:new Set(mapLocationsForGovernment(data,mandate,year,person.id,idsDeGobiernoEnAño(mandate,year,person.id)))};
   const names=pilotJurisdictionsFor(mandate.territorio,year,person.id);
   if(mandate.territorio==='Austria'&&mandate.ambito?.includes('Austria Interior'))
    names.push(...pilotJurisdictionsFor('Austria Interior',year,person.id));
   for(const name of names) {
   if(!routes.has(name))routes.set(name,[]);
   routes.get(name).push(candidate);
   }
  }
 }
 const layers=mosaic.layers.map(layer=>{
  const candidates=(layer.memberNames||[layer.name]).flatMap(n=>routes.get(n)||[]);
  const unique=[...new Map(candidates.map(g=>[g.id,g])).values()];
  const shared=unique.length===1?unique[0]:null;
  const names=layer.memberNames||[layer.name];
  const english=new Set(names.filter(n=>englishCrownLayer(n,year)));
  const crown=new Map(names.map(n=>[n,frenchCrownRelation(n,year)]).filter(([,relation])=>relation));
  const aragon=new Map(names.map(n=>[n,aragonCrownRelation(n,year)]).filter(([,relation])=>relation));
  // A coalesced identity can mix royal domain, fiefs and Lancastrian phases:
  // the relation is decided for each cell by the phases that contain it.
  let phasesById=null;
  if(english.size||crown.size||aragon.size){
   phasesById=new Map();
   for(const scope of layer.scopes||[{name:layer.name,ids:layer.ids}])for(const id of scope.ids){
    if(!phasesById.has(id))phasesById.set(id,[]);
    phasesById.get(id).push(scope.name);
   }
  }
  const identity=territorialIdentity(layer.name);
  const republic=names.some(n=>franceLowCountriesPoliticalKeys(n,year).includes('Provincias Unidas'));
  const baseColor=layer.politicalColorGroup==='polonia-lituania'?REINO_COLOR['Polonia-Lituania']:REINO_COLOR[identity] || layer.mosaicColor;
  return {...layer,mosaicColor:shared?.color || REINO_COLOR[identity] || layer.mosaicColor,
   crownRelation:aragon.values().next().value||crown.values().next().value||null,english,crown,aragon,phasesById,republic,politicalLabel:shared?.label || layer.displayName || layer.name,candidates,baseColor};
 });
 const byLocation=new Map();
 for(const layer of layers)for(const id of layer.ids){
  if(!byLocation.has(id))byLocation.set(id,[]);
  const applicable=[...new Map(layer.candidates.filter(g=>g.ids.has(id)).map(g=>[g.id,g])).values()];
  const unanimous=applicable.length>0&&new Set(applicable.map(g=>g.color)).size===1;
  const phases=layer.phasesById?.get(id)||[];
  const englishCrown=phases.some(n=>layer.english.has(n));
  const frenchRelation=phases.map(n=>layer.crown.get(n)).find(Boolean)||null;
  // An Aragonese vassalage or lordship takes the Aragonese tint, also inside
  // the kingdom of France (Montpellier, the Occitan oaths of 1213).
  const aragonRelation=phases.map(n=>layer.aragon.get(n)).find(Boolean)||null;
  const crownRelation=aragonRelation||frenchRelation;
  // The Burgundian state and its Habsburg heirs keep their colour inside the
  // kingdom too; the fief pattern still marks the French suzerainty.
  const polity=unanimous&&POLITY_GROUPS.has(applicable[0].id)?applicable[0]:null;
  const color=layer.republic?ORANGE_NASSAU:englishCrown?ENGLISH_CROWN_COLOR:polity?polity.color
   :aragonRelation?aragonVassalColor(aragonRelation):frenchRelation?frenchFiefColor(layer.entityId||layer.name):unanimous?applicable[0].color:layer.baseColor;
  const politicalLabel=englishCrown&&!applicable.length?'Inglaterra':applicable.length===1?applicable[0].label:layer.displayName||layer.name;
  byLocation.get(id).push({...layer,crownRelation,englishCrown,mosaicColor:color,politicalLabel});
 }
 return {...mosaic,layers,byLocation};
}
