import review from '../../../data/cartography/germany-completion-review.json' with {type:'json'};
import {regionalReviewRoutes} from './regionalReviewRoutes.js';
const routes = regionalReviewRoutes(review);
export const GERMANY_COMPLETION_IDENTITIES = routes.identities;
export const germanyCompletionJurisdictions = routes.jurisdictions;
