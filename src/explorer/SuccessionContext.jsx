import React from 'react';
import {TIPOS_FECHA} from '../data/successionHistory.js';
import './succession.css';

export function PersonLink({persona}) {
  return <a href={`/es/persona/${encodeURIComponent(persona.slug)}`}>{persona.nombre}</a>;
}
function References({fuentes}) {
  return <p className="succession-references">Referencias: {fuentes.map((s,i)=><React.Fragment key={s.url}>{i>0?' · ':''}<a href={s.url} target="_blank" rel="noreferrer">{s.titulo}</a></React.Fragment>)}</p>;
}
export function Lineage({personas,label='Línea familiar registrada',recorrido=false}) {
  return <div className="succession-lineage" data-relation={recorrido?'path':'descendencia'}><p>{label}</p><ol>{personas.map(p=><li key={p.id}><PersonLink persona={p}/></li>)}</ol></div>;
}
export function CrisisSucesoria({crisis}) {
  return <details className="succession-crisis" id={`crisis-${crisis.id}`}>
    <summary><span className="succession-crisis-period">{crisis.periodo}</span><span>{crisis.titulo}</span></summary>
    <div className="succession-crisis-body">
      <p>{crisis.resumen}</p>
      <div className="succession-candidates">{crisis.candidatos.map(c=><article key={c.persona.id}>
        <h4><PersonLink persona={c.persona}/></h4>
        <p>{c.fundamento}</p>
        <Lineage personas={c.ascendencia}/>
        <p><strong>Resultado.</strong> {c.resultado}</p>
        <a className="succession-atlas-link" href={`/es/?atlas=1&persona=${encodeURIComponent(c.persona.id)}`}>Ver en el Atlas →</a>
      </article>)}</div>
      <p><strong>Desenlace.</strong> {crisis.desenlace}</p>
      <References fuentes={crisis.fuentes}/>
    </div>
  </details>;
}
export function RelevoExplicado({relevo}) {
  return <details className="succession-explanation">
    <summary>Por qué cambió el gobierno <span>{relevo.motivos.join(' · ')}</span></summary>
    <div>
      <p><strong>Relevo de </strong><PersonLink persona={relevo.predecesor.persona}/></p>
      <p>{relevo.explicacion}</p>
      <p className="succession-kinship">{relevo.parentesco.texto}</p>
      {relevo.parentesco.via.length>2&&<details className="succession-kinship-details"><summary>Seguir el parentesco</summary><Lineage personas={relevo.parentesco.via} recorrido label="Recorrido entre las filiaciones registradas"/></details>}
      {!!relevo.fechas?.length&&<dl className="succession-dates">{relevo.fechas.map(f=><div key={f.tipo}><dt>{TIPOS_FECHA[f.tipo]} · {f.anio}</dt><dd>{f.nota}</dd></div>)}</dl>}
      {relevo.crisis&&<p><a href={`#crisis-${relevo.crisis}`} onClick={()=>{const detail=document.getElementById(`crisis-${relevo.crisis}`);if(detail)detail.open=true;}}>Abrir la crisis y sus reclamaciones →</a></p>}
      <References fuentes={relevo.fuentes}/>
    </div>
  </details>;
}
