import {useId, useRef, useState} from 'react';
import {ChevronDown} from 'lucide-react';
import {collectionGroups} from './storyThemes.js';

export default function StoryCollectionBrowser({items, locale = 'es', renderStories}) {
  const [view, setView] = useState('all');
  const [open, setOpen] = useState(null);
  const id = useId();
  const tabs = useRef([]);
  const en = locale === 'en';
  const views = [{id:'all', label:en ? 'All' : 'Todas'}, {id:'collections', label:en ? 'Collections' : 'Colecciones'}];
  function navigate(event, index) {
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : ['ArrowLeft','ArrowRight'].includes(event.key) ? 1 - index : null;
    if (next === null) return;
    event.preventDefault(); setView(views[next].id); tabs.current[next]?.focus();
  }
  return <div className="story-collection-browser">
    <div className="story-view-tabs" role="tablist" aria-label={en ? 'Browse stories' : 'Explorar historias'}>
      {views.map((v, i) => <button type="button" key={v.id} ref={node => {tabs.current[i] = node;}} id={`${id}-tab-${v.id}`} role="tab" aria-selected={view === v.id} aria-controls={`${id}-panel-${v.id}`} tabIndex={view === v.id ? 0 : -1} onClick={() => setView(v.id)} onKeyDown={e => navigate(e,i)}>{v.label}</button>)}
    </div>
    {views.map(v => <div key={v.id} role="tabpanel" id={`${id}-panel-${v.id}`} aria-labelledby={`${id}-tab-${v.id}`} hidden={view !== v.id} tabIndex={0}>
      {view === v.id && (v.id === 'all' ? renderStories(items) : <div className="story-collections">
        {collectionGroups(items).map(c => <article className={`public-story-card story-collection-card${open === c.id ? ' is-open' : ''}`} key={c.id}>
          <h2><button type="button" aria-expanded={open === c.id} aria-controls={`${id}-collection-${c.id}`} onClick={() => setOpen(open === c.id ? null : c.id)}><span>{en ? c.en : c.es}<small>{c.stories.length} {en ? c.stories.length === 1 ? 'story' : 'stories' : c.stories.length === 1 ? 'historia' : 'historias'}</small></span><ChevronDown size={20} aria-hidden="true"/></button></h2>
          <div id={`${id}-collection-${c.id}`} hidden={open !== c.id}>{open === c.id && (c.stories.length ? renderStories(c.stories) : <p>{en ? 'No stories in this collection are available in English yet.' : 'Todavía no hay historias en esta colección.'}</p>)}</div>
        </article>)}
      </div>)}
    </div>)}
  </div>;
}
