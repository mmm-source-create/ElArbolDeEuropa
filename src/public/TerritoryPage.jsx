import HistoricalUnions from "../components/HistoricalUnions.jsx";
import React,{useEffect} from 'react';
import Sucesion from '../explorer/Sucesion.jsx';
import {useJson,usePublicMeta} from './PublicSite.jsx';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import {slugPublico} from '../utils/personLabels.js';
import './public.css';
const claseTexto=c=>String(c||'Territorio').replaceAll('_',' ');
export function TerritoryPage({slug}) {
 const {data:t,loading,error}=useJson(`/territorios-meta/${encodeURIComponent(slug)}.json`);
 usePublicMeta({title:t?`${t.nombre} — Historia y sucesión`:'Territorio',description:t?.resumen||'Gobiernos, dinastías y conexiones históricas registradas.',path:`/es/territorio/${slug}`});
 useEffect(()=>{
  if(!t)return;
  const openAnchor=()=>{
   const id=window.location.hash.slice(1);
   if(!id.startsWith('union-')&&!id.startsWith('crisis-'))return;
   const target=document.getElementById(id);
   if(target?.tagName==='DETAILS'){target.open=true;target.scrollIntoView({block:'start'});}
  };
  openAnchor();window.addEventListener('hashchange',openAnchor);
  return ()=>window.removeEventListener('hashchange',openAnchor);
 },[t]);
 const atlas=`/es/territorio/${encodeURIComponent(slug)}?atlas=1`;
 return <div className="public-site"><SiteHeader locale="es"/><main className="territory-page">
 <a href="/es/territorios">← Territorios</a>
 {loading&&<p role="status">Cargando historia…</p>}{error&&<p role="alert">No se ha podido cargar esta ficha. <a href="/es/territorios">Consultar el catálogo</a></p>}
 {t&&<><header><p>{claseTexto(t.clase)} · {t.naturaleza==='agrupacion'?'Agrupación de exploración':t.naturaleza==='compuesta'?'Entidad compuesta':'Entidad histórica'}</p><h1>{t.nombre}</h1>
 <p>{t.resumen||`Esta ficha reúne los gobiernos y las conexiones documentadas en la base para ${t.nombre}. La serie puede ser incompleta: la ausencia de registros no implica que el territorio careciera de gobierno.`}</p>
 <div className="territory-actions"><a className="public-primary" href={atlas}>Abrir en el Atlas →</a><a className="public-secondary" href="#sucesion">Explorar Sucesión →</a></div></header>
 {t.nota&&<p>{t.nota}</p>}
 {!!t.pertenencias?.length&&<p>Vinculado a {t.pertenencias.map((v,i)=><React.Fragment key={i}><a href={`/es/territorio/${slugPublico(v.territorio)}`}>{v.territorio}</a> desde {v.desde}. </React.Fragment>)}</p>}
 {t.naturaleza!=='entidad'&&<section><h2>Territorios del conjunto</h2><p>Cada componente conserva sus títulos y cronología. Esta agrupación no establece una soberanía continua sobre todos ellos.</p><div className="territory-links">{t.componentes.map(n=><a key={n} href={`/es/territorio/${slugPublico(n)}`}>{n}</a>)}</div></section>}
 {!!t.evolucion?.length&&<section><h2>Evolución política</h2><ol className="territory-evolution">{t.evolucion.map((e,i)=><li key={i}><strong>{e.anio}</strong><span>{e.texto}</span></li>)}</ol></section>}
 {!!t.etapas?.length&&<section><h2>Rango del territorio</h2><p>El rango cambió con el tiempo; los gobiernos conservan su clase propia.</p>{t.etapas.map((e,i)=><p key={i}>{e.desde===null?'Etapa anterior':`Desde ${e.desde}`} · {claseTexto(e.clase)}</p>)}</section>}
 <HistoricalUnions uniones={t.uniones}/>
 <Sucesion territorio={t} />
 <details className="territory-government-details"><summary>Consultar todos los gobiernos registrados</summary><p>Incluye regencias, ramas, títulos nominales y disputas cuando constan. Los intervalos son anuales y no implican continuidad ni exhaustividad.</p>
 {!t.gobiernos.length?<p>No hay gobiernos cargados para esta entidad. Consulta las personas relacionadas.</p>:<div className="territory-table"><table><thead><tr><th>Persona</th><th>Territorio y título</th><th>Periodo</th><th>Condición</th></tr></thead><tbody>{t.gobiernos.map((g,i)=><tr key={i}><td><a href={`/es/persona/${g.persona.slug}`}>{g.persona.nombre}</a></td><td>{g.titulo} · {g.territorio}<small>{claseTexto(g.clase)}</small></td><td>{g.desde}–{g.hasta}</td><td>{g.condicion}{g.ambito&&` · ${g.ambito}`}{g.nota&&<small>{g.nota}</small>}</td></tr>)}</tbody></table></div>}</details>
 {!!t.dinastias.length&&<section><h2>Dinastías en los gobiernos registrados</h2><div className="territory-links">{t.dinastias.map(n=><a key={n} href={`/es/dinastia/${slugPublico(n)}`}>{n}</a>)}</div></section>}
 {!!t.historias.length&&<section><h2>Historias relacionadas</h2><div className="territory-links">{t.historias.map(h=><a key={h.slug} href={`/es/historia/${h.slug}`}>{h.titulo}</a>)}</div></section>}
 {!!t.eventos.length&&<section><h2>Acontecimientos vinculados a sus personajes</h2><ul>{t.eventos.slice(0,30).map((e,i)=><li key={e.id||i}>{e.anio||e.desde||e.fecha} · {e.titulo||e.nombre}</li>)}</ul></section>}
 {!!t.relacionados.length&&<section><h2>Entidades relacionadas</h2><div className="territory-links">{t.relacionados.map(n=><a key={n.slug} href={`/es/territorio/${n.slug}`}>{n.nombre}</a>)}</div></section>}
 <section><h2>Personas relacionadas</h2><div className="territory-people">{t.personas.slice(0,36).map(p=><article key={p.id}><h3><a href={`/es/persona/${p.slug}`}>{p.nombre}</a></h3><p>{p.resumen}</p></article>)}</div>{t.personas.length>36&&<p><a href={atlas}>Explorar las {t.personas.length} personas en el Atlas</a></p>}</section>
 {!!t.fuentes?.length&&<section><h2>Referencias</h2><ul>{t.fuentes.map(f=><li key={f.url}><a href={f.url} target="_blank" rel="noreferrer">{f.titulo}</a></li>)}</ul></section>}
 </>}
 </main><SiteFooter/></div>;
}
