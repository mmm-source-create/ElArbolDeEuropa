import {useState} from 'react';
import {ArrowRight,Search,Shield,Landmark} from 'lucide-react';
import DynastyCard from '../public/DynastyCard.jsx';
import {PersonaMiniCard,SectionHeading} from '../public/publicShared.jsx';
import {normalizarBusquedaPublica,slugPublico} from '../../domain/people/personLabels.js';
import {translatedEquivalent} from './routes.js';
import {connectionUrl} from '../connections/connectionTree.js';
import '../public/dynasty.css';
const entityPath=(kind,key)=>{const es=`/es/${kind}/${slugPublico(key)}`;return translatedEquivalent(es,'en')||es;};
function EntityLink({kind,name,label}){const path=entityPath(kind,name);return <a href={path}>{label||name}{path.startsWith('/es/')?' · ES':''}</a>;}
function EnglishDynastyConnection({branch:r,internal=false}) {
 return <section id={r.id} className="dynasty-connection" aria-label={`${r.etiqueta} · ${r.periodo}`}>
  <span className="dynasty-connection-label">{r.etiqueta} · {r.periodo}</span>
  {internal&&<h3>{r.fundador.nombre}</h3>}<p>{r.texto}</p>
  <div className="public-entity-members">{r.personas.map(p=><a key={p.id} href={p.path}>{p.nombre}{p.path.startsWith('/es/')?' · ES':''}</a>)}</div>
  <a className="public-entity-action" href={r.arbol?.ids?.length>1?connectionUrl(r.arbol.ids,r.arbol.criterion):`${r.fundador.path}?atlas=1`}>View the connection in the Spanish tree <ArrowRight size={12}/></a>
 </section>;
}
export default function EnglishEntity({data:d}){
 const dynasty=d.type==='dynasty',[query,setQuery]=useState('');
 const members=(dynasty?d.miembros:d.personas).filter(p=>normalizarBusquedaPublica([p.nombre,p.role,p.sobrenombre,...(p.aliases||[])].join(' ')).includes(normalizarBusquedaPublica(query)));
 const Icon=dynasty?Shield:Landmark;
 const internalBranches=dynasty?d.ramas.filter(r=>r.origen===d.key&&r.destino===d.key):[];
 return <main className={`public-main ${dynasty?'dynasty-page':'territory-page'}`}>
  <nav className="public-breadcrumbs" aria-label="Breadcrumb"><a href="/en/">Home</a><span>›</span><a href={dynasty?'/en/dynasties':'/en/territories'}>{dynasty?'Dynasties':'Territories'}</a><span>›</span><span aria-current="page">{d.nombre}</span></nav>
  <header className={`public-page-title ${dynasty?'dynasty-hero':'territory-hero'}`}>
   {d.arms?<figure className="dynasty-hero-figure"><img src={d.arms.archivo} width="76" height="91" alt={`Arms of ${d.nombre}: ${d.arms.blazon}`}/></figure>:<div className="public-page-icon"><Icon size={22}/></div>}
   <span>{dynasty?'Houses and lineages':'Historical territory · Duchy'}</span><h1>{d.nombre}</h1><p>{d.resumen}</p>
   {d.arms&&<p className="dynasty-blazon"><b>Arms.</b> {d.arms.blazon}<small> {d.arms.note}</small></p>}
   {dynasty&&<div className="dynasty-counts"><span><b>{d.total}</b> recorded people</span><span><b>{d.ramas.length}</b> documented {d.ramas.length===1?'connection':'connections'}</span></div>}
   <a className="public-primary" href={`${d.esPath}?atlas=1`}>Explore in the Spanish Atlas <ArrowRight size={15}/></a>
  </header>
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
  <section id="members" className="public-section"><SectionHeading eyebrow={dynasty?'Recorded members of this house':'People in the Atlas'}>{dynasty?'People in this house':'Related people'}</SectionHeading><label className="public-search"><Search size={16}/><input aria-label="Search people in this record" placeholder="Search names, nicknames or roles…" value={query} onChange={e=>setQuery(e.target.value)}/><span role="status">{members.length}</span></label>{dynasty?<div className="public-person-grid">{members.map(p=><PersonaMiniCard key={p.id} persona={p} locale="en" compact/>)}</div>:<div className="territory-people">{members.map(p=><article key={p.id}><h3><a href={p.path}>{p.nombre}{p.path.startsWith('/es/')?' · ES':''}</a></h3><p>{p.resumen}</p></article>)}</div>}{!members.length&&<p role="status">No people match this search.</p>}</section>
  <section className="public-content-card"><h2>{dynasty?'Recorded governments of members':'Recorded succession and governments'}</h2><p>Includes nominal titles, regencies and disputes when recorded. Annual intervals do not establish continuous or exclusive control.</p><div className="territory-table"><table><thead><tr><th>Person</th><th>Territory and title</th><th>Period</th><th>Status</th></tr></thead><tbody>{d.gobiernos.map((g,i)=><tr key={`${g.persona.id}-${i}`}><td><a href={g.persona.path}>{g.persona.nombre}{g.persona.path.startsWith('/es/')?' · ES':''}</a></td><td>{g.englishTitle} · <EntityLink kind="territorio" name={g.territorio} label={g.englishTerritory}/></td><td>{g.desde}–{g.hasta}</td><td>{g.englishCondition}{g.englishNote&&<small>{g.englishNote}</small>}</td></tr>)}</tbody></table></div></section>
  {!dynasty&&<><section><h2>Dynasties in the recorded governments</h2><div className="territory-links">{d.dinastias.map(t=><EntityLink key={t.key} kind="dinastia" name={t.key} label={t.name}/>)}</div></section>{!!d.relacionados.length&&<section><h2>Related territories</h2><div className="territory-links">{d.relacionados.map(t=><a key={t.slug} href={`/es/territorio/${t.slug}`}>{t.nombre} · ES</a>)}</div></section>}</>}
  {!!d.historias?.length&&<section><h2>Related stories</h2><div className="territory-links">{d.historias.map(h=><a key={h.slug} href={h.path}>{h.titulo}{h.revisionPendiente?' · Needs review':''}{h.path.startsWith('/es/')?' · Spanish original':''}</a>)}</div></section>}
  {!!d.fuentes.length&&<section id="sources" className="public-content-card"><h2>Contextual bibliography</h2><p>General references do not by themselves verify every relationship or date. Bibliographic titles retain their original language.</p><ul>{d.fuentes.map(f=><li key={f.url}><a href={f.url} target="_blank" rel="noreferrer">{f.titulo}</a></li>)}</ul><a href="/en/methodology">Sources and methodology</a></section>}
  {d.arms&&<small className="dynasty-arms-credit dynasty-page-credit">Arms: <a href={d.arms.fuente} target="_blank" rel="noreferrer">{d.arms.autor}</a> · <a href={d.arms.licenciaUrl} target="_blank" rel="noreferrer license">{d.arms.licencia}</a> · Wikimedia Commons. {d.arms.modifications}</small>}
 </main>;
}
