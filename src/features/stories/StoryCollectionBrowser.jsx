import SegmentedControl from '../../ui/SegmentedControl.jsx';
import {useId, useState} from 'react';
import {ChevronDown} from 'lucide-react';
import {collectionGroups} from './storyThemes.js';

export default function StoryCollectionBrowser({items, locale = 'es', renderStories}) {
  const [view, setView] = useState('all');
  const [open, setOpen] = useState(null);
  const id = useId();
  const en = locale === 'en';
  const views = [{id:'all', label:en ? 'All' : 'Todas'}, {id:'collections', label:en ? 'Collections' : 'Colecciones'}];
  return <div className="story-collection-browser">
    <SegmentedControl className="story-view-tabs" id={id} tabs options={views.map(v=>({value:v.id,label:v.label}))} value={view} onChange={setView} label={en ? 'Browse stories' : 'Explorar historias'}/>
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
