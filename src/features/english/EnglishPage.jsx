import EnglishEntity from './EnglishEntity.jsx';
import { lazy, Suspense, useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Search, Users, Info } from 'lucide-react';
import SiteHeader from '../../components/SiteHeader.jsx';
import SiteFooter from '../../components/SiteFooter.jsx';
import ProjectSupport from '../../components/ProjectSupport.jsx';
import { PersonaMiniCard, useJson, usePublicMeta } from '../public/publicShared.jsx';
import DynastyCard from '../public/DynastyCard.jsx';
import {normalizarBusquedaPublica} from '../../domain/people/personLabels.js';
import { HomeContent } from '../public/HomePage.jsx';
import { PersonContent, CatalogPage } from '../public/PublicSite.jsx';
import { entityMeta } from '../public/publicMeta.js';
import { englishRoute, englishSkeletonKind } from './routes.js';
import { StoryReader } from '../stories/StoryPage.jsx';
import ReadingSkeleton from '../stories/ReadingSkeleton.jsx';
import StoryCatalog from '../stories/StoryCatalog.jsx';
import {STORY_PROGRESS_KEY} from '../stories/storyModel.js';
import '../stories/stories.css';
import '../../styles/theme.css';
const EnglishChallenge = lazy(() => import('./EnglishChallenge.jsx'));

export default function EnglishPage({ page = null, pathname, challengeContent = null }) {
  const route = page || englishRoute(pathname || (typeof window === 'undefined' ? '/en/' : window.location.pathname));
  const state = useJson(route ? `/english-meta/${route.slug}${route.chapter ? `/capitulo/${route.chapter}` : ''}.json` : '/english-meta/unavailable.json', page?.data || null);
  const data = state.data;
  const skeletonKind = englishSkeletonKind(route);
  usePublicMeta(entityMeta('english', data, route?.slug));
  if (!data) return <div className="public-site"><SiteHeader locale="en"/><main className={`public-main${skeletonKind === 'story' ? ' story-page' : ''}`} aria-busy={state.loading}>{state.loading ? <ReadingSkeleton locale="en" kind={skeletonKind}/> : <div className="public-error" role="alert"><h1>Translation not available</h1><p>This page has not been translated or could not be loaded.</p><button className="public-primary" onClick={() => window.location.reload()}>Try again</button> <a className="public-secondary" href="/en/">English home</a></div>}</main><SiteFooter locale="en"/></div>;
  const prerendered = Boolean(page);
  if (data.type === 'story') return <StoryReader key={data.path} data={data} locale="en" prerendered={prerendered}/>;
  return <div className={data.type === 'challenge' ? 'public-site desafio-page' : 'public-site'}><SiteHeader locale="en" pathname={data.path} prerendered={prerendered}/>
    {data.type === 'home' ? <HomeContent data={data} locale="en" title={data.nombre} prerendered={prerendered}/> : ['dynasty','territory'].includes(data.type)?<EnglishEntity data={data}/>:data.type==='challenge'?<Suspense fallback={<ReadingSkeleton locale="en"/>}>{challengeContent || <EnglishChallenge/>}</Suspense>:data.type === 'person' ? <PersonContent persona={data} locale="en" path={data.path}/> : ['methodology','about','licences','acknowledgements'].includes(data.type) ? <EnglishInfo data={data}/> : <EnglishCatalog data={data}/>}
    <SiteFooter locale="en"/>
  </div>;
}

function PageTitle({ data, Icon, eyebrow }) {
  return <><nav className="public-breadcrumbs" aria-label="Breadcrumb"><a href="/en/">Home</a><span aria-hidden="true">›</span><span aria-current="page">{data.nombre}</span></nav><section className="public-page-title"><div className="public-page-icon"><Icon size={22}/></div><span>{eyebrow}</span><h1>{data.nombre}</h1><p>{data.description}</p></section></>;
}
function EnglishCatalog({ data }) {
  const tipo = {people:'personas',dynasties:'dinastias',territories:'territorios',stories:'historias'}[data.type];
  const items = data[data.type] || [];
  return <CatalogPage tipo={tipo} locale="en" initialData={{items}} catalogTitle={data.nombre} embedded/>;
}
function EnglishInfo({ data }) {
  const methodology=data.type==='methodology';
  return <main className="public-main public-info-page"><PageTitle data={data} Icon={Info} eyebrow={methodology?'Sources and methodology':data.type==='licences'?'Licences':data.type==='acknowledgements'?'Acknowledgements':'The project'}/><div className="public-info-grid">{data.sections.map(section => <section className="public-info-card" key={section.title} id={section.id}><h2>{section.title}</h2>{section.paragraphs?.map(text=><p key={text}>{text}</p>)}{!!section.links?.length&&<div className="public-info-links">{section.links.map(([label,href])=><a key={`${href}-${label}`} href={href} target="_blank" rel="noreferrer">{label} ↗</a>)}</div>}</section>)}{data.type==='about' && <ProjectSupport locale="en" />}</div><p className="english-catalog-note"><a href="/en/?atlas=1&continuar=1">Explore the Atlas</a></p></main>;
}
