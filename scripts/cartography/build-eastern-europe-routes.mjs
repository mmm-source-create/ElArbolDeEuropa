import fs from 'node:fs';
import {mapDataFile, projectRoot} from '../lib/project-paths.mjs';
import {compactBalkanRoutes} from './build-balkans-routes.mjs';

const read = name => JSON.parse(fs.readFileSync(mapDataFile(name)));
const geography = read('eastern-europe-geography.json');
const chronology = read('eastern-europe-chronology.json');
const local = read('eastern-europe-local-phases.json');
const inventory = new Set(read('location-inventory.json').cells.filter(c => c.visible).map(c => c.id));
const buckets = new Map();
const used = new Set();
const governments = (identity, year) => identity === 'Livonia polaca'
  ? year < 1569 ? ['Lituania'] : ['Polonia', 'Lituania', 'Polonia-Lituania']
  : identity === 'Lituania' || identity === 'Polonia'
    ? year < 1569 ? [identity] : [identity, 'Polonia-Lituania']
    : identity === 'Estonia danesa' ? ['Dinamarca', identity]
      : identity === 'Principado de Vladímir-Súzdal' ? ['Vladímir-Súzdal'] : [identity];

for (const region of geography.groups) {
  const series = chronology.regions[region.key];
  if (!series || !region.ids.length) throw Error('Missing chronology: '+region.key);
  for (const id of region.ids) {
    if (used.has(id) || !inventory.has(id)) throw Error('Invalid or duplicate eastern cell: '+id);
    used.add(id);
    const override = local.cells[id];
    const phases = [...new Map((override?.phases || series.phases).map(p => [p.from, p])).values()]
      .sort((a,b) => a.from-b.from);
    if (phases[0].from !== 1200) throw Error('Missing first phase: '+id);
    for (let i=0; i<phases.length; i++) {
      const phase = phases[i], end = phases[i+1]?.from-1 || 1800;
      if (phase.from>end || end>1800 || !phase.identity) throw Error('Invalid eastern interval: '+id);
      const cuts = [phase.from, ...(phase.from<1569 && end>=1569 ? [1569] : []), end+1];
      for (let c=0;c<cuts.length-1;c++) {
        const from=cuts[c],through=cuts[c+1]-1;
        const sourceKeys=[...new Set([...series.sourceKeys,...(override?.sourceKeys || [])])];
        if (sourceKeys.some(k=>!chronology.sources[k]?.locator)) throw Error('Missing source: '+id);
        const note=[series.note,override?.note,phase.note].filter(Boolean).join(' ');
        const key=JSON.stringify([region.key,from,through,phase.identity,phase.authorityCondition,sourceKeys,note]);
        if (!buckets.has(key)) buckets.set(key, {name:`${series.label} · ${phase.identity} · ${from}–${through} · revisión oriental ${buckets.size+1}`,
          identity:phase.identity,from,through,ids:[],governmentTerritories:governments(phase.identity,from),sourceKeys,
          scopeLabel:series.label,precision:'regional_reconstruction',limitedCore:false,
          ...(phase.authorityCondition?{authorityCondition:phase.authorityCondition}:{}),
          note:`${series.label}: ${phase.identity}, ${from}–${through}. ${note} Contornos comarcales aproximados; la datación regional no acredita la fundación de cada localidad ni una frontera municipal exacta.`});
        buckets.get(key).ids.push(id);
      }
    }
  }
}
for (const id of Object.keys(local.cells)) if (!used.has(id)) throw Error('Local correction outside scope: '+id);
const assignments=[...buckets.values()];
const review={schema:1,reviewedAt:chronology.reviewedAt,scope:{from:1200,through:1800,ids:geography.scopeIds},
  precedenceIds:[...used].sort(),sources:chronology.sources,retainedLayerEvidence:chronology.retainedLayerEvidence,assignments,limitedCore:false,limitations:chronology.limitations,authorityScopes:[]};

