import {GRUPOS_DINASTICOS_GENEALOGICOS} from '../../domain/genealogy/dynasties.js';

// Navigation follows the project's explicit genealogical taxonomy. Regional
// folders are deliberately excluded. More specific parents override the root.
const parents={};
for(const [root,houses] of Object.entries(GRUPOS_DINASTICOS_GENEALOGICOS))
  for(const house of houses)if(house!==root)parents[house]=[root==='Ivrea'?'Ivrea-Borgoña':root];
Object.assign(parents,{
  'Borbón-Orleans-Gastón':['Borbón'],
  'Borbón-Condé':['Borbón'],'Borbón-Orleans':['Borbón'],'Borbón-Parma':['Borbón'],
  'Valois-Alençon':['Valois'],'Valois-Anjou':['Valois'],'Valois-Angulema':['Valois-Orleans'],'Valois-Borgoña':['Valois'],'Valois-Orleans':['Valois'],
  'Anjou-Durazzo':['Anjou'],'Anjou-Hungría':['Anjou'],'Anjou-Tarento':['Anjou'],
  'Saboya-Carignano':['Saboya'],'Saboya-Nemours':['Saboya'],
  'Hannover':['Welf'],'Holstein-Gottorp':['Oldemburgo'],
  'Montfort-Bretaña':['Dreux'],'Borgoña-Portugal':['Borgoña'],
  'Plantagenet':['Anjou-Gâtinais'],
  // The double name records a marriage and descent from two houses.
  'Habsburgo-Lorena':['Habsburgo','Lorena'],
});
delete parents['Ivrea-Borgoña'];
// The sole Clermont member belongs to Clermont-Lodève, not to the capetian
// counts of Clermont: a matching territorial name is not a cadet relationship.
delete parents.Clermont;
export const HOUSE_PARENTS=Object.freeze(parents);
