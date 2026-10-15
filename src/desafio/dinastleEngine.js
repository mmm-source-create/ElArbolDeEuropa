import {gobiernosDe,territoriosDe,conyugesDe} from '../data/personAccessors.js';
import {gobiernoEfectivo} from '../data/territorios.js';
import {GRUPOS_DINASTICOS_GENEALOGICOS} from '../explorer/model.js';
import {canonicalDynasty} from '../data/dynastyAliases.js';
import {TERRITORIOS_SUB} from '../Territorios.jsx';
import {normalizarBusquedaPublica,slugBasePersona,slugPublico} from '../utils/personLabels.js';

export const DINASTLE_VERSION='v1';
export const DINASTLE_MAX=8;
export const DINASTLE_EPOCH='2026-10-15';
const GENERIC_HOUSES=new Set(['','Desconocida','Familias menores','Sin casa identificada','Sin casa']);
const regions=['Francia','España','Inglaterra','Escocia','Irlanda','Estados Italianos','Sacro Imperio','Hungría','Polonia-Lituania','Balcanes','Escandinavia','Georgia y Cáucaso','Bizancio y Oriente latino'];
const descendants=name=>{const seen=new Set(),walk=n=>{for(const c of TERRITORIOS_SUB[n]||[])if(!seen.has(c)){seen.add(c);walk(c);}};walk(name);return seen;};
const regionalSets=regions.map(n=>new Set([n,...descendants(n)]));
const familyOf=name=>Object.entries(GRUPOS_DINASTICOS_GENEALOGICOS).find(([,members])=>members.includes(name))?.[0]||name;
const hash=text=>{let h=2166136261;for(const c of text)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;return h;};
const unique=values=>[...new Set(values.filter(Boolean))];
const intersects=(a,b)=>a.some(v=>b.includes(v));

