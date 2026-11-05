import {useEffect,useId,useMemo,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,Copy,Shuffle,RotateCcw} from 'lucide-react';
import {HISTORIAS,EVENTOS_HISTORICOS} from '../../data/historias.js';
import {normalizarBusquedaPublica} from '../../domain/people/personLabels.js';
import {buildDinastleModel,dinastleDay,dayNumber,restoreDinastle,submitDinastle,compareDinastle,dinastleShare,DINASTLE_MAX} from './dinastleEngine.js';
import './dinastle.css';
import {rutaEntidadLocalizada,slugPersonaPorLocale} from '../atlas/atlasRoutes.js';
import {englishLabel} from '../english/v6/atlasPresentation.js';

const STORAGE_KEY='eade.dinastle.v1';
const columns=['Casa','Territorios vinculados','Función','Nacimiento','Vínculo'];
const statuses={exact:'Coincide',near:'Cercano',miss:'No coincide',unknown:'Sin dato comparable'};
const symbols={exact:'✓',near:'≈',miss:'—',unknown:'?'};
const storage=()=>{try{return window.localStorage;}catch{return null;}};
function read(model,day){try{return restoreDinastle(JSON.parse(storage()?.getItem(STORAGE_KEY)||'null'),model,day);}catch{return restoreDinastle(null,model,day);}}

