import {TERRITORIOS_SUB,TERRITORIOS_DESTACADOS,subterritoriosDeFiltro} from '../Territorios.jsx';
import {GRUPOS_DINASTICOS,GRUPOS_DINASTICOS_REGIONALES,DINASTIAS_DESTACADAS,OTRAS_DINASTIAS} from '../explorer/model.js';
import {territoriosDe,gobiernosDe} from './personAccessors.js';
import {gobiernoEfectivo} from './territorios.js';

export const alphabetical=(a,b)=>a.localeCompare(b,'es',{sensitivity:'base'});
export const DYNASTY_CHILDREN={
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
