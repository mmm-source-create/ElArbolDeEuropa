import {useEffect,useRef,useState} from 'react';
import {Search,ArrowRight,RotateCcw,Check,X} from 'lucide-react';
import {portraitSuggestions,nextPortrait} from '../desafio/portraitSearch.js';
import {responsiveImage} from '../../utils/responsiveImage.js';
import '../desafio/desafio.css';
import '../desafio/desafio-interactions.css';
import './englishChallenge.css';
export const ENGLISH_PORTRAIT_RECORD='eade:portraits:en:v1';

export default function EnglishPortraitChallenge({data}){
 const [person,setPerson]=useState(null),[used,setUsed]=useState([]),[query,setQuery]=useState(''),[selected,setSelected]=useState(null),[score,setScore]=useState(0),[done,setDone]=useState(false),[best,setBest]=useState(0),[active,setActive]=useState(0);
 const input=useRef(null),start=useRef(null);
 const options=portraitSuggestions(data.people,query,7,'en'),correct=selected===person?.id;
 useEffect(()=>{try{const n=Number(localStorage.getItem(ENGLISH_PORTRAIT_RECORD));if(Number.isInteger(n)&&n>0)setBest(n);}catch{/* Play remains available without storage. */}},[]);
 useEffect(()=>{if(person&&!selected&&!done)input.current?.focus();else if(!person&&used.length)start.current?.focus();},[person,selected,done,used.length]);
 const newGame=()=>{const p=nextPortrait(data.people);setPerson(p);setUsed(p?[p.id]:[]);setScore(0);setDone(false);setSelected(null);setQuery('');setActive(0);};
 const answer=id=>{if(selected||done)return;setSelected(id);if(id===person.id){const n=score+1;setScore(n);if(n>best){setBest(n);try{localStorage.setItem(ENGLISH_PORTRAIT_RECORD,String(n));}catch{/* Optional local record. */}}}else setDone(true);};
 const next=()=>{const p=nextPortrait(data.people,used);if(!p){setDone(true);return;}setPerson(p);setUsed([...used,p.id]);setSelected(null);setQuery('');setActive(0);};
 const exit=()=>{setPerson(null);setDone(false);setSelected(null);start.current?.focus();};
 return <main className="public-main desafio-page desafio-page-main english-challenge">
  <nav className="public-breadcrumbs" aria-label="Breadcrumb"><a href="/en/">Home</a><span>›</span><span aria-current="page">Challenge</span></nav>
  <header className="public-page-title"><span>Learn through the Atlas</span><h1>Challenge</h1><p>Identify historical portraits using English names, alternative names and nicknames. Each answer opens a complete English profile.</p></header>
  {!person?<section className="desafio-shell desafio-hub"><div className="desafio-mode-grid"><article className="desafio-mode-card is-portrait"><span className="desafio-mode-icon"><Search size={21}/></span><h2>Portraits</h2><p>Build a streak by recognising the people in these images. Type part of a name and choose a match. One wrong answer ends the streak.</p><p>{data.people.length} portraits · no repeats within a game · best streak: {best}</p><button ref={start} className="desafio-primary" onClick={newGame}>Start Portraits <ArrowRight size={14}/></button></article></div><p className="english-catalog-note">The other game modes are currently available in the <a href="/es/desafio">Spanish Challenge · ES</a>.</p></section>:<section className="desafio-shell desafio-play desafio-portrait-shell">
   <div className="desafio-progress-row"><h2>Portraits</h2><strong aria-label="Current streak">Streak: {score} · Best: {best}</strong></div>
   {!selected&&!done&&<div className="desafio-question-card desafio-portrait-card"><h3>Who is shown in this portrait?</h3><div className="desafio-portrait-stage"><img {...responsiveImage(person.portrait.archivo,'(max-width: 600px) 80vw, 310px')} alt="Historical portrait to identify" draggable="false" style={{objectPosition:person.portrait.encuadre||'50% 20%'}}/></div>
    <div className="desafio-name-entry"><label htmlFor="english-portrait-name">Name or nickname</label><div className="desafio-name-input"><Search size={16}/><input ref={input} id="english-portrait-name" role="combobox" aria-autocomplete="list" aria-controls="english-portrait-options" aria-expanded={Boolean(query.trim())} aria-activedescendant={options[active]?`english-option-${options[active].id}`:undefined} value={query} autoComplete="off" spellCheck="false" placeholder="Try Lionheart, Charles II, the Great…" onChange={e=>{setQuery(e.target.value);setActive(0);}} onKeyDown={e=>{if(['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();setActive(n=>options.length?(n+(e.key==='ArrowDown'?1:-1)+options.length)%options.length:0);}if(e.key==='Enter'&&options[active]){e.preventDefault();answer(options[active].id);}if(e.key==='Escape')setQuery('');}}/></div><small>Partial names and nicknames work. Use the arrow keys to choose a match and Enter to answer.</small>
     {!!query.trim()&&<div id="english-portrait-options" className="desafio-name-suggestions" role="listbox" aria-label="Name suggestions">{options.length?options.map((p,i)=><button type="button" id={`english-option-${p.id}`} key={p.id} role="option" aria-selected={i===active} onClick={()=>answer(p.id)}><strong>{p.nombre}{p.sobrenombre?` · ${p.sobrenombre}`:''}</strong><span>{p.role}</span></button>):<p role="status">No matches. Try another part of the name.</p>}</div>}
    </div>
   </div>}
   {(selected||done)&&<div className={`desafio-fast-feedback ${correct?'is-correct':'is-wrong'}`}><div className="desafio-fast-feedback-head" role="status">{correct?<Check size={16}/>:<X size={16}/>}<strong>{done?(correct?'You identified every portrait!':'Streak finished'): 'Correct'}</strong></div><div className="desafio-portrait-result"><span className="desafio-portrait-result-image"><img {...responsiveImage(person.portrait.archivo,'74px')} alt={`Portrait of ${person.nombre}`}/></span><div><h3>{person.nombre}</h3>{person.sobrenombre&&<p>“{person.sobrenombre}”</p>}<p>{person.summary}</p><p>{person.portrait.tipo} · {person.portrait.obra} · {person.portrait.autor}{person.portrait.fecha?` · ${person.portrait.fecha}`:''}</p>{person.portrait.institucion&&<p>{person.portrait.institucion}</p>}<small>{person.portrait.derechos} · <a href={person.portrait.fuenteUrl} target="_blank" rel="noreferrer">Image source and licence</a></small></div></div><div className="desafio-final-actions"><a className="desafio-secondary" href={person.path}>Read the complete profile</a>{!done&&<button className="desafio-primary" onClick={next}>Next portrait <ArrowRight size={14}/></button>}{done&&<button className="desafio-primary" onClick={newGame}>Play again <RotateCcw size={14}/></button>}</div></div>}
   <button className="desafio-back desafio-back-bottom" onClick={exit}>Back to Challenge</button>
  </section>}
 </main>;
}
