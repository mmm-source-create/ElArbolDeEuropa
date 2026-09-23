import React, { useState } from 'react';
import { ArrowRight, BookOpen, Search, Users, Info } from 'lucide-react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import { HomeContent, PersonContent, PersonaMiniCard, useJson, usePublicMeta } from '../public/PublicSite.jsx';
import { entityMeta } from '../public/publicMeta.js';
import { englishRoute } from './routes.js';
import { StoryReader } from '../stories/StoryPage.jsx';
import ReadingSkeleton from '../stories/ReadingSkeleton.jsx';
import '../stories/stories.css';

export default function EnglishPage({ page = null, pathname }) {
  const route = page || englishRoute(pathname || (typeof window === 'undefined' ? '/en/' : window.location.pathname));
  const state = useJson(route ? `/english-meta/${route.slug}${route.chapter ? `/capitulo/${route.chapter}` : ''}.json` : '/english-meta/unavailable.json', page?.data || null);
  const data = state.data;
  const skeletonKind = route?.slug?.startsWith('person-') ? 'person' : route?.slug === 'home' ? 'home' : ['people', 'stories'].includes(route?.slug) ? 'catalog' : route?.slug === 'methodology' ? 'methodology' : 'story';
  usePublicMeta(entityMeta('english', data, route?.slug));
  if (!data) return <div className="public-site"><SiteHeader locale="en"/><main className={`public-main${skeletonKind === 'story' ? ' story-page' : ''}`} aria-busy={state.loading}>{state.loading ? <ReadingSkeleton locale="en" kind={skeletonKind}/> : <div className="public-error" role="alert"><h1>Translation not available</h1><p>This page has not been translated or could not be loaded.</p><button className="public-primary" onClick={() => window.location.reload()}>Try again</button> <a className="public-secondary" href="/en/">English home</a></div>}</main><SiteFooter locale="en"/></div>;
  const prerendered = Boolean(page);
  if (data.type === 'story') return <StoryReader key={data.path} data={data} locale="en" prerendered={prerendered}/>;
  return <div className="public-site"><SiteHeader locale="en" pathname={data.path} prerendered={prerendered}/>
    {data.type === 'home' ? <HomeContent data={data} locale="en" title={data.nombre} prerendered={prerendered}/> : data.type === 'person' ? <PersonContent persona={data} locale="en" path={data.path}/> : data.type === 'methodology' ? <EnglishMethodology data={data}/> : <EnglishCatalog data={data}/>}
    <SiteFooter locale="en"/>
  </div>;
}

function PageTitle({ data, Icon, eyebrow }) {
  return <><nav className="public-breadcrumbs" aria-label="Breadcrumb"><a href="/en/">Home</a><span aria-hidden="true">›</span><span aria-current="page">{data.nombre}</span></nav><section className="public-page-title"><div className="public-page-icon"><Icon size={22}/></div><span>{eyebrow}</span><h1>{data.nombre}</h1><p>{data.description}</p></section></>;
}
function EnglishCatalog({ data }) {
  const [query, setQuery] = useState('');
  const people = data.type === 'people';
  const items = (people ? data.people : data.stories).filter(p => [p.nombre, p.summary, p.description].filter(Boolean).join(' ').toLocaleLowerCase('en').includes(query.trim().toLocaleLowerCase('en')));
  return <main className="public-main public-catalog"><PageTitle data={data} Icon={people ? Users : BookOpen} eyebrow={people ? 'Atlas index' : 'Guided stories'}/><label className="public-search"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder={people ? 'Search translated profiles…' : 'Search translated stories…'} aria-label={people ? 'Search translated profiles' : 'Search translated stories'}/><span>{items.length}</span></label>
    {people ? <div className="public-person-list">{items.map(p => <PersonaMiniCard key={p.id} persona={p} compact locale="en"/>)}</div> : <div className="public-story-grid public-story-catalog">{items.map(s => <article key={s.id} className="public-story-card"><span>{s.pasos} chapters · {s.period}</span><h2>{s.nombre}</h2><p>{s.description}</p><a href={s.path}>Start reading <ArrowRight size={13}/></a></article>)}</div>}
    {!items.length&&<p className="public-catalog-note" role="status">No translated {people ? 'profiles' : 'stories'} match this search.</p>}
    <p className="english-catalog-note">{people ? 'Five short profiles' : 'Two complete stories'} are translated so far. <a href={data.esPath}>Browse the full Spanish collection</a>, or <a href="/es/?atlas=1&continuar=1">open the Spanish Atlas</a>.</p>
  </main>;
}
function EnglishMethodology({ data }) {
  return <main className="public-main public-info-page"><PageTitle data={data} Icon={Info} eyebrow="About the project"/><div className="public-info-grid">{data.sections.map(([heading, text]) => <section className="public-info-card" key={heading}><h2>{heading}</h2><p>{text}</p></section>)}</div><p className="english-catalog-note"><a href="/es/fuentes">Full bibliography in its original language</a> · <a href="/es/?atlas=1&continuar=1">Explore the Spanish Atlas</a></p></main>;
}
