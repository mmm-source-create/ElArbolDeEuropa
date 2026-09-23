import { TRANSLATED_STORIES } from '../english/routes.js';
import { slugPublico } from '../utils/personPresentation.js';
import { safeStoryReturn, storyPeopleIds, storyStepIds } from '../stories/storyModel.js';

const available = story => story?.disponible !== false && Array.isArray(story?.pasos) && story.pasos.length > 0;
const spanishSlug = story => TRANSLATED_STORIES.find(item => item.id === story.id)?.es
  || (story.slug && !story.path?.startsWith('/en/') ? story.slug : slugPublico(story.storyTitle || story.titulo || story.nombre || story.id));

function routeStory(pathname, stories) {
  const match = String(pathname || '').match(/^\/(?:es\/)?historia\/([a-z0-9]+(?:-[a-z0-9]+)*)(?:\/capitulo\/([1-9][0-9]*))?\/?$/);
  if (match) {
    const story = stories.find(item => available(item) && [spanishSlug(item), slugPublico(item.id)].includes(match[1]));
    return story ? { story, chapter: match[2], locale: 'es' } : null;
  }
  const english = String(pathname || '').match(/^\/en\/story\/([a-z0-9]+(?:-[a-z0-9]+)*)(?:\/chapter\/([1-9][0-9]*))?\/?$/);
  if (!english) return null;
  const translated = TRANSLATED_STORIES.find(item => item.en === english[1]);
  const story = stories.find(item => available(item) && item.id === translated?.id);
  return story ? { story, chapter: english[2], locale: 'en' } : null;
}

function chapterNumber(value, count) {
  if (!/^-?\d+$/.test(String(value ?? ''))) return 1;
  const number = Number(value);
  if (!Number.isFinite(number)) return number > 0 ? count : 1;
  return Math.max(1, Math.min(count, number));
}

function readingPath(story, chapter, locale) {
  const translation = locale === 'en' && TRANSLATED_STORIES.find(item => item.id === story.id);
  return translation
    ? `/en/story/${translation.en}/chapter/${chapter}`
    : `/es/historia/${spanishSlug(story)}/capitulo/${chapter}`;
}

/** Resolve new Atlas URLs and existing reading links without loading generated data.
 * Query chapters are one-based; the returned index is zero-based.
 * An explicit unknown story never falls back to an unrelated return link.
 */
export function resolveStoryNavigation(pathname, search, stories = []) {
  const params = new URLSearchParams(search);
  const pathStory = routeStory(pathname, stories);
  const returnStory = routeStory(safeStoryReturn(search), stories);
  const requestedId = params.get('historia');
  const story = params.has('historia')
    ? stories.find(item => available(item) && item.id === requestedId)
    : pathStory?.story || returnStory?.story;
  if (!story) return null;

  const matchingPath = pathStory?.story.id === story.id ? pathStory : null;
  const matchingReturn = returnStory?.story.id === story.id ? returnStory : null;
  const chapter = chapterNumber(params.has('paso') ? params.get('paso') : matchingPath?.chapter || matchingReturn?.chapter, story.pasos.length);
  const locale = matchingReturn?.locale || matchingPath?.locale || 'es';
  return {
    story,
    index: chapter - 1,
    returnPath: readingPath(story, chapter, locale),
    ids: storyPeopleIds(story),
    highlightIds: storyStepIds(story, chapter),
  };
}

/** Keep the complete story selection stable while the current chapter changes.
 * Mutates and returns URL. A selected person already in the story is preserved;
 * callers may set/delete `persona` before calling when moving to a new chapter.
 */
export function writeStoryNavigation(url, story, index, returnPath = null, ids = storyPeopleIds(story)) {
  if (!available(story)) return url;
  const chapter = chapterNumber(Number.isInteger(index) ? index + 1 : 1, story.pasos.length);
  const safeReturn = safeStoryReturn(new URLSearchParams({ regreso: returnPath || '' }));
  const returnedStory = routeStory(safeReturn, [story]);
  const locale = returnedStory?.story.id === story.id ? returnedStory.locale : 'es';
  const selectedIds = [...new Set(ids)].filter(id => typeof id === 'string' && id);
  const stepIds = storyStepIds(story, chapter);
  const selectedPerson = url.searchParams.get('persona');

  url.pathname = '/es/';
  url.hash = '';
  for (const key of ['familia', 'arbol', 'continuar', 'seleccion', 'resaltar', 'conectar', 'vinculos']) url.searchParams.delete(key);
  url.searchParams.set('atlas', '1');
  url.searchParams.set('historia', story.id);
  url.searchParams.set('paso', String(chapter));
  url.searchParams.set('regreso', readingPath(story, chapter, locale));
  selectedIds.forEach(id => url.searchParams.append('seleccion', id));
  // Preserve an intentionally empty scope instead of falling back to the full tree.
  if (!selectedIds.length) url.searchParams.set('seleccion', '');
  stepIds.forEach(id => url.searchParams.append('resaltar', id));
  if (Number.isFinite(story.pasos[chapter - 1].anio)) url.searchParams.set('anio', String(story.pasos[chapter - 1].anio));
  else url.searchParams.delete('anio');
  if (selectedIds.includes(selectedPerson)) url.searchParams.set('persona', selectedPerson);
  else {
    const primary = stepIds.find(id => selectedIds.includes(id));
    if (primary) url.searchParams.set('persona', primary);
    else url.searchParams.delete('persona');
  }
  return url;
}
