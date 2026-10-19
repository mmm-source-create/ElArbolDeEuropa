import review from '../../data/cartography/germany-completion-review.json' with {type:'json'};
export const GERMANY_COMPLETION_SOURCES = Object.entries(review.sources).map(([key,source]) => ({
  titulo:source.title,url:source.url,grupo:/Atlas|^ieg|^ghdi/.test(key)?'Cartografía':'Archivos e instituciones',general:true,
  territorios:Object.entries(review.entities).filter(([,entity]) => entity.sourceKeys.includes(key)).map(([name]) => name),
  personas:[],nota:source.locator,
})).filter(source => source.territorios.length);
