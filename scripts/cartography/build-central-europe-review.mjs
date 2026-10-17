import fs from 'node:fs';
import {mapDataFile,projectRoot} from '../lib/project-paths.mjs';
import {compactBalkanRoutes} from './build-balkans-routes.mjs';
const read=n=>JSON.parse(fs.readFileSync(mapDataFile(n)));
const write=(n,d)=>fs.writeFileSync(mapDataFile(n),JSON.stringify(d,null,2)+'\n');
const source=read('poland-lithuania-partitions.json');
const scope=source.cells.map(c=>c.id);
if(new Set(scope).size!==scope.length)throw Error('Duplicate partition cell');
const buckets=new Map();
function add(identity,from,through,id,province,condition=null){
 if(from>through)return;
 const key=[identity,from,through,province,condition].join('|');
 if(!buckets.has(key))buckets.set(key,{identity,from,through,ids:[],province,condition});
 buckets.get(key).ids.push(id);
}
const mixed=source.mixedCells;
for(const c of source.cells){
 if(![1772,1793,1795].includes(c.annexedIn)||!['Austria','Prusia','Rusia'].includes(c.annexedBy))throw Error('Invalid partition recipient');
 const transitions=new Set([1772,c.annexedIn,1801]);
 for(const m of mixed.filter(m=>m.id===c.id)){transitions.add(m.from);transitions.add(m.through+1);}
 const cuts=[...transitions].sort((a,b)=>a-b);
 for(let i=0;i<cuts.length-1;i++){
  const from=cuts[i],through=cuts[i+1]-1,m=mixed.find(m=>m.id===c.id&&m.from<=from&&from<=m.through);
  const before=from<c.annexedIn;
  const owners=m?m.owners.map(o=>o==='Polonia-Lituania'?c.identityBefore:o):[before?c.identityBefore:c.annexedBy];
  for(const owner of owners)add(owner,from,through,c.id,m?m.reason:before?'Superficie conservada de '+c.identityBefore:c.province,m?'composición geográfica':null);
 }
}
const assignments=[...buckets.values()].map((b,i)=>{
 const recipient=b.identity==='Austria'?'Reino de Galicia y Lodomeria':b.identity;
 const governmentTerritories=b.identity==='Austria'?['Austria','Reino de Galicia y Lodomeria']:['Polonia','Prusia Real','Principado episcopal de Warmia','Livonia polaca'].includes(b.identity)?['Polonia','Polonia-Lituania']:b.identity==='Lituania'?['Lituania','Polonia-Lituania']:[b.identity];
 const event=b.from<1793?'first':b.from<1795?'second':'third';
 return {name:`${b.province} · ${b.from}–${b.through} · revisión polaco-lituana ${i+1}`,identity:recipient,from:b.from,through:b.through,ids:b.ids.sort(),governmentTerritories,sourceKeys:['province',event],precision:b.condition?'mixed_cell':'regional_reconstruction',limitedCore:false,scopeLabel:b.province,...(b.condition?{authorityCondition:b.condition}:{}),note:(b.condition?b.province: b.from<1772?'Ámbito provincial anterior a los repartos.':`Atribución territorial de ${b.province}; ${b.identity}. Se conserva el territorio hasta su cesión y se asigna desde entonces al estado receptor.`)+' Escala anual y contornos comarcales aproximados; no acredita una frontera municipal exacta.'};
});
const review={schema:1,reviewedAt:source.reviewedAt,scope:{from:1772,through:1800,ids:scope},limitedCore:false,limitations:source.limitations,sources:source.sources,assignments};
write('poland-lithuania-full-review.json',review);
fs.writeFileSync(projectRoot+'/src/cartography/regions/polandLithuaniaRouteData.json',JSON.stringify(compactBalkanRoutes(review))+'\n');
const frontier=read('poland-lithuania-frontier-review.json');
fs.writeFileSync(projectRoot+'/src/cartography/regions/polandLithuaniaFrontierRouteData.json',JSON.stringify(compactBalkanRoutes(frontier))+'\n');
const medieval=read('poland-lithuania-medieval-review.json');
fs.writeFileSync(projectRoot+'/src/cartography/regions/polandLithuaniaMedievalRouteData.json',JSON.stringify(compactBalkanRoutes(medieval))+'\n');
const base=read('corridor-locations.json'),entries=new Map([...base.territories,...base.additionalTerritories].map(e=>[e.name,e]));
// Rebuild from the original reviewed series, not from previously generated output.
const original=read('continuity-review.json');
const originals=new Map([...original.replacements,...source.continuitySeeds].map(e=>[e.name,e]));
const replacements=[];
const inheritedSources=name=>{const e=originals.get(name);return [...(e?.sources||[]),...(e?.active?.source?[{title:name+' · evidencia de la revisión anterior',url:e.active.source,locator:e.active.reason||e.note}]:[])];};
const clone=n=>structuredClone(originals.get(n)||entries.get(n));
const royal=clone('Prusia Real');royal.coverage={from:1466,through:1771};delete royal.active;royal.versions=[{from:1466,ids:[...new Set(source.cells.filter(c=>c.identityBefore==='Prusia Real').map(c=>c.id))],oldIds:[],borderline:[],event:'Provincia de la Corona: toda Prusia Real, sin las tierras orientales del ducado.'}];royal.sources=[...inheritedSources(royal.name),source.sources.province];replacements.push(royal);
const warmia=clone('Principado episcopal de Warmia');warmia.coverage={from:1243,through:1771};delete warmia.active;warmia.versions=[{from:1243,ids:warmia.versions.at(-1).ids,oldIds:[],borderline:[],event:'Jurisdicción episcopal de Warmia desde 1243, anterior a su cambio de protección de 1466.'}];warmia.sources=[source.sources.province,{title:'Ayuntamiento de Olsztyn · Historia',url:'https://visit.olsztyn.eu/en/category/2/the-history-of-olsztyn',locator:'La fundación de la diócesis en 1243 precede a la ciudad de 1353; cambio de protección durante la Guerra de los Trece Años.'}];replacements.push(warmia);
const prussia=clone('Prusia ducal');prussia.coverage={from:1525,through:1800};delete prussia.active;prussia.versions=prussia.versions.map(v=>({...v,ids:v.ids.filter(id=>!new Set(royal.versions[0].ids).has(id))}));prussia.sources=[source.sources.province,{title:'ZPE · Prusy Książęce',url:'https://zpe.gov.pl/a/prezentacja-multimedialna/DbYm1LK96',locator:'Ducado secular desde 1525, unión con Brandeburgo desde 1618; no incluye la Prusia Real.'}];replacements.push(prussia);
const courland=clone('Ducado de Curlandia');courland.coverage={from:1561,through:1794};delete courland.active;courland.versions=[{from:1561,ids:source.cells.filter(c=>c.identityBefore==='Curlandia').map(c=>c.id),oldIds:[],borderline:[],event:'Ducado de Curlandia y Semigalia: superficie occidental y oriental, feudo separado hasta 1795.'}];courland.sources=[...inheritedSources(courland.name),source.sources.province];replacements.push(courland);
const order=clone('Prusia de la Orden');order.coverage={from:1400,through:1524};delete order.active;
const orderAnchor=structuredClone(order.versions.findLast(v=>v.from<=1466));
order.versions=order.versions.filter(v=>v.from!==1466).map(v=>({...v,ids:v.ids.filter(id=>!warmia.versions[0].ids.includes(id))}));order.versions.push({...orderAnchor,from:1466,ids:orderAnchor.ids.filter(id=>!royal.versions[0].ids.includes(id)&&!warmia.versions.at(-1).ids.includes(id)),event:'Paz de Toruń: la Prusia Real y Warmia no siguen en dominio directo de la Orden.'});order.versions.sort((a,b)=>a.from-b.from);order.sources=[...inheritedSources(order.name),source.sources.province];replacements.push(order);
const russia=clone('Moscovia y Zarato de Rusia');russia.coverage={from:1400,through:1800};delete russia.active;russia.limitedCore=true;russia.precision='documented_core';russia.note=russia.note.split(' Continuidad del núcleo moscovita después de 1650;')[0]+' Continuidad del núcleo moscovita después de 1650; no representa toda la extensión imperial ni adelanta nuevas conquistas.';russia.sources=[...new Map([...inheritedSources(russia.name),source.sources.province].map(s=>[s.url,s])).values()];replacements.push(russia);
const poland=clone('Corona de Polonia');
// Czaplinek/Drahim was redeemed by Brandenburg in 1668; it is not a
// Commonwealth possession awaiting a partition in 1795.
for(const v of poland.versions)if(v.from>=1668)v.ids=v.ids.filter(id=>id!=='Czaplinek');
const anchor=poland.versions.findLast(v=>v.from<=1668);poland.versions.push({...structuredClone(anchor),from:1668,ids:anchor.ids.filter(id=>id!=='Czaplinek'),event:'Prenda de Drahim ejecutada por Brandeburgo, 1668.'});poland.versions.sort((a,b)=>a.from-b.from);replacements.push(poland);
const territories=[{name:'Livonia polaca · Latgalia',color:'#8B5AA5',corridor:'Polonia-Lituania · continuidad báltica',coverage:{from:1629,through:1771},versions:[{from:1629,ids:source.cells.filter(c=>c.identityBefore==='Livonia polaca').map(c=>c.id),oldIds:[],borderline:[],event:'Altmark deja Latgalia en la Mancomunidad; no desaparece con la Livonia sueca.'}],note:'Voivodato de Livonia (Inflanty): Latgalia permanece en la Mancomunidad después de 1629 hasta el primer reparto. No incluye Riga ni la Livonia sueca.',sources:[source.sources.province],precision:'regional_reconstruction',limitedCore:false},
 ...[{name:'Lituania · voivodato de Polotsk',identity:'Lituania',periods:[{from:1307,through:1562},{from:1579,through:1771}]},{name:'Rusia · ocupación de Polotsk',identity:'Rusia',periods:[{from:1563,through:1578}]}].map(e=>({...Object.fromEntries(Object.entries(e).filter(([k])=>k!=='identity')),color:e.identity==='Rusia'?'#60784A':'#43298E',corridor:'Polonia-Lituania · frontera del Dvina',coverage:{from:e.periods[0].from,through:e.periods.at(-1).through},versions:[{from:e.periods[0].from,ids:['Polotsk'],oldIds:[],borderline:[],event:'Jurisdicción de Polotsk; ocupación moscovita de 1563–1579 separada.'}],note:'Polotsk conserva su identidad provincial; la capa distingue la ocupación moscovita de Iván IV y la recuperación por Esteban Báthory en 1579.',sources:[source.sources.province],precision:'regional_reconstruction',limitedCore:true}))];
write('poland-lithuania-continuity-review.json',{reviewedAt:source.reviewedAt,replacements,territories,limitations:source.limitations});
console.log(`Polonia-Lituania: ${scope.length} celdas y ${assignments.length} fases; ${replacements.length} series de continuidad.`);
