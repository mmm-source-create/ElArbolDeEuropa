import React,{useEffect,useMemo,useRef,useState} from 'react';
import {PERSONAS} from '../personas.jsx';
import {TERRITORIOS} from '../data/territorios.js';
import {HISTORIAS} from '../historiaData.jsx';
import {coverageReport,coverageTasks,PILOT_PERSON_IDS} from './claims.js';
import {slugBasePersona,slugPublico} from '../utils/personLabels.js';
import './evidence.css';

export default function CoverageDialog({onClose}) {
  const report=useMemo(()=>coverageReport(PERSONAS,TERRITORIOS,HISTORIAS),[]);
  const tasks=useMemo(()=>coverageTasks(PERSONAS,Infinity,TERRITORIOS),[]);
  const [kind,setKind]=useState('all');
  const [status,setStatus]=useState('all');
  const [query,setQuery]=useState('');
  const slugCounts=useMemo(()=>{const counts=new Map();for(const person of PERSONAS){const slug=slugBasePersona(person);counts.set(slug,(counts.get(slug)||0)+1);}return counts;},[]);
  const byId=useMemo(()=>new Map(PERSONAS.map(person=>[person.id,person])),[]);
  const taskHref=task=>{
    if(task.territory)return `/es/territorio/${slugPublico(task.territory)}#sucesion`;
    const person=byId.get(task.personId);
    if(!person)return '/es/personas';
    const base=slugBasePersona(person);
    return `/es/persona/${base}${slugCounts.get(base)>1?`-${slugPublico(person.id)}`:''}#historical-evidence`;
  };
  const filtered=tasks.filter(task=>(kind==='all'||task.kind===kind)&&(status==='all'||task.status===status)&&(!query||`${task.personName} ${task.detail||''}`.toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es'))));
  const kindLabels={conflict:'Fuentes o fechas en conflicto',parents:'Filiación sin registrar',dates:'Fechas incompletas',government:'Gobierno sin fuente precisa',chronology:'Cronología que revisar',territory_gap:'Hueco territorial'};
  const statusLabels={not_researched:'Pendiente de investigar',unknown:'Desconocido documentado',possible_error:'Posible error'};
  const closeRef=useRef(null);
  const dialogRef=useRef(null);
  useEffect(()=>{
    const previousFocus=document.activeElement;
    closeRef.current?.focus();
    const onKey=event=>{
      if(event.key==='Escape')onClose();
      if(event.key!=='Tab')return;
      const items=[...dialogRef.current.querySelectorAll('button,summary,a[href],input,select,[tabindex]:not([tabindex="-1"])')].filter(element=>!element.disabled);
      if(!items.length)return;
      const first=items[0],last=items.at(-1);
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    };
    window.addEventListener('keydown',onKey);
    return ()=>{window.removeEventListener('keydown',onKey);previousFocus?.focus?.();};
  },[onClose]);
  const fields=Object.entries(report.byField).sort((a,b)=>b[1].pending-a[1].pending);
  return <div className="evidence-dialog-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)onClose();}}>
    <section ref={dialogRef} className="evidence-dialog" role="dialog" aria-modal="true" aria-labelledby="evidence-dialog-heading">
      <div className="evidence-dialog-heading"><div><span>AUDITORÍA EDITORIAL · V4.1</span><h2 id="evidence-dialog-heading">Cobertura documental</h2></div><button ref={closeRef} type="button" onClick={onClose} aria-label="Cerrar cobertura">×</button></div>
      <p>La base heredada agrupa bibliografía por ficha, pero todavía no relaciona cada dato con un pasaje preciso. Estas cifras son tareas de revisión, no errores históricos confirmados.</p>
      <div className="evidence-metrics">
        <div><strong>{report.total}</strong><span>Afirmaciones registradas</span></div>
        <div><strong>{report.sourced}</strong><span>Con pasaje específico</span></div>
        <div><strong>{report.totals.approximate + report.totals.disputed + report.totals.inferred}</strong><span>Aproximadas, discutidas o inferidas</span></div>
      </div>
      <h3>Prioridades de revisión</h3>
      <dl className="evidence-coverage-list">
        <div><dt>Personas sin padres registrados</dt><dd>{report.withoutParents}</dd></div>
        <div><dt>Fechas de nacimiento o muerte incompletas</dt><dd>{report.incompleteDates}</dd></div>
        <div><dt>Gobiernos sin fuente específica</dt><dd>{report.governmentsWithoutSource}</dd></div>
        <div><dt>Posibles contradicciones cronológicas de personas</dt><dd>{report.possibleContradictions}</dd></div>
        <div><dt>Afirmaciones marcadas como discutidas</dt><dd>{report.totals.disputed}</dd></div>
        <div><dt>Huecos de más de 50 años entre gobiernos registrados</dt><dd>{report.territoryGaps}</dd></div>
        <div><dt>Historias con protagonistas pendientes de revisión</dt><dd>{report.storiesToReview}</dd></div>
      </dl>
      <details><summary>Desglose de afirmaciones pendientes</summary><ul>{fields.map(([field,data])=><li key={field}>{field}: {data.pending} de {data.total}</li>)}</ul></details>
      <h3>Tareas de revisión</h3>
      <p>El recorrido piloto reúne {PILOT_PERSON_IDS.length} personas de tres generaciones. Las tareas de ese recorrido aparecen primero. «Pendiente de investigar» indica que el registro no contiene evidencia suficiente; «desconocido» se reserva para una ausencia declarada por un editor; «posible error» exige comprobación humana.</p>
      <div className="evidence-task-filters">
        <label>Buscar <input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Persona o territorio"/></label>
        <label>Tipo <select value={kind} onChange={event=>setKind(event.target.value)}><option value="all">Todos</option>{Object.entries(kindLabels).map(([value,text])=><option key={value} value={value}>{text}</option>)}</select></label>
        <label>Estado <select value={status} onChange={event=>setStatus(event.target.value)}><option value="all">Todos</option>{Object.entries(statusLabels).map(([value,text])=><option key={value} value={value}>{text}</option>)}</select></label>
      </div>
      <p className="evidence-task-count" role="status">{filtered.length} tareas · se muestran {Math.min(filtered.length,40)}</p>
      <ol className="evidence-task-list">{filtered.slice(0,40).map(task=><li key={task.id}><div><strong>{task.personName}</strong><span>{kindLabels[task.kind]} · {statusLabels[task.status]}</span>{task.detail&&<small>{task.detail}</small>}</div><a href={taskHref(task)}>Abrir ficha →</a></li>)}</ol>
      {!filtered.length&&<p>No hay tareas con estos filtros.</p>}
      <p className="evidence-caveat">Los huecos territoriales señalan cobertura de datos, no prueban ausencia de gobierno. Las fuentes generales siguen disponibles en cada ficha para iniciar la revisión.</p>
    </section>
  </div>;
}
