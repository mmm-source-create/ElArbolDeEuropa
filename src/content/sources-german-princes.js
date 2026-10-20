import {GERMAN_PRINCES_REVIEWS} from '../evidence/germanPrincesReviews.js';
// Each biographical article cited by the reviewed princes enters the public
// bibliography once, with the people and territories whose claims cite it.
const sources=new Map();
for(const [key,review] of Object.entries(GERMAN_PRINCES_REVIEWS))for(const source of review.sources){
 const [,personId,field,territory]=key.split(':');
 if(!sources.has(source.url))sources.set(source.url,{titulo:source.title,url:source.url,
  grupo:'Artículos de repertorios',personas:[],territorios:[],nota:source.locator});
 const record=sources.get(source.url);
 if(!record.personas.includes(personId))record.personas.push(personId);
 if(field==='government'&&!record.territorios.includes(territory))record.territorios.push(territory);
}
export const GERMAN_PRINCES_SOURCES=[...sources.values()];
