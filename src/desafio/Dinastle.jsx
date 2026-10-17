import {useEffect,useId,useMemo,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,Copy,Shuffle,RotateCcw} from 'lucide-react';
import {HISTORIAS,EVENTOS_HISTORICOS} from '../historiaData.jsx';
import {normalizarBusquedaPublica} from '../utils/personLabels.js';
import {buildDinastleModel,dinastleDay,dayNumber,restoreDinastle,submitDinastle,compareDinastle,dinastleShare,DINASTLE_MAX} from './dinastleEngine.js';
import './dinastle.css';

const STORAGE_KEY='eade.dinastle.v1';
const columns=['Casa','Territorios vinculados','Función','Nacimiento','Vínculo'];
const statuses={exact:'Coincide',near:'Cercano',miss:'No coincide',unknown:'Sin dato comparable'};
const symbols={exact:'✓',near:'≈',miss:'—',unknown:'?'};
const storage=()=>{try{return window.localStorage;}catch{return null;}};
function read(model,day){try{return restoreDinastle(JSON.parse(storage()?.getItem(STORAGE_KEY)||'null'),model,day);}catch{return restoreDinastle(null,model,day);}}

export default function Dinastle({people,onBack}) {
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
 if(!secret)return <section className="dinastle"><button onClick={onBack}>Volver a modos</button><h1>Dinastle</h1><p>No hay candidatos con datos suficientes para esta partida.</p></section>;
 const guess=id=>{
  if(done||!model.byId.has(id)||state.guesses.includes(id))return;
  if(free)setFree(previous=>submitDinastle(previous,id));else setDaily(previous=>submitDinastle(previous,id));
  setQuery('');setOpen(false);setActive(0);setMessage(id===secret.id?'¡Acertado!':`Intento ${state.guesses.length+1} de ${DINASTLE_MAX}. Pistas añadidas.`);input.current?.focus();
 };
 const startFree=()=>{const candidates=model.eligible.filter(e=>e.id!==state.secret);if(!candidates.length)return;const next=candidates[Math.floor(Math.random()*candidates.length)];setFree({...restoreDinastle(null,model,day),secret:next.id,daily:false});setQuery('');setMessage('Nueva partida libre.');setOpen(false);input.current?.focus();};
 return <DinastleBoard key={(free?'free:':'daily:')+state.secret} {...{model,state,secret,done,won,daily,free,day,query,setQuery,active,setActive,open,setOpen,message,setMessage,saved,input,listId,results,guess,startFree,onBack}} onDaily={()=>{setFree(null);setQuery('');setMessage('Partida diaria recuperada.');setOpen(false);}}/>;
}

