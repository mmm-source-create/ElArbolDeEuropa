import {normalizarBusquedaPublica} from './personLabels.js';

// These are identifiers in their own right, not a licence to put any new
// nickname in a heading. Additions require an editorial explanation here.
export const HISTORICAL_NAME_EXCEPTIONS = Object.freeze({
 CARLOS5:'The conventional imperial name; Charles I is retained among his offices and aliases.',
 MAXIM1:'The conventional imperial name; the role supplies the Holy Roman context.',
 MAXIM2:'The conventional imperial name, rather than selecting one of his several royal crowns.',
 MATIAS1HUN:'Corvinus is the established historiographical byname.',
 CARLOS3NAP:'Durazzo identifies one ruler with different regnal numbers in Naples and Hungary.',
 JUANSINTIERRA:'English normally uses John without a regnal number; Spanish retains Juan I.',
 EDUV1:'The established names Eduviges de Polonia and Jadwiga of Poland omit a numeral; the former saintly style and numeral remain an alias.',
 ENRIQUEJOVEN:'The Young King distinguishes the crowned son from his father Henry II.',
 ESTENSTUREVIEJO:'The Elder distinguishes two regents who have no regnal number.',
 ESTENSTUREJOVEN:'The Younger distinguishes two regents who have no regnal number.',
 WILLIAMYOUNGERBRUN:'The Younger is an established identifier within the ducal genealogy.',
 MARTINJOVENSIC:'The Younger distinguishes the Sicilian king from his father Martin of Aragon.',
 MIHAIBRAVE:'The traditional Spanish form identifies Michael the Brave without inventing a number.',
 PETRUTANAR:'The Younger distinguishes the Wallachian ruler without inventing a number.',
 PETRUSCHIOPUL:'The Lame distinguishes the Moldavian ruler without inventing a number.',
 MIHNEACELRAU:'The Bad is an established identifying byname in the Wallachian series.',
 VLAD5TANAR:'The Younger is the recorded identifying form of this Wallachian ruler.',
 VLADINECATUL:'The Drowned distinguishes the Wallachian ruler without inventing a number.',
 PATRASCUCELBUN:'The Good distinguishes the Wallachian ruler without inventing a number.',
 MIHNEATURCITUL:'The Turk is the recorded identifying byname in the Wallachian series.',
 STEFANSURDUL:'The Deaf distinguishes the Wallachian ruler without inventing a number.',
 ALEXANDRUCELRAU:'The Bad distinguishes the Wallachian ruler without inventing a number.',
 IANCUSASUL:'The Saxon is an established identifying byname in the Moldavian series.',
});

export function displayedNickname(person) {
 const nickname=person?.sobrenombre||'';
 return nickname&&normalizarBusquedaPublica(person.nombre).includes(normalizarBusquedaPublica(nickname))?'':nickname;
}

export function nameReviewIssues(person) {
 const issues=[];
 if(!person.nombre?.trim()||person.nombre!==person.nombre.trim())issues.push('empty-or-untrimmed-name');
 if(/^(?:San|Santa|Santo) /.test(person.nombre))issues.push('saint-style-in-heading');
 // Ottoman sultans have conventional single regnal names; emperors are checked
 // against explicit exceptions instead of being assigned an arbitrary kingdom.
 if(/^[\p{L}’'-]+(?: [\p{L}’'-]+)? [IVXLCDM]+$/u.test(person.nombre)
   &&person.gobiernos?.some(g=>['Rey','Reina','Zar'].includes(g.titulo))
   &&!HISTORICAL_NAME_EXCEPTIONS[person.id])issues.push('royal-name-without-context');
 if(person.sobrenombre&&!displayedNickname(person)&&!HISTORICAL_NAME_EXCEPTIONS[person.id])issues.push('nickname-repeated-in-name');
 return issues;
}