// Earlier Russian titles were not sovereignty over all future Russia. Retain
// a named, geographically bounded mandate even after the regional expansion.
const union=(keys)=>[...new Set(keys.flatMap(k=>geography.groups.find(g=>g.key===k)?.ids || []))];
const vl=union(['vladimir_suzdal','nizhny_murom','moscow','dmitrov','pereyaslavl','rostov','yaroslavl','uglich','galich_kostroma','ustyug']);
for (const [personId,from,through] of [['YAROSLAV2VLAD',1238,1246],['ALEXNEVSKY',1252,1263]])
  review.authorityScopes.push({personId,territory:'Rusia',from,through,ids:vl,sourceKeys:['rus'],note:'Gran principado de Vladímir-Súzdal y jurisdicciones del noreste; el título no transmite las repúblicas de Nóvgorod o Pskov ni las futuras conquistas rusas.'});
const base=read('corridor-locations.json');
const lit=base.territories.find(t=>t.name==='Gran Ducado de Lituania');
// The legacy grand-duchy layer excludes separately reviewed provinces such
// as Polotsk and Smolensk. Include those dated jurisdictions before splitting
// the civil-war mandates, then let runtime routes enforce actual ownership.
const polotsk=base.additionalTerritories.find(t=>t.name==='Lituania · voivodato de Polotsk');
const lit1400=[...new Set([
  ...lit.versions.findLast(v=>v.from<=1400).ids,
  ...(polotsk?.versions.findLast(v=>v.from<=1432)?.ids || []),
  ...[...assignments,...read('poland-lithuania-frontier-review.json').assignments]
    .filter(p=>p.from<=1432 && p.through>=1432 && p.governmentTerritories.includes('Lituania'))
    .flatMap(p=>p.ids),
])];
const coords=new Map(read('location-inventory.json').cells.map(c=>[c.id,c.centroid]));
const addScope=(personId,territory,from,through,ids,sourceKeys,note,disputedIds)=>review.authorityScopes.push({personId,territory,from,through,ids,sourceKeys,note,...(disputedIds?{disputedIds}:{} )});
const isEast=id=>coords.get(id)?.[0]>=653 || coords.get(id)?.[1]>=125;
const east=lit1400.filter(isEast),west=lit1400.filter(id=>!isEast(id));
const south=lit1400.filter(id=>coords.get(id)?.[1]>=125);
const recovered=lit1400.filter(id=>!south.includes(id));
addScope('SVITRIGAILALIT','Lituania',1433,1436,east,['svitrigaila'],'Gobierno rival en las provincias rutenas orientales y meridionales, incluida Volinia. Las pérdidas posteriores a Pabaiskas se resumen por cortes anuales regionales.',east);
addScope('SVITRIGAILALIT','Lituania',1437,1438,south,['svitrigaila'],'Tras perder Pólotsk, Vítebsk y Smolensk, conserva Kyiv y Volinia hasta la expulsión de finales de 1438. No se prolonga el dominio rival sobre todas las provincias orientales.',south);
addScope('ZYGIMANTASLIT','Lituania',1432,1436,west,['zygimantas','svitrigaila'],'Gobierno occidental inicial, con Vilna y Trakai; las provincias rutenas de Švitrigaila se reservan por separado.');
addScope('ZYGIMANTASLIT','Lituania',1437,1438,recovered,['zygimantas','svitrigaila'],'Recuperación de las provincias rutenas septentrionales para 1437; Kyiv y Volinia quedan fuera hasta el final de 1438.');
for (const [personId,territory,from,through,key] of [
  ['KESTUTISLIT','Principado de Trakai',1337,1381,'trakai'],
  ['SVARNASLIT','Lituania',1267,1269,'svarnas'],
]) {
  const item=geography.personalInventories[key];
  addScope(personId,territory,from,through,item.ids,item.sourceKeys,item.note);
}
const compact={...compactBalkanRoutes(review),personalCoverageIds:[...new Set([...geography.scopeIds,...lit1400])].sort()};
fs.writeFileSync(mapDataFile('eastern-europe-full-review.json'),JSON.stringify(review,null,2)+'\n');
fs.writeFileSync(projectRoot+'/src/data/easternEuropeRouteData.json',JSON.stringify(compact)+'\n');
console.log(`Europa oriental: ${geography.scopeIds.length} celdas auditadas, ${used.size} sustituidas, ${assignments.length} fases y ${review.authorityScopes.length} límites personales.`);
