import {useEffect,useMemo,useRef,useState} from 'react';
import {PERSONAS} from '../data/personas.js';
import {TERRITORIOS} from '../data/territorios.js';
import {HISTORIAS} from '../data/historias.js';
import {coverageReport,coverageTasks,PILOT_PERSON_IDS} from '../evidence/claims.js';
import {slugBasePersona,slugPublico} from '../domain/people/personLabels.js';
import './evidence.css';
import {translatedEquivalent} from '../features/english/routes.js';
import {englishLabel,englishNote} from '../features/english/v6/atlasPresentation.js';

export default function CoverageDialog({onClose,locale='es'}) {
  const en=locale==='en',tr=(es,english)=>en?english:es,term=value=>en?englishLabel(value):value,note=value=>en?englishNote(value):value;
  const report=useMemo(()=>coverageReport(PERSONAS,TERRITORIOS,HISTORIAS),[]);
  const tasks=useMemo(()=>coverageTasks(PERSONAS,Infinity,TERRITORIOS),[]);
  const [kind,setKind]=useState('all');
  const [status,setStatus]=useState('all');
  const [query,setQuery]=useState('');
  const slugCounts=useMemo(()=>{const counts=new Map();for(const person of PERSONAS){const slug=slugBasePersona(person);counts.set(slug,(counts.get(slug)||0)+1);}return counts;},[]);
  const byId=useMemo(()=>new Map(PERSONAS.map(person=>[person.id,person])),[]);
  const taskHref=task=>{
    if(task.territory)return translatedEquivalent(`/es/territorio/${slugPublico(task.territory)}`,locale)+'#sucesion';
    const person=byId.get(task.personId);
    if(!person)return '/es/personas';
    const base=slugBasePersona(person);
    return translatedEquivalent(`/es/persona/${base}${slugCounts.get(base)>1?`-${slugPublico(person.id)}`:''}`,locale)+'#historical-evidence';
  };
  const filtered=tasks.filter(task=>(kind==='all'||task.kind===kind)&&(status==='all'||task.status===status)&&(!query||`${task.personName} ${task.detail||''}`.toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es'))));
  const kindLabels={conflict:'Fuentes o fechas en conflicto',parents:'Filiación sin registrar',dates:'Fechas incompletas',government:'Gobierno sin fuente precisa',chronology:'Cronología que revisar',territory_gap:'Hueco territorial'};
  const statusLabels={not_researched:'Pendiente de investigar',unknown:'Desconocido documentado',possible_error:'Posible error'};
  const displayKind=value=>en?({conflict:'Conflicting sources or dates',parents:'Unrecorded parentage',dates:'Incomplete dates',government:'Government without a precise source',chronology:'Chronology to review',territory_gap:'Territorial gap'}[value]||value):kindLabels[value];
  const displayStatus=value=>en?({not_researched:'Research pending',unknown:'Documented unknown',possible_error:'Possible error'}[value]||value):statusLabels[value];
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
      <div className="evidence-dialog-heading"><div><span>{tr('AUDITORÍA EDITORIAL','EDITORIAL AUDIT')} · V4.1</span><h2 id="evidence-dialog-heading">{tr('Cobertura documental','Documentary coverage')}</h2></div><button ref={closeRef} type="button" onClick={onClose} aria-label={tr('Cerrar cobertura','Close coverage report')}>×</button></div>
      <p>{tr('La base heredada agrupa bibliografía por ficha, pero todavía no relaciona cada dato con un pasaje preciso. Estas cifras son tareas de revisión, no errores históricos confirmados.','The inherited database groups references by profile but does not yet link every data point to a precise passage. These figures describe review tasks, not confirmed historical errors.')}</p>
      <div className="evidence-metrics">
        <div><strong>{report.total}</strong><span>{tr('Afirmaciones registradas','Recorded claims')}</span></div>
        <div><strong>{report.sourced}</strong><span>{tr('Con pasaje específico','With a specific passage')}</span></div>
        <div><strong>{report.totals.approximate + report.totals.disputed + report.totals.inferred}</strong><span>{tr('Aproximadas, discutidas o inferidas','Approximate, disputed or inferred')}</span></div>
      </div>
      <h3>{tr('Prioridades de revisión','Review priorities')}</h3>
      <dl className="evidence-coverage-list">
        <div><dt>{tr('Personas sin padres registrados','People without recorded parents')}</dt><dd>{report.withoutParents}</dd></div>
        <div><dt>{tr('Fechas de nacimiento o muerte incompletas','Incomplete birth or death dates')}</dt><dd>{report.incompleteDates}</dd></div>
        <div><dt>{tr('Gobiernos sin fuente específica','Governments without a specific source')}</dt><dd>{report.governmentsWithoutSource}</dd></div>
        <div><dt>{tr('Posibles contradicciones cronológicas de personas','Possible personal chronology conflicts')}</dt><dd>{report.possibleContradictions}</dd></div>
        <div><dt>{tr('Afirmaciones marcadas como discutidas','Claims marked as disputed')}</dt><dd>{report.totals.disputed}</dd></div>
        <div><dt>{tr('Huecos de más de 50 años entre gobiernos registrados','Gaps of more than 50 years between recorded governments')}</dt><dd>{report.territoryGaps}</dd></div>
        <div><dt>{tr('Historias con protagonistas pendientes de revisión','Stories with people pending review')}</dt><dd>{report.storiesToReview}</dd></div>
      </dl>
      <details><summary>{tr('Desglose de afirmaciones pendientes','Pending claims breakdown')}</summary><ul>{fields.map(([field,data])=><li key={field}>{term(field)}: {data.pending} {tr('de','of')} {data.total}</li>)}</ul></details>
      <h3>{tr('Tareas de revisión','Review tasks')}</h3>
      <p>{en?`The pilot path contains ${PILOT_PERSON_IDS.length} people across three generations. Its tasks appear first. “Research pending” means the record does not contain enough evidence; “documented unknown” is reserved for an absence declared by an editor; “possible error” requires human verification.`:`El recorrido piloto reúne ${PILOT_PERSON_IDS.length} personas de tres generaciones. Las tareas de ese recorrido aparecen primero. «Pendiente de investigar» indica que el registro no contiene evidencia suficiente; «desconocido» se reserva para una ausencia declarada por un editor; «posible error» exige comprobación humana.`}</p>
      <div className="evidence-task-filters">
        <label>{tr('Buscar','Search')} <input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder={tr('Persona o territorio','Person or territory')}/></label>
        <label>{tr('Tipo','Type')} <select value={kind} onChange={event=>setKind(event.target.value)}><option value="all">{tr('Todos','All')}</option>{Object.keys(kindLabels).map(value=><option key={value} value={value}>{displayKind(value)}</option>)}</select></label>
        <label>{tr('Estado','Status')} <select value={status} onChange={event=>setStatus(event.target.value)}><option value="all">{tr('Todos','All')}</option>{Object.keys(statusLabels).map(value=><option key={value} value={value}>{displayStatus(value)}</option>)}</select></label>
      </div>
      <p className="evidence-task-count" role="status">{filtered.length} {tr('tareas','tasks')} · {tr('se muestran','showing')} {Math.min(filtered.length,40)}</p>
      <ol className="evidence-task-list">{filtered.slice(0,40).map(task=><li key={task.id}><div><strong>{task.personName}</strong><span>{displayKind(task.kind)} · {displayStatus(task.status)}</span>{task.detail&&<small>{note(task.detail)}</small>}</div><a href={taskHref(task)}>{tr('Abrir ficha','Open profile')} →</a></li>)}</ol>
      {!filtered.length&&<p>{tr('No hay tareas con estos filtros.','No tasks match these filters.')}</p>}
      <p className="evidence-caveat">{tr('Los huecos territoriales señalan cobertura de datos, no prueban ausencia de gobierno. Las fuentes generales siguen disponibles en cada ficha para iniciar la revisión.','Territorial gaps indicate data coverage; they do not prove the absence of government. General sources remain available in each profile as a starting point for review.')}</p>
    </section>
  </div>;
}
