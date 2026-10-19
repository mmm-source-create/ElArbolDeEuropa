import review from '../../data/cartography/german-swiss-expansion-review.json' with {type:'json'};
export const GERMAN_SWISS_SOURCES = Object.entries(review.sources).map(([key,source]) => ({
  titulo:source.title,url:source.url,grupo:['ghdi','ieg1792','imperial1512'].includes(key)?'Cartografía':'Archivos e instituciones',general:true,
  territorios:Object.entries(review.entities).filter(([,entity]) => entity.sourceKeys.includes(key)).map(([name]) => name),
  personas:[],nota:source.locator,
})).filter(source => source.territorios.length);
