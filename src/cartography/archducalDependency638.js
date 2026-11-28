import {ARCHDUCAL_LINGEN_PHASE} from './archducalLingen638.js';
import review from './regions/franceLowCountriesRouteData.json' with {type:'json'};
// Only dated Habsburg-controlled phases: Northern rebel and French-held
// surfaces and the directly Spanish citadel of Cambrai are excluded.
const names = new Map(review.assignments.filter(p => p.from<=1621 && p.through>=1598
  && p.governmentTerritories.some(t=>['Países Bajos','Condado de Borgoña','Charolais'].includes(t))
  && !p.governmentTerritories.some(t=>['Provincias Unidas','República Bátava','Francia','Principado episcopal de Cambrai'].includes(t)))
  .map(p=>[p.name,p]));
export const archducalPhaseMatches=(name,year=null)=>{if(name===ARCHDUCAL_LINGEN_PHASE)return year===null||year>=1605&&year<=1621;const p=names.get(name);return Boolean(p&&(year===null||p.from<=year&&year<=p.through));};
export const ARCHDUCAL_DEPENDENCY_638=Object.freeze({
 id:'archducal-spanish-dependency',scope:'archducal-1598',subject:'Países Bajos',subjectLabel:'Países Bajos y Borgoña archiducales',
 subjectPeople:['ALB7AUST','ISABCLARAEUG'],overlord:'España',type:'dependencia',periods:[[1598,1621]],
 overlordOffices:[{territory:'Castilla',people:['FEL2ESP','FEL3ESP','FEL4ESP']}],
 note:'Alberto e Isabel ejercen la soberanía conjunta de los Países Bajos y Borgoña. La cesión limita la disposición de sus dominios; el rey de España conserva el mando y la financiación del Ejército de Flandes. Esta trama representa dependencia dinástica y militar.',
 sources:[
 {title:'Universiteit Leiden · Act of cession, 6 May 1598',url:'https://dutchrevolt.library.universiteitleiden.nl/nederlands/bronnen/dutch_bronnen_1598-05-06-a-fra/',locator:'Artículos 3–8: reversión, restricciones sobre la enajenación, matrimonios y comercio con las Indias.',locatorEn:'Articles 3–8: reversion and restrictions on alienation, marriages and trade with the Indies.'},
 {title:'Werner Thomas · The Spanish Faction at the court of Albert and Isabella',url:'https://tile.loc.gov/storage-services/master/gdc/gdcebookspublic/20/20/71/99/03/2020719903/2020719903.pdf',locator:'Páginas 206–207 y 210–211: ciudadelas y ejército bajo mando español; Alberto como capitán general del rey; financiación y mandos separados de su gobierno.',locatorEn:'Pages 206–207 and 210–211: citadels and army under Spanish command; Albert as the king’s captain general; finance and commanders separated from his government.'}
 ]
});
