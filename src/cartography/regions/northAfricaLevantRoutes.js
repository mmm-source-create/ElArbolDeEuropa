import review from './northAfricaLevantRouteData.json' with {type:'json'};
import {regionalReviewRoutes} from './regionalReviewRoutes.js';
const routes=regionalReviewRoutes(review);
export const NORTH_AFRICA_LEVANT_IDENTITIES=routes.identities;
export const northAfricaLevantJurisdictions=routes.jurisdictions;
