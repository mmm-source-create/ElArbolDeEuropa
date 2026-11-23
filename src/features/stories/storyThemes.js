// Collections are optional and may overlap. They never classify the whole catalogue.
export const STORY_COLLECTIONS = [
  {id:'cruzadas', es:'Cruzadas', en:'Crusades'},
  {id:'cultura-popular', es:'Cultura Popular', en:'Popular Culture'},
  {id:'herencias-conflictivas', es:'Herencias conflictivas', en:'Contested Inheritances'},
  {id:'dinastias', es:'Dinastías', en:'Dynasties'},
  {id:'companias-libres', es:'Compañías libres', en:'Free Companies'},
];
const membership = {
  'herencias-conflictivas':['mohacs-caida-buda','habsburgo-capetos','iberia','ultimo-austria','estuardo-hannover','leonor-aquitania','visconti-sforza','borgona','dos-coronas-dos-hijas','corona-demasiado-grande','dos-rosas','reino-partido-dos','napoles-corona-disputada','federico-emperador-excomulgado','mindaugas-jogaila'],
  cruzadas:['balduino-saladino','sebastian-marruecos','lepanto-alianza','puertas-viena','constantinopla-dos-conquistas','ricardo-felipe-cruzada','federico-emperador-excomulgado'],
  // 6.1.2: guided stories of a whole house, from its rise to its end.
  dinastias:['anjou-hungria','jagellones-cracovia-buda','luxemburgo-casa-imperial','oldemburgo-dinamarca','paleologos-ultima-dinastia','romanov-rusia','saboya-alpes-corona','trastamara-montiel-reyes-catolicos','valois-francia','vasa-corona-baltico'],
  // 6.1.3: the free companies, from the Catalans in Byzantium to the condottieri of Milan.
  'companias-libres':['compania-catalana','grandes-companias','compania-blanca','condotieros'],
  'cultura-popular':['balduino-saladino','braveheart-detras-del-mito','dracula-detras-de-la-leyenda','gioconda','favoritos-maquiavelo'],
};
export function storyCollections(id) {
  return STORY_COLLECTIONS.filter(c => membership[c.id].includes(id)).map(c => c.id);
}
export function collectionGroups(items) {
  return STORY_COLLECTIONS.map(c => ({...c, stories:items.filter(s => (s.colecciones || storyCollections(s.id)).includes(c.id))}));
}

export function collectionLabels(story,locale='es') {
 const ids=story.colecciones || storyCollections(story.id);
 return STORY_COLLECTIONS.filter(c=>ids.includes(c.id)).map(c=>locale==='en'?c.en:c.es);
}
