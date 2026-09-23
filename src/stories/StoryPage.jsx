import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, GitBranch } from 'lucide-react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import { useJson, usePublicMeta } from '../public/PublicSite.jsx';
import { entityMeta } from '../public/publicMeta.js';
import { storyChapterPath, storyAtlasUrl, readStoryProgress, saveStoryProgress, storyStepIds } from './storyModel.js';
import './stories.css';
import ReadingSkeleton from './ReadingSkeleton.jsx';

export default function StoryPage({ slug, chapter = null, initialData = null }) {
  const { data, loading, error } = useJson(`/historias-meta/${slug}${chapter ? `/capitulo/${chapter}` : ''}.json`, initialData);
  usePublicMeta(entityMeta('historia', data, slug));
  if (loading || error || !data) return <div className="public-site"><SiteHeader/><main className="public-main story-page" aria-busy={loading}>
    {loading ? <ReadingSkeleton/> : <div className="public-error" role="alert"><h1>Historia no disponible</h1><p>No se ha podido abrir esta historia o capítulo.</p><button className="public-primary" onClick={() => window.location.reload()}>Reintentar</button> <a className="public-secondary" href="/es/historias">Ver historias</a></div>}
  </main><SiteFooter/></div>;
  return <StoryReader key={`${data.id}:${data.chapter || 0}`} data={data} prerendered={Boolean(initialData)}/>;
}

