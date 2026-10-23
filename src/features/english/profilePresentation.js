import {personClaims} from '../../evidence/claims.js';
export const profileLabel=(person,text)=>person?.englishLabels?.[text] || text;
export const profileNote=(person,text)=>person?.englishNotes?.[text] || text;
export const profileClaims=person=>person.localizedClaims || personClaims(person);
