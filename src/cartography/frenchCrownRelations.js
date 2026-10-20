import review from './regions/franceLowCountriesRouteData.json' with {type:'json'};
import earlyReview from './regions/earlyMedievalRouteData.json' with {type:'json'};
import {gobiernosDe} from '../domain/genealogy/personAccessors.js';
import {gobiernoEfectivo} from '../data/territorios.js';
import {territorialIdentity} from './territorialIdentity.js';
import {reviewedMapLayers,reviewedLayerLocations,reviewedLayerEvidence} from './locationMapPilot.js';
import {frenchFiefColor} from './mapColors.js';

const APPANAGE_SOURCE={title:'Larousse · Apanage',url:'https://www.larousse.fr/encyclopedie/divers/apanage/22040',locator:'Apanages de los hijos y hermanos del rey; reserva de derechos de soberanía, reversión y pérdida de poder político desde el siglo XVI.'};
// Annual bounds are intersected with the independently reviewed local control
// phases. A royal grant is neither an Ottoman-style tribute nor direct rule.
const FRENCH_CROWN_RELATIONS=Object.freeze([
 ['Orleans',1344,1375],['Orleans',1392,1497],['Orleans',1533,1589],['Orleans',1626,1789],
 ['Berry',1360,1422],['Poitou',1241,1270],['Poitou',1372,1415],
 ['Anjou',1576,1584],['Anjou',1246,1327],['Anjou',1360,1480],['Maine',1246,1327],['Maine',1360,1480],
 ['Alençon',1285,1549],['Alençon',1566,1584],['Valois',1284,1497],
 ['Ducado de Auvernia',1360,1530],['Borgoña',1200,1360],['Borgoña',1363,1476],
 ['Angulema',1407,1514],['Artois',1237,1525],
].map(([subject,from,through])=>({subject,from,through,type:'apanage'})).concat([{subject:'Borbón',from:1327,through:1530,type:'feudo',source:{title:'Larousse · Maison de Bourbon',url:'https://www.larousse.fr/encyclopedie/groupe-personnage/maison_de_Bourbon/109751',locator:'Ducado-pairía desde 1327, gran feudo de la Corona, confiscación en 1527 y reunión al dominio real en 1531.'}}]));

const FIEF_SOURCES=[{title:'William R. Shepherd · France in 1328',url:'https://maps.lib.utexas.edu/maps/historical/shepherd/france_1328.jpg',locator:'Historical Atlas, p. 76: dominio real frente a los grandes feudos y señoríos del reino.'},
 {title:'Larousse · Domaine royal',url:'https://www.larousse.fr/encyclopedie/divers/domaine_royal/44341',locator:'Diferencia entre las tierras del rey y los feudos de sus vasallos dentro del reino; reunión progresiva al dominio.'}];
// Fiefs and lordships inside the kingdom: their prince or lord governs and the
// king keeps superior authority. The bounds are the period inside the kingdom;
// a reviewed phase attributed to the Crown itself is royal domain, not a fief.
// Imperial lands west of the old frontier (Provence, the Dauphiné, the county
// of Burgundy, Lorraine, Bar, Savoy, Dombes, Orange) and sovereign Béarn stay out.
const FRENCH_CROWN_FIEFS=Object.freeze([
 ['Bretaña',1106,1531],['Flandes',1106,1525],['Champaña',1106,1314],['Toulouse',1106,1270],
 ['Blois',1106,1789],['Chartres',1106,1789],['Vendôme',1106,1789],['Dreux',1106,1789],['Perche',1106,1789],
 ['Alençon',1106,1789],['Évreux',1106,1789],['Aumale',1106,1789],['Longueville',1106,1789],['Laval',1106,1789],
 ['Valois',1106,1789],['Clermont-en-Beauvaisis',1106,1789],['Étampes',1106,1789],['Nemours',1106,1789],
 ['Soissons',1106,1789],['Coucy',1106,1789],['Guisa',1106,1789],['Marle',1106,1789],['Braine y Roucy',1106,1789],
 ['Joigny',1106,1789],['Tonnerre',1106,1789],['Rethel',1106,1789],['Nevers',1106,1789],['Auxerre',1106,1789],
 ['Mâcon',1106,1789],['Charolais',1106,1789],['Sancerre',1106,1789],['Boulogne',1106,1789],['Ponthieu',1106,1789],
 ['Borbón',1106,1789],['Forez',1106,1789],['Beaujolais',1106,1789],['Auvernia',1106,1789],['Ducado de Auvernia',1106,1789],
 ['Delfinado de Auvernia',1106,1789],['Obispado de Clermont',1106,1789],['Berry',1106,1789],['La Marche',1106,1789],
 ['Angulema',1106,1789],['Vizcondado de Limoges',1106,1789],['Périgord',1106,1789],['Vizcondado de Turena',1106,1789],
 ['Ventadour',1106,1789],['Señoríos y temporal eclesiástico del Limousin',1106,1789],['Vizcondado de Thouars',1106,1789],
 ['La Roche-sur-Yon',1106,1789],['Armagnac',1106,1789],['Albret',1106,1789],['Foix',1106,1589],['Condado de Bigorra',1106,1619],
 ['Señorío de Mirepoix',1209,1619],['Rodez',1106,1789],['Castres y Lautrec',1106,1789],['Vizcondado de Narbona',1106,1506],
 ['Vizcondado de Carcasona',1106,1225],['Señoríos del Languedoc oriental',1106,1228],['Montpellier',1106,1789],
 ['Condado de Melgueil',1106,1789],['Temporal del obispado de Albi',1106,1789],['Temporales episcopales del Languedoc',1106,1789],
 ['Paréage de Pamiers',1106,1789],['Paréage del Gévaudan',1106,1789],['Temporales y señoríos del Vivarais y Velay',1308,1789],
 ['Orleans',1106,1789],['Anjou',1106,1789],['Maine',1106,1789],['Turena',1106,1789],['Poitou',1106,1789],
 ['Normandía',1106,1789],['Aquitania',1106,1789],['Ducado de Aquitania',1106,1789],['Artois',1106,1525],['Borgoña',1106,1477],
].map(([subject,from,through])=>({subject,from,through,type:'feudo',sources:FIEF_SOURCES})));
// English kings did homage for their French lands until the confiscation of
// Guyenne in 1337 and Edward III's claim to the French crown; from then on the
// map shows their rule there as sovereign, in the English colour.
const ENGLISH_HOMAGE_THROUGH=1336;
const ENGLISH_HOMAGE_SOURCE={title:'The Gascon Rolls Project · Introduction historique',url:'https://www.gasconrolls.org/fr/the-project/historical-introduction/index.html',locator:'El ducado pasa de feudo tenido del rey de Francia a principado soberano a partir de los años 1330–1340.'};
const ENGLISH_FIEFS=new Set(['Aquitania','Ducado de Aquitania','Normandía','Anjou','Maine','Turena','Poitou','Ponthieu']);

