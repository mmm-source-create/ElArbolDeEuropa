import {englishNameText} from '../nameCorrections.js';
import {personClaims} from '../../../evidence/claims.js';
import {englishSourceTitle} from '../v535Vocabulary.js';
import profilesRuntime from '../../../generated/englishProfilesRuntime.json' with {type:'json'};
import {PROFILE_LABELS,PROFILE_NOTES,translatedProfileText} from '../profileVocabulary.js';

const claimsCache=new WeakMap();
function localizeClaims() {
 if(!claimsCache.has(this))claimsCache.set(this,personClaims(this).map(claim=>({...claim,note:this.englishNotes[claim.note]||translatedProfileText(claim.note,undefined,claim),alternatives:(claim.alternatives||[]).map(text=>this.englishNotes[text]||translatedProfileText(text,undefined,claim)),sources:claim.sources.map(source=>({...source,title:englishSourceTitle(source.title),locator:translatedProfileText(source.locator,undefined,claim)}))})));
 return claimsCache.get(this);
}
const SPANISH_DISPLAY=Symbol.for('eade.spanish-display');

export function englishLabel(value) {
  return value == null ? value : PROFILE_LABELS[value] || value;
}

export function englishNote(value) {
  return value == null ? value : englishNameText(PROFILE_NOTES[value] || PROFILE_LABELS[value] || value);
}

export function englishProfileFor(id) {
  return profilesRuntime.profiles[id] || null;
}

// The historical model keeps its IDs, relationship keys, dates and government
// records. Only person-facing name fields are changed for the English runtime.
// A page reload is used for locale changes, so Spanish state never receives
// these presentation values.
export function applyEnglishPersonPresentation(people) {
  for (const person of people || []) {
    if (person[SPANISH_DISPLAY]) continue;
    const profile=englishProfileFor(person.id);
    if (!profile) continue;
    Object.defineProperty(person,SPANISH_DISPLAY,{value:{nombre:person.nombre,sobrenombre:person.sobrenombre,aliases:person.aliases},enumerable:false});
    person.nombre=profile.name;
    person.sobrenombre=profile.nickname || '';
    person.searchAliases=[...(person.aliases||[]),person[SPANISH_DISPLAY].nombre];
    person.aliases=[...new Set((profile.aliases||[]).filter(Boolean))];
    person.nombreEn=profile.name;
    person.localizeClaims=localizeClaims;
    person.role=profile.role || englishLabel(person.titulo);
    person.summary=profile.summary;
    person.englishLabels=PROFILE_LABELS;
    person.englishNotes=profile.governmentNotes && Object.keys(profile.governmentNotes).length ? Object.assign(Object.create(PROFILE_NOTES),profile.governmentNotes) : PROFILE_NOTES;
  }
  return people;
}