export function dinastleDay(date=new Date()) {
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
 return ['year','month','day'].map(t=>parts.find(p=>p.type===t).value).join('-');
}
export const dayNumber=day=>Math.floor((Date.parse(day+'T12:00:00Z')-Date.parse(DINASTLE_EPOCH+'T12:00:00Z'))/86400000)+1;
export function dinastleRoles(person) {
 const active=gobiernosDe(person).filter(gobiernoEfectivo);
 const roles=[];
 for(const g of active) {
  if(/regencia|regente/i.test(g.condicion+' '+g.titulo))roles.push('Regencia');
  else if(/gobierno delegado|gobernador|virrey|estat[uú]der/i.test(g.condicion+' '+g.titulo))roles.push('Gobierno delegado');
  else if(/papa/i.test(g.titulo))roles.push('Papado');
  else if(/emperador|emperatriz/i.test(g.titulo))roles.push('Dignidad imperial');
  else if(/rey|reina|sult[aá]n|zar/i.test(g.titulo))roles.push('Realeza soberana');
  else roles.push('Gobierno principesco');
 }
 if(/consorte/i.test(person.titulo||''))roles.push('Consorte');
 if(!roles.length) {
  const title=normalizarBusquedaPublica(person.titulo||'');
  if(/papa/.test(title))roles.push('Papado');
  if(/militar|capitan|almirante|condotier|soldado/.test(title))roles.push('Militar');
  if(/artista|pintor|escultor|arquitecto/.test(title))roles.push('Arte');
  if(/teologo|reformador|religios|obispo|cardenal/.test(title))roles.push('Religión');
  if(/humanista|filosof|escritor|poeta/.test(title))roles.push('Humanismo');
  if(/principe|princesa|infante|infanta|duque|duquesa|conde|condesa|marques/.test(title))roles.push('Nobleza');
 }
 return unique(roles);
}
export function buildDinastleModel(people,stories=[],events=[]) {
 const byId=new Map(people.map(p=>[p.id,p]));
 const editorial=new Set([...stories.flatMap(s=>[...(s.personas||[]),...(s.protagonistas||[]),...(s.pasos||[]).flatMap(p=>[p.persona,...(p.personas||[])])]),...events.flatMap(e=>e.personas||[])].filter(id=>typeof id==='string'));
 const born=new Map(),spouses=new Map(),history=new Map();
 const edge=(graph,a,b)=>{if(!byId.has(a)||!byId.has(b)||a===b)return;if(!graph.has(a))graph.set(a,new Set());if(!graph.has(b))graph.set(b,new Set());graph.get(a).add(b);graph.get(b).add(a);};
 for(const p of people){for(const id of [p.padre,p.madre])edge(born,p.id,id);for(const id of conyugesDe(p))edge(spouses,p.id,id);}
 const linkGroup=ids=>{const list=unique(ids).filter(id=>byId.has(id));for(const a of list)for(const b of list)edge(history,a,b);};
 for(const e of events)linkGroup(e.personas||[]);
 for(const s of stories)for(const step of s.pasos||[])linkGroup([step.persona,...(step.personas||[])]);
 const names=new Map();for(const p of people){const slug=slugBasePersona(p);names.set(slug,(names.get(slug)||0)+1);}
 const entries=people.map(person=>({person,id:person.id,house:GENERIC_HOUSES.has(person.dinastia)?null:canonicalDynasty(person.dinastia),
  territories:unique([...territoriosDe(person),...gobiernosDe(person).filter(gobiernoEfectivo).map(g=>g.territorio)]),roles:dinastleRoles(person),
  year:Number.isInteger(person.nac)?person.nac:null,approximate:!!person.nacAprox,
  href:'/es/persona/'+slugBasePersona(person)+(names.get(slugBasePersona(person))>1?'-'+slugPublico(person.id):'')}));
 const eligible=entries.filter(e=>editorial.has(e.id)&&e.year!==null&&e.house&&e.roles.length&&e.territories.length).sort((a,b)=>a.id.localeCompare(b.id));
 return {entries,byId:new Map(entries.map(e=>[e.id,e])),eligible,born,spouses,history};
}
export function dailyDinastle(model,day) {
 if(!model.eligible.length)return null;
 // A seeded permutation visits every candidate before repeating. The roster
 // is frozen per version by stored secret ID, never inferred from old guesses.
 const pool=model.eligible.map(e=>({e,rank:hash(DINASTLE_VERSION+':'+e.id)})).sort((a,b)=>a.rank-b.rank||a.e.id.localeCompare(b.e.id));
 return pool[((dayNumber(day)-1)%pool.length+pool.length)%pool.length].e;
}
export function familyDistance(model,a,b,max=4) {
 if(a===b)return 0;let frontier=[a];const seen=new Set(frontier);
 for(let d=1;d<=max;d++){const next=[];for(const id of frontier)for(const n of model.born.get(id)||[])if(!seen.has(n)){if(n===b)return d;seen.add(n);next.push(n);}frontier=next;}
 return null;
}
export function compareDinastle(model,guess,secret) {
 const cell=(label,status,extra={})=>({label,status,...extra});
 const house=!guess.house||!secret.house?cell(guess.house||'Sin casa documentada','unknown'):cell(guess.house,guess.house===secret.house?'exact':familyOf(guess.house)===familyOf(secret.house)?'near':'miss');
 const territory=!guess.territories.length||!secret.territories.length?cell(guess.territories.join(' · ')||'Sin vínculo documentado','unknown'):
  cell(guess.territories.join(' · '),intersects(guess.territories,secret.territories)?'exact':regionalSets.some(r=>guess.territories.some(t=>r.has(t))&&secret.territories.some(t=>r.has(t)))?'near':'miss');
 const role=!guess.roles.length||!secret.roles.length?cell(guess.roles.join(' · ')||'Sin función clasificada','unknown'):cell(guess.roles.join(' · '),intersects(guess.roles,secret.roles)?'exact':guess.roles.some(r=>['Realeza soberana','Dignidad imperial','Gobierno principesco'].includes(r))&&secret.roles.some(r=>['Realeza soberana','Dignidad imperial','Gobierno principesco'].includes(r))?'near':'miss');
 const year=guess.year===null||secret.year===null?cell(guess.year===null?'Fecha no documentada':String(guess.year),'unknown'):
  cell((guess.approximate?'c. ':'')+guess.year,guess.year===secret.year&&!guess.approximate&&!secret.approximate?'exact':Math.abs(guess.year-secret.year)<=50?'near':'miss',{direction:guess.year===secret.year?null:guess.year<secret.year?'after':'before'});
 const distance=familyDistance(model,guess.id,secret.id);
 const relation=guess.id===secret.id?cell('Es este personaje','exact'):distance!==null?cell(distance===1?'Padre, madre, hijo o hija':distance+' pasos de filiación',distance===1?'exact':'near'):
  model.spouses.get(guess.id)?.has(secret.id)?cell('Matrimonio documentado','exact'):model.history.get(guess.id)?.has(secret.id)?cell('Coinciden en un episodio; sin parentesco cercano registrado','near'):cell('Sin vínculo cercano registrado','unknown');
 return [house,territory,role,year,relation];
}
export function restoreDinastle(raw,model,day) {
 const fallback={version:DINASTLE_VERSION,day,secret:dailyDinastle(model,day)?.id,guesses:[],stats:{played:0,won:0,streak:0,best:0,lastDay:null}};
 if(!raw||raw.version!==DINASTLE_VERSION)return fallback;
 const stats={...fallback.stats};for(const k of ['played','won','streak','best'])if(Number.isSafeInteger(raw.stats?.[k])&&raw.stats[k]>=0)stats[k]=raw.stats[k];
 if(/^\d{4}-\d{2}-\d{2}$/.test(raw.stats?.lastDay||''))stats.lastDay=raw.stats.lastDay;
 stats.won=Math.min(stats.won,stats.played);stats.best=Math.max(stats.streak,stats.best);
 if(raw.day!==day)return {...fallback,stats};
 if(!model.eligible.some(e=>e.id===raw.secret))return {...fallback,stats};
 const guesses=unique(Array.isArray(raw.guesses)?raw.guesses:[]).filter(id=>typeof id==='string'&&model.byId.has(id)).slice(0,DINASTLE_MAX);
 const winIndex=guesses.indexOf(raw.secret);
 return {...fallback,secret:raw.secret,guesses:winIndex>=0?guesses.slice(0,winIndex+1):guesses,stats};
}
export function submitDinastle(state,id) {
 if(state.guesses.includes(id)||state.guesses.includes(state.secret)||state.guesses.length>=DINASTLE_MAX)return state;
 const guesses=[...state.guesses,id],done=id===state.secret||guesses.length===DINASTLE_MAX;
 let stats=state.stats;
 if(done&&state.daily!==false){const yesterday=new Date(Date.parse(state.day+'T12:00:00Z')-86400000).toISOString().slice(0,10),won=id===state.secret,streak=won?(stats.lastDay===yesterday?stats.streak:0)+1:0;stats={played:stats.played+1,won:stats.won+Number(won),streak,best:Math.max(stats.best,streak),lastDay:state.day};}
 return {...state,guesses,stats};
}
export function dinastleShare(model,state) {
 const secret=model.byId.get(state.secret),won=state.guesses.includes(state.secret);
 return `Dinastle ${state.daily===false?'libre':'nº '+dayNumber(state.day)} · ${won?state.guesses.length:'X'}/${DINASTLE_MAX}\n`+state.guesses.map(id=>compareDinastle(model,model.byId.get(id),secret).map(c=>({exact:'🟩',near:'🟨',miss:'⬛',unknown:'⬜'})[c.status]).join('')).join('\n')+'\nhttps://treeofeurope.eu/es/desafio?juego=dinastle';
}