const phases=new Map([...earlyReview.assignments,...review.assignments].map(p=>[p.name,p]));
// A reviewed phase attributed to the English crown: Angevin, Gascon, Calais
// and Lancastrian lands share England's colour.
export const englishCrownLayer=(name,year)=>{
 const phase=phases.get(name);
 return Boolean(phase&&phase.from<=year&&year<=phase.through&&phase.governmentTerritories.includes('Inglaterra'));
};
export function frenchCrownRelation(name,year) {
 const phase=phases.get(name);
 if(!phase||year<phase.from||year>phase.through)return null;
 // The 1481 reunion did not prevent Henry III granting a new appanage to
 // François in 1576. The coarse royal-domain phase must not erase that grant.
 const renewedAnjou=phase.identity==='Anjou'&&year>=1576&&year<=1584;
 if(phase.governmentTerritories.includes('Francia')&&!renewedAnjou)return null;
 const span=r=>({...r,...(renewedAnjou?{source:{title:'Bibliothèque nationale de France · Paix de Monsieur (1576)',url:'https://catalogue.bnf.fr/ark%3A/12148/cb14603033f',locator:'François recibe Anjou, Touraine y Berry en apanage por la paz de 1576; no se separan del reino de Francia.'}}:{}),from:Math.max(r.from,phase.from),through:Math.min(r.through,phase.through)});
 if(phase.governmentTerritories.includes('Inglaterra'))
  return ENGLISH_FIEFS.has(phase.identity)&&year<=ENGLISH_HOMAGE_THROUGH
   ?span({subject:phase.identity,from:phase.from,through:ENGLISH_HOMAGE_THROUGH,type:'feudo',holder:'Inglaterra',source:ENGLISH_HOMAGE_SOURCE}):null;
 const relation=FRENCH_CROWN_RELATIONS.find(r=>r.subject===phase.identity&&r.from<=year&&year<=r.through)
  ||FRENCH_CROWN_FIEFS.find(r=>r.subject===phase.identity&&r.from<=year&&year<=r.through);
 return relation?span(relation):null;
}

export function frenchCrownEntries(person,year,data,ownEntries=[]) {
 const office=gobiernosDe(person).find(g=>g.territorio==='Francia'&&gobiernoEfectivo(g)&&g.desde<=year&&year<=g.hasta&&!g.ambito&&!['rival','ocupación','disputado','regencia','gobierno delegado'].includes(g.condicion));
 if(!office||!data||year>=1790)return [];
 const owned=new Set(ownEntries.filter(e=>e.paint).flatMap(e=>e.ids));
 return reviewedMapLayers(data).flatMap(layer=>{
  const relation=frenchCrownRelation(layer.name,year);if(!relation||relation.holder)return [];
  const ids=reviewedLayerLocations(data,layer,year).filter(id=>!owned.has(id));if(!ids.length)return [];
  const evidence=reviewedLayerEvidence(layer,year);
  return [{person,government:null,claim:null,territory:territorialIdentity(layer.name),kind:relation.type==='feudo'?'feudal':'apanage',paint:true,ids,color:frenchFiefColor(territorialIdentity(layer.name)),
   crownRelation:{...relation,overlord:'Francia',note:(relation.type==='feudo'?'Feudo':'Apanage')+' dentro del reino de Francia. El rey conserva autoridad superior; la trama distingue el gobierno del príncipe y no acredita administración real directa.'},mapSources:[...(relation.sources||[relation.source||APPANAGE_SOURCE]),...evidence.sources,...(relation.subject==='Angulema'?[{title:'Larousse · Valois',url:'https://www.larousse.fr/archives/grande-encyclopedie/page/14215',locator:'Apanage de Angulema constituido en 1407 y retorno a la Corona con Francisco I en 1515.'}]:relation.subject==='Artois'?[{title:'Larousse · Artois',url:'https://www.larousse.fr/encyclopedie/autre-region/Artois/106321',locator:'Apanage de 1237 y superioridad francesa hasta Madrid (1526) y Cambrai (1529). Corte anual en 1526.'}]:[])],
   mapNote:(relation.type==='feudo'?'Feudo':'Apanage')+' dentro del reino de Francia. El rey conserva autoridad superior; la trama distingue el gobierno del príncipe y no acredita administración real directa. '+(evidence.note||''),
   mapScopes:[{ids,...evidence}]}];
 });
}
