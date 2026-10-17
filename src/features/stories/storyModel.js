export const STORY_PROGRESS_KEY = 'eade.storyProgress.v1';
export function storyPath(slug, chapter = null) {
  return `/es/historia/${encodeURIComponent(slug)}${chapter ? `/capitulo/${chapter}` : ''}`;
}
export function readStoryProgress(storage, id, count) {
  try {
    const value = JSON.parse(storage.getItem(STORY_PROGRESS_KEY))?.[id];
    return { last: Number.isInteger(value?.last) && value.last > 0 && value.last <= count ? value.last : 1,
      read: [...new Set(Array.isArray(value?.read) ? value.read.filter(n => Number.isInteger(n) && n > 0 && n <= count) : [])] };
  } catch { return { last: 1, read: [] }; }
}
export function saveStoryProgress(storage, id, count, chapter) {
  const progress = readStoryProgress(storage, id, count);
  if (!Number.isInteger(chapter) || chapter < 1 || chapter > count) return progress;
  const next = { last: chapter, read: [...new Set([...progress.read, chapter])] };
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
