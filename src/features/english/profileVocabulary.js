import {FOURTH_200_NAMES,FOURTH_200_LABELS,FOURTH_200_NOTES} from './reviewedFourth200Vocabulary.js';
import {THIRD_100_NAMES,THIRD_100_LABELS,THIRD_100_NOTES} from './reviewedThird100Vocabulary.js';
import {ROSES_NAMES,ROSES_LABELS,ROSES_NOTES} from './rosesVocabulary.js';
import {REVIEWED_NEXT_100_NAMES,REVIEWED_NEXT_100_LABELS,REVIEWED_NEXT_100_NOTES} from './reviewedNext100Vocabulary.js';
import {REVIEWED_100_NAMES,REVIEWED_100_LABELS,REVIEWED_100_NOTES} from './reviewed100Vocabulary.js';
import {IBERIAN_NAMES,IBERIAN_LABELS,IBERIAN_NOTES} from './iberianVocabulary.js';
import {EXPANDED_NOTES} from './expandedNotes.js';
import {EXPANDED_NAMES,EXPANDED_LABELS} from './expandedVocabulary.js';
import {V535_NAMES,V535_LABELS,V535_NOTES} from './v535Vocabulary.js';
import {V536_NAMES,V536_LABELS,V536_NOTES} from './v536Vocabulary.js';
// Display translations only: canonical dynasty and territory keys stay intact.
export const PROFILE_LABELS = {
  ...FOURTH_200_LABELS,
  ...THIRD_100_LABELS,
  ...ROSES_LABELS,
  ...REVIEWED_NEXT_100_LABELS,
  ...REVIEWED_100_LABELS,
  'Jagellón':'Jagiellon','Kotromanić':'Kotromanić',Piast:'Piast',Ban:'Ban','Ban / Rey':'Ban / King',
  ...EXPANDED_LABELS,
  ...V535_LABELS,
  ...V536_LABELS,
  ...IBERIAN_LABELS,
  'Anjou-Hungría':'Anjou-Hungary', 'Anjou-Durazzo':'Anjou-Durazzo', 'Capeto':'Capet', 'Plantagenet':'Plantagenet', 'Poitiers':'Poitiers', 'Tudor':'Tudor', 'Osmanlí':'Ottoman',
  'Nápoles':'Naples', 'Hungría':'Hungary', 'Croacia':'Croatia', 'Acaya':'Achaea', 'Jerusalén':'Jerusalem', 'Comuna de Arezzo':'Commune of Arezzo', 'Polonia':'Poland', 'Inglaterra':'England', 'Irlanda':'Ireland', 'Francia':'France', 'Aquitania':'Aquitaine', 'Normandía':'Normandy', 'Anjou':'Anjou', 'Maine':'Maine', 'Imperio otomano':'Ottoman Empire', 'Corona de San Esteban':'Crown of Saint Stephen',
  'Rey':'King', 'Reina':'Queen', 'Duque':'Duke', 'Duquesa':'Duchess', 'Conde':'Count', 'Príncipe':'Prince', 'Señor':'Lord', 'Sultán':'Sultan', 'Emperador':'Emperor', 'Consorte':'Consort', 'Noble':'Noble', 'Duque / Rey titular':'Duke / Titular king', 'Consorte / Regente':'Consort / Regent', 'Consorte titular':'Titular consort', 'Príncipe consorte':'Prince consort', 'Consorte / Condesa':'Consort / Countess', 'Conde / Regente':'Earl / Regent', 'Conde / Rey':'Count / King', 'Duque consorte':'Duke consort', 'Rey / Conde':'King / Earl', 'Rey de Romanos':'King of the Romans',
  'Conde de Anjou y Maine · Duque de Normandía':'Count of Anjou and Maine · Duke of Normandy', 'Emperatriz · Señora de los ingleses':'Empress · Lady of the English', 'Duquesa de Aquitania · Reina consorte de Francia e Inglaterra':'Duchess of Aquitaine · Queen consort of France and England', 'Rey asociado de Inglaterra':'Junior king of England', 'Rey · Duque de Normandía y Aquitania · Conde de Anjou':'King · Duke of Normandy and Aquitaine · Count of Anjou', 'Duque de Bretaña':'Duke of Brittany', 'Reina consorte de Sicilia · Condesa consorte de Tolosa':'Queen consort of Sicily · Countess consort of Toulouse', 'Reina consorte de Inglaterra':'Queen consort of England', 'Gran almirante otomano':'Ottoman grand admiral', 'Almirante / Gobernador de Argel':'Admiral / Governor of Algiers',
  'reinado':'Kingship', 'ducado':'Duchy', 'condado':'County', 'gobierno':'Government', 'principado':'Principality', 'sultanato':'Sultanate', 'efectivo':'Effective rule', 'gobierno delegado':'Delegated government', 'titular':'Titular', 'ocupación':'Occupation', 'jure uxoris':'Jure uxoris', 'corregente':'Co-ruler', 'Gobiernos':'Governments', 'Gobierno':'Government',
  'Principado':'Principality', 'Ducado':'Duchy', 'Condado':'County', 'Sultanato':'Sultanate', 'Regencia':'Regency', 'Gobierno delegado':'Delegated government', 'Reinado':'Reign', 'Título nominal':'Nominal title', 'Pretensión':'Claim', 'Control disputado':'Disputed control',
};

