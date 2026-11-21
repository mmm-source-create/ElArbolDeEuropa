// 6.0.13: dated routes of the North Atlantic review (Ireland, Wales, Man,
// Iceland, Gotland, Finland, Lapland, Kola and Greenland).
import review from './northAtlanticRouteData.json' with {type:'json'};
import {regionalReviewRoutes} from './regionalReviewRoutes.js';
const routes=regionalReviewRoutes(review);
export const NORTH_ATLANTIC_IDENTITIES=routes.identities;
export const northAtlanticJurisdictions=routes.jurisdictions;
