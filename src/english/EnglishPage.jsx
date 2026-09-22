import React,{useEffect,useState} from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import {useJson,usePublicMeta} from '../public/PublicSite.jsx';
import {entityMeta} from '../public/publicMeta.js';
import {englishRoute} from './routes.js';
import {readStoryProgress,saveStoryProgress} from '../stories/storyModel.js';
import '../stories/stories.css';
import ReadingSkeleton from '../stories/ReadingSkeleton.jsx';

export default function EnglishPage({page=null,pathname}) {
 const route=page||englishRoute(pathname||(typeof window==='undefined'?'/en/':window.location.pathname));
 const state=useJson(route?`/english-meta/${route.slug}${route.chapter?`/capitulo/${route.chapter}`:''}.json`:'/english-meta/unavailable.json',page?.data||null);
 const data=state.data;
 usePublicMeta(entityMeta('english',data,route?.slug));
 if(!data)return <div className="public-site"><SiteHeader locale="en"/><main className="public-main story-loading">{state.loading?<ReadingSkeleton locale="en"/>:<><h1>Translation not available</h1><p>This page has not been translated or could not be loaded.</p><button onClick={()=>window.location.reload()}>Try again</button><a href="/en/">English home</a></>}</main></div>;
 return <EnglishContent key={data.path} data={data} prerendered={Boolean(page)}/>;
}
function EnglishContent({data,prerendered}) {
 const [progress,setProgress]=useState({last:1,read:[]});
 useEffect(()=>{if(data.type==='story')try{setProgress(data.chapter?saveStoryProgress(window.localStorage,data.id,data.pasos.length,data.chapter):readStoryProgress(window.localStorage,data.id,data.pasos.length));}catch{}},[data.id,data.chapter,data.type,data.pasos?.length]);
 const base=data.storyPath||data.path,step=data.chapter?data.pasos?.[data.chapter-1]:null;
 const protagonists=step?data.protagonists.filter(p=>(step.personas||[step.persona]).includes(p.id)):data.protagonists;
 const atlas=new URLSearchParams({atlas:'1'});if(step){(step.personas||[step.persona]).filter(Boolean).forEach(id=>atlas.append('seleccion',id));atlas.set('anio',String(step.anio));atlas.set('regreso',data.path);}else if(data.type==='person')atlas.set('familia',data.id);
 return <div className="public-site"><SiteHeader locale="en" pathname={data.path} prerendered={prerendered}/><main className="public-main story-page english-page">
  <p className="story-eyebrow">English edition · {data.type==='person'?'Translated short profile':'Translated content'}</p>
  {data.type==='story'&&data.chapter&&<nav aria-label="Breadcrumb"><a href="/en/stories">Stories</a> / <a href={base}>{data.title}</a></nav>}
  <header className="story-heading"><h1>{data.nombre}</h1><p>{data.type==='person'?data.role:data.type==='story'&&step?`Chapter ${data.chapter} of ${data.pasos.length} · ${step.anio}`:data.description}</p></header>
  {['home','stories','people'].includes(data.type)&&<>
   {data.type==='home'&&<><p>Start with a complete story or a translated profile. The full interactive Atlas is available in Spanish.</p><div className="home-pathways"><a className="home-pathway" href="/en/people"><h2>Meet a person</h2><p>Explore five translated profiles and their family connections.</p><strong>Choose a profile →</strong></a><a className="home-pathway" href="/en/stories"><h2>Read a story</h2><p>Follow Burgundy’s inheritance or Leonardo’s search for a portrait.</p><strong>Choose a story →</strong></a><a className="home-pathway" href="/es/?atlas=1&anio=1500&panel=europa"><h2>Visit a year</h2><p>Open Europe in 1500 in the full Spanish Atlas.</p><strong>Europe in 1500 (Spanish) →</strong></a></div></>}
   {data.type!=='people'&&<section><h2>Complete stories</h2><div className="public-story-grid">{data.stories.map(s=><a key={s.id} className="public-story-card" href={s.path}><span>English translation · {s.period}</span><h3>{s.nombre}</h3><p>{s.description}</p><strong>Start reading →</strong></a>)}</div><p>Other stories remain <a href="/es/historias">available in Spanish</a>.</p></section>}
   {data.type!=='stories'&&<section><h2>Selected profiles</h2><div className="public-door-grid">{data.people.map(p=><a key={p.id} className="public-door-card" href={p.path}><strong>{p.nombre}</strong><span>{p.summary}</span><small>English short profile →</small></a>)}</div></section>}
  </>}
  {data.type==='methodology'&&<>{data.sections.map(([heading,text])=><section key={heading}><h2>{heading}</h2><p>{text}</p></section>)}<a href="/es/fuentes">Full bibliography in its original language →</a></>}
  {data.type==='person'&&<><p className="story-text">{data.summary}</p><p>{data.nacAprox?'c. ':''}{data.nac??'Birth unknown'} – {data.muerAprox?'c. ':''}{data.muer??'Death unknown'}</p><a className="public-primary" href={`/es/?${atlas}`}>Explore this family (Spanish Atlas) →</a><h2>Recorded family</h2>{[['Parents',data.padres],['Partners',data.conyuges],['Children',data.hijos]].map(([title,items])=><section key={title}><h3>{title}</h3>{items?.length?<ul>{items.map(p=><li key={p.id}><a href={`/es/persona/${p.slug}`}>{p.nombre} · Spanish record</a></li>)}</ul>:<p>No relationships recorded in this category.</p>}</section>)}<p>This short profile is translated. <a href={data.esPath}>Detailed biography, government records and documentary notes are available in Spanish.</a></p></>}
  {data.type==='story'&&<><p>{data.period} · {data.pasos.length} chapters</p><div className="story-progress"><label htmlFor="english-progress">{progress.read.length} of {data.pasos.length} chapters visited</label><progress id="english-progress" max={data.pasos.length} value={progress.read.length}/><small>Progress is saved in this browser when local storage is available, and shared between both languages.</small></div>{!step&&<a className="public-primary" href={`${base}/chapter/${progress.last}`}>{progress.read.length?'Continue reading':'Start story'} →</a>}
   <div className="story-layout"><article>{step&&<><p className="story-text">{step.texto}</p><a className="public-primary" href={`/es/?${atlas}`}>Explore this chapter (Spanish Atlas) →</a><nav className="story-pagination" aria-label="Chapter navigation">{data.chapter>1&&<a href={`${base}/chapter/${data.chapter-1}`}>← Previous</a>}{data.chapter<data.pasos.length?<a href={`${base}/chapter/${data.chapter+1}`}>Next →</a>:<a href={base}>Back to contents</a>}</nav></>}
    <h2>People in the story</h2><p>Open a short note without leaving your chapter. Translation availability is shown on each profile.</p><div className="story-people">{protagonists.map(p=><details key={p.id}><summary>{p.nombre}</summary>{p.summary?<><p>{p.summary}</p><a href={p.enPath} target="_blank" rel="noreferrer">English short profile (new tab) ↗</a></>:<p>A translation of this profile is not yet available.</p>}<p><a href={`/es/persona/${p.slug}`} target="_blank" rel="noreferrer">Full profile and sources in Spanish (new tab) ↗</a></p></details>)}</div>
   </article><aside><h2>Timeline and chapters</h2><ol className="story-chapters">{data.pasos.map((p,i)=><li key={i} className={data.chapter===i+1?'is-current':''}><a href={`${base}/chapter/${i+1}`} aria-current={data.chapter===i+1?'page':undefined}><span>{p.anio}</span>{p.titulo}{progress.read.includes(i+1)&&<small> · Visited</small>}</a></li>)}</ol></aside></div></>}
  {!!data.fuentes&&<details className="story-sources"><summary>Sources and coverage</summary><p>Source titles remain in their original language. Coverage is selective; consult the <a href="/en/methodology">methodology</a> and the documentary notes in the Spanish records.</p><ul>{data.fuentes.map((f,i)=><li key={i}>{f.url?<a href={f.url} target="_blank" rel="noreferrer">{f.label||f.titulo||f.url}</a>:(f.label||f.titulo||String(f))}</li>)}</ul></details>}
  <p className="english-equivalent"><a href={data.esPath||'/es/'}>Read this page in Spanish →</a></p>
  <a className="english-atlas-link" href="/es/?atlas=1&continuar=1">Full Atlas (Spanish) →</a>
 </main><SiteFooter locale="en"/></div>;
}
