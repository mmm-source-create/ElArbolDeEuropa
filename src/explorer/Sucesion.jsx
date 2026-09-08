import React, {useMemo, useState} from 'react';
import {sucesionDe} from '../data/sucesion.js';

// La ficha ya contiene los gobiernos y referencias de sus personajes.
// No carga el dataset completo del Atlas ni participa en sus paneles.
export default function Sucesion({territorio}) {
  const [disputas, setDisputas] = useState(false);
  const personas = useMemo(() => {
    const porId = new Map();
    for (const {persona, ...gobierno} of territorio.gobiernos || []) {
      if (!porId.has(persona.id)) porId.set(persona.id, {...persona, gobiernos: []});
      porId.get(persona.id).gobiernos.push(gobierno);
    }
    return [...porId.values()];
  }, [territorio]);
  const filas = useMemo(() => sucesionDe(personas, territorio.nombre, {disputas}), [personas, territorio.nombre, disputas]);
  const grupos = [...new Set(filas.map(f => f.gobierno.territorio))];
  return <section id="sucesion" className="territory-succession" aria-labelledby="territory-succession-title">
    <div className="territory-succession-head">
      <div><h2 id="territory-succession-title">Sucesión</h2><p>Quién ocupó cada cargo y en qué orden.</p></div>
      <label className="territory-succession-filter"><input type="checkbox" checked={disputas} onChange={e => setDisputas(e.target.checked)}/><span>Mostrar disputas, pretendientes y títulos nominales</span></label>
    </div>
    <p className="territory-succession-note">Los periodos registrados pueden solaparse o tener lagunas. Las fechas tienen precisión de año.</p>
    {territorio.naturaleza !== 'entidad' && <p className="territory-succession-note">Cada territorio del conjunto conserva su propia sucesión.</p>}
    <p className="territory-succession-count" role="status">{filas.length ? `${filas.length} mandatos registrados` : 'No hay gobiernos registrados con esta selección.'}</p>
    <div className="territory-succession-columns">{grupos.map(t => <div className="territory-succession-group" key={t}>
      {(grupos.length > 1 || t !== territorio.nombre) && <h3>{t}</h3>}
      <ol className="territory-succession-list">{filas.filter(f => f.gobierno.territorio === t).map(({persona:p, gobierno:g, key, solapados, contextoDesde}) => <li key={key}>
        <div className="territory-succession-date">{g.desde}–{g.hasta}</div>
        <div className="territory-succession-card">
          <h4><a href={`/es/persona/${encodeURIComponent(p.slug)}`}>{p.nombre}</a></h4>
          <p>{g.titulo}<span className="territory-succession-condition">{g.condicion}</span></p>
          <p className="territory-succession-meta">{p.dinastia}{g.ambito ? ` · ${g.ambito}` : ''}</p>
          {contextoDesde > g.desde && <p className="territory-succession-meta">En este conjunto desde {contextoDesde}; el mandato comenzó antes.</p>}
          {g.nota && <p className="territory-succession-meta">{g.nota}</p>}
          {solapados.length > 0 && <p className="territory-succession-overlap">Coincide en fechas con {Array.from(new Set(solapados)).join(', ')}.</p>}
        </div>
      </li>)}</ol>
    </div>)}</div>
  </section>;
}
