import review from './franceLowCountriesRouteData.json' with {type: 'json'};
import {regionalReviewRoutes} from './regionalReviewRoutes.js';
const routes = regionalReviewRoutes(review);
export const FRANCE_LOW_COUNTRIES_IDENTITIES = routes.identities;
export const franceLowCountriesJurisdictions = routes.jurisdictions;
export const franceLowCountriesScope = routes.scope;
