import {swissConfederationAt,SWISS_COLLECTIVE,SWISS_CONFEDERATION_COLOR} from './swissConfederation622.js';
import {COLOR_612} from './paletteReview612.js';
import * as MAP_COLORS from './mapColors.js';
const {harmonizeMapColor}=MAP_COLORS;
import {frenchCrownRelation,englishCrownLayer} from './frenchCrownRelations.js';
import {aragonCrownRelation} from './aragonCrownRelations.js';
import {tributaryLayerRelation,tributaryLayerRelations,relationCoversLocation} from './tributaryRelations.js';
import {ORANGE_NASSAU,ENGLISH_CROWN_COLOR,frenchFiefColor,aragonVassalColor,tributaryColor} from './mapColors.js';
import {franceLowCountriesPoliticalKeys} from './regions/franceLowCountriesRoutes.js';
import {governmentGroupsAt} from '../domain/government/governmentPresentation.js';
import {vidaEnAnio} from '../domain/time/europeYear.js';
import {atlasPoliticalMosaicAt,atlasMosaicPalette} from './atlasMosaic.js';
import {pilotJurisdictionsFor,mapLocationsForGovernment} from './locationMapPilot.js';
import {REINO_COLOR, datedTerritoryColor, idsDeGobiernoEnAño} from './kingdomMaps.js';
const CURATED_COLORS=new Set([...Object.values(REINO_COLOR),...Object.values(MAP_COLORS)].filter(c=>typeof c==='string'&&c.startsWith('#')).map(c=>c.toLowerCase()));
import {territorialIdentity} from './territorialIdentity.js';

export function governmentTableAt(people,year,collectives=[]) {
 const rows=new Map();
 for(const person of people) for(const group of governmentGroupsAt(person,year,{view:'panorama'})) {
  const key=group.id;
  if(!rows.has(key)) rows.set(key,{id:key,label:group.label,unionParts:group.unionParts||null,color:group.color,governments:[]});
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
 if(year>=1291&&year<=1797)rows.set('confederacion-suiza',{id:'confederacion-suiza',label:'Confederación Suiza',color:SWISS_CONFEDERATION_COLOR,governments:[],collectives:[SWISS_COLLECTIVE]});
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
  const rulers=people.filter(p=>!candidates.has(p.id)&&vidaEnAnio(p,year)).map(person=>({person,groups:governmentGroupsAt(person,year,{view:'panorama'}).filter(g=>g.kind==='sovereign')}))
   .filter(e=>e.groups.length&&/\b(rey|reina|emperador|emperatriz|sult[aá]n|zar|papa)\b/i.test(e.person.titulo||''))
   .sort((a,b)=>b.groups.length-a.groups.length||a.person.nombre.localeCompare(b.person.nombre,'es'));
  for(const {person,groups} of rulers.slice(0,8-candidates.size)){add(person.id,`Gobierno registrado: ${groups.map(g=>g.label).join(' · ')}`);candidates.get(person.id).score=0;}
 }
 return [...candidates.values()].sort((a,b)=>b.score-a.score||a.person.nombre.localeCompare(b.person.nombre,'es'))
  .map(e=>({...e,reasons:[...e.reasons],stories:[...e.stories.values()]}));
}

const POLITY_GROUPS=new Set(['herencia-borgonona','paises-bajos','monarquia-hispanica-exterior','monarquia-austriaca-exterior','dinamarca-noruega-exterior','austria-interior-exterior']);

