import {ROYAL_COVERAGE_REVIEWS} from '../evidence/royalCoverageReviews.js';
// Keep the public bibliography connected to the same individual office
// reviews, including short reigns and regencies added during this audit.
const sources=new Map();
for(const [key,review] of Object.entries(ROYAL_COVERAGE_REVIEWS))for(const source of review.sources){
 const [,personId,,territory]=key.split(':');
 if(!sources.has(source.url))sources.set(source.url,{titulo:source.title,url:source.url,
  grupo:'Revisión de sucesiones regias',personas:[],territorios:[],nota:source.locator});
 const record=sources.get(source.url);
 if(!record.personas.includes(personId))record.personas.push(personId);
 if(!record.territorios.includes(territory))record.territorios.push(territory);
}
export const ROYAL_COVERAGE_SOURCES=[...sources.values()];
