import review from './middleEastRouteData.json' with {type:'json'};
import {regionalReviewRoutes} from './regionalReviewRoutes.js';
const routes=regionalReviewRoutes(review);
export const MIDDLE_EAST_IDENTITIES=routes.identities;
export const middleEastJurisdictions=routes.jurisdictions;
