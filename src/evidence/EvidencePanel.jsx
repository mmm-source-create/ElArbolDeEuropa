import React,{useState} from 'react';
import {PERSONAS} from '../personas.jsx';
import {sourcesForPerson} from '../content/sources.js';
import {CERTAINTY,EDITORIAL_HISTORY,PILOT_PERSON_IDS,citationText,formatClaimDate,personClaims} from './claims.js';
import './evidence.css';

const BY_ID = new Map(PERSONAS.map(person => [person.id,person]));

function claimValue(claim,locale) {
  if (claim.field === 'Padre' || claim.field === 'Madre' || claim.field === 'Matrimonio o vínculo conyugal') return BY_ID.get(claim.value)?.nombre || claim.value;
  if (claim.field === 'Gobierno') return `${claim.value.titulo} · ${claim.value.territorio} · ${claim.interval.from ?? '?'}–${claim.interval.to ?? '?'}`;
  if (claim.field === 'Sucesión') return `${claim.value.territorio} · ${claim.value.predecesor ? `${BY_ID.get(claim.value.predecesor.persona)?.nombre || 'Predecesor no registrado'} → ` : ''}${BY_ID.get(claim.value.sucesor?.persona)?.nombre || 'Sucesor no registrado'} · ${claim.interval.from ?? '?'}`;
  return formatClaimDate(claim,locale);
}

export function EvidenceMark({claim,locale='es'}) {
  if (!claim) return null;
  const en=locale==='en';
  const label=en?{documented:'Documented',approximate:'Approximate',disputed:'Disputed',inferred:'Inferred',pending:'Pending review'}[claim.certainty]:CERTAINTY[claim.certainty];
  return <span className={`evidence-status evidence-${claim.certainty}`} title={claim.sources.length ? `${label} · ${claim.sources[0].title}` : label}>{label}</span>;
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
    try { await navigator.clipboard.writeText(citationText(claim,person.nombre,locale,id=>BY_ID.get(id)?.nombre)); setCopyStatus(label(`Cita copiada: ${claim.field}.`,`Citation copied: ${fieldEn[claim.field]}.`)); }
    catch { setCopyStatus(label('No se pudo copiar. Selecciona el texto de la ficha.','Could not copy. Select the text on the profile.')); }
  };
  const groups=[
    {key:'dates',es:'Fechas',english:'Dates',claims:claims.filter(c=>['Nacimiento','Fallecimiento'].includes(c.field))},
    {key:'family',es:'Familia y vínculos',english:'Family and relationships',claims:claims.filter(c=>['Padre','Madre','Matrimonio o vínculo conyugal'].includes(c.field))},
    {key:'governments',es:'Gobiernos',english:'Governments',claims:claims.filter(c=>c.field==='Gobierno')},
    {key:'successions',es:'Sucesiones',english:'Successions',claims:claims.filter(c=>c.field==='Sucesión')},
  ].filter(group=>group.claims.length);
  return <section id="historical-evidence" className={`evidence-panel${compact?' evidence-panel-compact':''}`} aria-label={label(`Evidencia histórica de ${person.nombre}`,`Historical evidence for ${person.nombre}`)}>
    <h3>{label('Evidencia de esta ficha','Evidence for this profile')}</h3>
    <p className="evidence-intro">{label(`${claims.length} afirmaciones registradas · ${unsourced} sin fuente específica. Las referencias de contexto no verifican por sí solas cada dato.`,`${claims.length} recorded claims · ${unsourced} without a claim-specific source. Context references do not by themselves verify every fact.`)}</p>
    {groups.map(group=><details key={group.key} open={PILOT_PERSON_IDS.includes(personId) && ['dates','family'].includes(group.key) ? true : undefined}>
      <summary>{label(group.es,group.english)} <small>({group.claims.filter(c=>c.sources.length).length}/{group.claims.length} {label('con fuente precisa','with a precise source')})</small></summary>
      <ul className="evidence-claim-list">{group.claims.map(claim=><li key={claim.id} id={`evidence-${claim.id}`}>
        <div><strong>{en?fieldEn[claim.field]:claim.field}</strong><span className={`evidence-status evidence-${claim.certainty}`}>{en?certaintyEn[claim.certainty]:CERTAINTY[claim.certainty]}</span></div>
        <p>{claimValue(claim,locale)}</p>
        {claim.note&&<small lang="es">{claim.note}</small>}
        {claim.alternatives.length>0&&<small>{label('Alternativas registradas:','Recorded alternatives:')} {claim.alternatives.join(' · ')}</small>}
        {claim.sources.length ? <div className="evidence-sources">{claim.sources.map(source=><a key={`${source.url}-${source.locator}`} href={source.url} target="_blank" rel="noreferrer">{source.title}{source.locator&&` · ${source.locator}`}</a>)}</div> : <small>{label('Fuente precisa pendiente de añadir.','A precise source has not yet been added.')}</small>}
        <div className="evidence-meta">{claim.reviewedAt ? label(`Revisado el ${claim.reviewedAt}${claim.editor ? ` por ${claim.editor}` : ''}`,`Reviewed on ${claim.reviewedAt}${claim.editor ? ` by ${claim.editor}` : ''}`) : label('Sin revisión individual registrada','No individual review recorded')} · <button type="button" onClick={()=>copy(claim)}>{label('Copiar cita','Copy citation')}</button></div>
      </li>)}</ul>
    </details>)}
    {!claims.length&&<p>{label('No hay afirmaciones estructuradas para esta ficha.','No structured claims are available for this profile.')}</p>}
    {contextual.length>0&&<details><summary>{label('Referencias biográficas y de contexto','Biographical and contextual references')} ({contextual.length})</summary><ul className="evidence-context-links">{contextual.map(source=><li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.titulo}</a></li>)}</ul></details>}
    <details><summary>{label('Historial editorial','Editorial history')}</summary><ul className="evidence-history">{EDITORIAL_HISTORY.filter(entry=>entry.scope==='all'||entry.scope===person.id||entry.scope==='pilot'&&PILOT_PERSON_IDS.includes(person.id)).map(entry=><li key={entry.id}><strong>{entry.date}</strong> · {en ? entry.changeEn ? `${entry.changeEn} ${entry.reasonEn}` : entry.id === 'v41-rah-pilot' ? 'Dates and parentage in the Isabella I–Joanna I–Charles V corridor were reviewed with passage-level references. Other claims remain pending.' : entry.id === 'v4-gerald-review' ? 'A specific source was linked to the birth, death and father claims. The birth date is approximate.' : 'Claim registry added; existing historical data kept. Specific sourcing remains to be reviewed.' : `${entry.change} ${entry.reason}`}</li>)}</ul></details>
    <p className="evidence-copy-status" role="status">{copyStatus}</p>
  </section>;
}
