import {isRepublicanOffice} from '../filters/atlasFilters.js';
import {mandateIdentity,identityLabel} from '../../cartography/territorialNames.js';
import {ORANGE_NASSAU} from '../../cartography/mapColors.js';
import {gobiernosDe,intervalosDisputadosDe} from '../genealogy/personAccessors.js';
import {gobiernoEfectivo} from '../../data/territorios.js';
import {agrupacionesPoliticasEnMapa, colorTerritorioEnMapa, REINO_COLOR} from '../../cartography/kingdomMaps.js';
import {authorityKind} from './authorityKind.js';
import {PERSONAS} from '../../data/personas.js';

let byId=null;
const personById=id=>(byId||=new Map(PERSONAS.map(p=>[p.id,p]))).get(id);

const labels = {'monarquia-hispanica':'España','castilla-leon':'Corona de Castilla',
 'tierras-austriacas':'Austria','austro-bohemia':'Austria y Corona de San Wenceslao'};
const cache=new WeakMap();

// This is a presentation of existing dated mandates, never a change of title,
// ownership or border. Sovereigns and their delegates remain distinct rows.
// Rank of a title for choosing a sovereign's main realm (6.0.12).
const AUSTRIAN_MONARCHY=new Set(['monarquia-austriaca-exterior']);
const RANK={imperio:7,reinado:6,zarato:6,sultanato:6,gran_ducado:5,electorado:5,ducado:4,principado:4,despotado:4,voivodato:4,marquesado:3,landgraviato:3,margraviato:3,condado:2,vizcondado:2,señorío:1};
export function governmentGroupsAt(person, year, {view = 'personal'} = {}) {
 if (!person || !Number.isInteger(year)) return [];
 const cacheKey=`${view}:${year}`;
 if(cache.get(person)?.has(cacheKey))return cache.get(person).get(cacheKey);
 const active=gobiernosDe(person).filter(m=>gobiernoEfectivo(m)&&m.desde<=year&&year<=m.hasta);
 if(!active.length)return [];
 const groups = agrupacionesPoliticasEnMapa(person,year,{view}), result = new Map();
 for (const mandate of active) {
  const kind = authorityKind(mandate,year);
  const group = kind==='sovereign'
   ? groups.find(g=>g.territorios.has(mandate.territorio)) : null;
  const imperial = ['Alemania','Sacro Imperio'].includes(mandate.territorio);
  const republican=isRepublicanOffice(person,mandate,year);
  const identity=mandateIdentity(mandate.territorio);
  const inner=view==='personal'&&year<1619&&mandate.territorio==='Austria'&&mandate.ambito?.includes('Austria Interior');
  const id = inner?'austria-interior':republican?'provincias-unidas':group?.id || (imperial?'sacro-imperio':identity);
  const key = `${id}|${kind}|${mandate.soberano||''}`;
  if (!result.has(key)) result.set(key,{id,key,person,kind,
   label:inner?'Austria Interior':republican?'Provincias Unidas':labels[id] || group?.nombre || (imperial?'Sacro Imperio (Alemania)':identity==='Transilvania'?identityLabel(mandateIdentity(identity),year):mandate.territorio),
   color:inner?REINO_COLOR['Austria Interior']:republican?ORANGE_NASSAU:group?.color || colorTerritorioEnMapa(person,mandate.territorio,year),
   unionParts:group?.partesUnion || null,note:group?.nota || '',source:group?.fuente || null,mandates:[]});
  result.get(key).mandates.push(mandate);
 }
 // 6.0.12: on the common map one sovereign is one foreign policy. Every realm
 // a person rules effectively in that year takes the colour of the main group:
 // highest title, then most territories, then the earliest held. The Empire is a dignity above
 // the territories, and republican offices are not personal sovereignty.
 if(view==='panorama'){
  const sovereign=[...result.values()].filter(g=>g.kind==='sovereign'&&!['sacro-imperio','provincias-unidas'].includes(g.id)
   &&!g.mandates.every(m=>m.condicion==='jure uxoris'));
  if(sovereign.length>1){
   const first=g=>Math.min(...g.mandates.map(m=>m.desde));
   // 6.0.14: the Austrian Habsburg monarchy ranks just above a kingdom, so Ferdinand I
   // keeps its red when he gains Bohemia and Hungary (1526).
   const rank=g=>AUSTRIAN_MONARCHY.has(g.id)?RANK.reinado+.5:Math.max(...g.mandates.map(m=>RANK[m.clase]||1));
   const primary=[...sovereign].sort((a,b)=>rank(b)-rank(a)||b.mandates.length-a.mandates.length||first(a)-first(b)||a.id.localeCompare(b.id))[0];
   for(const group of sovereign)if(group!==primary){group.color=primary.color;group.sharedSovereign=primary.id;}
  }
 }
 // 6.0.15: realms handed over by a living parent who keeps ruling the same
 // monarchy (Naples in 1554 and the Netherlands in 1555, from Charles V to
 // Philip II) keep that monarchy's colour until the parent's last year.
 if(view==='panorama')for(const parentId of [person.padre,person.madre].filter(Boolean)){
  const parent=personById(parentId);
  if(!parent)continue;
  const parentGroups=agrupacionesPoliticasEnMapa(parent,year,{view:'panorama'}).filter(g=>g.id!=='sacro-imperio');
  const continuing=parentGroups.filter(g=>agrupacionesPoliticasEnMapa(parent,year+1,{view:'panorama'}).some(next=>next.id===g.id));
  for(const group of result.values()){
   if(group.kind!=='sovereign'||group.mandates.every(m=>m.condicion==='jure uxoris'))continue;
   const own=group.mandates.filter(m=>m.condicion!=='jure uxoris');
   const parentGroup=continuing.find(g=>own.every(m=>g.miembros?.has(m.territorio)
    &&gobiernosDe(parent).some(pm=>pm.territorio===m.territorio&&gobiernoEfectivo(pm)&&pm.desde<=year&&pm.hasta>=year-1)));
   if(!parentGroup)continue;
   const parentColor=governmentGroupsAt(parent,year,{view:'panorama'}).find(g=>g.id===parentGroup.id)?.color||parentGroup.color;
   group.color=parentColor;group.sharedSovereign=parentGroup.id;group.inheritedFrom=parent.id;
  }
 }
 if(!cache.has(person))cache.set(person,new Map());
 const years=cache.get(person);if(years.size>=4)years.delete(years.keys().next().value);
 const output=[...result.values()];years.set(cacheKey,output);return output;
}

