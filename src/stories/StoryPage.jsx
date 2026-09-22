import React, { useEffect, useState } from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import { useJson, usePublicMeta } from '../public/PublicSite.jsx';
import { entityMeta } from '../public/publicMeta.js';
import { storyPath, storyAtlasUrl, readStoryProgress, saveStoryProgress } from './storyModel.js';
import './stories.css';
import ReadingSkeleton from './ReadingSkeleton.jsx';

export default function StoryPage({ slug, chapter = null, initialData = null }) {
  const { data, loading, error } = useJson(`/historias-meta/${slug}${chapter ? `/capitulo/${chapter}` : ''}.json`, initialData);
  usePublicMeta(entityMeta('historia', data, slug));
  if (loading || error || !data) return <div className="public-site"><SiteHeader/><main className="public-main story-loading" aria-busy={loading}>
    {loading ? <ReadingSkeleton/> : <><h1>Historia no disponible</h1><p>No se ha podido abrir esta historia o capítulo.</p><button onClick={() => window.location.reload()}>Reintentar</button><a href="/es/historias">Ver historias</a></>}
  </main></div>;
  return <StoryReader key={`${data.id}:${data.chapter || 0}`} data={data} prerendered={Boolean(initialData)}/>;
}

function StoryReader({ data, prerendered }) {
  const { pasos, chapter, protagonists } = data;
  const [progress, setProgress] = useState({ last: 1, read: [] });
  useEffect(() => {
    try { setProgress(chapter ? saveStoryProgress(window.localStorage, data.id, pasos.length, chapter) : readStoryProgress(window.localStorage, data.id, pasos.length)); }
    catch { /* Storage may be unavailable. */ }
  }, [data.id, chapter, pasos.length]);
  const step = chapter ? pasos[chapter - 1] : null;
  const people = step ? protagonists.filter(p => (step.personas || [step.persona]).includes(p.id)) : protagonists;
  return <div className="public-site"><SiteHeader pathname={storyPath(data.slug,chapter)} prerendered={prerendered}/>
    <main className="public-main story-page">
      <nav aria-label="Migas de pan"><a href="/es/historias">Historias</a>{chapter && <> / <a href={storyPath(data.slug)}>{data.storyTitle}</a></>}</nav>
      <header className="story-heading"><p className="story-eyebrow">{chapter ? `Capítulo ${chapter} de ${pasos.length} · ${step.anio}` : `${data.period} · ${pasos.length} capítulos`}</p><h1>{data.nombre}</h1><p>{chapter ? data.storyTitle : data.descripcion}</p></header>
      <div className="story-progress"><label htmlFor="reading-progress">{progress.read.length} de {pasos.length} capítulos visitados</label><progress id="reading-progress" max={pasos.length} value={progress.read.length}/><small>El avance se guarda en este navegador cuando permite almacenamiento local.</small></div>
      {!chapter && <a className="public-primary" href={storyPath(data.slug, progress.last)}>{progress.read.length ? 'Continuar lectura' : 'Comenzar historia'} →</a>}
      <div className="story-layout"><article>
        {step ? <><p className="story-text">{step.texto}</p><a className="public-primary" href={storyAtlasUrl(data, chapter)}>Explorar este capítulo en el Atlas →</a>
          <nav className="story-pagination" aria-label="Navegación de capítulos">{chapter > 1 && <a href={storyPath(data.slug, chapter - 1)}>← Anterior</a>}{chapter < pasos.length ? <a href={storyPath(data.slug, chapter + 1)}>Siguiente →</a> : <a href={storyPath(data.slug)}>Volver al índice</a>}</nav></> : <><h2>La historia, paso a paso</h2><p>{data.subtitulo}</p></>}
        <h2>{step ? 'Personajes de este capítulo' : 'Protagonistas'}</h2><p>Abre una ficha breve sin salir de la lectura.</p>
        <div className="story-people">{people.map(p => <details key={p.id}><summary>{p.nombre}</summary><p>{p.resumen || p.biografia || 'Consulta la ficha para conocer los datos registrados.'}</p><a href={`/es/persona/${p.slug}`} target="_blank" rel="noreferrer">Ficha completa (otra pestaña) ↗</a></details>)}</div>
        <details className="story-sources"><summary>Fuentes y límites de cobertura</summary><p>Este recorrido reúne los acontecimientos y personas documentados por el proyecto. No representa una historia exhaustiva; las fichas conservan las notas sobre fechas inciertas y filiaciones.</p><a href="/es/fuentes">Metodología y bibliografía compartida</a><ul>{data.fuentes.map((f, i) => <li key={i}>{f.url ? <a href={f.url} target="_blank" rel="noreferrer">{f.label || f.titulo || f.url}</a> : (f.label || f.titulo || String(f))}</li>)}</ul></details>
      </article><aside><h2>Cronología y capítulos</h2><ol className="story-chapters">{pasos.map((p, i) => <li key={i} className={chapter === i + 1 ? 'is-current' : ''}><a href={storyPath(data.slug, i + 1)} aria-current={chapter === i + 1 ? 'page' : undefined}><span>{p.anio}</span> {p.titulo}{progress.read.includes(i + 1) && <small> · Visitado</small>}</a></li>)}</ol></aside></div>
    </main><SiteFooter/></div>;
}