export const ENGLISH_NAMES = {
  ...FOURTH_200_NAMES,
  ...THIRD_100_NAMES,
  ...ROSES_NAMES,
  ...REVIEWED_NEXT_100_NAMES,
  ...REVIEWED_100_NAMES,
  STEPHEN2BOS:'Stephen II of Bosnia',CASI4:'Casimir IV of Poland',EDUVIGJAGBAV:'Hedwig Jagiellon',JUAN1ALBERTO:'John I Albert of Poland',
  VLADISLAVBOS:'Vladislav of Bosnia',DABISABOS:'Stephen Dabiša of Bosnia',TVRTKO1BOS:'Tvrtko I of Bosnia',OSTOJABOS:'Stephen Ostoja of Bosnia',
  ENRIQ6LUX:'Henry VI of Luxembourg',PHILIPPALUXAVES:'Philippa of Luxembourg',JUAN1B:'John of Bohemia',
  BOLESL:'Bolesław the Pious',PREM2:'Przemysł II of Poland',EDUVK:'Hedwig of Kalisz',ISABRP:'Elizabeth Richeza of Poland',BEATSIL:'Beatrice of Silesia',
  FED1BARBARROJA: "Frederick I",
  ...EXPANDED_NAMES,
  ...V535_NAMES,
  ...V536_NAMES,
  ...IBERIAN_NAMES,
  FELIPE2TAR:'Philip II of Taranto', ROBERTO2TAR:'Robert of Taranto', JAMES1CYPRUS:'James I of Cyprus', LUISDURAZZO:'Louis of Durazzo', MARGSANSEVERINO:'Margaret Sanseverino', MARGDUR:'Margaret of Durazzo', LADISLAONAP:'Ladislaus of Naples', INESDUR:'Agnes of Durazzo', CARLODURAZZO:'Charles, Duke of Durazzo', JUANA2NAP:'Joanna II of Naples', JUANDURAZZO:'John of Durazzo', SEGIS1:'Sigismund of Luxembourg', LUIS1:'Louis I of Hungary', MARIA1H:'Mary, Queen of Hungary', LUIS2ANJOU:'Louis II of Anjou', LUIS1ANJOU:'Louis I of Anjou', JUANA1NAP:'Joanna I of Naples', CARLOS1:'Charles I of Hungary', ISABPI:'Elizabeth of Poland', MARGLUX:'Margaret of Bohemia', ISABBOS:'Elizabeth of Bosnia', EDUV1:'Jadwiga of Poland', ANDRES1ANJOU:'Andrew, Duke of Calabria', CATANJ:'Catherine of Anjou', ISABESLAV:'Elizabeth of Slavonia', CLEMHUNGRIA:'Clementia of Hungary', CARLOSM:'Charles Martel of Anjou', CARLOS3NAP:'Charles of Durazzo', LADI2:'Władysław II Jagiełło', LADI1:'Władysław I of Poland', CASI3:'Casimir III of Poland', JELENASUBICBOS:'Jelena Šubić', BARBCEL:'Barbara of Cilli', CARLOS4:'Charles IV of Luxembourg', JUAN2ARAG:'John II of Aragon', FERN1ARAG:'Ferdinand I of Aragon', ENRIQ2CAST:'Henry II of Castile', PEDRO4ARAG:'Peter IV of Aragon',
  GODOFREDO5ANJ:'Geoffrey V of Anjou', MATILDEEMPERATRIZ:'Empress Matilda', ELEANORAQUIT:'Eleanor of Aquitaine', LEONORINGCAST:'Eleanor of England', ENRIQUEJOVEN:'Henry the Young King', RICARDO1ING:'Richard I of England', GODOFREDO2BRET:'Geoffrey II of Brittany', JUANAINGSIC:'Joan of England', JUANSINTIERRA:'John, King of England', MATILDAING:'Matilda of England', ARTURO1BRET:'Arthur I of Brittany', JOANENGLANDSCOT:'Joan of England', ISABELINGHOH:'Isabella of England', ENRIQ3ING:'Henry III of England', RICARDOCORNUALLES:'Richard of Cornwall', MARGARETENGLANDSCOT:'Margaret of England', FULK5JER:'Fulk V of Anjou', BERENGUELANAV:'Berengaria of Navarre', WILLIAMMARSHAL:'William Marshal', RAYMONDPOITIERS:'Raymond of Poitiers', ISABELANG:'Isabella of Angoulême', GILBERTCLARE1180:'Gilbert de Clare, Earl of Gloucester', LUIS7FRA:'Louis VII of France', HENRY2ING:'Henry II of England', LUIS8FRA:'Louis VIII of France', LUIS6FRA:'Louis VI of France', FEL2FRA:'Philip II of France', PIERRE1BRET:'Peter of Dreux',
  ENRIQ8ING:'Henry VIII of England', ANABOLENA:'Anne Boleyn', EDUARDO6ING:'Edward VI of England', MARIA1ING:'Mary I of England', MARGARETTUDOR:'Margaret Tudor', MARIATUDOR:'Mary Tudor', ARTUROGALES:'Arthur, Prince of Wales', ENRIQ7ING:'Henry VII of England', CARLOS1ING:'Charles I of England', JACOBO1ING:'James VI and I', FEL2ESP:'Philip II of Spain', MURROUGH1THOM:'Murrough O’Brien, Earl of Thomond',
  BLANCACAST:'Blanche of Castile', MARGPROV:'Margaret of Provence', FEL3FRA:'Philip III of France', ISABFRA:'Isabella of France', INESFRA:'Agnes of France', ROB1CLER:'Robert, Count of Clermont', MARGFRAN:'Margaret of France', ALPHONSEPOITIERS:'Alphonse of Poitiers', FEL4FRA:'Philip IV of France', MARGARITAFRA:'Margaret of France', LUIS10FRA:'Louis X of France', FEL5FRA:'Philip V of France', CARLOSVAL:'Charles of Valois', ROBERT2DREUX:'Robert II of Dreux', ODONBORG:'Odo of Burgundy',
  SELIM1OSM:'Selim I', SELIM2OSM:'Selim II', MURAD3OSM:'Murad III', BAYEZID2OSM:'Bayezid II', MEHMED3OSM:'Mehmed III', MEHMED2OSM:'Mehmed II', AHMED1OSM:'Ahmed I', IBRAHIM1OSM:'Ibrahim', ALIPASHALEPANTO:'Müezzinzade Ali Pasha', ULUCALI:'Uluç Ali Pasha', CARLOS5:'Charles V',
};

