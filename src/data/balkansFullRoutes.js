import review from './balkansFullRouteData.json' with {type: 'json'};
import {regionalReviewRoutes} from './regionalReviewRoutes.js';
const routes = regionalReviewRoutes(review);
export const BALKANS_FULL_IDENTITIES = routes.identities;
export const balkansFullJurisdictions = routes.jurisdictions;
export const balkansFullScope = routes.scope;
