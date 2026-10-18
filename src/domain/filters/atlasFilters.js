import {TERRITORIOS_SUB, TERRITORIOS_DESTACADOS, subterritoriosDeFiltro} from './territoryFilters.js';
import {GRUPOS_DINASTICOS, GRUPOS_DINASTICOS_REGIONALES, DINASTIAS_DESTACADAS, OTRAS_DINASTIAS} from '../genealogy/dynasties.js';
import {territoriosDe,gobiernosDe} from '../genealogy/personAccessors.js';
import {FILTER_REGIONS,TERRITORY_REGION} from './filterRegions.js';
import {gobiernoEfectivo} from '../../data/territorios.js';

const alphabetical=(a,b)=>a.localeCompare(b,'es',{sensitivity:'base'});
const DYNASTY_CHILDREN={
 Capeto:['Borgoña','Anjou','Artois','Borbón','Clermont','Courtenay','Dreux','Évreux','Valois'],
 Borbón:['Borbón-Condé','Borbón-Orleans','Borbón-Parma'],
 Valois:['Valois-Alençon','Valois-Angulema','Valois-Borgoña','Valois-Orleans'],
 Anjou:['Anjou-Durazzo','Anjou-Hungría','Anjou-Tarento'],
};
export const TERRITORIAL_FOLDER_LABELS=new Set(['Balcanes','Borgoña y Países Bajos','Borgoña y Franco Condado','Países Bajos y Flandes','Incorporaciones del siglo XVI','Estados Italianos','Escandinavia','Georgia y Cáucaso','Bizancio y Oriente latino','Polonia-Lituania']);

export function atlasFilterOptions(people) {
 const used=new Set(people.flatMap(territoriosDe));
 const hasTerritory=name=>used.has(name)||subterritoriosDeFiltro(name).some(n=>used.has(n))||name==='Provincias Unidas';
 const childNames=new Set(Object.values(TERRITORIOS_SUB).flat());
 const roots=[...new Set([...TERRITORIOS_DESTACADOS,...Object.keys(TERRITORIOS_SUB),...used])]
  .filter(n=>hasTerritory(n)&&(!childNames.has(n)||TERRITORIOS_DESTACADOS.includes(n))).sort(alphabetical);
 const subs=Object.fromEntries(Object.entries(TERRITORIOS_SUB).map(([n,children])=>[n,[...new Set(children)].filter(hasTerritory).sort(alphabetical)]));
 const houses=new Set(people.map(p=>p.dinastia).filter(Boolean));
 const counts=new Map();for(const p of people)counts.set(p.dinastia,(counts.get(p.dinastia)||0)+1);
 const represented=new Set(Object.entries(GRUPOS_DINASTICOS).filter(([n])=>DINASTIAS_DESTACADAS.includes(n)).flatMap(([,members])=>members));
 const main=[...new Set([...DINASTIAS_DESTACADAS,...houses].filter(n=>houses.has(n)||(GRUPOS_DINASTICOS[n]||[]).some(c=>houses.has(c))))]
  .filter(n=>DINASTIAS_DESTACADAS.includes(n)||!represented.has(n)&&(counts.get(n)||0)>=5).sort(alphabetical);
 const branchOptions={};
 for(const n of main) {
  const raw=DYNASTY_CHILDREN[n]||GRUPOS_DINASTICOS[n]||[];
  branchOptions[n]=raw.filter(c=>c!==n&&(houses.has(c)||(GRUPOS_DINASTICOS[c]||[]).some(r=>houses.has(r)))).sort(alphabetical);
 }
 for(const [n,raw]of Object.entries(DYNASTY_CHILDREN))branchOptions[n]=raw.filter(c=>houses.has(c)||(GRUPOS_DINASTICOS[c]||[]).some(r=>houses.has(r))).sort(alphabetical);
 const covered=new Set(main.flatMap(n=>GRUPOS_DINASTICOS[n]||[n]));
 const other=[...houses].filter(n=>!covered.has(n)).sort(alphabetical);
 if(other.length){main.push(OTRAS_DINASTIAS);branchOptions[OTRAS_DINASTIAS]=other;}
 return {territorios:roots,subsPorTerritorio:subs,dinastias:main,ramasPorPrincipal:branchOptions,otrasDinastias:new Set(other),
  dynastyFamilies:main.filter(n=>!Object.hasOwn(GRUPOS_DINASTICOS_REGIONALES,n)&&n!==OTRAS_DINASTIAS),
  dynastyFolders:main.filter(n=>Object.hasOwn(GRUPOS_DINASTICOS_REGIONALES,n)||n===OTRAS_DINASTIAS)};
}

