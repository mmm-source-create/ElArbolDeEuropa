import regions from '../../src/content/territoryRegions.json' with {type:'json'};
import {gobiernosDe} from '../../src/domain/genealogy/personAccessors.js';
import {TERRITORY_REGIONS} from '../../src/features/public/territoryCatalog.js';

const regionsByName=new Map();
for(const [region,names] of Object.entries(regions.regions))for(const name of names){
  if(!TERRITORY_REGIONS[region])throw Error(`Unknown territory region: ${region}`);
  if(regionsByName.has(name))throw Error(`Duplicate primary territory region: ${name}`);
  regionsByName.set(name,[region,...(regions.additional[name]||[])]);
}
const aliases={
  'Condado de Borgoña':['Franco Condado','Franche-Comté','County of Burgundy'],
  'Borgoña':['Ducado de Borgoña','Duchy of Burgundy'],
  'Las dos Borgoñas':['The two Burgundies'],
  'Borgoña y Países Bajos':['Burgundy and the Low Countries'],
  'Confederación Suiza':['Swiss Confederation','Old Swiss Confederacy'],
};

export function territoryCatalogMetadata(name,entity,history,people,names) {
  const assigned=regionsByName.get(name);
  if(!assigned)throw Error(`Assign a geographic region before publishing ${name}`);
  const governments=people.flatMap(person=>gobiernosDe(person).filter(g=>names.includes(g.territorio)).map(g=>({...g,personId:person.id})))
    .filter(g=>Number.isFinite(g.desde)&&Number.isFinite(g.hasta))
    .map(g=>entity.naturaleza==='compuesta'?{...g,
      desde:Number.isFinite(entity.desde)?Math.max(g.desde,entity.desde):g.desde,
      hasta:Number.isFinite(entity.hasta)?Math.min(g.hasta,entity.hasta):g.hasta}:g)
    .filter(g=>g.desde<=g.hasta);
  const ranges=governments.map(g=>[g.desde,g.hasta]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
  const intervalos=[];
  for(const [from,to] of ranges){const last=intervalos.at(-1);if(last&&from<=last[1]+1)last[1]=Math.max(last[1],to);else intervalos.push([from,to]);}
  return {key:name,clase:entity.clase,naturaleza:entity.naturaleza,regiones:assigned,
    aliases:[...new Set([...(entity.aliases||[]),...(aliases[name]||[])])],
    editorial:Boolean(history.resumen),resumen:history.resumen||'',intervalos,
    gobernantes:new Set(governments.map(g=>g.personId)).size,gobiernos:governments.length};
}
