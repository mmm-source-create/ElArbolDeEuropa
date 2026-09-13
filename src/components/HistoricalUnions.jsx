import React from 'react';
import {slugPublico} from '../utils/personLabels.js';
import './crowns.css';
export default function HistoricalUnions({uniones=[]}) {
 if(!uniones.length)return null;
 return <section className="historical-unions"><h2>Uniones y separaciones</h2><p>Compartir un soberano no implicaba compartir todas las instituciones. Estas secuencias incluyen rupturas y cambios de gobierno.</p>
 {uniones.map(u=><details key={u.id} id={`union-${u.id}`} className="crown-details"><summary>{u.titulo}</summary><p>{u.resumen}</p><p><strong>Instituciones.</strong> {u.instituciones}</p><div className="crown-related">{u.territorios.map(t=><a key={t} href={`/es/territorio/${slugPublico(t)}`}>{t}</a>)}</div><ol className="crown-accessions">{u.etapas.map((e,i)=><li key={`${e.anio}-${i}`}><strong>{e.anio} · {e.titulo}</strong><p>{e.texto}</p><div className="crown-related">{e.personas.map(p=><a key={p.id} href={`/es/persona/${p.slug}`}>{p.nombre}</a>)}</div><a className="crown-year-link" href={`/?atlas=1&panel=europa&anio=${e.anio}`}>Europa en {e.anio} →</a></li>)}</ol><div className="crown-sources">{u.fuentes.map(f=><a key={f.url} href={f.url} target="_blank" rel="noreferrer">{f.titulo}</a>)}</div></details>)}
 </section>;
}