export const PROFILE_NOTES = {
  ...FOURTH_200_NOTES,
  ...THIRD_100_NOTES,
  ...ROSES_NOTES,
  ...REVIEWED_NEXT_100_NOTES,
  ...REVIEWED_100_NOTES,
  ...EXPANDED_NOTES,
  ...V535_NOTES,
  ...V536_NOTES,
  ...IBERIAN_NOTES,
  'Coronado en 1381, entró en Nápoles el 16 de julio; la resistencia de Juana I y Luis de Anjou impide interpretar ese año como doce meses de control exclusivo.':'Crowned in 1381, he entered Naples on 16 July. Resistance by Joanna I and Louis of Anjou means that the year cannot be treated as twelve months of exclusive control.',
  'Coronación el 31 de diciembre de 1385; atentado en Buda el 7 de febrero de 1386. El intervalo anual no acredita dos años completos de reinado.':'Coronation on 31 December 1385; assassination attempt in Buda on 7 February 1386. The annual interval does not represent two complete years of rule.',
  'Rey croata-húngaro desde su coronación de 1385, con oposición de los partidarios de María.':'King of Croatia and Hungary from his coronation in 1385, opposed by Mary’s supporters.',
  'Gobernó Croacia y Dalmacia como delegado de Luis I, no como soberano independiente.':'He governed Croatia and Dalmatia as Louis I’s delegate, rather than as an independent sovereign.',
  'Título nominal tras Jacques de Baux. La Compañía Navarra ejercía el poder local; no se colorea Acaya como dominio efectivo de Carlos.':'A nominal title after James of Baux. The Navarrese Company exercised local power; Achaea is not filled as territory under Charles’s effective rule.',
  'Título jerosolimitano asociado a la titulatura napolitana; sin posesión de Jerusalén.':'The title to Jerusalem accompanied the Neapolitan royal style; it did not confer possession of Jerusalem.',
  'Autoridad militar sobre Arezzo desde 1380, terminada por la conquista y adquisición florentina en 1384; no anexa toda Toscana a Nápoles.':'Military authority over Arezzo from 1380 ended with its conquest and acquisition by Florence in 1384. This did not annex all Tuscany to Naples.',
  'Gobierno delegado de Croacia y Dalmacia; Zara fue su residencia ducal. No fue rey durante esta etapa.':'Delegated government of Croatia and Dalmatia; Zadar was his ducal residence. He was not king during this period.',
  'Título nominal tras la muerte de Jacques de Baux; el gobierno efectivo permaneció en manos de la Compañía Navarra.':'A nominal title after the death of James of Baux; effective government remained in the hands of the Navarrese Company.',
  'Título de la monarquía napolitana, sin dominio efectivo en Tierra Santa.':'A title of the Neapolitan monarchy, without effective rule in the Holy Land.',
  'Autoridad militar y gobierno de su vicario; la ciudad pasó a Florencia en noviembre de 1384.':'Military authority and government by his vicar; the city passed to Florence in November 1384.',
  'Nápoles comienza en 1381 por coronación y conquista; 1382 es la muerte de Juana I. Corfú y Butrinto se consultan como dominios napolitanos desde 1382. Acaya y Jerusalén son títulos nominales. Ragusa conservó sus instituciones y se opuso a Carlos: la dependencia de la Corona húngara no acredita un tributo personal a este rey. No se trasladan a Carlos los vasallos de Luis I sin evidencia propia.':'Rule in Naples begins in 1381 with coronation and conquest; 1382 is the year of Joanna I’s death. Corfu and Butrint appear as Neapolitan domains from 1382. Achaea and Jerusalem are nominal titles. Ragusa retained its institutions and opposed Charles: dependence on the Hungarian crown does not establish personal tribute to this king. Louis I’s vassals are not transferred to Charles without specific evidence.',
  'Reinos de la Corona húngara y, antes de la separación oriental, su voivodato de Transilvania. Cada título conserva su identidad; un príncipe transilvano independiente o un tributario otomano no se integra por compartir soberano o vecindad.':'The kingdoms of the Hungarian crown and, before its eastern separation, the voivodeship of Transylvania. Each title retains its identity; an independent Transylvanian prince or an Ottoman tributary is not included merely because of a shared ruler or proximity.',
  'MedLands da 1371.':'MedLands gives 1371.',
  'Coronación papal, entrada del 16 de julio de 1381 y nueva coronación napolitana del 25 de noviembre de 1381.':'Papal coronation, entry on 16 July 1381 and second coronation in Naples on 25 November 1381.',
  'Últimos párrafos: coronación húngara de 1385 y atentado de 1386.':'Final paragraphs: Hungarian coronation in 1385 and assassination attempt in 1386.',
  'Biografía: coronación de 1385 como rey croata-húngaro.':'Biography: coronation as king of Croatia and Hungary in 1385.',
  'Gobierno de Croacia y Dalmacia, 1369–1376.':'Government of Croatia and Dalmatia, 1369–1376.',
  'Investidura por Luis I, residencia en Zara y partida de mayo de 1376.':'Investiture by Louis I, residence in Zadar and departure in May 1376.',
  'Capítulo sobre la Compañía Navarra: representación nominal de Carlos y gobierno local de los capitanes.':'Chapter on the Navarrese Company: nominal representation of Charles and local government by the captains.',
  'Lista de príncipes de Acaya: Jacques de Baux 1381–1383 y Carlos 1381–1386; solapamiento de reclamaciones.':'List of princes of Achaea: James of Baux, 1381–1383, and Charles, 1381–1386; overlapping claims.',
  '«Leggende, imprese, notizie», pp. 15–16, titulatura monetaria de Carlos III.':'“Leggende, imprese, notizie”, pp. 15–16: Charles III’s royal style on his coins.',
  'Entrega a Carlos en 1380; toma de posesión florentina del 17 de noviembre de 1384.':'Submission to Charles in 1380; Florence took possession on 17 November 1384.',
  'Entrada «MÁRIA of Hungary (1371-Buda 1395)»':'Entry “MÁRIA of Hungary (1371-Buda 1395)”',
};

