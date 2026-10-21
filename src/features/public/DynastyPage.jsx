import {connectionUrl} from '../connections/connectionTree.js';
import {entityMeta} from "./publicMeta.js";
import {useMemo,useState} from 'react';
import {ArrowRight,Search,Shield} from 'lucide-react';
import SiteHeader from '../../components/SiteHeader.jsx';
import SiteFooter from '../../components/SiteFooter.jsx';
import {useJson,usePublicMeta,PersonaMiniCard} from './publicShared.jsx';
import ReadingSkeleton from '../stories/ReadingSkeleton.jsx';
import {normalizarBusquedaPublica,slugPublico} from '../../domain/people/personLabels.js';
import DynastyArms, {ArmsCredit} from '../../components/DynastyArms.jsx';
import {escudoDe} from '../../content/dinastias/escudos.js';
import './dynasty.css';
import DynastyCard from './DynastyCard.jsx';
import '../../styles/theme.css';

function DynastyConnection({branch:r,internal=false}) {
  return <section id={r.id} className="dynasty-connection" aria-label={`${r.etiqueta} · ${r.periodo}`}>
    <span className="dynasty-connection-label">{r.etiqueta} · {r.periodo}</span>
    {internal&&<h3>{r.fundador.nombre}</h3>}
    <p>{r.texto}</p>
    <div className="public-entity-members">{r.personas.map(p=><a key={p.id} href={`/es/persona/${p.slug}`}>{p.nombre}</a>)}</div>
    <a className="public-entity-action" href={r.arbol?.ids?.length>1?connectionUrl(r.arbol.ids,r.arbol.criterion):`/es/persona/${r.fundador.slug}?atlas=1`}>Ver la conexión en el árbol <ArrowRight size={12}/></a>
  </section>;
}

function DynastyHouseGroup({title,items,relationship,branches}) {
  if(!items?.length)return null;
  return <div className="dynasty-house-group"><h3>{title}</h3><div className="public-entity-grid">{items.map(item=>{
    const connections=branches.filter(r=>item.conexiones?item.conexiones.includes(r.id):r.origen===item.nombre||r.destino===item.nombre);
    return <DynastyCard key={item.slug} item={item} headingLevel={3} relationship={relationship} showMembers={!connections.length}>
      {!!connections.length&&connections.map(r=><DynastyConnection key={r.id} branch={r}/>)}
    </DynastyCard>;
  })}</div></div>;
}

