// One primary theme per story: counts and reading progress never duplicate a journey.
export const STORY_THEMES = [
  {id:'cruzadas', es:'Cruzadas', en:'Crusades', descriptionEs:'Del reino de Jerusalén a las campañas del Mediterráneo y Europa central. Lepanto, Marruecos y Viena pertenecen a contextos posteriores a las cruzadas medievales.', descriptionEn:'From the kingdom of Jerusalem to campaigns in the Mediterranean and central Europe. Lepanto, Morocco and Vienna belong to later settings than the medieval crusades.'},
  {id:'cultura-popular', es:'Cultura popular', en:'Popular culture', descriptionEs:'Cine, literatura y obras célebres: qué sabemos, qué se inventó y cómo nació el mito.', descriptionEn:'Film, literature and famous works: what the evidence supports, what was invented and how the myth emerged.'},
  {id:'dinastias-poder', es:'Dinastías y poder', en:'Dynasties and power', descriptionEs:'Herencias, matrimonios, guerras y coronas que cambiaron el mapa.', descriptionEn:'Inheritances, marriages, wars and crowns that changed the map.'},
  {id:'renacimiento-reformas', es:'Renacimiento y reformas', en:'Renaissance and reform', descriptionEs:'Cortes italianas, papado y conflictos religiosos de la Europa moderna.', descriptionEn:'Italian courts, the papacy and the religious conflicts of early modern Europe.'},
];
const membership = {
  cruzadas:['balduino-saladino','sebastian-marruecos','lepanto-alianza','puertas-viena','constantinopla-dos-conquistas','ricardo-felipe-cruzada'],
  'cultura-popular':['reino-de-los-cielos','braveheart-detras-del-mito','dracula-detras-de-la-leyenda','gioconda','favoritos-maquiavelo'],
  'renacimiento-reformas':['papales','condotieros','revolucion-protestante','corona-dos-credos','guerras-italianas','visconti-sforza'],
};
export function storyThemeId(id) {
  return Object.keys(membership).find(theme => membership[theme].includes(id)) || 'dinastias-poder';
}
export function storyTheme(id) { return STORY_THEMES.find(theme => theme.id === id); }
export function groupStories(items, theme = 'all') {
  return STORY_THEMES.filter(t => theme === 'all' || t.id === theme)
    .map(t => ({...t, stories:items.filter(s => (s.tema || storyThemeId(s.id)) === t.id)}))
    .filter(t => t.stories.length);
}
