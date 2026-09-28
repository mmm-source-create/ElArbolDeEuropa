// A small, shared index for the Atlas search. Results retain their entity type,
// so the user can tell whether an action opens a record or changes the year.
export function atlasSearch(query, { people, dynasties, territories, stories, events, normalize }, limit = 5) {
  const term = normalize(query || '');
  if (!term) return { people: [], dynasties: [], territories: [], stories: [], events: [], total: 0 };
  const rank = (value) => {
    const text = normalize(value || '');
    if (text === term) return 0;
    if (text.startsWith(term)) return 1;
    return text.includes(term) ? 2 : Infinity;
  };
  const pick = (items, label, extra = () => '') => items
    .map(item => ({ item, score: Math.min(rank(label(item)), 4 + rank(extra(item))) }))
    .filter(result => Number.isFinite(result.score))
    .sort((a, b) => a.score - b.score || label(a.item).localeCompare(label(b.item), 'es'));
  const matches = {
    people: pick(people, item => item.nombre, item => [item.aliases?.join(' '), item.titulo, item.dinastia, item.reinos?.join(' ')].filter(Boolean).join(' ')),
    dynasties: pick(dynasties, item => item),
    territories: pick(territories, item => item),
    stories: pick(stories.filter(item => item.disponible), item => item.titulo, item => item.subtitulo),
    events: pick(events, item => item.titulo, item => item.descripcion),
  };
  return {
    ...Object.fromEntries(Object.entries(matches).map(([kind, items]) => [kind, items.slice(0, limit).map(result => result.item)])),
    total: Object.values(matches).reduce((count, items) => count + items.length, 0),
  };
}
