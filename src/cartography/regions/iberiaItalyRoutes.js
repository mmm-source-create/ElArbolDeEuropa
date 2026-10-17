import review from './iberiaItalyRouteData.json' with {type: 'json'};
import {regionalReviewRoutes} from './regionalReviewRoutes.js';
const routes = regionalReviewRoutes(review);
export const IBERIA_ITALY_IDENTITIES = routes.identities;
export const iberiaItalyJurisdictions = routes.jurisdictions;
export const iberiaItalyScope = routes.scope;