// Keep the laboratory's researched geometry and precedence exactly intact.
// Only a dated, matching mandate can give its political group a shared color.
export function europeMosaicAt(data,year,people) {
 const mosaic=atlasPoliticalMosaicAt(data,year,atlasMosaicPalette(data,people),people);
 const routes=new Map();
 for(const person of people) for(const group of governmentGroupsAt(person,year,{view:'panorama'})) {
  if(group.kind!=='sovereign'&&group.kind!=='disputed')continue;
  for(const mandate of group.mandates) {
   const candidate={...group,personId:person.id,collegial:mandate.condicion==='corregente',territory:mandate.territorio,from:mandate.desde,through:mandate.hasta,ids:new Set(mapLocationsForGovernment(data,mandate,year,person.id,idsDeGobiernoEnAño(mandate,year,person.id)))};
   const names=pilotJurisdictionsFor(mandate.territorio,year,person.id);
   if(mandate.territorio==='Austria'&&mandate.ambito?.includes('Austria Interior'))
    names.push(...pilotJurisdictionsFor('Austria Interior',year,person.id));
   for(const name of names) {
   if(!routes.has(name))routes.set(name,[]);
   routes.get(name).push(candidate);
   }
  }
 }
 // A reviewed Netherlandish phase may lack an individual lordship title (Cuijk).
 // Its explicit political attribution follows the active Low Countries government,
 // anchored in recorded provincial mandates, rather than an unrelated palette tint.
 const netherlandsAnchors=new Set(['Brabante','Flandes','Henao','Condado de Borgoña']);
 const netherlandsGroups=[...new Map([...routes.values()].flat().filter(g=>g.kind==='sovereign'&&netherlandsAnchors.has(g.territory))
  .map(g=>[`${g.id}|${g.color}`,g])).values()];
 const netherlandsPolity=netherlandsGroups.length===1?netherlandsGroups[0]:null;
 const layers=mosaic.layers.map(layer=>{
  const candidates=(layer.memberNames||[layer.name]).flatMap(n=>routes.get(n)||[]);
  const unique=[...new Map(candidates.map(g=>[`${g.id}|${g.personId}|${g.kind}`,g])).values()];
  const shared=unique.length===1?unique[0]:null;
  const names=layer.memberNames||[layer.name];
  const english=new Set(names.filter(n=>englishCrownLayer(n,year)));
  const crown=new Map(names.map(n=>[n,frenchCrownRelation(n,year)]).filter(([,relation])=>relation));
  const aragon=new Map(names.map(n=>[n,aragonCrownRelation(n,year)]).filter(([,relation])=>relation));
  const tributaryCandidates=new Map(names.map(n=>[n,tributaryLayerRelations(n,year)]));
  const tributary=new Map(names.map(n=>[n,tributaryLayerRelation(n,year)]).filter(([,relation])=>relation));
  // A coalesced identity can mix royal domain, fiefs and Lancastrian phases:
  // the relation is decided for each cell by the phases that contain it.
  let phasesById=null;
  if(english.size||crown.size||aragon.size||tributary.size){
   phasesById=new Map();
   for(const scope of layer.scopes||[{name:layer.name,ids:layer.ids}])for(const id of scope.ids){
    if(!phasesById.has(id))phasesById.set(id,[]);
    phasesById.get(id).push(scope.name);
   }
  }
  const identity=territorialIdentity(layer.name);
  const republic=names.some(n=>franceLowCountriesPoliticalKeys(n,year).includes('Provincias Unidas'));
  const baseColor=layer.politicalColorGroup ? layer.mosaicColor : datedTerritoryColor(identity,year) || layer.mosaicColor;
  return {...layer,mosaicColor:shared?.color || REINO_COLOR[identity] || layer.mosaicColor,
   crownRelation:aragon.values().next().value||crown.values().next().value||null,english,crown,aragon,tributary,tributaryCandidates,phasesById,republic,politicalLabel:shared?.label || layer.displayName || layer.name,candidates,baseColor};
 });
 const byLocation=new Map();
 for(const layer of layers)for(const id of layer.ids){
  if(!byLocation.has(id))byLocation.set(id,[]);
  const matches=layer.candidates.filter(g=>g.ids.has(id));
  const senior=matches.some(g=>!g.collegial)?matches.filter(g=>!g.collegial):matches;
  // Inclusive annual dates retain both office holders for inspection. In a
  // documented succession year the incoming sovereign supplies the swatch;
  // rival claims, co-rule and simultaneous different jurisdictions stay mixed.
  const governing=senior.filter(g=>!(g.kind==='sovereign'&&g.through===year&&g.from<year
   &&senior.some(next=>next.kind==='sovereign'&&!next.collegial&&next.personId!==g.personId
    &&next.territory===g.territory&&next.from===year)));
  const applicable=[...new Map(governing.map(g=>[`${g.id}|${g.personId}|${g.kind}`,g])).values()];
  // Equal swatches alone cannot establish a common political unit.
  const unanimous=applicable.length>0&&new Set(applicable.map(g=>g.id)).size===1
    &&new Set(applicable.map(g=>g.color)).size===1;
  const phases=layer.phasesById?.get(id)||[];
  const englishCrown=phases.some(n=>layer.english.has(n));
  const frenchRelation=phases.map(n=>layer.crown.get(n)).find(Boolean)||null;
  // An Aragonese vassalage or lordship takes the Aragonese tint, also inside
  // the kingdom of France (Montpellier, the Occitan oaths of 1213).
  const aragonRelation=phases.map(n=>layer.aragon.get(n)).find(Boolean)||null;
  // A tributary or a fief outside the French and Aragonese crowns (Ottoman
  // principalities, Polish Prussia and Courland, Angevin Brittany) takes a
  // tint of its overlord in the years its dependency is documented.
  const tributaryRelation=phases.flatMap(n=>layer.tributaryCandidates.get(n)||[]).find(relation=>relationCoversLocation(relation,id))||null;
  const crownRelation=aragonRelation||frenchRelation;
  // The Burgundian state and its Habsburg heirs keep their colour inside the
  // kingdom too; the fief pattern still marks the French suzerainty.
  const polity=unanimous&&POLITY_GROUPS.has(applicable[0].id)&&applicable.every(g=>g.id===applicable[0].id)?applicable[0]
   :!applicable.length&&layer.politicalColorGroup==='paises-bajos-habsburgicos'?netherlandsPolity:null;
  const confederation=swissConfederationAt(layer.entityId,year);
  const color=confederation?confederation.color:layer.republic?ORANGE_NASSAU:englishCrown?ENGLISH_CROWN_COLOR:aragonRelation?aragonVassalColor(aragonRelation):tributaryRelation?tributaryColor(tributaryRelation,year)
   :['charolais-archducal','schleswig-holstein'].includes(layer.politicalColorGroup)?layer.baseColor:polity&&['herencia-borgonona','paises-bajos','monarquia-hispanica-exterior'].includes(polity.id)?polity.color:frenchRelation?frenchFiefColor(layer.entityId||layer.name):polity?polity.color:unanimous?applicable[0].color:layer.baseColor;
  const politicalGroup=confederation?confederation.id:layer.republic?'republica-neerlandesa':layer.politicalColorGroup==='charolais-archducal'?'charolais-archducal':polity?.id || (unanimous?applicable[0].id:layer.politicalColorGroup || null);
  const politicalLabel=confederation?confederation.label:tributaryRelation?.subjectLabel|| (englishCrown&&!applicable.length?'Inglaterra':applicable.length===1?applicable[0].label:polity?.label||layer.displayName||layer.name);
  // 6.0.12: reviewed colours for territories that clashed with a neighbour;
  // relation tints keep their own families.
  // Curated colours (kingdom table, map constants, political groups) are kept;
  // only colours from the regional tables and the automatic series are muted.
  const curated=CURATED_COLORS.has(String(color).toLowerCase())||Boolean(confederation)||Boolean(polity)||(unanimous&&color===applicable[0].color);
  const harmonized=curated?color:harmonizeMapColor(color);
  const reviewed=tributaryRelation||crownRelation||englishCrown||layer.republic||confederation?color:COLOR_612[String(harmonized).toLowerCase()]||harmonized;
  byLocation.get(id).push({...layer,confederation,crownRelation,tributaryRelation,englishCrown,mosaicColor:reviewed,politicalLabel,politicalGroup});
 }
 // 6.0.14: Poland and Lithuania share the union colour in a year when either
 // takes it (Jadwiga's and Vytautas's reigns left one side out). Years with
 // separate monarchs and no union colour (1492–1500) keep their own colours.
 const unionEntries=[...byLocation.values()].flat().filter(entry=>UNION_ENTITIES.has(entry.entityId)&&String(entry.politicalGroup||'').startsWith('union-mismo-soberano'));
 if(unionEntries.length){
  const {mosaicColor,politicalGroup,politicalLabel}=unionEntries[0];
  for(const [id,entries] of byLocation)byLocation.set(id,entries.map(entry=>UNION_ENTITIES.has(entry.entityId)&&!entry.tributaryRelation&&entry.politicalGroup!==politicalGroup
   ?{...entry,mosaicColor,politicalGroup,politicalLabel}:entry));
 }
 return {...mosaic,layers,byLocation};
}
const UNION_ENTITIES=new Set(['Polonia','Lituania']);
