// Collections are optional and may overlap. They never classify the whole catalogue.
export const STORY_COLLECTIONS = [
  {id:'cruzadas', es:'Cruzadas', en:'Crusades'},
  {id:'cultura-popular', es:'Cultura Popular', en:'Popular Culture'},
  {id:'herencias-conflictivas', es:'Herencias conflictivas', en:'Contested Inheritances'},
];
const membership = {
  'herencias-conflictivas':['borgona','dos-coronas-dos-hijas','corona-demasiado-grande'],
  cruzadas:['balduino-saladino','sebastian-marruecos','lepanto-alianza','puertas-viena','constantinopla-dos-conquistas','ricardo-felipe-cruzada'],
  'cultura-popular':['balduino-saladino','braveheart-detras-del-mito','dracula-detras-de-la-leyenda','gioconda','favoritos-maquiavelo'],
};
export function storyCollections(id) {
  return STORY_COLLECTIONS.filter(c => membership[c.id].includes(id)).map(c => c.id);
}
export function collectionGroups(items) {
  return STORY_COLLECTIONS.map(c => ({...c, stories:items.filter(s => (s.colecciones || storyCollections(s.id)).includes(c.id))}));
}
