import review from '../../../data/cartography/german-swiss-expansion-review.json' with {type:'json'};
import {regionalReviewRoutes} from './regionalReviewRoutes.js';
const routes = regionalReviewRoutes(review);
export const GERMAN_SWISS_IDENTITIES = Object.freeze({...routes.identities,
  'Ducado de Schleswig':'Schleswig','Ducado de Holstein':'Holstein',
  'Núcleo de Brandeburgo':'Brandeburgo',
});
export const germanSwissJurisdictions = routes.jurisdictions;
export const germanSwissScope = routes.scope;
