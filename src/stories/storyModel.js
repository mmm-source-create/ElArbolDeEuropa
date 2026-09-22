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
export function storyAtlasUrl(story, chapter) {
  const step = story.pasos[chapter - 1];
  const params = new URLSearchParams({ atlas: '1', vista: 'arbol', anio: String(step.anio), regreso: storyPath(story.slug, chapter) });
  [...new Set(step.personas || [step.persona])].filter(Boolean).forEach(id => params.append('seleccion', id));
  return `/es/?${params}`;
}
export function safeStoryReturn(search) {
  const path = new URLSearchParams(search).get('regreso');
  return /^\/es\/historia\/[a-z0-9]+(?:-[a-z0-9]+)*\/capitulo\/[1-9][0-9]*$/.test(path || '') ? path : null;
}
