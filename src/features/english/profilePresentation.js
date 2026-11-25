import {CLAIM_TEXTS_621} from './claimTexts621.js';
import {slugPublico} from '../../domain/people/personLabels.js';
import {translatedEquivalent} from './routes.js';
export const profileLabel=(person,text)=>person?.englishLabels?.[text] || text;
// 6.0.21: hand translations take precedence on English pages.
export const profileNote=(person,text)=>person?.englishNotes ? CLAIM_TEXTS_621[text] || person.englishNotes[text] || text : text;
// 6.3.2: a public record carries its claims in its own data; the Atlas passes
// the claims it computes. This module no longer loads the evidence system.
export const profileClaims=person=>person.localizedClaims || person.localizeClaims?.() || person.claims || [];

export const profileEntityPath=(kind,key,locale='es')=>{const path=`/es/${kind}/${slugPublico(key)}`;return locale==='en'?translatedEquivalent(path,'en')||path:path;};
