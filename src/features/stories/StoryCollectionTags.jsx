import {collectionLabels} from './storyThemes.js';
export default function StoryCollectionTags({story,locale='es'}) {
 const labels=collectionLabels(story,locale);
 return labels.length ? <div className="story-collection-tags" aria-label={locale==='en'?'Collections':'Colecciones'}>{labels.map(label=><span key={label}>{label}</span>)}</div> : null;
}
