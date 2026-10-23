import {slugPublico} from '../../domain/people/personLabels.js';
import {translatedEquivalent} from './routes.js';
import {personClaims} from '../../evidence/claims.js';
export const profileLabel=(person,text)=>person?.englishLabels?.[text] || text;
export const profileNote=(person,text)=>person?.englishNotes?.[text] || text;
export const profileClaims=person=>person.localizedClaims || personClaims(person);

export const profileEntityPath=(kind,key,locale='es')=>{const path=`/es/${kind}/${slugPublico(key)}`;return locale==='en'?translatedEquivalent(path,'en')||path:path;};
