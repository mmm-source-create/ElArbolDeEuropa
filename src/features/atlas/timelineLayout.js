import {EUROPE_REGIONS} from '../../domain/time/europeTimeline.js';
import {territoriosDe} from '../../domain/genealogy/personAccessors.js';
import {territorioCoincideConFiltro} from '../../domain/filters/territoryFilters.js';
import {REINO_COLOR} from '../../cartography/kingdomMaps.js';
import {groupedGovernmentIntervals} from '../../domain/government/governmentPresentation.js';
import {anioInicioPersona,anioFinPersona,TL_MIN,inicioEvento,finEvento} from './timelineUtils.js';

export const EVENT_CATEGORIES={guerra:['Guerras','#c15e4a'],religion:['Religión','#9073ad'],politica:['Política y tratados','#438f95'],dinastia:['Dinastías','#b28a46'],cultura:['Cultura','#6c936b'],crisis:['Crisis','#b67d53'],sociedad:['Sociedad','#b67d53']};
export const timelineX=(year,scale)=>(year-TL_MIN)*scale;
export function timelineYearAt(x,scale,min,max){return Math.max(min,Math.min(max,Math.round(min+x/scale)));}
const intervals=new WeakMap();
export function timelineGovernments(person){if(!intervals.has(person))intervals.set(person,groupedGovernmentIntervals(person));return intervals.get(person);}

// Pack entire labels as well as dated lifespans. Names never collide even
// when a brief lifespan is narrower than its label at the current scale.
export function buildTimelineRows(people,scale) {
 const groups=new Map();
 for(const person of people){
  const region=EUROPE_REGIONS.find(([,roots])=>territoriosDe(person).some(t=>roots.some(root=>territorioCoincideConFiltro(t,root))));
  const label=region?.[0]||'Otras trayectorias';
  if(!groups.has(label))groups.set(label,{color:REINO_COLOR[region?.[1][0]]||'#9073ad',people:[]});
  const from=anioInicioPersona(person),through=anioFinPersona(person);
  const start=Number.isFinite(from)?timelineX(from,scale):12;
  const width=Number.isFinite(through)&&Number.isFinite(from)?Math.max(2,(through-from)*scale):0;
  groups.get(label).people.push({person,from,through,start,width,end:start+Math.max(width,Math.min(340,person.nombre.length*7+95))});
 }
 const rows=[];
 const order=[...EUROPE_REGIONS.map(([label])=>label),'Otras trayectorias'];
 for(const label of order){const group=groups.get(label);if(!group)continue;
  rows.push({key:'group:'+label,kind:'group',label,color:group.color,count:group.people.length,estimatedSize:30});
  const lanes=[];
  for(const entry of group.people.toSorted((a,b)=>a.start-b.start||a.person.id.localeCompare(b.person.id))){let lane=lanes.find(l=>l.end+14<=entry.start);if(!lane){lane={people:[],end:0};lanes.push(lane);}lane.people.push(entry);lane.end=entry.end;}
  lanes.forEach((lane,i)=>rows.push({key:`lane:${label}:${i}`,kind:'people',color:group.color,people:lane.people,
   estimatedSize:Math.max(64,...lane.people.map(({person})=>38+new Set(timelineGovernments(person).map(g=>g.key)).size*7))}));
 }
 return rows;
}
export function layoutTimelineEvents(events,scale) {
 const ends=[];
 const items=events.toSorted((a,b)=>inicioEvento(a)-inicioEvento(b)||a.id.localeCompare(b.id)).map(event=>{
  const start=timelineX(inicioEvento(event),scale),duration=Math.max(0,(finEvento(event)-inicioEvento(event))*scale);
  const width=Math.max(duration,Math.min(260,event.titulo.length*6+24));
  let lane=ends.findIndex(end=>end+10<=start);if(lane<0)lane=ends.length;ends[lane]=start+width;
  return {event,start,duration,width,lane};
 });
 return {items,height:Math.max(36,ends.length*27+8)};
}