function DinastleBoard({model,state,secret,done,won,daily,free,day,query,setQuery,active,setActive,open,setOpen,message,setMessage,saved,input,listId,results,guess,startFree,onBack,onDaily}) {
 const [shareText,setShareText]=useState('');
 const share=async()=>{try{await navigator.clipboard.writeText(dinastleShare(model,state));setMessage('Resultado copiado sin revelar el personaje.');}catch{setShareText(dinastleShare(model,state));setMessage('Selecciona y copia el resultado de abajo.');}};
 return <section className="dinastle" aria-labelledby="dinastle-title">
  <button type="button" className="dinastle-back" onClick={onBack}><ArrowLeft size={16}/> Todos los modos</button>
  <header className="dinastle-header"><div><span className="dinastle-eyebrow">Un personaje · ocho oportunidades</span><h1 id="dinastle-title">Dinastle</h1><p>Adivina quién se esconde entre las historias del Atlas.</p></div><div className="dinastle-counter"><span>{free?'Partida libre':`Diario nº ${dayNumber(day)}`}</span><strong>{state.guesses.length}<small> / {DINASTLE_MAX}</small></strong><span>intentos</span></div></header>
  <div className="dinastle-toolbar"><button type="button" aria-pressed={!free} onClick={onDaily}><RotateCcw size={14}/> El de hoy</button><button type="button" onClick={startFree}><Shuffle size={14}/> {free?'Otro personaje':'Partida libre'}</button><small>{!free?`${day} · cambia a medianoche en Madrid`:`${model.eligible.length} candidatos de historias y acontecimientos`}</small></div>
  <details className="dinastle-rules"><summary>Cómo se juega y qué significan las pistas</summary><p>Puedes proponer cualquier persona del Atlas. La respuesta se selecciona entre personajes de historias y acontecimientos con datos suficientes. Coincidir en un territorio significa compartir alguna vinculación registrada durante sus vidas, aunque sus gobiernos no sean simultáneos.</p><p>La casa coincide por identidad; una rama de la misma familia da cercanía. Una región geográfica no es parentesco. Las funciones distinguen soberanía, consorte, regencia y gobierno delegado. El nacimiento se considera cercano a menos de 51 años; las fechas aproximadas llevan «c.» y no se presentan como coincidencias exactas.</p><p>En vínculos se distinguen filiación, matrimonio y coincidencia en un episodio. «Sin vínculo cercano registrado» expresa el límite de la base. ↑ indica que la respuesta nació después; ↓, antes. Desde el cuarto intento aparecen pistas. El resultado se puede compartir sin revelar el nombre.</p></details>
  {!done&&<div className="dinastle-search"><label className="sr-only" htmlFor={listId+'-input'}>Nombre del personaje</label><input ref={input} id={listId+'-input'} role="combobox" aria-autocomplete="list" aria-controls={listId} aria-expanded={open&&results.length>0} aria-activedescendant={open&&results[active]?listId+'-'+active:undefined} autoComplete="off" placeholder="Escribe un nombre: Isabel, Carlos, Juana…" value={query} onChange={e=>{setQuery(e.target.value);setActive(0);setOpen(true);setMessage('');}} onFocus={()=>setOpen(true)} onBlur={e=>{if(!e.currentTarget.parentElement.contains(e.relatedTarget))setOpen(false);}} onKeyDown={e=>{if(['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();setOpen(true);setActive(n=>results.length?(n+(e.key==='ArrowDown'?1:results.length-1))%results.length:0);}else if(e.key==='Enter'){e.preventDefault();if(open&&results[active])guess(results[active].id);else setMessage('Elige una persona de las sugerencias.');}else if(e.key==='Escape')setOpen(false);}}/>{open&&results.length>0&&<ul id={listId} role="listbox" aria-label="Sugerencias de personajes">{results.map((entry,i)=><li role="option" id={listId+'-'+i} aria-selected={i===active} key={entry.id}><button type="button" tabIndex={-1} onMouseDown={e=>e.preventDefault()} onClick={()=>guess(entry.id)}><strong>{entry.person.nombre}</strong><small>{entry.house||'Sin casa documentada'} · {entry.year??'?'}</small></button></li>)}</ul>}{open&&query.trim()&&!results.length&&<p className="dinastle-no-results">No hay coincidencias disponibles. Prueba otro nombre.</p>}</div>}
  <p role="status" aria-live="polite" className="dinastle-message">{message||(!saved?'El progreso se conserva durante esta visita; el navegador no permite guardarlo.':' ')}</p>
  <div className="dinastle-key">{Object.entries(statuses).map(([s,label])=><span key={s}><i className={'is-'+s} aria-hidden="true">{symbols[s]}</i>{label}</span>)}</div>
  <div className="dinastle-board" role="table" aria-label="Intentos y pistas de Dinastle"><div className="dinastle-row dinastle-head" role="row">{['Persona',...columns].map(c=><div role="columnheader" key={c}>{c}</div>)}</div>{state.guesses.map((id,index)=>{const e=model.byId.get(id),cells=compareDinastle(model,e,secret);return <div role="row" className="dinastle-row dinastle-reveal" key={id}><div role="rowheader" className="dinastle-person"><small>Intento {index+1}</small><strong>{e.person.nombre}</strong></div>{cells.map((c,i)=><div role="cell" key={i} className={'dinastle-cell is-'+c.status} style={{'--cell-delay':i*65+'ms'}} aria-label={`${columns[i]}: ${c.label}. ${statuses[c.status]}${c.direction?c.direction==='after'?'. Nació después':'. Nació antes':''}`}><small>{columns[i]}</small><DinastleCellText cell={c} index={i}/><i aria-hidden="true">{symbols[c.status]}</i></div>)}</div>})}{!state.guesses.length&&<p className="dinastle-empty">Tu primera propuesta abrirá las pistas. No hace falta conocer todos los personajes.</p>}</div>
  {!done&&state.guesses.length>=4&&<aside className="dinastle-hint"><strong>Pista {state.guesses.length>=6?'ampliada':''}</strong><p>Nació en el siglo {Math.ceil(secret.year/100)}{secret.approximate?' aproximadamente':''}.{state.guesses.length>=6?` Función registrada: ${secret.roles.join(' · ')}.`:''}{state.guesses.length>=7?` Su nombre empieza por «${secret.person.nombre[0]}».`:''}</p></aside>}
  {done&&<div className="dinastle-result"><span className="dinastle-eyebrow">{won?`¡Acertado en ${state.guesses.length} intentos!`:'Hoy has descubierto a…'}</span><h2>{secret.person.nombre}</h2><p>{secret.house} · {secret.approximate?'c. ':''}{secret.year}–{secret.person.muer??'?'} · {secret.roles.join(' · ')}</p><p>{secret.territories.join(' · ')}</p><div className="dinastle-actions"><a href={secret.href}>Descubrir su ficha <ArrowRight size={16}/></a><button type="button" onClick={share}><Copy size={15}/> Copiar resultado</button><button type="button" onClick={startFree}><Shuffle size={15}/> Otra partida</button></div>{shareText&&<textarea aria-label="Resultado para copiar" readOnly value={shareText}/>}</div>}
  <div className="dinastle-stats" aria-label="Estadísticas de Dinastle diario">{[['partidas',daily.stats.played],['victorias',daily.stats.won],['racha',daily.stats.streak],['mejor racha',daily.stats.best]].map(([label,n])=><span key={label}><strong>{n}</strong>{label}</span>)}</div>
  <p className="dinastle-footnote">Pistas calculadas con los datos del Atlas. Los resultados se guardan en este navegador. Las partidas libres no cambian las estadísticas diarias.</p>
 </section>;
}

function DinastleCellText({cell,index}) {
 const items=index===1?cell.label.split(' · '):[];
 if(items.length>3)return <details className="dinastle-territories"><summary>{items.slice(0,2).join(' · ')} <span>+{items.length-2}</span></summary><ul>{items.map(item=><li key={item}>{item}</li>)}</ul></details>;
 return <span>{cell.label}{cell.direction&&<b aria-hidden="true"> {cell.direction==='after'?'↑':'↓'}</b>}</span>;
}
