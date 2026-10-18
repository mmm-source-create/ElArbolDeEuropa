import review from '../../../data/cartography/bosnia-hum-review.json' with {type: 'json'};
import {regionalReviewRoutes} from './regionalReviewRoutes.js';
const routes = regionalReviewRoutes(review);
export const BOSNIA_HUM_IDENTITIES = routes.identities;
export const bosniaHumJurisdictions = routes.jurisdictions;
export const bosniaHumScope = routes.scope;