// These are labels attached to a precise authority record, rather than new
// historical assertions. Fail closed if editorial prose has no translation.
export function translatedProfileText(text, names = ENGLISH_NAMES, claim) {
  if (!text) return text;
  if (PROFILE_NOTES[text]) return PROFILE_NOTES[text];
  const fixed={'Cabecera biográfica':'Biographical heading','Biografía, párrafo 1':'Biography, paragraph 1','Historia → Fechas de reinado':'History → Reign dates','Filiación paterna confirmada en la fuente.':'Paternal relationship confirmed by the source.','Filiación materna confirmada en la fuente.':'Maternal relationship confirmed by the source.','Fuente citada en la explicación de la sucesión':'Source cited in the succession explanation','Sucesión contrastada con la fuente.':'Succession checked against the source.'};
  if(fixed[text])return fixed[text];
  const marriage=text.match(/^Historia → matrimonio de (\d+)$/);if(marriage)return `History → Marriage in ${marriage[1]}`;
  const office=text.match(/^La ficha de autoridad fecha este cargo en (.+)\.$/);if(office)return `The authority record dates this office to ${office[1]}.`;
  if(text==='Conde de Condado de Barcelona, 1516–1556, contrastado con la fuente.')return 'Count of Barcelona, 1516–1556, checked against the source.';
  const checked=text.match(/^(.+) de (.+), (\d+–\d+), contrastado con la fuente\.$/);
  if(checked&&PROFILE_LABELS[checked[1]]&&PROFILE_LABELS[checked[2]])return `${PROFILE_LABELS[checked[1]]} of ${PROFILE_LABELS[checked[2]]}, ${checked[3]}, checked against the source.`;
  if(text==='Datos biográficos: «Königin v. Kastilien u. León v. 1474-1504 u. v. 1479-1504 als Gattin Ferdinands II. auch Königin v. Aragón, auch genannt Isabella die Katholische»')return 'Biographical data: Queen of Castile and León, 1474–1504, and Queen of Aragon as Ferdinand II’s consort, 1479–1504; also called Isabella the Catholic.';
  if(text==='Datos biográficos: «Röm.-dt. Kaiser 1508-1519»')return 'Biographical data: Holy Roman Emperor, 1508–1519.';
  const vital=text.match(/^La ficha de autoridad registra el (nacimiento|fallecimiento) en (.+)\.$/);
  if(vital)return `The authority record gives the ${vital[1]==='nacimiento'?'birth':'death'} as ${vital[2]}.`;
  const relation=text.match(/^La ficha de autoridad enlaza a .+ \(GND ([0-9X]+)\) como (cónyuge|padre|madre)\.$/);
  if(relation)return `The authority record identifies ${names[claim?.value] || 'the linked person'} (GND ${relation[1]}) as ${relation[2]==='cónyuge'?'spouse':relation[2]==='padre'?'father':'mother'}.`;
  if(text.startsWith('Datos vitales: fecha de nacimiento'))return text.replace('Datos vitales: fecha de nacimiento','Vital data: birth date');
  if(text==='Datos vitales: fecha de fallecimiento')return 'Vital data: death date';
  const locator=text.match(/^Relaciones con personas: (cónyuge|padre|madre) → GND ([0-9X]+)$/);
  if(locator)return `Relationships: ${locator[1]==='cónyuge'?'spouse':locator[1]==='padre'?'father':'mother'} → GND ${locator[2]}`;
  throw new Error(`Missing complete-profile translation: ${text}`);
}
