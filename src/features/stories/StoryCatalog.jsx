import {useState} from 'react';
import {ArrowRight} from 'lucide-react';
import {STORY_THEMES, groupStories} from './storyThemes.js';

export default function StoryCatalog({items, progress = {}, locale = 'es'}) {
  const [theme, setTheme] = useState('all');
  const en = locale === 'en';
  const groups = groupStories(items, theme);
  const matches = groups.reduce((n,g) => n + g.stories.length,0);
  const title = s => s.nombre || s.titulo;
  const path = s => s.path || `/es/historia/${s.slug}`;
  return <div className="story-themed-catalog">
    <div className="story-theme-filters" role="group" aria-label={en ? 'Story themes' : 'Temas de historias'}>
      {[{id:'all', es:'Todos los temas', en:'All themes'}, ...STORY_THEMES].map(t => <button key={t.id} type="button" aria-pressed={theme === t.id} disabled={t.id !== 'all' && !groupStories(items,t.id).length} onClick={() => setTheme(t.id)}>{en ? t.en : t.es}<small>{t.id === 'all' ? items.length : groupStories(items,t.id)[0]?.stories.length || 0}</small></button>)}
    </div>
    <p className="public-catalog-note" role="status">{matches} {matches === 1 ? en ? 'story matches these filters' : 'historia coincide con estos filtros' : en ? 'stories match these filters' : 'historias coinciden con estos filtros'}</p>
    {groups.map(g => <section className="story-catalog-section" key={g.id} aria-label={en ? g.en : g.es}>
      <h2>{en ? g.en : g.es}<small>{g.stories.length}</small></h2><p className="story-theme-description">{en ? g.descriptionEn : g.descriptionEs}</p>
      <div className="public-story-grid public-story-catalog">{g.stories.filter(s => s.disponible !== false).map(s => {
        const count = Array.isArray(s.pasos) ? s.pasos.length : s.pasos;
        const saved = progress[s.id], read = Math.min(saved?.read?.length || 0,count);
        const last = Number.isInteger(saved?.last) && saved.last > 0 && saved.last <= count ? saved.last : 1;
        return <article className="public-story-card" key={s.id}><span>{count} {en ? 'chapters' : 'capítulos'}{s.minutos ? ` · ${s.minutos} min` : ''}</span><h3>{title(s)}</h3><p>{s.subtitulo || s.description || s.descripcion}</p>
          {read > 0 && <div className="story-card-progress" aria-label={en ? `${read} of ${count} chapters visited` : `${read} de ${count} capítulos visitados`}><i style={{width:`${Math.round(read / count * 100)}%`}}/></div>}
          <a href={read > 0 && read < count ? `${path(s)}/${en ? 'chapter' : 'capitulo'}/${last}` : path(s)}>{read >= count ? en ? 'Read again' : 'Volver a leer' : read > 0 ? en ? `Continue with chapter ${last}` : `Continuar en el capítulo ${last}` : en ? 'Start reading' : 'Comenzar recorrido'}<ArrowRight size={13}/></a></article>;
      })}</div>
      {g.stories.some(s => s.disponible === false) && <div className="story-coming"><h3>{en ? 'In preparation' : 'En preparación'}</h3><ul className="story-coming-list">{g.stories.filter(s => s.disponible === false).map(s => <li key={s.id}><strong>{title(s)}</strong><span>{s.subtitulo || s.description || s.descripcion}</span></li>)}</ul></div>}
    </section>)}
    {!groups.length && <p className="public-muted">{en ? 'No stories match this theme and search.' : 'Ninguna historia coincide con este tema y búsqueda.'}</p>}
  </div>;
}
