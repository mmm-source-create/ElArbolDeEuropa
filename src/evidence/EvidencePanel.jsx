import React,{useState} from 'react';
import {PERSONAS} from '../personas.jsx';
import {sourcesForPerson} from '../content/sources.js';
import {CERTAINTY,EDITORIAL_HISTORY,citationText,personClaims} from './claims.js';
import './evidence.css';

const BY_ID = new Map(PERSONAS.map(person => [person.id,person]));

function claimValue(claim) {
  if (claim.field === 'Padre' || claim.field === 'Madre' || claim.field === 'Matrimonio o vínculo conyugal') return BY_ID.get(claim.value)?.nombre || claim.value;
  if (claim.field === 'Gobierno') return `${claim.value.titulo} · ${claim.value.territorio} · ${claim.interval.from ?? '?'}–${claim.interval.to ?? '?'}`;
  if (claim.field === 'Sucesión') return `${claim.value.territorio} · ${claim.value.predecesor ? `${BY_ID.get(claim.value.predecesor.persona)?.nombre || 'Predecesor no registrado'} → ` : ''}${BY_ID.get(claim.value.sucesor?.persona)?.nombre || 'Sucesor no registrado'} · ${claim.interval.from ?? '?'}`;
  return claim.value;
}

export default function EvidencePanel({personId,compact=false,locale='es'}) {
  const person=BY_ID.get(personId);
  const [copyStatus,setCopyStatus]=useState('');
  if (!person) return null;
  const en=locale==='en';
  const label=(es,english)=>en?english:es;
  const fieldEn={'Nacimiento':'Birth','Fallecimiento':'Death','Padre':'Father','Madre':'Mother','Matrimonio o vínculo conyugal':'Marriage or partnership','Gobierno':'Government','Sucesión':'Succession'};
  const certaintyEn={documented:'Documented',approximate:'Approximate',disputed:'Disputed',inferred:'Inferred',pending:'Pending review'};
  const claims=personClaims(person);
  const contextual=sourcesForPerson(personId);
  const unsourced=claims.filter(claim=>!claim.sources.length).length;
  const copy=async(claim)=>{
    try { await navigator.clipboard.writeText(citationText(claim,person.nombre,locale)); setCopyStatus(label(`Cita copiada: ${claim.field}.`,`Citation copied: ${fieldEn[claim.field]}.`)); }
    catch { setCopyStatus(label('No se pudo copiar. Selecciona el texto de la ficha.','Could not copy. Select the text on the profile.')); }
  };
  return <section className={`evidence-panel${compact?' evidence-panel-compact':''}`} aria-label={label(`Evidencia histórica de ${person.nombre}`,`Historical evidence for ${person.nombre}`)}>
    <h3>{label('Evidencia de esta ficha','Evidence for this profile')}</h3>
    <p className="evidence-intro">{label(`${claims.length} afirmaciones registradas · ${unsourced} sin fuente específica. Las referencias de contexto no verifican por sí solas cada dato.`,`${claims.length} recorded claims · ${unsourced} without a claim-specific source. Context references do not by themselves verify every fact.`)}</p>
    <details>
      <summary>{label('Revisar fechas, vínculos, gobiernos y sucesiones','Review dates, relationships, governments and successions')}</summary>
      <ul className="evidence-claim-list">{claims.map(claim=><li key={claim.id}>
        <div><strong>{en?fieldEn[claim.field]:claim.field}</strong><span className={`evidence-status evidence-${claim.certainty}`}>{en?certaintyEn[claim.certainty]:CERTAINTY[claim.certainty]}</span></div>
        <p>{claimValue(claim)}</p>
        {claim.note&&<small>{claim.note}</small>}
        {claim.sources.length ? <div className="evidence-sources">{claim.sources.map(source=><a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title}</a>)}</div> : <small>{label('Fuente precisa pendiente de añadir.','A precise source has not yet been added.')}</small>}
        <div className="evidence-meta">{claim.reviewedAt ? label(`Revisado el ${claim.reviewedAt}${claim.editor ? ` por ${claim.editor}` : ''}`,`Reviewed on ${claim.reviewedAt}${claim.editor ? ` by ${claim.editor}` : ''}`) : label('Sin revisión individual registrada','No individual review recorded')} · <button type="button" onClick={()=>copy(claim)}>{label('Copiar cita','Copy citation')}</button></div>
      </li>)}</ul>
      {!claims.length&&<p>{label('No hay afirmaciones estructuradas para esta ficha.','No structured claims are available for this profile.')}</p>}
    </details>
    {contextual.length>0&&<details><summary>{label('Referencias biográficas y de contexto','Biographical and contextual references')} ({contextual.length})</summary><ul className="evidence-context-links">{contextual.map(source=><li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.titulo}</a></li>)}</ul></details>}
    <details><summary>{label('Historial editorial','Editorial history')}</summary><ul className="evidence-history">{EDITORIAL_HISTORY.filter(entry=>entry.scope==='all'||entry.scope===person.id).map(entry=><li key={entry.id}><strong>{entry.date}</strong> · {en ? entry.id === 'v4-gerald-review' ? 'A specific source was linked to the birth, death and father claims. The birth date is approximate.' : 'Claim registry added; existing historical data kept. Specific sourcing remains to be reviewed.' : `${entry.change} ${entry.reason}`}</li>)}</ul></details>
    <p className="evidence-copy-status" role="status">{copyStatus}</p>
  </section>;
}