export default function DynastyPage({slug,initialData=null}) {
  const {data:d,loading,error}=useJson(`/dinastias-meta/${encodeURIComponent(slug)}.json`,initialData);
  const [query,setQuery]=useState('');
  const [limit,setLimit]=useState(36);
  const members=useMemo(()=>{const q=normalizarBusquedaPublica(query);return (d?.miembros||[]).filter(p=>normalizarBusquedaPublica([p.nombre,p.titulo,...(p.aliases||[])].join(' ')).includes(q));},[d,query]);
  usePublicMeta(entityMeta('dinastia',d,slug));
  const atlas=`/es/dinastia/${d?.slug||slug}?atlas=1`;
  const escudo=escudoDe(d?.nombre);
  const branches=d?.ramas||[];
  const internalBranches=branches.filter(r=>r.origen===d.nombre&&r.destino===d.nombre);
  const relationCount=(d?.casasOrigen?.length||0)+(d?.casasDerivadas?.length||0)+(d?.casasConectadas?.length||0)+internalBranches.length;
  const hasConnections=relationCount>0||branches.length>0;
  return <div className="public-site"><SiteHeader pathname={`/es/dinastia/${slug}`} prerendered={Boolean(initialData)}/><main className="public-main dynasty-page">
    <nav className="public-breadcrumbs" aria-label="Migas de pan"><a href="/es/">Inicio</a><span>›</span><a href="/es/dinastias">Dinastías</a><span>›</span><span aria-current="page">{d?.nombre||'Ficha'}</span></nav>
    {loading?<ReadingSkeleton kind="entity-body"/>:error||!d?<section className="public-error"><h1>Ficha no disponible</h1><p>No se ha podido cargar esta casa.</p><a href="/es/dinastias">Volver al catálogo de dinastías</a></section>:<>
      <header className="public-page-title dynasty-hero">
        {escudo?<figure className="dynasty-hero-figure"><DynastyArms dinastia={d.nombre} size={76} className="dynasty-hero-arms"/></figure>:<div className="public-page-icon"><Shield size={22}/></div>}<span>Casas y linajes · {d.editorial?'Historia de la dinastía':'Personas del Atlas'}</span>
        <h1>{d.nombre}</h1><p>{d.resumen||'Explora los miembros de esta casa y los territorios vinculados a sus gobiernos registrados.'}</p>
        {escudo&&<p className="dynasty-blazon"><b>Armas.</b> {escudo.blason}{escudo.nota&&<small> {escudo.nota}</small>}</p>}
        <div className="dynasty-counts"><span><b>{d.total}</b> {d.total===1?'persona registrada':'personas registradas'}</span><span><b>{relationCount}</b> {relationCount===1?'rama o conexión':'ramas y conexiones'}</span></div>
        <a className="public-primary" href={atlas}>Explorar esta casa en el Atlas <ArrowRight size={15}/></a>
      </header>
      <nav className="dynasty-nav" aria-label="Secciones de la dinastía">
        {hasConnections&&<a href="#casas">Casas de origen y ramas</a>}
        {d.editorial&&<a href="#historia">Historia de la casa</a>}<a href="#miembros">Personas</a>{!!d.fuentes.length&&<a href="#fuentes">Bibliografía</a>}
      </nav>
      {hasConnections&&<section id="casas" className="public-section">
        <span id="ramas" className="dynasty-anchor" aria-hidden="true"/>
        <div className="public-section-heading"><div><span>Genealogía, herencias y alianzas</span><h2>Casas de origen y ramas</h2></div></div>
        <p className="dynasty-intro">El parentesco entre casas y las conexiones por matrimonio o herencia se reúnen aquí. Cada vínculo documentado explica su origen y permite seguir a sus protagonistas en el árbol.</p>
        <DynastyHouseGroup title="Casa de origen" items={d.casasOrigen} relationship="Casa de origen" branches={branches}/>
        <DynastyHouseGroup title="Ramas de esta casa" items={d.casasDerivadas} relationship="Rama de esta casa" branches={branches}/>
        <DynastyHouseGroup title="Alianzas y transmisiones" items={d.casasConectadas} relationship="Casa conectada" branches={branches}/>
        {!!internalBranches.length&&<div className="dynasty-house-group"><h3>Ramas y conexiones internas</h3><div className="dynasty-branches">{internalBranches.map(r=><article key={r.id} className="public-content-card dynasty-branch"><DynastyConnection branch={r} internal/></article>)}</div></div>}
      </section>}
      {d.editorial?<section id="historia" className="dynasty-history">
        <article className="public-content-card"><span>La formación de una casa</span><h2>Origen</h2><p>{d.origen}</p></article>
        <article className="public-content-card"><span>Herencias y alianzas</span><h2>Trayectoria</h2><p>{d.trayectoria}</p></article>
        <article className="public-content-card"><span>Continuidades y cambios</span><h2>Legado</h2><p>{d.legado}</p></article>
      </section>:<p className="public-catalog-note">Esta ficha reúne los datos registrados en el Atlas. La historia editorial de esta casa se incorporará en futuras ampliaciones.</p>}
      {!!d.protagonistas.length&&<section className="public-section"><div className="public-section-heading"><div><span>Personas que conectan la historia</span><h2>Protagonistas y enlaces</h2></div></div><div className="public-person-grid">{d.protagonistas.map(p=><PersonaMiniCard key={p.id} persona={p} compact/>)}</div></section>}
      {!!d.territorios.length&&<section className="public-section"><div className="public-section-heading"><div><span>El contexto territorial</span><h2>Territorios vinculados</h2></div></div><div className="public-entity-members">{d.territorios.map(t=><a key={t} href={`/es/territorio/${slugPublico(t)}`}>{t}</a>)}</div></section>}
      <section id="miembros" className="public-section"><div className="public-section-heading"><div><span>Miembros registrados en esta casa</span><h2>Personas</h2></div></div>
        <label className="public-search"><Search size={16}/><input aria-label="Buscar personas de esta casa" placeholder="Buscar nombre, título o nombre alternativo…" value={query} onChange={e=>{setQuery(e.target.value);setLimit(36);}}/><span role="status">{members.length}</span></label>
        <div className="public-person-grid">{members.slice(0,limit).map(p=><PersonaMiniCard key={p.id} persona={p} compact/>)}</div>
        {!members.length&&<p>No hay personas que coincidan con esta búsqueda.</p>}
        {members.length>limit&&<button className="public-secondary dynasty-more" onClick={()=>setLimit(n=>n+36)}>Mostrar más personas ({limit} de {members.length})</button>}
      </section>
      {!!d.gobiernos.length&&<details className="public-content-card dynasty-governments"><summary>Gobiernos registrados de miembros de la casa</summary><p>Incluye títulos nominales, regencias y disputas cuando constan. La condición de cada mandato aparece expresamente.</p><ul>{d.gobiernos.map((g,i)=><li key={`${g.persona.id}-${i}`}><a href={`/es/persona/${g.persona.slug}`}>{g.persona.nombre}</a><span>{g.titulo} · <a href={`/es/territorio/${slugPublico(g.territorio)}`}>{g.territorio}</a> · {g.desde}–{g.hasta} · {g.condicion}</span>{g.nota&&<small>{g.nota}</small>}</li>)}</ul></details>}
      {!!d.fuentes.length&&<section id="fuentes" className="public-content-card dynasty-sources"><span>Documentación</span><h2>Bibliografía de contexto</h2><p>Repertorios para consultar la historia de la casa. Una referencia general no verifica por sí sola cada filiación o fecha.</p><ul>{d.fuentes.map(f=><li key={f.url}><a href={f.url} target="_blank" rel="noreferrer">{f.titulo}</a></li>)}</ul><a href="/es/fuentes">Fuentes y metodología del proyecto</a></section>}
      <ArmsCredit dinastia={d.nombre} className="dynasty-page-credit"/>
    </>}
  </main><SiteFooter/></div>;
}
