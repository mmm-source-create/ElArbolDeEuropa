import React,{useMemo,useState} from 'react';
import {ArrowRight,Search,Shield} from 'lucide-react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import {useJson,usePublicMeta,PersonaMiniCard} from './PublicSite.jsx';
import {normalizarBusquedaPublica,slugPublico} from '../utils/personLabels.js';
import './dynasty.css';

export default function DynastyPage({slug}) {
  const {data:d,loading,error}=useJson(`/dinastias-meta/${encodeURIComponent(slug)}.json`);
  const [query,setQuery]=useState('');
  const [limit,setLimit]=useState(36);
  const members=useMemo(()=>{const q=normalizarBusquedaPublica(query);return (d?.miembros||[]).filter(p=>normalizarBusquedaPublica([p.nombre,p.titulo,...(p.aliases||[])].join(' ')).includes(q));},[d,query]);
  usePublicMeta({title:d?`Casa de ${d.nombre} — El Árbol de Europa`:'Dinastía — El Árbol de Europa',description:d?.resumen||'Personas, ramas y territorios de una casa en el Atlas.',path:`/es/dinastia/${d?.slug||slug}`});
  const atlas=`/es/dinastia/${d?.slug||slug}?atlas=1`;
  return <div className="public-site"><SiteHeader/><main className="public-main dynasty-page">
    <nav className="public-breadcrumbs" aria-label="Migas de pan"><a href="/es/">Inicio</a><span>›</span><a href="/es/dinastias">Dinastías</a><span>›</span><span aria-current="page">{d?.nombre||'Ficha'}</span></nav>
    {loading?<p className="public-loading" role="status">Cargando ficha de la casa…</p>:error||!d?<section className="public-error"><h1>Ficha no disponible</h1><p>No se ha podido cargar esta casa.</p><a href="/es/dinastias">Volver al catálogo de dinastías</a></section>:<>
      <header className="public-page-title dynasty-hero">
        <div className="public-page-icon"><Shield size={22}/></div><span>Casas y linajes · {d.editorial?'Historia de la dinastía':'Personas del Atlas'}</span>
        <h1>{d.nombre}</h1><p>{d.resumen||'Explora los miembros de esta casa y los territorios vinculados a sus gobiernos registrados.'}</p>
        <div className="dynasty-counts"><span><b>{d.total}</b> personas registradas</span><span><b>{d.ramas.length}</b> ramas y conexiones descritas</span></div>
        <a className="public-primary" href={atlas}>Explorar esta casa en el Atlas <ArrowRight size={15}/></a>
      </header>
      <nav className="dynasty-nav" aria-label="Secciones de la dinastía">
        {d.editorial&&<a href="#historia">Historia de la casa</a>}{!!d.ramas.length&&<a href="#ramas">Ramas y conexiones</a>}<a href="#miembros">Personas</a>{!!d.fuentes.length&&<a href="#fuentes">Bibliografía</a>}
      </nav>
      {d.editorial?<section id="historia" className="dynasty-history">
        <article className="public-content-card"><span>La formación de una casa</span><h2>Origen</h2><p>{d.origen}</p></article>
        <article className="public-content-card"><span>Herencias y alianzas</span><h2>Trayectoria</h2><p>{d.trayectoria}</p></article>
        <article className="public-content-card"><span>Continuidades y cambios</span><h2>Legado</h2><p>{d.legado}</p></article>
      </section>:<p className="public-catalog-note">Esta ficha reúne los datos registrados en el Atlas. La historia editorial de esta casa se incorporará en futuras ampliaciones.</p>}
      {!!d.protagonistas.length&&<section className="public-section"><div className="public-section-heading"><div><span>Personas que conectan la historia</span><h2>Protagonistas y enlaces</h2></div></div><div className="public-person-grid">{d.protagonistas.map(p=><PersonaMiniCard key={p.id} persona={p} compact/>)}</div></section>}
      {!!d.ramas.length&&<section id="ramas" className="public-section"><div className="public-section-heading"><div><span>Genealogía y transmisión del patrimonio</span><h2>Ramas y conexiones</h2></div></div>
        <p className="dynasty-intro">Cada vínculo indica si nace una rama de la casa o si un matrimonio transmite derechos a otra familia. Las personas enlazadas permiten seguir la conexión en el árbol.</p>
        <div className="dynasty-branches">{d.ramas.map(r=><article id={r.id} key={r.id} className="public-content-card dynasty-branch">
          <span>{r.etiqueta} · {r.periodo}</span><h3>{r.origen===r.destino?`${r.origen} · ${r.fundador.nombre}`:<><a href={`/es/dinastia/${r.origenSlug}`}>{r.origen}</a><span aria-hidden="true"> → </span><a href={`/es/dinastia/${r.destinoSlug}`}>{r.destino}</a></>}</h3>
          <p>{r.texto}</p><div className="public-entity-members">{r.personas.map(p=><a key={p.id} href={`/es/persona/${p.slug}`}>{p.nombre}</a>)}</div>
          <a className="public-entity-action" href={`/es/persona/${r.fundador.slug}?atlas=1`}>Seguir a {r.fundador.nombre} en el árbol <ArrowRight size={12}/></a>
        </article>)}</div>
      </section>}
      {!!d.territorios.length&&<section className="public-section"><div className="public-section-heading"><div><span>El contexto territorial</span><h2>Territorios vinculados</h2></div></div><div className="public-entity-members">{d.territorios.map(t=><a key={t} href={`/es/territorio/${slugPublico(t)}`}>{t}</a>)}</div></section>}
      <section id="miembros" className="public-section"><div className="public-section-heading"><div><span>Miembros registrados en esta casa</span><h2>Personas</h2></div></div>
        <label className="public-search"><Search size={16}/><input aria-label="Buscar personas de esta casa" placeholder="Buscar nombre, título o nombre alternativo…" value={query} onChange={e=>{setQuery(e.target.value);setLimit(36);}}/><span role="status">{members.length}</span></label>
        <div className="public-person-grid">{members.slice(0,limit).map(p=><PersonaMiniCard key={p.id} persona={p} compact/>)}</div>
        {!members.length&&<p>No hay personas que coincidan con esta búsqueda.</p>}
        {members.length>limit&&<button className="public-secondary dynasty-more" onClick={()=>setLimit(n=>n+36)}>Mostrar más personas ({limit} de {members.length})</button>}
      </section>
      {!!d.gobiernos.length&&<details className="public-content-card dynasty-governments"><summary>Gobiernos registrados de miembros de la casa</summary><p>Incluye títulos nominales, regencias y disputas cuando constan. La condición de cada mandato aparece expresamente.</p><ul>{d.gobiernos.map((g,i)=><li key={`${g.persona.id}-${i}`}><a href={`/es/persona/${g.persona.slug}`}>{g.persona.nombre}</a><span>{g.titulo} · <a href={`/es/territorio/${slugPublico(g.territorio)}`}>{g.territorio}</a> · {g.desde}–{g.hasta} · {g.condicion}</span>{g.nota&&<small>{g.nota}</small>}</li>)}</ul></details>}
      {!!d.fuentes.length&&<section id="fuentes" className="public-content-card dynasty-sources"><span>Documentación</span><h2>Bibliografía de contexto</h2><p>Repertorios para consultar la historia de la casa. Una referencia general no verifica por sí sola cada filiación o fecha.</p><ul>{d.fuentes.map(f=><li key={f.url}><a href={f.url} target="_blank" rel="noreferrer">{f.titulo}</a></li>)}</ul><a href="/es/fuentes">Fuentes y metodología del proyecto</a></section>}
    </>}
  </main><SiteFooter/></div>;
}
