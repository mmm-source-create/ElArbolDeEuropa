import review from './franceLowCountriesRouteData.json' with {type:'json'};
import {gobiernosDe} from './personAccessors.js';
import {gobiernoEfectivo} from './territorios.js';
import {territorialIdentity} from './territorialIdentity.js';
import {reviewedMapLayers,reviewedLayerLocations,reviewedLayerEvidence} from './locationMapPilot.js';
import {FRENCH_CROWN_COLOR} from './mapColors.js';

export const APPANAGE_SOURCE={title:'Larousse · Apanage',url:'https://www.larousse.fr/encyclopedie/divers/apanage/22040',locator:'Apanages de los hijos y hermanos del rey; reserva de derechos de soberanía, reversión y pérdida de poder político desde el siglo XVI.'};
// Annual bounds are intersected with the independently reviewed local control
// phases. A royal grant is neither an Ottoman-style tribute nor direct rule.
export const FRENCH_CROWN_RELATIONS=Object.freeze([
 ['Orleans',1344,1375],['Orleans',1392,1497],['Orleans',1533,1589],['Orleans',1626,1789],
 ['Berry',1360,1422],['Poitou',1241,1270],['Poitou',1372,1415],
 ['Anjou',1246,1327],['Anjou',1360,1480],['Maine',1246,1327],['Maine',1360,1480],
 ['Alençon',1285,1549],['Alençon',1566,1584],['Valois',1284,1497],
 ['Ducado de Auvernia',1360,1530],['Borgoña',1200,1360],['Borgoña',1363,1476],
 ['Angulema',1407,1514],['Artois',1237,1525],
].map(([subject,from,through])=>({subject,from,through,type:'apanage'})).concat([{subject:'Borbón',from:1327,through:1530,type:'feudo',source:{title:'Larousse · Maison de Bourbon',url:'https://www.larousse.fr/encyclopedie/groupe-personnage/maison_de_Bourbon/109751',locator:'Ducado-pairía desde 1327, gran feudo de la Corona, confiscación en 1527 y reunión al dominio real en 1531.'}}]));

const phases=new Map(review.assignments.map(p=>[p.name,p]));
export function frenchCrownRelation(name,year) {
 const phase=phases.get(name);
 if(!phase||year<phase.from||year>phase.through||phase.governmentTerritories.includes('Francia')||phase.governmentTerritories.includes('Inglaterra'))return null;
 return FRENCH_CROWN_RELATIONS.find(r=>r.subject===phase.identity&&r.from<=year&&year<=r.through)||null;
}

export function frenchCrownEntries(person,year,data,ownEntries=[]) {
 const office=gobiernosDe(person).find(g=>g.territorio==='Francia'&&gobiernoEfectivo(g)&&g.desde<=year&&year<=g.hasta&&!g.ambito&&!['rival','ocupación','disputado','regencia','gobierno delegado'].includes(g.condicion));
 if(!office||!data||year>=1790)return [];
 const owned=new Set(ownEntries.filter(e=>e.paint).flatMap(e=>e.ids));
 return reviewedMapLayers(data).flatMap(layer=>{
  const relation=frenchCrownRelation(layer.name,year);if(!relation)return [];
  const ids=reviewedLayerLocations(data,layer,year).filter(id=>!owned.has(id));if(!ids.length)return [];
  const evidence=reviewedLayerEvidence(layer,year);
  return [{person,government:null,claim:null,territory:territorialIdentity(layer.name),kind:relation.type==='feudo'?'feudal':'apanage',paint:true,ids,color:FRENCH_CROWN_COLOR,
   crownRelation:{...relation,overlord:'Francia',note:(relation.type==='feudo'?'Feudo':'Apanage')+' dentro del reino de Francia. El rey conserva autoridad superior; la trama distingue el gobierno del príncipe y no acredita administración real directa.'},mapSources:[relation.source||APPANAGE_SOURCE,...evidence.sources,...(relation.subject==='Angulema'?[{title:'Larousse · Valois',url:'https://www.larousse.fr/archives/grande-encyclopedie/page/14215',locator:'Apanage de Angulema constituido en 1407 y retorno a la Corona con Francisco I en 1515.'}]:relation.subject==='Artois'?[{title:'Larousse · Artois',url:'https://www.larousse.fr/encyclopedie/autre-region/Artois/106321',locator:'Apanage de 1237 y superioridad francesa hasta Madrid (1526) y Cambrai (1529). Corte anual en 1526.'}]:[])],
   mapNote:(relation.type==='feudo'?'Feudo':'Apanage')+' dentro del reino de Francia. El rey conserva autoridad superior; la trama distingue el gobierno del príncipe y no acredita administración real directa. '+(evidence.note||''),
   mapScopes:[{ids,...evidence}]}];
 });
}
