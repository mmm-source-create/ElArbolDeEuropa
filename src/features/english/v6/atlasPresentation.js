import profilesRuntime from '../../../generated/englishProfilesRuntime.json' with {type:'json'};
import {PROFILE_LABELS,PROFILE_NOTES} from '../profileVocabulary.js';

const SPANISH_DISPLAY=Symbol.for('eade.spanish-display');

export function englishLabel(value) {
  return value == null ? value : PROFILE_LABELS[value] || value;
}

export function englishNote(value) {
  return value == null ? value : PROFILE_NOTES[value] || value;
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
    person.aliases=[...new Set([...(profile.aliases||[]),...(person.aliases||[]),person[SPANISH_DISPLAY].nombre].filter(Boolean))];
    person.nombreEn=profile.name;
    person.role=profile.role || englishLabel(person.titulo);
    person.summary=profile.summary;
    person.englishLabels=PROFILE_LABELS;
    person.englishNotes={...PROFILE_NOTES,...(profile.governmentNotes||{})};
  }
  return people;
}
