import earlyReview from './regions/earlyMedievalRouteData.json' with {type:'json'};
import franceReview from './regions/franceLowCountriesRouteData.json' with {type:'json'};
import iberiaReview from './regions/iberiaItalyRouteData.json' with {type:'json'};
import balkansReview from './regions/balkansFullRouteData.json' with {type:'json'};
import {gobiernosDe} from '../domain/genealogy/personAccessors.js';
import {gobiernoEfectivo} from '../data/territorios.js';
import {territorialIdentity} from './territorialIdentity.js';
import {reviewedMapLayers,reviewedLayerLocations,reviewedLayerEvidence} from './locationMapPilot.js';
import {aragonVassalColor} from './mapColors.js';

const gec=(slug,title,locator)=>({title:`Gran Enciclopèdia Catalana · ${title}`,url:`https://www.enciclopedia.cat/${slug}`,locator});
const SOURCES={
 athens:gec('gran-enciclopedia-catalana/ducat-datenes','Ducat d’Atenes','Conquista catalana de 1311, duques de la casa de Aragón de Sicilia, Federico III de Sicilia duque desde 1355 y unión a la Corona por Pedro IV en 1380; Nerio Acciaiuoli toma Atenas en 1388.'),
 neopatria:gec('gran-enciclopedia-catalana/ducat-de-neopatria','Ducat de Neopàtria','Ducado formado en 1319 por Alfonso Fadrique y unido al de Atenas; Pedro IV asume el título en 1377 y los florentinos lo ocupan en 1390.'),
 salona:gec('gran-enciclopedia-catalana/comtat-de-salona','Comtat de Salona','Castillo tomado por los catalanes en 1311 y condado de los Fadrique hasta la conquista turca de 1394.'),
 mallorca:gec('gran-enciclopedia-catalana/jaume-ii-de-mallorca','Jaume II de Mallorca','Declaración de vasallaje en Perpiñán (20 de enero de 1279) y restitución del reino con nuevo vasallaje tras Anagni (1295) y Argelers (1298).'),
 montpellier:gec('gran-enciclopedia-catalana/senyoria-de-montpeller','Senyoria de Montpeller','Unida al casal de Barcelona por el matrimonio de María con Pedro I en 1204; Jaime III la vende al rey de Francia el 13 de abril de 1349.'),
 arborea:gec('historia.-politica-societat-i-cultura-dels-paisos-catalans/les-dificultats-politiques-a-la-baixa','Les dificultats polítiques a la baixa edat mitjana','Desde 1323, territorios de los jueces de Arborea vinculados al rey de Aragón por un contrato de vasallaje, hasta la guerra con Mariano IV.'),
 carcassonne:gec('gran-enciclopedia-catalana/comtat-de-carcassona','Comtat de Carcassona','Reconocimiento de la soberanía de Ramón Berenguer IV por Ramón Trencavel I (1157) y de Alfonso I por Roger II (1167); desposesión por Simón de Montfort en 1209.'),
 bearn:gec('gran-enciclopedia-catalana/bearn-0','Bearn','Vasallaje respecto del rey de Aragón; la vizcondesa María se declara vasalla de Alfonso el Casto en 1170.'),
 bigorre:gec('gran-enciclopedia-catalana/bigorra','Bigorra','Céntulo III recibe el valle de Arán de Alfonso I a cambio de que él y sus sucesores sean vasallos de la Corona.'),
 occitania1213:gec('ec-gec-0050109.xml','Pere I de Catalunya-Aragó','En 1213 recibe en Toulouse el juramento de fidelidad de Ramón VI y el homenaje de Foix y Bearne; muere en Muret en septiembre.'),
 pallars:gec('gran-enciclopedia-catalana/comtat-de-pallars-sobira','Comtat de Pallars Sobirà','Condado catalán bajo el conde-rey; la guerra de 1487 acaba con la confiscación de 1488.'),
 provence:gec('gran-enciclopedia-catalana/regne-marquesat-i-comtat-de-provenca','Regne, marquesat i comtat de Provença','Condes de la casa de Barcelona entre 1112 y 1245; Alfonso I la recupera en 1166 para sus hermanos y su hijo.'),
};
// The overlord is the territory whose ruler holds the superior authority in the
// year: the Catalan duchies depended on the Aragonese kings of Sicily while
// their dukes were princes of that house (1312–1354). When the king himself
// was duke (Frederick III of Sicily from 1355, Peter IV from 1380, John I) the
// duchies are his own government, painted like his other realms, and only
// Salona remains a vassal. A dynastic branch or a disputed succession has no
// overlord and only tints the panorama.
const SUMMARIES={
 feudo:r=>r.overlord==='Trinacria'?'Vasallo de los reyes de Sicilia de la casa de Aragón':'Vasallo de la Corona de Aragón',
 fidelidad:()=> 'Juramento de fidelidad al rey de Aragón',
 ducado:r=>r.overlord==='Trinacria'?'Ducado catalán bajo los reyes de Sicilia de la casa de Aragón':'Ducado catalán unido a la Corona de Aragón',
 señorío:r=>r.holder==='Mallorca'?'Señorío de los reyes de Mallorca dentro del reino de Francia':'Señorío del rey de Aragón dentro del reino de Francia',
 tutela:()=> 'Gobernada por Pedro II de Aragón como tutor del conde',
 sucesion:()=> 'Sucesión disputada de los ducados catalanes tras la muerte de Federico III de Sicilia',
 rama:()=> 'Rama provenzal del casal de Barcelona',
};
const NOTES={
 feudo:'El príncipe gobierna con instituciones propias y debe homenaje al soberano aragonés; la trama no acredita administración directa del rey.',
 fidelidad:'Juramento de 1213, deshecho por la derrota de Muret; no convierte el condado en tierra de la Corona.',
 ducado:'Los ducados conservaron gobierno propio, con vicarios generales y capitanes catalanes.',
 señorío:'El rey gobierna la ciudad como señor, dentro del reino de Francia y bajo su autoridad superior.',
 tutela:'Provenza siguió siendo un condado del Imperio con su propio conde.',
 sucesion:'María de Sicilia heredaba los ducados por el testamento de su padre y Pedro IV asumió el título en 1377; la Compañía le ofreció la soberanía y la unión a la Corona se cumplió en 1380.',
 rama:'Feudo del Imperio gobernado por una rama del casal de Barcelona; no es tierra de la Corona de Aragón.',
};
export const ARAGON_CROWN_RELATIONS=Object.freeze([
 ['Atenas',1312,1354,'ducado','Trinacria','athens'],['Atenas',1378,1379,'sucesion',null,'athens'],
 ['Ducado de Neopatria',1319,1354,'ducado','Trinacria','neopatria'],['Ducado de Neopatria',1378,1379,'sucesion',null,'neopatria'],
 ['Condado de Salona',1312,1377,'feudo','Trinacria','salona'],['Condado de Salona',1378,1379,'sucesion',null,'salona'],['Condado de Salona',1380,1388,'feudo','Aragón','salona'],
 // Confiscated by Peter III and Alfonso III between 1285 and 1298.
 ['Mallorca',1279,1285,'feudo','Aragón','mallorca'],['Mallorca',1298,1343,'feudo','Aragón','mallorca'],
 ['Montpellier',1204,1275,'señorío','Aragón','montpellier','Aragón'],['Montpellier',1276,1348,'señorío','Mallorca','montpellier','Mallorca'],
 ['Judicado de Arborea',1323,1352,'feudo','Aragón','arborea'],
 ['Vizcondado de Carcasona',1157,1208,'feudo','Aragón','carcassonne'],['Vizcondados Trencavel',1157,1208,'feudo','Aragón','carcassonne'],
 ['Bearne',1170,1213,'feudo','Aragón','bearn'],['Condado de Bigorra',1170,1213,'feudo','Aragón','bigorre'],
 ['Toulouse',1213,1213,'fidelidad','Aragón','occitania1213'],['Foix',1213,1213,'feudo','Aragón','occitania1213'],
 ['Pallars Sobirà',1106,1487,'feudo','Aragón','pallars'],
 ['Provenza',1196,1208,'rama',null,'provence'],['Provenza',1209,1213,'tutela','Aragón','occitania1213'],['Provenza',1214,1245,'rama',null,'provence'],
].map(([subject,from,through,type,overlord,source,holder])=>({subject,from,through,type,overlord,holder:holder||null,source:SOURCES[source]})));

