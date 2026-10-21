import {DYNASTY_MAP_REVIEWS} from '../evidence/dynastyMapReviews.js';
const sources=new Map();
for(const [key,review] of Object.entries(DYNASTY_MAP_REVIEWS))for(const source of review.sources){
  const [,personId,field,territory]=key.split(':');
  if(!sources.has(source.url))sources.set(source.url,{titulo:source.title,url:source.url,grupo:'Casas y gobiernos revisados',personas:[],territorios:[],nota:source.locator});
  const record=sources.get(source.url);
  if(!record.personas.includes(personId))record.personas.push(personId);
  if(field==='government'&&!record.territorios.includes(territory))record.territorios.push(territory);
}
for(const [titulo,url] of [
  ['Deutsche Biographie · Askanier','https://www.deutsche-biographie.de/sfz1446.html'],
  ['Deutsche Biographie · Askanier, anhaltinische Linie','https://www.deutsche-biographie.de/sfz130929.html'],
  ['Deutsche Biographie · Askanier, sachsen-lauenburgische Linie','https://www.deutsche-biographie.de/sfz130931.html'],
  ['Deutsche Biographie · Askanier, sachsen-wittenbergische Linie','https://www.deutsche-biographie.de/sfz130932.html'],
  ['National Army Museum · Seven Years War','https://www.nam.ac.uk/explore/seven-years-war'],
  ['Wydawnictwo Sejmowe · Union of Lublin 1569','https://wydawnictwo.sejm.gov.pl/publikacja/union-of-lublin-1569/'],
])sources.set(url,{titulo,url,grupo:'Casas y gobiernos revisados',personas:[],territorios:[],nota:'Contexto de las ramas familiares o del criterio de dirección política exterior.'});
export const DYNASTY_MAP_SOURCES=[...sources.values()];
