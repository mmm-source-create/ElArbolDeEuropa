import {escudoDe,nombreEmblema} from '../../content/dinastias/escudos.js';
import DynastyArms from '../../components/DynastyArms.jsx';
import {useState} from 'react';
import {ArrowRight,Search,Shield,Landmark} from 'lucide-react';
import DynastyCard from '../public/DynastyCard.jsx';
import {PersonaMiniCard,SectionHeading} from '../public/publicShared.jsx';
import {normalizarBusquedaPublica,slugPublico} from '../../domain/people/personLabels.js';
import {translatedEquivalent} from './routes.js';
import {connectionUrl} from '../connections/connectionTree.js';
import '../public/dynasty.css';
import '../../components/crowns.css';
import EnglishSuccession from './EnglishSuccession.jsx';
const entityPath=(kind,key)=>{const es=`/es/${kind}/${slugPublico(key)}`;return translatedEquivalent(es,'en')||es;};
function EntityLink({kind,name,label}){const path=entityPath(kind,name);return <a href={path}>{label||name}{path.startsWith('/es/')?' · ES':''}</a>;}
function EnglishDynastyConnection({branch:r,internal=false}) {
 return <section id={r.id} className="dynasty-connection" aria-label={`${r.etiqueta} · ${r.periodo}`}>
  <span className="dynasty-connection-label">{r.etiqueta} · {r.periodo}</span>
  {internal&&<h3>{r.fundador.nombre}</h3>}<p>{r.texto}</p>
  <div className="public-entity-members">{r.personas.map(p=><a key={p.id} href={p.path}>{p.nombre}{p.path.startsWith('/es/')?' · ES':''}</a>)}</div>
  <a className="public-entity-action" href={r.arbol?.ids?.length>1?connectionUrl(r.arbol.ids,r.arbol.criterion).replace('/es/','/en/'):`/en/?atlas=1&familia=${encodeURIComponent(r.fundador.id)}`}>View the connection in the tree <ArrowRight size={12}/></a>
 </section>;
}
export default function EnglishEntity({data:d}){
 const dynasty=d.type==='dynasty',[query,setQuery]=useState('');
 const members=(dynasty?d.miembros:d.personas).filter(p=>normalizarBusquedaPublica([p.nombre,p.role,p.sobrenombre,...(p.aliases||[])].join(' ')).includes(normalizarBusquedaPublica(query)));
 const Icon=dynasty?Shield:Landmark;
 const internalBranches=dynasty?d.ramas.filter(r=>r.origen===d.key&&r.destino===d.key):[];
 return <main className={`public-main ${dynasty?'dynasty-page':'territory-page'}`}>
  <nav className="public-breadcrumbs" aria-label="Breadcrumb"><a href="/en">Home</a><span>›</span><a href={dynasty?'/en/dynasties':'/en/territories'}>{dynasty?'Dynasties':'Territories'}</a><span>›</span><span aria-current="page">{d.nombre}</span></nav>
  <header className={`public-page-title ${dynasty?'dynasty-hero':'territory-hero'}`}>
   {d.arms?<figure className="dynasty-hero-figure"><DynastyArms dinastia={d.key} size={76} locale="en"/></figure>:<div className="public-page-icon"><Icon size={22}/></div>}
   <span>{dynasty?'Houses and lineages':d.naturaleza==='agrupacion'?'Exploration grouping':d.naturaleza==='compuesta'?'Composite entity':'Historical territory'}</span><h1>{d.nombre}</h1><p>{d.resumen}</p>
   {d.arms?.blazon&&<p className="dynasty-blazon"><b>{nombreEmblema(escudoDe(d.key),'en')}.</b> {d.arms.blazon}<small> {d.arms.note}</small></p>}
   {dynasty&&<div className="dynasty-counts"><span><b>{d.total}</b> recorded people</span><span><b>{d.ramas.length}</b> documented {d.ramas.length===1?'connection':'connections'}</span></div>}
   <a className="public-primary" href={`/en/?atlas=1&${dynasty?'dinastia':'territorio'}=${encodeURIComponent(d.key)}`}>Explore in the Atlas <ArrowRight size={15}/></a>
  </header>
  {!dynasty&&d.nota&&<p>{d.nota}</p>}
  {!dynasty&&!!d.pertenencias?.length&&<p>{d.pertenencias.map((v,i)=><span key={i}>Part of <EntityLink kind="territorio" name={v.key} label={v.name}/> from {v.desde}. </span>)}</p>}
  {!dynasty&&!!d.evolucion?.length&&<section><h2>Political evolution</h2><ol className="territory-evolution">{d.evolucion.map((e,i)=><li key={i}><strong>{e.anio}</strong><span>{e.texto}</span></li>)}</ol></section>}
  {!dynasty&&!!d.uniones?.length&&<section className="historical-unions"><h2>Unions and separations</h2><p>Sharing a sovereign did not mean sharing every institution. These sequences include breaks and changes of government.</p>{d.uniones.map(u=><details key={u.id} id={`union-${u.id}`} className="crown-details"><summary>{u.titulo}</summary><p>{u.resumen}</p><p><strong>Institutions.</strong> {u.instituciones}</p><div className="crown-related">{u.territorios.map(t=><EntityLink key={t.key} kind="territorio" name={t.key} label={t.name}/>)}</div><ol className="crown-accessions">{u.etapas.map((e,i)=><li key={`${e.anio}-${i}`}><strong>{e.anio} · {e.titulo}</strong><p>{e.texto}</p><div className="crown-related">{e.personas.map(p=><a key={p.id} href={p.path}>{p.nombre}{p.path.startsWith('/es/')?' · ES':''}</a>)}</div></li>)}</ol><div className="crown-sources">{u.fuentes.map(f=><a key={f.url} href={f.url} target="_blank" rel="noreferrer">{f.titulo}</a>)}</div></details>)}</section>}
  {!dynasty&&!!d.etapas?.length&&<section><h2>Rank of the territory</h2><p>The rank changed over time; governments keep their own class.</p>{d.etapas.map((e,i)=><p key={i}>{e.desde===null?'Earlier stage':`From ${e.desde}`} · {e.clase}</p>)}</section>}
  {!dynasty&&d.naturaleza&&d.naturaleza!=='entidad'&&!!d.componentes?.length&&<section><h2>Territories in this group</h2><p>Each component keeps its own titles and chronology. This grouping does not establish continuous sovereignty over all of them.</p><div className="territory-links">{d.componentes.map(c=><EntityLink key={c.key} kind="territorio" name={c.key} label={c.name}/>)}</div></section>}
  {dynasty&&<>
   <nav className="dynasty-nav" aria-label="Dynasty sections"><a href="#houses">Parent houses and branches</a><a href="#history">History of the house</a><a href="#members">People</a><a href="#sources">Bibliography</a></nav>
   <section id="houses" className="public-section"><SectionHeading eyebrow="Genealogy, inheritance and alliances">Parent houses and branches</SectionHeading><p className="dynasty-intro">Descent, marriage and inheritance connect houses in different ways. Each documented link retains its own explanation.</p>
    {[['Parent house',d.casasOrigen],['Branches of this house',d.casasDerivadas],['Alliances and inheritances',d.casasConectadas]].filter(([,houses])=>houses.length).map(([title,houses])=><div key={title} className="dynasty-house-group"><h3>{title}</h3><div className="public-entity-grid">{houses.map(h=><DynastyCard key={h.slug} item={h} headingLevel={3} relationship={title} locale="en" showMembers={!d.ramas.some(r=>h.conexiones?.includes(r.id))}>{d.ramas.filter(r=>h.conexiones?.includes(r.id)).map(r=><EnglishDynastyConnection key={r.id} branch={r}/>)}</DynastyCard>)}</div></div>)}
   {!!internalBranches.length&&<div className="dynasty-house-group"><h3>Branches and connections within the house</h3><div className="dynasty-branches">{internalBranches.map(r=><article key={r.id} className="public-content-card dynasty-branch"><EnglishDynastyConnection branch={r} internal/></article>)}</div></div>}
   </section>
   <section id="history" className="dynasty-history">{[['Origin',d.origen],['Development',d.trayectoria],['Legacy',d.legado]].map(([title,text])=><article key={title} className="public-content-card"><h2>{title}</h2><p>{text}</p></article>)}</section>
   {!!d.protagonistas.length&&<section className="public-section"><SectionHeading eyebrow="People who connect the history">Protagonists and connections</SectionHeading><div className="public-person-grid">{d.protagonistas.map(p=><PersonaMiniCard key={p.id} persona={p} locale="en" compact/>)}</div></section>}
   {!!d.territorios.length&&<section className="public-section"><SectionHeading eyebrow="Territorial context">Linked territories</SectionHeading><div className="public-entity-members">{d.territorios.map(t=><EntityLink key={t.key} kind="territorio" name={t.key} label={t.name}/>)}</div></section>}
  </>}
  {dynasty?null
  :<>{/* 6.0.21: the succession in order, as on the Spanish page, with the full table kept below. */}
   <EnglishSuccession territory={d}/>
   <details className="territory-government-details"><summary>See every recorded government</summary><p>Includes regencies, branches, nominal titles and disputes when recorded. Intervals are annual and do not imply continuity or completeness.</p>{!d.gobiernos.length?<p>No governments are recorded for this entity. See the related people.</p>:<div className="territory-table"><table><thead><tr><th>Person</th><th>Territory and title</th><th>Period</th><th>Status</th></tr></thead><tbody>{d.gobiernos.map((g,i)=><tr key={`${g.persona.id}-${i}`}><td><a href={g.persona.path}>{g.persona.nombre}{g.persona.path.startsWith('/es/')?' · ES':''}</a></td><td>{g.englishTitle} · <EntityLink kind="territorio" name={g.territorio} label={g.englishTerritory}/></td><td>{g.desde}–{g.hasta}</td><td>{g.englishCondition}{g.englishNote&&<small>{g.englishNote}</small>}</td></tr>)}</tbody></table></div>}</details></>}
  {!dynasty&&<><section><h2>Dynasties in the recorded governments</h2><div className="territory-links">{d.dinastias.map(t=><EntityLink key={t.key} kind="dinastia" name={t.key} label={t.name}/>)}</div></section>{!!d.relacionados.length&&<section><h2>Related territories</h2><div className="territory-links">{d.relacionados.map(t=><a key={t.slug} href={translatedEquivalent(`/es/territorio/${t.slug}`,'en')||`/es/territorio/${t.slug}`}>{t.nombre}</a>)}</div></section>}</>}
  {!dynasty&&!!d.eventos?.length&&<section><h2>Events linked to its people</h2><ul>{d.eventos.slice(0,30).map((e,i)=><li key={e.id||i}>{e.anio} · {e.titulo}</li>)}</ul></section>}
  <section id="members" className="public-section"><SectionHeading eyebrow={dynasty?'Recorded members of this house':'People in the Atlas'}>{dynasty?'People in this house':'Related people'}</SectionHeading><label className="public-search"><Search size={16}/><input aria-label="Search people in this record" placeholder="Search names, nicknames or roles…" value={query} onChange={e=>setQuery(e.target.value)}/><span role="status">{members.length}</span></label>{dynasty?<div className="public-person-grid">{members.map(p=><PersonaMiniCard key={p.id} persona={p} locale="en" compact/>)}</div>:<div className="territory-people">{members.map(p=><article key={p.id}><h3><a href={p.path}>{p.nombre}{p.path.startsWith('/es/')?' · ES':''}</a></h3><p>{p.resumen}</p></article>)}</div>}{!members.length&&<p role="status">No people match this search.</p>}</section>
  {dynasty&&<section className="public-content-card"><h2>Recorded governments of members</h2><p>Includes nominal titles, regencies and disputes when recorded. Annual intervals do not establish continuous or exclusive control.</p><div className="territory-table"><table><thead><tr><th>Person</th><th>Territory and title</th><th>Period</th><th>Status</th></tr></thead><tbody>{d.gobiernos.map((g,i)=><tr key={`${g.persona.id}-${i}`}><td><a href={g.persona.path}>{g.persona.nombre}{g.persona.path.startsWith('/es/')?' · ES':''}</a></td><td>{g.englishTitle} · <EntityLink kind="territorio" name={g.territorio} label={g.englishTerritory}/></td><td>{g.desde}–{g.hasta}</td><td>{g.englishCondition}{g.englishNote&&<small>{g.englishNote}</small>}</td></tr>)}</tbody></table></div></section>}
  {!!d.historias?.length&&<section><h2>Related stories</h2><div className="territory-links">{d.historias.map(h=><a key={h.slug} href={h.path}>{h.titulo}{h.revisionPendiente?' · Needs review':''}{h.path.startsWith('/es/')?' · Spanish original':''}</a>)}</div></section>}
  {!!d.fuentes.length&&<section id="sources" className="public-content-card"><h2>Contextual bibliography</h2><p>General references do not by themselves verify every relationship or date. Bibliographic titles retain their original language.</p><ul>{d.fuentes.map(f=><li key={f.url}><a href={f.url} target="_blank" rel="noreferrer">{f.titulo}</a></li>)}</ul><a href="/en/methodology">Sources and methodology</a></section>}
  {d.arms&&<small className="dynasty-arms-credit dynasty-page-credit">{nombreEmblema(escudoDe(d.key),'en')}: <a href={d.arms.fuente} target="_blank" rel="noreferrer">{d.arms.autor}</a> · {d.arms.licenciaUrl?<a href={d.arms.licenciaUrl} target="_blank" rel="noreferrer license">{d.arms.licencia}</a>:d.arms.licencia} · {d.arms.procedencia==='Aportación del autor'?'Supplied by the author':d.arms.procedencia||'Wikimedia Commons'}. {d.arms.modifications}</small>}
 </main>;
}
