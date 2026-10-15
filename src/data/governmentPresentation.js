import {isRepublicanOffice} from './atlasFilters.js';
import {territorialIdentity,territorialLabel} from './territorialIdentity.js';
import {ORANGE_NASSAU} from './mapColors.js';
import {gobiernosDe} from './personAccessors.js';
import {gobiernoEfectivo} from './territorios.js';
import {agrupacionesPoliticasEnMapa, REINO_COLOR, REINO_COLOR_DEFAULT} from '../Territorios.jsx';
import {authorityKind} from './mapAuthorities.js';

const labels = {'monarquia-hispanica':'España','castilla-leon':'Corona de Castilla',
 'tierras-austriacas':'Austria','austro-bohemia':'Austria y Corona de Bohemia'};
const cache=new WeakMap();

// This is a presentation of existing dated mandates, never a change of title,
// ownership or border. Sovereigns and their delegates remain distinct rows.
export function governmentGroupsAt(person, year) {
 if (!person || !Number.isInteger(year)) return [];
 if(cache.get(person)?.has(year))return cache.get(person).get(year);
 const active=gobiernosDe(person).filter(m=>gobiernoEfectivo(m)&&m.desde<=year&&year<=m.hasta);
 if(!active.length)return [];
 const groups = agrupacionesPoliticasEnMapa(person,year), result = new Map();
 for (const mandate of active) {
  const kind = authorityKind(mandate,year);
  const group = kind==='sovereign' || kind==='disputed'
   ? groups.find(g=>g.territorios.has(mandate.territorio)) : null;
  const imperial = ['Alemania','Sacro Imperio'].includes(mandate.territorio);
  const republican=isRepublicanOffice(person,mandate,year);
  const identity=territorialIdentity(mandate.territorio);
  const inner=year<1619&&mandate.territorio==='Austria'&&mandate.ambito?.includes('Austria Interior');
  const id = inner?'austria-interior':republican?'provincias-unidas':group?.id || (imperial?'sacro-imperio':identity);
  const key = `${id}|${kind}|${mandate.soberano||''}`;
  if (!result.has(key)) result.set(key,{id,key,person,kind,
   label:inner?'Austria Interior':republican?'Provincias Unidas':labels[id] || group?.nombre || (imperial?'Sacro Imperio (Alemania)':identity==='Transilvania'?territorialLabel(identity,year):mandate.territorio),
   color:inner?REINO_COLOR['Austria Interior']:republican?ORANGE_NASSAU:group?.color || REINO_COLOR[mandate.territorio] || REINO_COLOR_DEFAULT,
   note:group?.nota || '',source:group?.fuente || null,mandates:[]});
  result.get(key).mandates.push(mandate);
 }
 if(!cache.has(person))cache.set(person,new Map());
 const years=cache.get(person);if(years.size>=4)years.delete(years.keys().next().value);
 const output=[...result.values()];years.set(year,output);return output;
}

const referenceYears = new WeakMap();
export function governmentReferenceYear(person) {
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
 const changes=[1230,1516,1526,1541,1549,1588,1619,1749,1765].filter(y=>from<y&&y<=through);
 const cuts=[...new Set([...mandates.flatMap(g=>[g.desde,g.hasta+1]),...changes])].sort((a,b)=>a-b), result=[];
 for(let i=0;i<cuts.length-1;i++) for(const group of governmentGroupsAt(person,cuts[i])) {
  const previous=result.findLast(g=>g.key===group.key&&g.label===group.label&&g.color===group.color&&g.through===cuts[i]-1);
  if(previous) previous.through=cuts[i+1]-1;
  else result.push({...group,from:cuts[i],through:cuts[i+1]-1});
 }
 return result;
}
