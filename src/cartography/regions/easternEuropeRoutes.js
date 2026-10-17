import review from './easternEuropeRouteData.json' with {type:'json'};
import {regionalReviewRoutes} from './regionalReviewRoutes.js';
const routes=regionalReviewRoutes(review);
export const EASTERN_EUROPE_IDENTITIES=routes.identities;
export function easternEuropeJurisdictions(names,territory,year,personId){
  return routes.jurisdictions(names,territory==='Principado de Trakai'?'Lituania':territory,year,personId);
}
export function easternEuropeScope(personId,territory,year){
  const scope=routes.scope(personId,territory,year);
  return scope?{...scope,coverageIds:review.personalCoverageIds}:null;
}