// Provincial offices belong to the Republic without giving the office-holder
// sovereignty over every province. Habsburg governors are excluded by scope.
export function isRepublicanOffice(person,mandate,year=null) {
 return (year==null||year>=1588)&&mandate.territorio==='Países Bajos'&&(/estat[uú]der/i.test(mandate.titulo)||mandate.clase==='estatuderato'||/regencia del cargo hereditario/i.test(mandate.nota||''))
  &&(year==null||(mandate.desde<=year&&year<=mandate.hasta));
}
export function personMatchesTerritory(person,filter,year=null,governmentsOnly=false) {
 if(filter==='Provincias Unidas')return gobiernosDe(person).some(g=>isRepublicanOffice(person,g,year));
 const values=governmentsOnly?gobiernosDe(person).filter(g=>gobiernoEfectivo(g)&&(year==null||g.desde<=year&&year<=g.hasta)).map(g=>g.territorio):territoriosDe(person);
 return values.some(n=>{if(governmentsOnly&&year!=null&&filter==='Hungría'&&(n==='Transilvania habsbúrgica'||n==='Transilvania'&&year>1540||n==='Banato de Temes'&&year<1779))return false;return n===filter||subterritoriosDeFiltro(filter).includes(n);});
}

// V5.21 · Territories and dynasties share one geographic ordering in the
// filters. It only arranges the list; filter values and matching are unchanged.
// Reviewed exceptions: Imperial Italy and the Low Countries would otherwise vote
// for the Empire, and Polish houses for Central Europe.
const HOUSE_REGION={'Gonzaga':4,'Saboya':4,'Saboya-Carignano':4,'Saluzzo':4,'Sforza':4,'Visconti':4,'Aleramici':4,'Pignatelli':4,'Brabante':1,'Dampierre':1,'Baux':1,'Jagellón':6,'Piast':6,'Sin casa identificada':9,'Otras dinastías':9};
const FOLDER_REGION={'Casas ibéricas':0,'Casas francesas':1,'Casas británicas':2,'Casas irlandesas':2,'Casas germánicas':3,'Casas italianas':4,'Casas escandinavas':5,'Casas orientales':7};
let parentIndex=null;
function rootTerritory(name){
 if(!parentIndex){parentIndex=new Map();for(const [root,children] of Object.entries(TERRITORIOS_SUB))for(const child of children)if(!parentIndex.has(child))parentIndex.set(child,root);}
 const seen=new Set();let current=name;
 while(!Object.hasOwn(TERRITORY_REGION,current)&&parentIndex.has(current)&&!seen.has(current)){seen.add(current);current=parentIndex.get(current);}
 return current;
}
export function territoryRegion(name){
 const index=TERRITORY_REGION[rootTerritory(name)];
 return FILTER_REGIONS[index ?? FILTER_REGIONS.length-1];
}
// A house belongs to the region where most of its members held or were linked to territories.
export function dynastyRegions(people,houses){
 const votes=new Map();
 for(const person of people){
  if(!person.dinastia)continue;
  for(const name of territoriosDe(person)){const region=territoryRegion(name);if(region==='Otros')continue;
   const tally=votes.get(person.dinastia)||new Map();tally.set(region,(tally.get(region)||0)+1);votes.set(person.dinastia,tally);}
 }
 const regionOfHouse=name=>{
  if(Object.hasOwn(FOLDER_REGION,name))return FILTER_REGIONS[FOLDER_REGION[name]];
  if(Object.hasOwn(HOUSE_REGION,name))return FILTER_REGIONS[HOUSE_REGION[name]];
  const members=[name,...(GRUPOS_DINASTICOS[name]||[]),...(DYNASTY_CHILDREN[name]||[])];
  const tally=new Map();for(const m of members)for(const [r,n] of votes.get(m)||[])tally.set(r,(tally.get(r)||0)+n);
  const best=[...tally].sort((a,b)=>b[1]-a[1]||FILTER_REGIONS.indexOf(a[0])-FILTER_REGIONS.indexOf(b[0]))[0];
  return best?.[0]||'Otros';
 };
 return Object.fromEntries(houses.map(name=>[name,regionOfHouse(name)]));
}
export function groupByRegion(names,regionOf){
 const groups=new Map(FILTER_REGIONS.map(region=>[region,[]]));
 for(const name of names)groups.get(regionOf(name)||'Otros').push(name);
 return [...groups].filter(([,items])=>items.length).map(([region,items])=>({region,items:items.sort(alphabetical)}));
}