const referenceYears = new WeakMap();
function governmentReferenceYear(person) {
 if (!person) return null;
 if (!referenceYears.has(person)) {
  const effective=gobiernosDe(person).filter(g=>gobiernoEfectivo(g)&&Number.isInteger(g.desde)&&Number.isInteger(g.hasta));
  const candidates=[...new Set(effective.flatMap(g=>[g.desde,g.hasta]))];
  referenceYears.set(person,candidates.sort((a,b)=>effective.filter(g=>g.desde<=b&&b<=g.hasta).length-effective.filter(g=>g.desde<=a&&a<=g.hasta).length||b-a)[0]??null);
 }
 return referenceYears.get(person);
}
export function governmentSummary(person, year=null) {
 return [...new Set(governmentGroupsAt(person,year??governmentReferenceYear(person)).map(g=>g.label))];
}

export function groupedGovernmentIntervals(person) {
 const mandates=gobiernosDe(person).filter(g=>Number.isInteger(g.desde)&&Number.isInteger(g.hasta)&&gobiernoEfectivo(g));
 const from=Math.min(...mandates.map(g=>g.desde)),through=Math.max(...mandates.map(g=>g.hasta));
 const changes=[1230,1516,1526,1541,1549,1569,1588,1619,1707,1715,1716,1749,1765].filter(y=>from<y&&y<=through);
 // A dated disputed-control interval changes the kind of authority too.
 const disputes=mandates.flatMap(g=>intervalosDisputadosDe(g).flatMap(period=>[period.desde,period.hasta+1]));
 const cuts=[...new Set([...mandates.flatMap(g=>[g.desde,g.hasta+1]),...disputes,...changes])].sort((a,b)=>a-b), result=[];
 for(let i=0;i<cuts.length-1;i++) for(const group of governmentGroupsAt(person,cuts[i])) {
  const previous=result.findLast(g=>g.key===group.key&&g.label===group.label&&g.color===group.color&&g.through===cuts[i]-1);
  if(previous) previous.through=cuts[i+1]-1;
  else result.push({...group,from:cuts[i],through:cuts[i+1]-1});
 }
 return result;
}