export default function Dinastle({people,onBack,locale='es'}) {
 const en=locale==='en',tr=(es,english)=>en?english:es;
 const model=useMemo(()=>buildDinastleModel(people,HISTORIAS,EVENTOS_HISTORICOS),[people]);
 const [day,setDay]=useState(dinastleDay);
 const [daily,setDaily]=useState(()=>read(model,dinastleDay()));
 const [free,setFree]=useState(null);
 const [query,setQuery]=useState(''),[active,setActive]=useState(0),[open,setOpen]=useState(false),[message,setMessage]=useState(''),[saved,setSaved]=useState(true);
 const input=useRef(null),listId=useId();
 const state=free||daily,secret=model.byId.get(state.secret),won=state.guesses.includes(state.secret),done=won||state.guesses.length>=DINASTLE_MAX;
 const results=useMemo(()=>query.trim()?model.entries.filter(e=>!state.guesses.includes(e.id)&&normalizarBusquedaPublica(e.person.nombre+' '+(e.person.aliases||[]).join(' ')).includes(normalizarBusquedaPublica(query))).sort((a,b)=>a.person.nombre.localeCompare(b.person.nombre,'es')).slice(0,7):[],[model,query,state.guesses]);
 useEffect(()=>{try{if(!storage())throw new Error();storage().setItem(STORAGE_KEY,JSON.stringify(daily));setSaved(true);}catch{setSaved(false);}},[daily]);
 useEffect(()=>{const check=()=>{const next=dinastleDay();if(next!==day){setDay(next);setDaily(previous=>restoreDinastle(previous,model,next));}};const timer=setInterval(check,60000);document.addEventListener('visibilitychange',check);return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',check);};},[day,model]);
 if(!secret)return <section className="dinastle"><button onClick={onBack}>{tr('Volver a modos','Back to modes')}</button><h1>Dinastle</h1><p>{tr('No hay candidatos con datos suficientes para esta partida.','There are no candidates with enough data for this game.')}</p></section>;
 const guess=id=>{
  if(done||!model.byId.has(id)||state.guesses.includes(id))return;
  if(free)setFree(previous=>submitDinastle(previous,id));else setDaily(previous=>submitDinastle(previous,id));
  setQuery('');setOpen(false);setActive(0);setMessage(id===secret.id?tr('¡Acertado!','Correct!'):(en?`Attempt ${state.guesses.length+1} of ${DINASTLE_MAX}. Clues added.`:`Intento ${state.guesses.length+1} de ${DINASTLE_MAX}. Pistas añadidas.`));input.current?.focus();
 };
 const startFree=()=>{const candidates=model.eligible.filter(e=>e.id!==state.secret);if(!candidates.length)return;const next=candidates[Math.floor(Math.random()*candidates.length)];setFree({...restoreDinastle(null,model,day),secret:next.id,daily:false});setQuery('');setMessage(tr('Nueva partida libre.','New free game.'));setOpen(false);input.current?.focus();};
 return <DinastleBoard key={(free?'free:':'daily:')+state.secret} {...{model,state,secret,done,won,daily,free,day,query,setQuery,active,setActive,open,setOpen,message,setMessage,saved,input,listId,results,guess,startFree,onBack,locale}} onDaily={()=>{setFree(null);setQuery('');setMessage(tr('Partida diaria recuperada.','Daily game restored.'));setOpen(false);}}/>;
}

function DinastleBoard({model,state,secret,done,won,daily,free,day,query,setQuery,active,setActive,open,setOpen,message,setMessage,saved,input,listId,results,guess,startFree,onBack,onDaily,locale='es'}) {
 const en=locale==='en',tr=(es,english)=>en?english:es;
 const displayColumns=en?['House','Linked territories','Role','Birth','Connection']:columns;
 const displayStatuses=en?{exact:'Match',near:'Close',miss:'No match',unknown:'No comparable data'}:statuses;
 const [shareText,setShareText]=useState('');
 const shareResult=localizedShare(model,state,locale);
 const share=async()=>{try{await navigator.clipboard.writeText(shareResult);setMessage(tr('Resultado copiado sin revelar el personaje.','Result copied without revealing the person.'));}catch{setShareText(shareResult);setMessage(tr('Selecciona y copia el resultado de abajo.','Select and copy the result below.'));}};
 return <section className="dinastle" aria-labelledby="dinastle-title">
  <button type="button" className="dinastle-back" onClick={onBack}><ArrowLeft size={16}/> {tr('Todos los modos','All modes')}</button>
  <header className="dinastle-header"><div><span className="dinastle-eyebrow">{tr('Un personaje · ocho oportunidades','One person · eight attempts')}</span><h1 id="dinastle-title">Dinastle</h1><p>{tr('Adivina quién se esconde entre las historias del Atlas.','Guess who is hidden among the Atlas stories.')}</p></div><div className="dinastle-counter"><span>{free?tr('Partida libre','Free game'):`${tr('Diario nº','Daily no.')} ${dayNumber(day)}`}</span><strong>{state.guesses.length}<small> / {DINASTLE_MAX}</small></strong><span>{tr('intentos','attempts')}</span></div></header>
  <div className="dinastle-toolbar"><button type="button" aria-pressed={!free} onClick={onDaily}><RotateCcw size={14}/> {tr('El de hoy','Today’s game')}</button><button type="button" onClick={startFree}><Shuffle size={14}/> {free?tr('Otro personaje','Another person'):tr('Partida libre','Free game')}</button><small>{!free?`${day} · ${tr('cambia a medianoche en Madrid','changes at midnight in Madrid')}`:`${model.eligible.length} ${tr('candidatos de historias y acontecimientos','candidates from stories and events')}`}</small></div>
  <details className="dinastle-rules"><summary>{tr('Cómo se juega y qué significan las pistas','How to play and what the clues mean')}</summary><p>{tr('Puedes proponer cualquier persona del Atlas. La respuesta se selecciona entre personajes de historias y acontecimientos con datos suficientes. Coincidir en un territorio significa compartir alguna vinculación registrada durante sus vidas, aunque sus gobiernos no sean simultáneos.','You can guess any person in the Atlas. The answer is selected from people in stories and events with enough data. A territory match means both people have a recorded association with it during their lives, even if they did not rule at the same time.')}</p><p>{tr('La casa coincide por identidad; una rama de la misma familia da cercanía. Una región geográfica no es parentesco. Las funciones distinguen soberanía, consorte, regencia y gobierno delegado. El nacimiento se considera cercano a menos de 51 años; las fechas aproximadas llevan «c.» y no se presentan como coincidencias exactas.','Houses match by identity; a branch of the same family counts as close. A geographical region is not kinship. Roles distinguish sovereignty, consortship, regency and delegated government. Birth dates within 51 years are close; approximate dates carry “c.” and are not exact matches.')}</p><p>{tr('En vínculos se distinguen filiación, matrimonio y coincidencia en un episodio. «Sin vínculo cercano registrado» expresa el límite de la base. ↑ indica que la respuesta nació después; ↓, antes. Desde el cuarto intento aparecen pistas. El resultado se puede compartir sin revelar el nombre.','Connections distinguish parentage, marriage and appearance in the same episode. “No close connection recorded” states the database limit. ↑ means the answer was born later; ↓ means earlier. Hints appear from the fourth attempt. You can share the result without revealing the name.')}</p></details>
  {!done&&<div className="dinastle-search"><label className="sr-only" htmlFor={listId+'-input'}>{tr('Nombre del personaje','Person’s name')}</label><input ref={input} id={listId+'-input'} role="combobox" aria-autocomplete="list" aria-controls={listId} aria-expanded={open&&results.length>0} aria-activedescendant={open&&results[active]?listId+'-'+active:undefined} autoComplete="off" placeholder={tr('Escribe un nombre: Isabel, Carlos, Juana…','Type a name: Elizabeth, Charles, Joanna…')} value={query} onChange={e=>{setQuery(e.target.value);setActive(0);setOpen(true);setMessage('');}} onFocus={()=>setOpen(true)} onBlur={e=>{if(!e.currentTarget.parentElement.contains(e.relatedTarget))setOpen(false);}} onKeyDown={e=>{if(['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();setOpen(true);setActive(n=>results.length?(n+(e.key==='ArrowDown'?1:results.length-1))%results.length:0);}else if(e.key==='Enter'){e.preventDefault();if(open&&results[active])guess(results[active].id);else setMessage(tr('Elige una persona de las sugerencias.','Choose a person from the suggestions.'));}else if(e.key==='Escape')setOpen(false);}}/>{open&&results.length>0&&<ul id={listId} role="listbox" aria-label={tr('Sugerencias de personajes','Person suggestions')}>{results.map((entry,i)=><li role="option" id={listId+'-'+i} aria-selected={i===active} key={entry.id}><button type="button" tabIndex={-1} onMouseDown={e=>e.preventDefault()} onClick={()=>guess(entry.id)}><strong>{entry.person.nombre}</strong><small>{entry.house||tr('Sin casa documentada','No documented house')} · {entry.year??'?'}</small></button></li>)}</ul>}{open&&query.trim()&&!results.length&&<p className="dinastle-no-results">{tr('No hay coincidencias disponibles. Prueba otro nombre.','No matches are available. Try another name.')}</p>}</div>}
  <p role="status" aria-live="polite" className="dinastle-message">{message||(!saved?tr('El progreso se conserva durante esta visita; el navegador no permite guardarlo.','Progress is retained for this visit; the browser does not allow it to be saved.'):' ')}</p>
  <div className="dinastle-key">{Object.entries(displayStatuses).map(([s,label])=><span key={s}><i className={'is-'+s} aria-hidden="true">{symbols[s]}</i>{label}</span>)}</div>
  <div className="dinastle-board" role="table" aria-label={tr('Intentos y pistas de Dinastle','Dinastle guesses and clues')}><div className="dinastle-row dinastle-head" role="row">{[tr('Persona','Person'),...displayColumns].map(c=><div role="columnheader" key={c}>{c}</div>)}</div>{state.guesses.map((id,index)=>{const e=model.byId.get(id),cells=compareDinastle(model,e,secret).map((cell,i)=>en?englishDinastleCell(cell,i):cell);return <div role="row" className="dinastle-row dinastle-reveal" key={id}><div role="rowheader" className="dinastle-person"><small>{tr('Intento','Attempt')} {index+1}</small><strong>{e.person.nombre}</strong></div>{cells.map((c,i)=><div role="cell" key={i} className={'dinastle-cell is-'+c.status} style={{'--cell-delay':i*65+'ms'}} aria-label={`${displayColumns[i]}: ${c.label}. ${displayStatuses[c.status]}${c.direction?c.direction==='after'?tr('. Nació después','. Born later'):tr('. Nació antes','. Born earlier'):''}`}><small>{displayColumns[i]}</small><DinastleCellText cell={c} index={i}/><i aria-hidden="true">{symbols[c.status]}</i></div>)}</div>})}{!state.guesses.length&&<p className="dinastle-empty">{tr('Tu primera propuesta abrirá las pistas. No hace falta conocer todos los personajes.','Your first guess will reveal the clues. You do not need to know every person.')}</p>}</div>
  {!done&&state.guesses.length>=4&&<aside className="dinastle-hint"><strong>{state.guesses.length>=6?tr('Pista ampliada','Extended hint'):tr('Pista','Hint')}</strong><p>{en?`Born in the ${Math.ceil(secret.year/100)}${ordinal(Math.ceil(secret.year/100))} century${secret.approximate?' (approximately)':''}.`:`Nació en el siglo ${Math.ceil(secret.year/100)}${secret.approximate?' aproximadamente':''}.`}{state.guesses.length>=6?` ${tr('Función registrada','Recorded role')}: ${secret.roles.map(value=>en?englishLabel(value):value).join(' · ')}.`:''}{state.guesses.length>=7?` ${tr('Su nombre empieza por','Their name begins with')} “${secret.person.nombre[0]}”.`:''}</p></aside>}
  {done&&<div className="dinastle-result"><span className="dinastle-eyebrow">{won?(en?`Correct in ${state.guesses.length} attempts!`:`¡Acertado en ${state.guesses.length} intentos!`):tr('Hoy has descubierto a…','Today you discovered…')}</span><h2>{secret.person.nombre}</h2><p>{en?englishLabel(secret.house):secret.house} · {secret.approximate?'c. ':''}{secret.year}–{secret.person.muer??'?'} · {secret.roles.map(value=>en?englishLabel(value):value).join(' · ')}</p><p>{secret.territories.map(value=>en?englishLabel(value):value).join(' · ')}</p><div className="dinastle-actions"><a href={en?rutaEntidadLocalizada('en','persona',slugPersonaPorLocale(secret.person,'en')):secret.href}>{tr('Descubrir su ficha','Open the profile')} <ArrowRight size={16}/></a><button type="button" onClick={share}><Copy size={15}/> {tr('Copiar resultado','Copy result')}</button><button type="button" onClick={startFree}><Shuffle size={15}/> {tr('Otra partida','Another game')}</button></div>{shareText&&<textarea aria-label={tr('Resultado para copiar','Result to copy')} readOnly value={shareText}/>}</div>}
  <div className="dinastle-stats" aria-label={tr('Estadísticas de Dinastle diario','Daily Dinastle statistics')}>{[[tr('partidas','games'),daily.stats.played],[tr('victorias','wins'),daily.stats.won],[tr('racha','streak'),daily.stats.streak],[tr('mejor racha','best streak'),daily.stats.best]].map(([label,n])=><span key={label}><strong>{n}</strong>{label}</span>)}</div>
  <p className="dinastle-footnote">{tr('Pistas calculadas con los datos del Atlas. Los resultados se guardan en este navegador. Las partidas libres no cambian las estadísticas diarias.','Clues are calculated from Atlas data. Results are saved in this browser. Free games do not change daily statistics.')}</p>
 </section>;
}

function ordinal(number){const mod100=number%100;if(mod100>=11&&mod100<=13)return'th';return number%10===1?'st':number%10===2?'nd':number%10===3?'rd':'th';}

function englishDinastleCell(cell,index){
 let label=cell.label;
 if(index<=2)label=label.split(' · ').map(englishLabel).join(' · ');
 if(index===4){
  const exact={'Sin vínculo cercano registrado':'No close relationship recorded','Matrimonio documentado':'Documented marriage','Coinciden en un episodio; sin parentesco cercano registrado':'Appear in the same episode; no close relationship recorded','Es este personaje':'This is the person','Padre, madre, hijo o hija':'Parent or child'};
  label=exact[label]||label.replace(/(\d+) pasos de filiación/,(_,count)=>`${count} parentage steps`);
 }
 return {...cell,label};
}

function localizedShare(model,state,locale){
 const result=dinastleShare(model,state);
 if(locale!=='en')return result;
 return result.replace('libre','free').replace(/nº /,'no. ').replace('https://treeofeurope.eu/es/desafio?juego=dinastle','https://treeofeurope.eu/en/challenge?game=dinastle');
}

function DinastleCellText({cell,index}) {
 const items=index===1?cell.label.split(' · '):[];
 if(items.length>3)return <details className="dinastle-territories"><summary>{items.slice(0,2).join(' · ')} <span>+{items.length-2}</span></summary><ul>{items.map(item=><li key={item}>{item}</li>)}</ul></details>;
 return <span>{cell.label}{cell.direction&&<b aria-hidden="true"> {cell.direction==='after'?'↑':'↓'}</b>}</span>;
}
