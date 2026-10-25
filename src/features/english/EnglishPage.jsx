import EnglishEntity from './EnglishEntity.jsx';
import EnglishPortraitChallenge from './EnglishPortraitChallenge.jsx';
import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Search, Users, Info } from 'lucide-react';
import SiteHeader from '../../components/SiteHeader.jsx';
import SiteFooter from '../../components/SiteFooter.jsx';
import ProjectSupport from '../../components/ProjectSupport.jsx';
import { PersonaMiniCard, useJson, usePublicMeta } from '../public/publicShared.jsx';
import DynastyCard from '../public/DynastyCard.jsx';
import {normalizarBusquedaPublica} from '../../domain/people/personLabels.js';
import { HomeContent } from '../public/HomePage.jsx';
import { PersonContent } from '../public/PublicSite.jsx';
import { entityMeta } from '../public/publicMeta.js';
import { englishRoute, englishSkeletonKind } from './routes.js';
import { StoryReader } from '../stories/StoryPage.jsx';
import ReadingSkeleton from '../stories/ReadingSkeleton.jsx';
import StoryCatalog from '../stories/StoryCatalog.jsx';
import {STORY_PROGRESS_KEY} from '../stories/storyModel.js';
import '../stories/stories.css';
import '../../styles/theme.css';

export default function EnglishPage({ page = null, pathname }) {
  const route = page || englishRoute(pathname || (typeof window === 'undefined' ? '/en/' : window.location.pathname));
  const state = useJson(route ? `/english-meta/${route.slug}${route.chapter ? `/capitulo/${route.chapter}` : ''}.json` : '/english-meta/unavailable.json', page?.data || null);
  const data = state.data;
  const skeletonKind = englishSkeletonKind(route);
  usePublicMeta(entityMeta('english', data, route?.slug));
  if (!data) return <div className="public-site"><SiteHeader locale="en"/><main className={`public-main${skeletonKind === 'story' ? ' story-page' : ''}`} aria-busy={state.loading}>{state.loading ? <ReadingSkeleton locale="en" kind={skeletonKind}/> : <div className="public-error" role="alert"><h1>Translation not available</h1><p>This page has not been translated or could not be loaded.</p><button className="public-primary" onClick={() => window.location.reload()}>Try again</button> <a className="public-secondary" href="/en/">English home</a></div>}</main><SiteFooter locale="en"/></div>;
  const prerendered = Boolean(page);
  if (data.type === 'story') return <StoryReader key={data.path} data={data} locale="en" prerendered={prerendered}/>;
  return <div className="public-site"><SiteHeader locale="en" pathname={data.path} prerendered={prerendered}/>
    {data.type === 'home' ? <HomeContent data={data} locale="en" title={data.nombre} prerendered={prerendered}/> : ['dynasty','territory'].includes(data.type)?<EnglishEntity data={data}/>:data.type==='challenge'?<EnglishPortraitChallenge data={data}/>:data.type === 'person' ? <PersonContent persona={data} locale="en" path={data.path}/> : ['methodology','about'].includes(data.type) ? <EnglishInfo data={data}/> : <EnglishCatalog data={data}/>}
    <SiteFooter locale="en"/>
  </div>;
}

function PageTitle({ data, Icon, eyebrow }) {
  return <><nav className="public-breadcrumbs" aria-label="Breadcrumb"><a href="/en/">Home</a><span aria-hidden="true">›</span><span aria-current="page">{data.nombre}</span></nav><section className="public-page-title"><div className="public-page-icon"><Icon size={22}/></div><span>{eyebrow}</span><h1>{data.nombre}</h1><p>{data.description}</p></section></>;
}
function EnglishCatalog({ data }) {
  const [query, setQuery] = useState('');
  const [progress,setProgress]=useState({});
  useEffect(()=>{
    if(data.type!=='stories')return;
    try {const saved=JSON.parse(window.localStorage.getItem(STORY_PROGRESS_KEY));setProgress(saved&&typeof saved==='object'&&!Array.isArray(saved)?saved:{});} catch { /* Reading remains available with storage disabled. */ }
  },[data.type]);
  const people = data.type === 'people',stories=data.type==='stories',entities=!people&&!stories;
  const collection=people?data.people:stories?data.stories:data.type==='dynasties'?data.dynasties:data.territories;
  const noun=people?'profiles':stories?'stories':data.type;
  const items = collection.filter(p => normalizarBusquedaPublica([p.nombre, p.role, p.sobrenombre, ...(p.aliases||[]), p.summary, p.description].filter(Boolean).join(' ')).includes(normalizarBusquedaPublica(query)));
  return <main className="public-main public-catalog"><PageTitle data={data} Icon={people ? Users : BookOpen} eyebrow={stories?'Guided stories':'Atlas index'}/><label className="public-search"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder={`Search translated ${noun}…`} aria-label={`Search translated ${noun}`}/><span>{items.length}</span></label>
    {entities?<div className="public-entity-grid">{items.map(item=>data.type==='dynasties'?<DynastyCard key={item.path} item={{...item,resumen:item.description}} locale="en"/>:<article key={item.path} className="public-entity-card"><div className="public-entity-card-head"><h2>{item.nombre}</h2></div><p>{item.description}</p><a className="public-entity-action" href={item.path}>Read the complete record <ArrowRight size={13}/></a></article>)}</div>:people ? <div className="public-person-list">{items.map(p => <PersonaMiniCard key={p.id} persona={p} compact locale="en"/>)}</div> : <StoryCatalog items={items} progress={progress} locale="en"/>}
    {!items.length&&<p className="public-catalog-note" role="status">No translated {noun} match this search.</p>}
    <p className="english-catalog-note">{collection.length} translated {collection.length===1?({profiles:'profile',stories:'story',dynasties:'dynasty',territories:'territory'}[noun]||noun):noun}. <a href={data.esPath}>Browse the full Spanish collection</a>, or <a href="/es/?atlas=1&continuar=1">open the Spanish Atlas</a>.</p>
  </main>;
}
function EnglishInfo({ data }) {
  const methodology=data.type==='methodology';
  return <main className="public-main public-info-page"><PageTitle data={data} Icon={Info} eyebrow={methodology?'Sources and methodology':'The project'}/><div className="public-info-grid">{data.sections.map(section => <section className="public-info-card" key={section.title}><h2>{section.title}</h2>{section.paragraphs?.map(text=><p key={text}>{text}</p>)}{!!section.links?.length&&<div className="public-info-links">{section.links.map(([label,href])=><a key={href} href={href} target="_blank" rel="noreferrer">{label} ↗</a>)}</div>}</section>)}{!methodology && <ProjectSupport locale="en" />}</div><p className="english-catalog-note">{methodology&&<><a href="/es/fuentes">Original Spanish source notes</a> · </>}<a href="/es/?atlas=1&continuar=1">Explore the Spanish Atlas</a></p></main>;
}
