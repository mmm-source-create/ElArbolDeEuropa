import React, {useState} from 'react';
import {TERRITORIOS} from '../data/territorios.js';
import {sucesionDe} from '../data/sucesion.js';
import {slugPublico} from '../utils/personPresentation.js';
export default function Sucesion({personas, territorios, setTerritorios, anio, seleccion, onSelect}) {
  const [disputas,setDisputas] = useState(false);
  const territorio = territorios[0] || 'Castilla';
  const filas = sucesionDe(personas,territorio,{disputas});
  const grupos = [...new Set(filas.map(f=>f.gobierno.territorio))];
  return <section className="succession-stage" aria-label="Sucesión política">
    <div className="succession-controls"><h2>Sucesión</h2><label>Territorio <select value={territorio} onChange={e=>setTerritorios([e.target.value])}>{Object.keys(TERRITORIOS).sort((a,b)=>a.localeCompare(b,'es')).map(t=><option key={t}>{t}</option>)}</select></label>
      <label><input type="checkbox" checked={disputas} onChange={e=>setDisputas(e.target.checked)}/> Mostrar disputas, pretendientes y títulos nominales</label>
      <a href={`/es/territorio/${slugPublico(territorio)}`}>Leer historia de {territorio} ↗</a>
    </div>
    <p>Orden de acceso al cargo según los gobiernos registrados. Los huecos no implican vacantes. Las fechas tienen precisión de año.</p>
    {territorios.length>1 && <p>Se muestra el primer territorio seleccionado. El selector permite cambiar la sucesión.</p>}
    {TERRITORIOS[territorio]?.naturaleza !== 'entidad' && <p>Este conjunto reúne entidades distintas: cada territorio conserva su propia sucesión.</p>}
    {Number.isFinite(anio) && <p>Año global: <strong>{anio}</strong>. Los gobiernos vigentes se resaltan; se mantiene el contexto anterior y posterior.</p>}
    {!filas.length && <p role="status">No hay gobiernos registrados para este territorio con esta selección.</p>}
    <div className="succession-columns">{grupos.map(t=><section key={t}><h3>{t}</h3><ol className="succession-list">{filas.filter(f=>f.gobierno.territorio===t).map(({persona:p,gobierno:g,key,solapados,contextoDesde})=><li key={key} className={`${seleccion===p.id?'is-selected ':''}${Number.isFinite(anio)&&g.desde<=anio&&g.hasta>=anio?'is-current':''}`}>
      <button type="button" aria-pressed={seleccion===p.id} onClick={()=>onSelect(p.id)}><strong>{p.nombre}</strong><span>{g.titulo} · {g.desde}–{g.hasta}</span><span>{p.dinastia} · {g.condicion}{g.ambito ? ` · ${g.ambito}` : ''}</span></button>
      {contextoDesde>g.desde && <small>En este conjunto desde {contextoDesde}; el mandato comenzó antes.</small>}
      {solapados.length>0 && <small>Coincide en fechas con {solapados.join(', ')}. {g.nota || 'Consultar la condición y el ámbito de cada gobierno.'}</small>}
    </li>)}</ol></section>)}</div>
  </section>;
}
