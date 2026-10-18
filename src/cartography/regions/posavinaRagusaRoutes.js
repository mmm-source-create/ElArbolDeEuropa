import review from '../../../data/cartography/posavina-ragusa-review.json' with {type: 'json'};
import {regionalReviewRoutes} from './regionalReviewRoutes.js';
const routes = regionalReviewRoutes(review);
export const POSAVINA_RAGUSA_IDENTITIES = routes.identities;
export const posavinaRagusaJurisdictions = routes.jurisdictions;
export const posavinaRagusaScope = routes.scope;
