export const STORY_PROGRESS_KEY = 'eade.storyProgress.v1';
export function storyPath(slug, chapter = null) {
  return `/es/historia/${encodeURIComponent(slug)}${chapter ? `/capitulo/${chapter}` : ''}`;
}
export function normalizeStoryProgress(value, id, count) {
  // The two Barbarossa chapters precede Sicily in the expanded Third Crusade.
  const legacyCrusade = id === 'ricardo-felipe-cruzada' && count >= 8 && value?.revision !== 2;
  const legacyBurgundy = id === 'borgona' && count >= 17 && value?.revision !== 3;
  const valid = n => Number.isInteger(n) && n > 0 && n <= (legacyCrusade ? 6 : legacyBurgundy ? 11 : count);
  const chapter = n => legacyCrusade && n >= 2 ? n + 2 : legacyBurgundy && n >= 8 ? n + 6 : n;
  return {last:valid(value?.last) ? chapter(value.last) : 1,
    read:[...new Set(Array.isArray(value?.read) ? value.read.filter(valid).map(chapter) : [])]};
}
export function readStoryProgress(storage, id, count) {
  try { return normalizeStoryProgress(JSON.parse(storage.getItem(STORY_PROGRESS_KEY))?.[id], id, count); }
  catch { return { last: 1, read: [] }; }
}
export function saveStoryProgress(storage, id, count, chapter) {
  const progress = readStoryProgress(storage, id, count);
  if (!Number.isInteger(chapter) || chapter < 1 || chapter > count) return progress;
  const next = { last: chapter, read: [...new Set([...progress.read, chapter])],
    ...(id === 'ricardo-felipe-cruzada' && count >= 8 ? {revision:2} : id === 'borgona' && count >= 17 ? {revision:3} : {}) };
  try {
    let all; try { all = JSON.parse(storage.getItem(STORY_PROGRESS_KEY)); } catch { /* Recover corrupt storage. */ }
    storage.setItem(STORY_PROGRESS_KEY, JSON.stringify({ ...(all && typeof all === 'object' && !Array.isArray(all) ? all : {}), [id]: next }));
  } catch { /* Reading remains possible with storage disabled. */ }
  return next;
}
export function storyStepIds(story, chapter) {
  const step = story.pasos?.[chapter - 1];
  return [...new Set(step?.personas || [step?.persona])].filter(Boolean);
}
export function storyPeopleIds(story) {
  return [...new Set([...(story.protagonists || []).map(p => p.id), ...(story.pasos || []).flatMap((_, i) => storyStepIds(story, i + 1))])].filter(Boolean);
}
export function storyChapterPath(story, chapter = null, locale = 'es') {
  if (locale === 'en') {
    const base = story.storyPath || story.path?.replace(/\/chapter\/[1-9][0-9]*$/, '');
    return `${base}${chapter ? `/chapter/${chapter}` : ''}`;
  }
  return storyPath(story.slug, chapter);
}
export function storyAtlasUrl(story, chapter, locale = story.path?.startsWith('/en/') ? 'en' : 'es') {
  const step = story.pasos?.[chapter - 1];
  if (!step) return '/es/?atlas=1';
  const params = new URLSearchParams({ atlas: '1', vista: 'arbol', anio: String(step.anio), historia: story.id, paso: String(chapter), regreso: storyChapterPath(story, chapter, locale) });
  storyPeopleIds(story).forEach(id => params.append('seleccion', id));
  storyStepIds(story, chapter).forEach(id => params.append('resaltar', id));
  return `/es/?${params}`;
}
export function safeStoryReturn(search) {
  const path = new URLSearchParams(search).get('regreso');
  return /^(?:\/es\/historia\/[a-z0-9]+(?:-[a-z0-9]+)*\/capitulo|\/en\/story\/[a-z0-9]+(?:-[a-z0-9]+)*\/chapter)\/[1-9][0-9]*$/.test(path || '') ? path : null;
}

// Catalogue records deliberately omit the full chapter content. The Atlas resolves
// the story ID and chapter, including its year and people, on arrival.
export function catalogStoryAtlasUrl(story,chapter=1,locale='es') {
 const path=story.path || `/es/historia/${story.slug}`;
 const params=new URLSearchParams({atlas:'1',vista:'arbol',historia:story.id,paso:String(chapter),regreso:`${path}/${locale==='en'?'chapter':'capitulo'}/${chapter}`});
 return `/es/?${params}`;
}