export function StoryReader({ data, prerendered = false, locale = 'es' }) {
  const en = locale === 'en';
  const { pasos, chapter, protagonists = [] } = data;
  const [progress, setProgress] = useState({ last: 1, read: [] });
  const [timelineOpen, setTimelineOpen] = useState(true);
  useEffect(() => {
    try { setProgress(chapter ? saveStoryProgress(window.localStorage, data.id, pasos.length, chapter) : readStoryProgress(window.localStorage, data.id, pasos.length)); }
    catch { /* Reading remains available when browser storage is disabled. */ }
  }, [data.id, chapter, pasos.length]);
  useEffect(() => {
    const media = window.matchMedia?.('(max-width: 760px)');
    if (!media) return;
    const update = () => setTimelineOpen(!media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const step = chapter ? pasos[chapter - 1] : null;
  const stepIds = storyStepIds(data, chapter);
  const people = step ? protagonists.filter(p => stepIds.includes(p.id)) : protagonists;
  const chapterPath = n => storyChapterPath(data, n, locale);
  const title = en ? data.title : data.storyTitle;
  const storiesPath = en ? '/en/stories' : '/es/historias';
  return <div className="public-site"><SiteHeader locale={locale} pathname={chapterPath(chapter)} prerendered={prerendered}/>
    <main className="public-main story-page">
      <nav className="public-breadcrumbs" aria-label={en ? 'Breadcrumb' : 'Migas de pan'}><a href={en ? '/en/' : '/es/'}>{en ? 'Home' : 'Inicio'}</a><span aria-hidden="true">›</span><a href={storiesPath}>{en ? 'Stories' : 'Historias'}</a>{chapter && <><span aria-hidden="true">›</span><a href={chapterPath()}>{title}</a></>}</nav>
      <header className="story-heading"><span className="story-eyebrow">{chapter ? `${en ? 'Chapter' : 'Capítulo'} ${chapter} / ${pasos.length} · ${step.anio}` : `${data.period || ''} · ${pasos.length} ${en ? 'chapters' : 'capítulos'}`}</span><h1>{data.nombre}</h1><p>{chapter ? title : en ? data.description : data.descripcion}</p></header>
      <div className="story-reading-meta"><BookOpen size={14} aria-hidden="true"/><div className="story-progress"><label htmlFor="reading-progress">{en ? `${progress.read.length} of ${pasos.length} chapters visited` : `${progress.read.length} de ${pasos.length} capítulos visitados`}</label><progress id="reading-progress" max={pasos.length} value={progress.read.length}/></div><span title={en ? 'Progress is shared between languages and saved when browser storage is available.' : 'El progreso se guarda cuando este navegador permite almacenamiento local.'}>{en ? 'Saved on this browser' : 'Guardado en este navegador'}</span></div>
      <div className="story-layout"><article className="story-reading">
        {step ? <><p className="story-text">{step.texto}</p><div className="story-atlas-action"><a className="public-primary" href={storyAtlasUrl(data, chapter, locale)}><GitBranch size={14} aria-hidden="true"/>{en ? 'View the story in the Atlas' : 'Ver la historia en el Atlas'}</a><p>{en ? 'The whole story stays in view; this chapter’s people are highlighted. Atlas controls are in Spanish.' : 'Toda la historia permanece en el árbol; este capítulo destaca a sus protagonistas.'}</p></div>
          <nav className="story-pagination" aria-label={en ? 'Chapter navigation' : 'Navegación de capítulos'}>{chapter > 1 ? <a href={chapterPath(chapter - 1)}><ArrowLeft size={14}/>{en ? 'Previous' : 'Anterior'}</a> : <a href={chapterPath()}><ArrowLeft size={14}/>{en ? 'Contents' : 'Índice'}</a>}{chapter < pasos.length ? <a href={chapterPath(chapter + 1)}>{en ? 'Next chapter' : 'Siguiente capítulo'}<ArrowRight size={14}/></a> : <a href={chapterPath()}>{en ? 'Back to contents' : 'Volver al índice'}<ArrowRight size={14}/></a>}</nav></> : <div className="story-introduction"><h2>{en ? 'A story, step by step' : 'Una historia, paso a paso'}</h2><p>{en ? data.subtitle : data.subtitulo}</p><a className="public-primary" href={chapterPath(progress.last)}>{progress.read.length ? en ? 'Continue reading' : 'Continuar lectura' : en ? 'Start story' : 'Comenzar historia'}<ArrowRight size={14}/></a></div>}
        <section className="story-cast"><h2>{step ? en ? 'People in this chapter' : 'Personajes de este capítulo' : en ? 'People in the story' : 'Protagonistas'}</h2><div className="story-people">{people.map(p => <details key={p.id}><summary>{p.nombre}</summary>{en ? <>{p.summary ? <p>{p.summary}</p> : <p>A translation of this profile is not yet available.</p>}{p.enPath && <a href={p.enPath} target="_blank" rel="noreferrer">English profile ↗</a>}<a href={`/es/persona/${p.slug}`} target="_blank" rel="noreferrer">Full profile and sources in Spanish ↗</a></> : <><p>{p.resumen || p.biografia || 'Consulta la ficha para conocer los datos registrados.'}</p><a href={`/es/persona/${p.slug}`} target="_blank" rel="noreferrer">Ficha completa (otra pestaña) ↗</a></>}</details>)}</div></section>
        <details className="story-sources"><summary>{en ? 'Sources and coverage' : 'Fuentes y límites de cobertura'}</summary><p>{en ? 'Coverage is selective. Source titles remain in their original language; the Spanish records retain the detailed documentary notes.' : 'Este recorrido reúne los acontecimientos y personas documentados por el proyecto. Las fichas conservan las notas sobre fechas inciertas y filiaciones.'}</p><a href={en ? '/en/methodology' : '/es/fuentes'}>{en ? 'Sources and methodology' : 'Metodología y bibliografía'}</a><ul>{(data.fuentes || []).map((f, i) => <li key={i}>{f.url ? <a href={f.url} target="_blank" rel="noreferrer">{f.label || f.titulo || f.url}</a> : (f.label || f.titulo || String(f))}</li>)}</ul></details>
      </article><aside className="story-timeline"><details open={timelineOpen} onToggle={e => setTimelineOpen(e.currentTarget.open)}><summary>{en ? 'Timeline and chapters' : 'Cronología y capítulos'}<span>{chapter ? `${chapter} / ${pasos.length}` : pasos.length}</span></summary><ol className="story-chapters">{pasos.map((p, i) => <li key={i} className={chapter === i + 1 ? 'is-current' : ''}><a href={chapterPath(i + 1)} aria-current={chapter === i + 1 ? 'page' : undefined}><span className="story-chapter-year">{p.anio}</span><span>{p.titulo}{progress.read.includes(i + 1) && <small>{en ? 'Visited' : 'Visitado'}</small>}</span></a></li>)}</ol></details></aside></div>
    </main><SiteFooter locale={locale}/></div>;
}