const phases=new Map([earlyReview,franceReview,iberiaReview,balkansReview].flatMap(review=>review.assignments).map(p=>[p.name,p]));
const DIRECT=['Aragón','Condado de Barcelona','Francia'];

// The relation in force for a reviewed phase, clipped to the phase's span.
// Lands the Crown or the French king govern directly are not vassals.
export function aragonCrownRelation(name,year) {
 const phase=phases.get(name);
 if(!phase||year<phase.from||year>phase.through||phase.governmentTerritories.some(t=>DIRECT.includes(t)))return null;
 const relation=ARAGON_CROWN_RELATIONS.find(r=>r.subject===phase.identity&&r.from<=year&&year<=r.through);
 if(!relation)return null;
 return {...relation,territory:phase.governmentTerritories[0]||phase.identity,from:Math.max(relation.from,phase.from),through:Math.min(relation.through,phase.through),
  overlordLabel:'Corona de Aragón',summary:SUMMARIES[relation.type](relation),note:NOTES[relation.type]};
}

const EXCLUDED_CONDITIONS=['rival','ocupación','disputado','regencia','gobierno delegado'];
export function aragonCrownEntries(person,year,data,ownEntries=[]) {
 if(!data)return [];
 const ruled=new Set(gobiernosDe(person).filter(g=>gobiernoEfectivo(g)&&g.desde<=year&&year<=g.hasta&&!g.ambito&&!EXCLUDED_CONDITIONS.includes(g.condicion)).map(g=>g.territorio));
 if(!['Aragón','Trinacria','Mallorca'].some(t=>ruled.has(t)))return [];
 const owned=new Set(ownEntries.filter(e=>e.paint).flatMap(e=>e.ids));
 const entries=new Map();
 for(const layer of reviewedMapLayers(data)) {
  const relation=aragonCrownRelation(layer.name,year);
  if(!relation?.overlord||!ruled.has(relation.overlord))continue;
  const ids=reviewedLayerLocations(data,layer,year).filter(id=>!owned.has(id));if(!ids.length)continue;
  const evidence=reviewedLayerEvidence(layer,year);
  const territory=relation.territory||territorialIdentity(layer.name), key=`${territory}-${relation.from}`;
  if(!entries.has(key))entries.set(key,{person,government:null,claim:null,territory,kind:'vassal',paint:true,ids:[],color:aragonVassalColor(relation),
   crownRelation:relation,mapSources:[relation.source],mapNote:`${relation.summary}. ${relation.note}`,mapScopes:[]});
  const entry=entries.get(key);
  entry.ids=[...new Set([...entry.ids,...ids])];
  entry.mapScopes.push({ids,...evidence});
  entry.mapSources=[...new Map([...entry.mapSources,...evidence.sources].map(s=>[s.url,s])).values()];
 }
 return [...entries.values()];
}
