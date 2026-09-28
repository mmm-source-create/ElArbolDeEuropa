import React,{useEffect,useMemo,useRef} from 'react';
import {PERSONAS} from '../personas.jsx';
import {TERRITORIOS} from '../data/territorios.js';
import {HISTORIAS} from '../historiaData.jsx';
import {coverageReport} from './claims.js';
import './evidence.css';

export default function CoverageDialog({onClose}) {
  const report=useMemo(()=>coverageReport(PERSONAS,TERRITORIOS,HISTORIAS),[]);
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
      <div className="evidence-dialog-heading"><div><span>AUDITORÍA EDITORIAL · V4.0</span><h2 id="evidence-dialog-heading">Cobertura documental</h2></div><button ref={closeRef} type="button" onClick={onClose} aria-label="Cerrar cobertura">×</button></div>
      <p>La base heredada agrupa bibliografía por ficha, pero todavía no relaciona cada dato con un pasaje preciso. Estas cifras son tareas de revisión, no errores históricos confirmados.</p>
      <div className="evidence-metrics">
        <div><strong>{report.total}</strong><span>Afirmaciones registradas</span></div>
        <div><strong>{report.sourced}</strong><span>Con fuente específica</span></div>
        <div><strong>{report.totals.approximate + report.totals.disputed}</strong><span>Marcadas como aproximadas o discutidas</span></div>
      </div>
      <h3>Prioridades de revisión</h3>
      <dl className="evidence-coverage-list">
        <div><dt>Personas sin padres registrados</dt><dd>{report.withoutParents}</dd></div>
        <div><dt>Fechas de nacimiento o muerte incompletas</dt><dd>{report.incompleteDates}</dd></div>
        <div><dt>Gobiernos sin fuente específica</dt><dd>{report.governmentsWithoutSource}</dd></div>
        <div><dt>Posibles contradicciones cronológicas de personas</dt><dd>{report.possibleContradictions}</dd></div>
        <div><dt>Huecos de más de 50 años entre gobiernos registrados</dt><dd>{report.territoryGaps}</dd></div>
        <div><dt>Historias con protagonistas pendientes de revisión</dt><dd>{report.storiesToReview}</dd></div>
      </dl>
      <details><summary>Desglose de afirmaciones pendientes</summary><ul>{fields.map(([field,data])=><li key={field}>{field}: {data.pending} de {data.total}</li>)}</ul></details>
      <p className="evidence-caveat">Los huecos territoriales señalan cobertura de datos, no prueban ausencia de gobierno. Las fuentes generales siguen disponibles en cada ficha para iniciar la revisión.</p>
    </section>
  </div>;
}
