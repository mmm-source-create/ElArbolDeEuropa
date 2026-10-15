import review from './earlyMedievalRouteData.json' with {type:'json'};
import {regionalReviewRoutes} from './regionalReviewRoutes.js';
const routes=regionalReviewRoutes(review);
export const EARLY_MEDIEVAL_IDENTITIES=routes.identities;
export function earlyMedievalJurisdictions(territory,year,personId){
 return routes.jurisdictions([],territory,year,personId);
}
