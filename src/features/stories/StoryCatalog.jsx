import {ArrowRight} from 'lucide-react';
import StoryCollectionBrowser from './StoryCollectionBrowser.jsx';
import {catalogStoryAtlasUrl,normalizeStoryProgress} from './storyModel.js';

export default function StoryCatalog({items, progress = {}, locale = 'es'}) {
  const en = locale === 'en';
  const title = s => s.nombre || s.titulo;
  const path = s => s.path || `/es/historia/${s.slug}`;
  function renderStories(stories) {
    return <>
      <div className="public-story-grid public-story-catalog">{stories.filter(s => s.disponible !== false).map(s => {
        const count = Array.isArray(s.pasos) ? s.pasos.length : s.pasos;
        const saved = normalizeStoryProgress(progress[s.id],s.id,count), read = Math.min(saved.read.length,count);
        const last = Number.isInteger(saved?.last) && saved.last > 0 && saved.last <= count ? saved.last : 1;
        return <article className="public-story-card" key={s.id}><span>{count} {en ? 'chapters' : 'capítulos'}{s.minutos ? ` · ${s.minutos} min` : ''}</span><h3>{title(s)}</h3>{s.revisionPendiente && <strong className="story-review-note">{en ? 'Needs review' : 'Pendiente de revisión'}</strong>}<p>{s.subtitulo || s.description || s.descripcion}</p>
          {read > 0 && <div className="story-card-progress" aria-label={en ? `${read} of ${count} chapters visited` : `${read} de ${count} capítulos visitados`}><i style={{width:`${Math.round(read / count * 100)}%`}}/></div>}
          <div className="story-entry-actions"><a className="public-primary" href={catalogStoryAtlasUrl(s,last,locale)}>{en ? 'Read in the Atlas' : 'Leer en el Atlas'}<ArrowRight size={13}/></a><a className="public-secondary" href={read > 0 && read < count ? `${path(s)}/${en ? 'chapter' : 'capitulo'}/${last}` : path(s)}>{read > 0 ? en ? 'Continue chapters' : 'Continuar capítulos' : en ? 'Read chapters' : 'Leer capítulos'}<ArrowRight size={13}/></a></div></article>;
      })}</div>
      {stories.some(s => s.disponible === false) && <div className="story-coming"><h3>{en ? 'In preparation' : 'En preparación'}</h3><ul className="story-coming-list">{stories.filter(s => s.disponible === false).map(s => <li key={s.id}><strong>{title(s)}</strong><span>{s.subtitulo || s.description || s.descripcion}</span></li>)}</ul></div>}
      {!stories.length && <p className="public-muted">{en ? 'No stories found.' : 'No se han encontrado historias.'}</p>}
    </>;
  }
  return <StoryCollectionBrowser items={items} locale={locale} renderStories={renderStories}/>;
}
