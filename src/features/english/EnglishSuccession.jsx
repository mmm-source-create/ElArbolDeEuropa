// 6.0.21 · English counterpart of the Spanish succession section (features/atlas/Sucesion.jsx): who held
// each office and in what order, with the hand-translated explained successions and crises.
import React, {useMemo, useState} from 'react';
import {sucesionDe} from '../../domain/government/sucesion.js';
import {coincideMandato} from '../../domain/government/successionHistory.js';
import '../atlas/succession.css';

const Person = ({persona}) => <a href={persona.path}>{persona.nombre}{persona.path.startsWith('/es/') ? ' · ES' : ''}</a>;
function References({fuentes}) {
  return <p className="succession-references">References: {fuentes.map((s, i) => <React.Fragment key={s.url}>{i > 0 ? ' · ' : ''}<a href={s.url} target="_blank" rel="noreferrer">{s.titulo}</a></React.Fragment>)}</p>;
}
function Lineage({personas, label = 'Recorded family line', path = false}) {
  return <div className="succession-lineage" data-relation={path ? 'path' : 'descendencia'}><p>{label}</p><ol>{personas.map(p => <li key={p.id}><Person persona={p}/></li>)}</ol></div>;
}
function Crisis({crisis}) {
  return <details className="succession-crisis" id={`crisis-${crisis.id}`}>
    <summary><span className="succession-crisis-period">{crisis.periodo}</span><span>{crisis.titulo}</span></summary>
    <div className="succession-crisis-body">
      <p>{crisis.resumen}</p>
      <div className="succession-candidates">{crisis.candidatos.map(c => <article key={c.persona.id}>
        <h4><Person persona={c.persona}/></h4>
        <p>{c.fundamento}</p>
        <Lineage personas={c.ascendencia}/>
        <p><strong>Outcome.</strong> {c.resultado}</p>
        <a className="succession-atlas-link" href={`/en/?atlas=1&persona=${encodeURIComponent(c.persona.id)}`}>View in the Atlas →</a>
      </article>)}</div>
      <p><strong>Resolution.</strong> {crisis.desenlace}</p>
      <References fuentes={crisis.fuentes}/>
    </div>
  </details>;
}
function Explained({relevo}) {
  return <details className="succession-explanation">
    <summary>Why the government changed <span>{relevo.motivos.join(' · ')}</span></summary>
    <div>
      <p><strong>Succeeded </strong><Person persona={relevo.predecesor.persona}/></p>
      <p>{relevo.explicacion}</p>
      <p className="succession-kinship">{relevo.parentesco.texto}</p>
      {relevo.parentesco.via.length > 2 && <details className="succession-kinship-details"><summary>Follow the kinship</summary><Lineage personas={relevo.parentesco.via} path label="Path through the recorded parentage"/></details>}
      {!!relevo.fechas?.length && <dl className="succession-dates">{relevo.fechas.map(f => <div key={f.tipo}><dt>{f.tipo} · {f.anio}</dt><dd>{f.nota}</dd></div>)}</dl>}
      {relevo.crisis && <p><a href={`#crisis-${relevo.crisis}`} onClick={() => { const detail = document.getElementById(`crisis-${relevo.crisis}`); if (detail) detail.open = true; }}>Open the crisis and its claims →</a></p>}
      <References fuentes={relevo.fuentes}/>
    </div>
  </details>;
}

export default function EnglishSuccession({territory: d}) {
  const [disputes, setDisputes] = useState(false);
  const people = useMemo(() => {
    const byId = new Map();
    for (const {persona, ...government} of d.gobiernos || []) {
      if (!byId.has(persona.id)) byId.set(persona.id, {...persona, gobiernos: []});
      byId.get(persona.id).gobiernos.push(government);
    }
    return [...byId.values()];
  }, [d]);
  const rows = useMemo(() => sucesionDe(people, d.key, {disputas: disputes}), [people, d.key, disputes]);
  const groups = [...new Set(rows.map(r => r.gobierno.territorio))];
  const relevos = d.sucesiones?.relevos || [];
  return <section id="succession" className="territory-succession" aria-labelledby="territory-succession-title">
    <div className="territory-succession-head">
      <div><h2 id="territory-succession-title">Succession</h2><p>Who held each office and in what order.</p></div>
      <label className="territory-succession-filter"><input type="checkbox" checked={disputes} onChange={e => setDisputes(e.target.checked)}/><span>Show disputes, claimants and nominal titles</span></label>
    </div>
    <p className="territory-succession-note">Recorded periods may overlap or leave gaps. Dates are given to the year. Only explained successions indicate a direct succession.</p>
    {d.naturaleza !== 'entidad' && <p className="territory-succession-note">Each territory in the group keeps its own succession.</p>}
    {!!d.sucesiones?.crisis?.length && <div className="succession-crises"><h3>Succession crises</h3>{d.sucesiones.crisis.map(c => <Crisis key={c.id} crisis={c}/>)}</div>}
    <p className="territory-succession-count" role="status">{rows.length ? `${rows.length} recorded ${rows.length === 1 ? 'term' : 'terms'}` : 'No governments are recorded for this selection.'}</p>
    <div className="territory-succession-columns">{groups.map(t => <div className="territory-succession-group" key={t}>
      {(groups.length > 1 || t !== d.key) && <h3>{rows.find(r => r.gobierno.territorio === t)?.gobierno.englishTerritory || t}</h3>}
      <ol className="territory-succession-list">{rows.filter(r => r.gobierno.territorio === t).map(({persona: p, gobierno: g, key, solapados, contextoDesde}) => <li key={key}>
        <div className="territory-succession-date">{g.desde}–{g.hasta}</div>
        <div className="territory-succession-card">
          <h4><Person persona={p}/></h4>
          <p>{g.englishTitle}<span className="territory-succession-condition">{g.englishCondition}</span></p>
          {g.englishDynasty && <p className="territory-succession-meta">{g.englishDynasty}</p>}
          {contextoDesde > g.desde && <p className="territory-succession-meta">In this group from {contextoDesde}; the term began earlier.</p>}
          {g.englishNote && <p className="territory-succession-meta">{g.englishNote}</p>}
          {relevos.filter(r => r.sucesor.persona.id === p.id && coincideMandato(g, r.sucesor, r.territorio)).map(r => <Explained key={r.id} relevo={r}/>)}
          {relevos.filter(r => r.predecesor.persona.id === p.id && coincideMandato(g, r.predecesor, r.territorio)).map(r => <p key={r.id} className="territory-succession-meta">Explained succession: <Person persona={r.sucesor.persona}/> ({r.sucesor.desde}).</p>)}
          {solapados.length > 0 && <p className="territory-succession-overlap">Overlaps in date with {Array.from(new Set(solapados)).join(', ')}.</p>}
        </div>
      </li>)}</ol>
    </div>)}</div>
  </section>;
}
