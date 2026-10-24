// Regional review of North Africa, the Levant and the last gaps in Cyprus,
// 1200–1800. Cells are selected by their centroid in the location inventory
// and grouped into historical zones; each zone has a complete chronology, so
// every cell has exactly one attribution in every year. Cells that other
// reviews already govern in these years (northern Syria, Ceuta, Lampedusa)
// stay out. Annual cuts are conventional and the precision is regional.
import fs from 'node:fs';
import path from 'node:path';
import {projectRoot, mapDataFile} from '../lib/project-paths.mjs';
import {compactBalkanRoutes} from './build-balkans-routes.mjs';

const FROM = 1200, THROUGH = 1800;
const read = name => JSON.parse(fs.readFileSync(mapDataFile(name)));
const inventory = read('location-inventory.json').cells.filter(cell => cell.visible && cell.centroid);
const governedElsewhere = new Set(['Aleppo', 'Antioch', 'Artah', 'Idlib', 'Jabbul', 'Latakia', 'Marrat', 'Zardana', 'Ceuta', 'Lampedusa']);

const T = slug => `https://www.treccani.it/enciclopedia/${slug}/`;
const sources = {
  almohadi: {title: 'Treccani · Almohadi', url: T('almohadi'), locator: 'Fundación en 1147 y desaparición en 1269 con la toma de Marrakech por los benimerines.'},
  merinidi: {title: 'Treccani · Merìnidi', url: T('merinidi'), locator: 'Sustituyen a los almohades (Marrakech, 1269); los suplantan después los wattasíes.'},
  wattasidi: {title: 'Treccani · Wattàsidi', url: T('wattasidi'), locator: 'Rama colateral de los benimerines, en el poder desde mediados del siglo XV hasta la primera mitad del XVI.'},
  marocco: {title: 'Treccani · Marocco', url: T('marocco'), locator: 'Benimerines (siglos XIII–XV), wattasíes (XV–XVI) y las dinastías jerifianas saadí y filalí (alauí).'},
  hafsidi: {title: 'Treccani · Hàfsidi', url: T('hafsidi'), locator: 'Independencia de los almohades en 1236, extensión a Argelia, ramas de Túnez y Bugía y fin en 1574 como provincia otomana.'},
  algeri: {title: 'Treccani · Algeri', url: T('algeri'), locator: 'En el siglo XVI la autoridad turca se afirma de forma estable y Argel pasa a capital del más poderoso de los Estados berberiscos.'},
  tunisi: {title: 'Treccani · Tunisi', url: T('tunisi'), locator: 'Esplendor hafsí, protectorado español, reconquista otomana definitiva en 1574 y gobierno efectivo de deyes y beyes.'},
  tripoli: {title: 'Treccani · Tripoli', url: T('tripoli'), locator: 'Hafsí en los siglos XIII–XIV; española en 1510, de los caballeros de Malta desde 1530 y otomana desde 1551.'},
  tripolitania: {title: 'Treccani · Tripolitania', url: T('tripolitania'), locator: 'Interludio de Qaraqush (1185–1212), hegemonía hafsí, tribus independientes, conquista otomana de 1551 y soberanía nominal bajo los Caramanli.'},
  cirenaica: {title: 'Treccani · Cirenaica', url: T('cirenaica'), locator: 'Dominio turco en el siglo XVI, limitado a la costa; el interior quedó en gran parte a su suerte.'},
  fezzan: {title: 'Treccani · Fezzan', url: T('fezzan'), locator: 'Oasis del Uadi Sciati, el Uadi el-Agial y el Uadi Bergiug, con poblaciones sedentarias y nómadas tuareg y tubu.'},
  orano: {title: 'Treccani · Orano', url: T('orano'), locator: 'Conquista española en 1509 y recuperación en 1732; los cortes de pérdida (1708) y evacuación (1792) siguen la revisión del Instituto de Historia y Cultura Naval, fuente orano1708.'},
  melilla: {title: 'Treccani · Melilla', url: T('melilla'), locator: 'Puerto del reino de Tremecén, ocupado por España en 1497.'},
  bejaia: {title: 'Treccani · Bejaïa', url: T('bejaia'), locator: 'Centro almohade y conquista otomana en 1555. La entrada española se fecha en 1510 siguiendo la Revista de Historia Naval 50, fuente presidios.'},
  tangier: {title: 'Ottoman History Podcast · The English in 17th-Century Tangier', url: 'https://www.ottomanhistorypodcast.com/2018/10/english-tangier.html', locator: 'Tánger portugués desde 1471, dote de Catalina de Braganza, ocupación inglesa desde 1662 y evacuación en 1684.'},
  safi: {title:'HPIP · Safi',url:'https://hpip.org/pt/Contents/Place/376',locator:'Conquista efectiva de Safí en 1508 y abandono portugués en 1541; la factoría y el protectorado anteriores no equivalen a ocupación de la ciudad.'},
  azemmour: {title:'HPIP · Azemmour',url:'https://hpip.org/pt/Contents/Place/561',locator:'Vasallaje desde 1486; conquista portuguesa en 1513 y evacuación en octubre de 1541.'},
  agadir: {title:'HPIP · Agadir, arquitectura militar',url:'https://hpip.org/en/heritage/details/1930',locator:'Castillo de João Lopes de Sequeira fundado en 1505; plaza perdida ante los saadíes en 1541.'},
  mogador: {title:'HPIP · Castelo Real de Mogador',url:'https://hpip.org/pt/heritage/details/1931',locator:'Construcción portuguesa desde julio de 1506; pérdida del Castelo Real antes del final de 1510.'},
  aguz: {title:'Ministério da Defesa Nacional de Portugal · O corso e a pirataria no golfo luso-hispano-marroquino',url:'https://www.defesa.gov.pt/pt/defesa/organizacao/comissoes/cphm/rphm/edicoes/ano2/n22022/corso/',locator:'Fortalezas satélite portuguesas de Aguz desde 1508; véase HPIP para su abandono hacia 1524–1525.'},
  aguzEnd: {title:'HPIP · Castelo de Aguz',url:'https://hpip.org/pt/heritage/details/922',locator:'Concesiones desde 1508, castillo de piedra construido a partir de 1519 y fin de la presencia hacia 1524–1525.'},
  asilah: {title:'HPIP · Assilah',url:'https://hpip.org/pt/Contents/Place/357',locator:'Presencia portuguesa de 1471 a 1550; retorno de 1577 a 1589.'},
  larache: {title:'Archivo General Militar de Madrid · Comandancia General de Larache',url:'https://ejercito.defensa.gob.es/unidades/Madrid/ihycm/Archivos/archivos-generales/agm-madrid-fondo1-5.html',locator:'Ocupación española en 1610 y recuperación marroquí en 1689.'},
  mamora: {title:'Bulletin Hispanique · Chronique, 1946',url:'https://www.persee.fr/doc/hispa_0007-4640_1946_num_48_2_3049',locator:'Flota española ante La Mamora el 3 de agosto de 1614; permanencia hasta 1681.'},
  presidios: {title:'Revista de Historia Naval 50 · Ignacio de Loyola y el mar',url:'https://armada.defensa.gob.es/archivo/mardigitalrevistas/rhn/1995/1995n50.pdf',locator:'Bugía conquistada el 5 de enero de 1510, tras Orán en mayo de 1509; Trípoli en julio de 1510.'},
  orano1708: {title:'Instituto de Historia y Cultura Naval · Cuaderno monográfico 83',url:'https://armada.defensa.gob.es/archivo/mardigitalrevistas/cuadernosihcn/83cuaderno/cm83.pdf',locator:'Orán se pierde en 1708; recuperación de 1732 y evacuación definitiva de 1792.'},
  tunis1569: {title:'Erudition and the Republic of Letters 9 (2024) · The Circulation of Arabic Books from Ifrīqiya',url:'https://brill.com/view/journals/erl/9/3/article-p281_002.pdf',locator:'Página 283: restauración hafsí bajo tributo a Carlos V y guarnición española en La Goleta; Túnez conquistada por gobernadores otomanos de Argel en 1569, recuperada por Juan de Austria en 1573 y conquistada definitivamente en 1574.'},
  tunisiConquistas: {title:'Treccani · Tunisi',url:T('tunisi'),locator:'Conquista de Barbarroja en 1534; restauración hafsí por Carlos V en 1535 y guarnición en La Goleta; nueva toma otomana de 1569, ocupación española de 1573 y conquista otomana definitiva en 1574.'},
  mazagan: {title: 'UNESCO · Portuguese City of Mazagan (El Jadida)', url: 'https://whc.unesco.org/en/list/1058', locator: 'Fortaleza portuguesa construida desde 1514 y abandonada en 1769.'},
  ayyubiti: {title: 'Treccani · Ayyubiti', url: T('ayyubiti'), locator: 'Dominio de Egipto y Siria hasta mediados del siglo XIII; el ramo de Hama se prolonga en el XIV.'},
  mamelucchi: {title: 'Treccani · Mamelucchi', url: T('mamelucchi'), locator: 'Dominio directo en Egipto (1250–1517) y en Siria (1260–1516).'},
  egitto: {title: 'Treccani · Egitto', url: T('egitto'), locator: 'Conquista otomana en 1517 y ocupación francesa de 1798 a 1801.'},
  gerusalemme: {title: 'Treccani · Gerusalemme', url: T('gerusalemme'), locator: 'Federico II en 1229, ocupación egipcia en 1239, restitución en 1243, Egipto desde 1244 y conquista otomana en 1517.'},
  crociate: {title: 'Treccani · Crociate', url: T('crociate'), locator: 'Tratado de Jaffa (1229) y pérdida de Trípoli (1289) y Acre (1291).'},
  cipro: {title: 'Treccani · Cipro', url: T('cipro'), locator: 'Reino de los Lusignan, cesión a Venecia en 1489 y conquista otomana en 1571.'},
};

// Zone predicates on the centroid [x, y] of the cropped map.
const SINAI = new Set(['El_Arish', 'Nekhel', 'Northern_Sinai_Desert1', 'Northern_Sinai_Desert2', 'Connector_Egypt15', 'Sinai_Desert', 'Faran', 'Nuweiba', 'El_Tor', 'Saint_Katrine']);
const zoneOf = ({id, centroid: [x, y]}) => {
  if (governedElsewhere.has(id)) return null;
  if (id === 'Kyrenia' || id === 'Famagusta') return 'chipre';
  if (SINAI.has(id)) return 'egipto';
  if (x >= 676 && x < 698 && y >= 203 && y <= 236) {
    if (['Acre', 'Sidon', 'Beirut'].includes(id)) return 'costa-acre';
    if (id === 'Jaffa') return 'jaffa';
    if (id === 'Safed') return 'safed';
    if (id === 'Jerusalem') return 'jerusalen';
    if (['Tripoli_Syria', 'Tartus', 'Baniyas'].includes(id)) return 'tripoli-siria';
    if (x >= 688 && (y >= 226 || /Desert|Nafud|Hamad|Harrah|Basithah|Sakaka|Dumat|Arar|Kaf|Qurayyat|Nasifah/.test(id))) return 'desierto-sirio';
    return y < 216 ? 'siria' : 'palestina';
  }
  // West of the Canaries only the mainland coast of the Sahara enters the review.
  if (x < 520) return y > 240 ? 'sahara' : null;
  if (x >= 676) return null;
  if (x < 556) return y <= 203.8 ? null : y > 235 ? 'sahara' : y < 217 ? 'marruecos-norte' : 'marruecos-sur';
  if (x < 590.5) return y <= 199.5 ? null : y > 213.5 ? 'sahara' : x < 568 ? 'tremecen' : x < 577 ? 'argel' : 'constantina';
  if (x < 599.5) return y <= 199.5 ? null : y > 219.5 ? 'sahara' : 'tunez';
  if (x < 625) return y <= 205 ? null : y > 238 ? 'fezzan' : 'tripolitania';
  if (x < 646) return y <= 212 ? null : y > 231 ? 'sahara' : y <= 224 ? 'cirenaica-costa' : 'cirenaica-interior';
  return y < 222 ? null : 'egipto';
};

const P = (from, through, identity, governmentTerritories, sourceKeys, note, extra = {}) =>
  ({from, through, identity, governmentTerritories, sourceKeys, note, ...extra});
const OTTOMAN = ['Imperio otomano'];
const AYYUBID = ['Egipto'], MAMLUK = ['Egipto'];
const LEVANT_TAIL = otto => [P(1260, otto - 1, 'Sultanato mameluco', MAMLUK, ['mamelucchi'], 'Siria y Palestina bajo los sultanes mamelucos de El Cairo.'),
  P(otto, THROUGH, 'Imperio otomano', OTTOMAN, ['mamelucchi', 'gerusalemme'], 'Provincias otomanas desde la conquista de Selim I.')];
const ALGIERS = from => P(from, THROUGH, 'Regencia de Argel', OTTOMAN, ['algeri'], 'Regencia otomana de Argel. Desde el siglo XVII la gobernaron agás y deyes con amplia autonomía.');

const CHRONOLOGY = {
  'marruecos-norte': [
    P(1200, 1247, 'Califato almohade', ['Califato almohade'], ['almohadi'], 'Marruecos septentrional bajo el califato almohade.'),
    P(1248, 1464, 'Sultanato benimerín', [], ['merinidi', 'marocco'], 'Fez, la capital benimerín, y el norte de Marruecos.'),
    P(1465, 1548, 'Sultanato wattasí', [], ['wattasidi', 'marocco'], 'Los wattasíes suplantan a los benimerines; la revuelta jerifiana de Fez (1465–1471) no se separa.'),
    P(1549, 1665, 'Sultanato saadí', [], ['marocco'], 'Fez bajo los jerifes saadíes. A mediados del siglo XVII el poder se fragmentó entre la zawiya de Dila y otros poderes locales, que el mapa no separa.'),
    P(1666, THROUGH, 'Sultanato alauí', [], ['marocco'], 'La dinastía filalí o alauí, desde la toma de Fez.'),
  ],
  'marruecos-sur': [
    P(1200, 1268, 'Califato almohade', ['Califato almohade'], ['almohadi'], 'Marrakech, capital almohade hasta 1269.'),
    P(1269, 1464, 'Sultanato benimerín', [], ['merinidi', 'almohadi'], 'Marrakech y el sur bajo los benimerines desde 1269.'),
    P(1465, 1523, 'Marruecos meridional · poderes locales', [], ['marocco', 'wattasidi'], 'Tras la caída de los benimerines, Marrakech y el Sus quedaron en manos de emires y jerifes locales hasta la toma de Marrakech por los saadíes.', {authorityCondition: 'control disputado'}),
    P(1524, 1667, 'Sultanato saadí', [], ['marocco'], 'Marrakech, capital saadí desde 1524/1525.'),
    P(1668, THROUGH, 'Sultanato alauí', [], ['marocco'], 'Sultanato alauí desde la toma de Marrakech.'),
  ],
  tremecen: [
    P(1200, 1234, 'Califato almohade', ['Califato almohade'], ['almohadi'], 'Magreb central bajo los almohades.'),
    P(1235, 1336, 'Reino de Tremecén', [], ['melilla', 'marocco'], 'Reino ziyaní de Tremecén.'),
    P(1337, 1348, 'Sultanato benimerín', [], ['merinidi'], 'Ocupación benimerín de Tremecén.', {authorityCondition: 'ocupación'}),
    P(1349, 1351, 'Reino de Tremecén', [], ['melilla'], 'Restauración ziyaní.'),
    P(1352, 1359, 'Sultanato benimerín', [], ['merinidi'], 'Segunda ocupación benimerín.', {authorityCondition: 'ocupación'}),
    P(1360, 1555, 'Reino de Tremecén', [], ['melilla', 'marocco'], 'Reino ziyaní de Tremecén hasta la conquista otomana.'),
    ALGIERS(1556),
  ],
  argel: [
    P(1200, 1234, 'Califato almohade', ['Califato almohade'], ['almohadi'], 'Magreb central bajo los almohades.'),
    P(1235, 1515, 'Reino de Tremecén', [], ['melilla', 'hafsidi'], 'Litoral de Argel en la órbita ziyaní, con periodos hafsíes y poderes urbanos autónomos que el mapa no separa.'),
    ALGIERS(1516),
  ],
  constantina: [
    P(1200, 1235, 'Califato almohade', ['Califato almohade'], ['almohadi'], 'Magreb oriental bajo los almohades.'),
    P(1236, 1524, 'Sultanato hafsí', [], ['hafsidi'], 'Bugía y Constantina, en manos hafsíes; la rama de Bugía se separó en 1284.'),
    ALGIERS(1525),
  ],
  tunez: [
    P(1200, 1235, 'Califato almohade', ['Califato almohade'], ['almohadi', 'hafsidi'], 'Ifriqiya, gobernada por los hafsíes en nombre de los almohades.'),
    P(1236, 1573, 'Sultanato hafsí', [], ['hafsidi', 'tunisi'], 'Sultanato hafsí de Túnez; protectorado español desde 1535; la guarnición española se concentró en La Goleta, sin controlar de forma uniforme toda Ifriqiya.'),
    P(1574, THROUGH, 'Regencia de Túnez', OTTOMAN, ['tunisi', 'hafsidi'], 'Regencia otomana de Túnez; desde finales del siglo XVI el gobierno efectivo pasó a deyes y beyes.'),
  ],
  tripolitania: [
    P(1200, 1212, 'Tripolitania de Qaraqush', [], ['tripolitania'], 'Interludio del aventurero Qaraqush y los Banu Ghaniya frente a los almohades.', {authorityCondition: 'control disputado'}),
    P(1213, 1235, 'Califato almohade', ['Califato almohade'], ['tripolitania', 'almohadi'], 'Restablecimiento almohade.'),
    P(1236, 1509, 'Sultanato hafsí', [], ['tripolitania', 'tripoli'], 'Hegemonía hafsí sobre Trípoli y su comarca.'),
    P(1510, 1550, 'Tripolitania · tribus', [], ['tripolitania'], 'Mientras Trípoli era española y de los caballeros de Malta, el resto del país quedó repartido entre tribus prácticamente independientes.'),
    P(1551, 1710, 'Regencia de Trípoli', OTTOMAN, ['tripolitania', 'tripoli'], 'Regencia otomana de Trípoli.'),
    P(1711, THROUGH, 'Regencia de Trípoli', [], ['tripolitania'], 'Gobierno de los Caramanli; la soberanía otomana fue puramente nominal en el siglo XVIII.', {authorityCondition: 'autonomía tributaria'}),
  ],
  'cirenaica-costa': [
    P(1200, 1550, 'Cirenaica · tribus árabes', [], ['cirenaica'], 'Barca y su costa, entre tribus árabes y dependencias nominales.'),
    P(1551, THROUGH, 'Regencia de Trípoli', OTTOMAN, ['cirenaica', 'tripolitania'], 'Dominio turco, limitado a la zona costera.'),
  ],
  'cirenaica-interior': [P(FROM, THROUGH, 'Cirenaica · tribus árabes', [], ['cirenaica'], 'Interior de Cirenaica, abandonado en gran parte a sí mismo bajo el dominio turco de la costa.')],
  fezzan: [P(FROM, THROUGH, 'Fezzán', [], ['fezzan'], 'Oasis del Fezzán con poblaciones sedentarias y nómadas tuareg y tubu. Las dependencias de Kanem y los tributos a Trípoli no se fechan.')],
  sahara: [P(FROM, THROUGH, 'Tierras saharianas', [], ['marocco', 'cirenaica'], 'Desierto, oasis y confederaciones nómadas sin una autoridad territorial estable que el mapa pueda fechar.')],
  egipto: [
    P(1200, 1249, 'Sultanato ayubí', AYYUBID, ['ayyubiti'], 'Egipto ayubí de al-Adil y al-Kamil.'),
    P(1250, 1516, 'Sultanato mameluco', MAMLUK, ['mamelucchi'], 'Sultanato mameluco de El Cairo.'),
    P(1517, 1797, 'Imperio otomano', OTTOMAN, ['egitto', 'mamelucchi'], 'Provincia otomana; los mamelucos conservaron buena parte del poder.'),
    P(1798, THROUGH, 'Ocupación francesa de Egipto', ['Francia', 'República francesa'], ['egitto'], 'Expedición de Bonaparte y ocupación francesa hasta 1801.', {authorityCondition: 'ocupación'}),
  ],
  'costa-acre': [
    P(1200, 1290, 'Jerusalén', ['Jerusalén'], ['crociate'], 'Acre, Tiro, Sidón y Beirut, núcleo del reino de Jerusalén tras 1187.'),
    P(1291, 1515, 'Sultanato mameluco', MAMLUK, ['crociate', 'mamelucchi'], 'Caída de Acre y de las últimas plazas cruzadas en 1291.'),
    P(1516, THROUGH, 'Imperio otomano', OTTOMAN, ['mamelucchi'], 'Conquista otomana de Siria.'),
  ],
  jaffa: [
    P(1200, 1267, 'Jerusalén', ['Jerusalén'], ['crociate'], 'Jaffa, plaza del reino de Jerusalén.'),
    P(1268, 1516, 'Sultanato mameluco', MAMLUK, ['mamelucchi'], 'Conquista mameluca de Jaffa.'),
    P(1517, THROUGH, 'Imperio otomano', OTTOMAN, ['gerusalemme'], 'Palestina otomana.'),
  ],
  safed: [
    P(1200, 1239, 'Sultanato ayubí', AYYUBID, ['ayyubiti'], 'Galilea ayubí.'),
    P(1240, 1265, 'Jerusalén', ['Jerusalén'], ['crociate'], 'Fortaleza templaria de Safed, restituida a los cruzados.'),
    P(1266, 1515, 'Sultanato mameluco', MAMLUK, ['mamelucchi'], 'Conquista de Baibars.'),
    P(1516, THROUGH, 'Imperio otomano', OTTOMAN, ['mamelucchi'], 'Conquista otomana de Siria.'),
  ],
  jerusalen: [
    P(1200, 1228, 'Sultanato ayubí', AYYUBID, ['ayyubiti', 'gerusalemme'], 'Jerusalén ayubí desde la reconquista de 1187.'),
    P(1229, 1238, 'Jerusalén', ['Jerusalén'], ['gerusalemme', 'crociate'], 'Tratado de Jaffa: Federico II entra en Jerusalén.'),
    P(1239, 1242, 'Sultanato ayubí', AYYUBID, ['gerusalemme'], 'Ocupación egipcia de 1239.'),
    P(1243, 1243, 'Jerusalén', ['Jerusalén'], ['gerusalemme'], 'Restitución temporal a los cristianos.'),
    P(1244, 1249, 'Sultanato ayubí', AYYUBID, ['gerusalemme', 'ayyubiti'], 'Jerusalén pasa al Egipto musulmán.'),
    P(1250, 1516, 'Sultanato mameluco', MAMLUK, ['gerusalemme', 'mamelucchi'], 'Jerusalén bajo el Egipto mameluco.'),
    P(1517, THROUGH, 'Imperio otomano', OTTOMAN, ['gerusalemme'], 'Ocupación de Selim I en 1517.'),
  ],
  'tripoli-siria': [
    P(1200, 1288, 'Trípoli', ['Trípoli'], ['crociate'], 'Condado de Trípoli, con Tortosa y Margat.'),
    P(1289, 1515, 'Sultanato mameluco', MAMLUK, ['crociate', 'mamelucchi'], 'Conquista mameluca de Trípoli en 1289.'),
    P(1516, THROUGH, 'Imperio otomano', OTTOMAN, ['mamelucchi'], 'Conquista otomana de Siria.'),
  ],
  siria: [P(1200, 1259, 'Sultanato ayubí', AYYUBID, ['ayyubiti'], 'Damasco, Homs, Hama y Baalbek bajo príncipes ayubíes.'), ...LEVANT_TAIL(1516)],
  palestina: [P(1200, 1259, 'Sultanato ayubí', AYYUBID, ['ayyubiti'], 'Palestina interior, el Haurán y Transjordania bajo los ayubíes.'), ...LEVANT_TAIL(1517)],
  'desierto-sirio': [P(FROM, THROUGH, 'Desierto sirio · tribus beduinas', [], ['mamelucchi'], 'Estepa y desierto sirio-arábigos, bajo tribus beduinas; la autoridad de los Estados vecinos fue intermitente.')],
  chipre: [
    P(1200, 1488, 'Chipre', ['Chipre'], ['cipro'], 'Reino de Chipre de los Lusignan.'),
    P(1489, 1570, 'Venecia', ['Venecia'], ['cipro'], 'Abdicación de Caterina Cornaro en favor de Venecia.'),
    P(1571, THROUGH, 'Imperio otomano', OTTOMAN, ['cipro'], 'Conquista otomana de 1571.'),
  ],
};
// Coastal fortresses held by Portugal, Castile/Spain or England inside a zone.
// The database records the Spanish monarchs under their effective Castilian office.
// Using an absent «España» mandate would omit the outposts from their personal maps.
const CASTILE = ['Castilla'], SPAIN = ['Castilla'], PORTUGAL = ['Portugal'];
const PRESIDIOS = {
  Melilla: [[1497, 1515, 'Presidios españoles del Magreb', CASTILE, ['melilla']], [1516, THROUGH, 'Presidios españoles del Magreb', SPAIN, ['melilla']]],
  Oran: [[1509, 1515, 'Presidios españoles del Magreb', CASTILE, ['orano']], [1516, 1707, 'Presidios españoles del Magreb', SPAIN, ['orano1708']],
    [1732, 1791, 'Presidios españoles del Magreb', SPAIN, ['orano']]],
  Bejaia: [[1510, 1515, 'Presidios españoles del Magreb', CASTILE, ['presidios']], [1516, 1554, 'Presidios españoles del Magreb', SPAIN, ['presidios', 'bejaia']]],
  Tripoli: [[1510, 1515, 'Presidios españoles del Magreb', CASTILE, ['tripoli']], [1516, 1529, 'Presidios españoles del Magreb', SPAIN, ['tripoli']],
    [1530, 1550, 'Trípoli de los caballeros de Malta', [], ['tripoli']]],
  Tangier: [[1471, 1661, 'Plazas portuguesas del Magreb', PORTUGAL, ['tangier']], [1662, 1683, 'Tánger inglés', ['Inglaterra'], ['tangier']]],
  Asilah: [[1471, 1549, 'Plazas portuguesas del Magreb', PORTUGAL, ['asilah']], [1577, 1588, 'Plazas portuguesas del Magreb', PORTUGAL, ['asilah']]],
  Mazaghan: [[1514, 1768, 'Plazas portuguesas del Magreb', PORTUGAL, ['mazagan']]],
  Asfi: [[1508, 1540, 'Plazas portuguesas del Magreb', PORTUGAL, ['safi']]],
  Azemmour: [[1513, 1540, 'Plazas portuguesas del Magreb', PORTUGAL, ['azemmour']]],
  Agadir: [[1505, 1540, 'Plazas portuguesas del Magreb', PORTUGAL, ['agadir', 'safi']]],
  Mogador: [[1506, 1509, 'Plazas portuguesas del Magreb', PORTUGAL, ['mogador']]],
  Aguz: [[1508, 1524, 'Plazas portuguesas del Magreb', PORTUGAL, ['aguz', 'aguzEnd']]],
  Larache: [[1610, 1688, 'Presidios españoles del Magreb', SPAIN, ['larache']]],
  La_Mamora: [[1614, 1680, 'Presidios españoles del Magreb', SPAIN, ['mamora']]],
  Tunis: [[1534, 1534, 'Imperio otomano', OTTOMAN, ['tunisiConquistas']], [1569, 1572, 'Imperio otomano', OTTOMAN, ['tunis1569', 'tunisiConquistas']], [1573, 1573, 'Presidios españoles del Magreb', SPAIN, ['tunisiConquistas']]],
};

const cellsByZone = new Map();
for (const cell of inventory) {
  const zone = zoneOf(cell);
  if (!zone) continue;
  if (!cellsByZone.has(zone)) cellsByZone.set(zone, []);
  cellsByZone.get(zone).push(cell.id);
}
const ZONE_LABEL = {'marruecos-norte': 'Marruecos septentrional', 'marruecos-sur': 'Marruecos meridional', tremecen: 'Magreb central occidental',
  argel: 'Litoral de Argel', constantina: 'Bugía y Constantina', tunez: 'Ifriqiya', tripolitania: 'Tripolitania', 'cirenaica-costa': 'Costa de Cirenaica',
  'cirenaica-interior': 'Interior de Cirenaica', fezzan: 'Fezzán', sahara: 'Sáhara', egipto: 'Egipto y Sinaí', 'costa-acre': 'Acre, Sidón y Beirut',
  jaffa: 'Jaffa', safed: 'Safed', jerusalen: 'Jerusalén', 'tripoli-siria': 'Trípoli de Siria', siria: 'Siria central', palestina: 'Palestina interior y Transjordania',
  'desierto-sirio': 'Desierto sirio', chipre: 'Kirenia y Famagusta'};

let serial = 0;
const assignments = [];
const phase = (label, p, ids) => {
  serial += 1;
  assignments.push({name: `${label} · ${p.identity} · ${p.from}–${p.through} · revisión África y Levante ${serial}`,
    identity: p.identity, from: p.from, through: p.through, ids, governmentTerritories: p.governmentTerritories,
    sourceKeys: p.sourceKeys, precision: 'regional_approximation', limitedCore: p.limitedCore ?? false, note: p.note,
    scopeLabel: `${label} · ${p.from}–${p.through}`, ...(p.authorityCondition ? {authorityCondition: p.authorityCondition} : {})});
};
for (const [zone, ids] of [...cellsByZone].sort(([a], [b]) => a.localeCompare(b))) {
  const chronology = CHRONOLOGY[zone];
  let next = FROM;
  for (const p of chronology) {
    if (p.from !== next) throw new Error(`Cronología incompleta: ${zone} ${next}`);
    next = p.through + 1;
  }
  if (next !== THROUGH + 1) throw new Error(`Cronología incompleta: ${zone} hasta ${next - 1}`);
  const zoneIds = ids.filter(id => !PRESIDIOS[id]).sort();
  for (const p of chronology) phase(ZONE_LABEL[zone], p, zoneIds);
  // A fortress follows its zone outside the years of European possession.
  for (const id of ids.filter(id => PRESIDIOS[id]).sort()) {
    const held = PRESIDIOS[id].map(([from, through, identity, governmentTerritories, sourceKeys]) =>
      P(from, through, identity, governmentTerritories, sourceKeys, `Plaza de ${id.replaceAll('_', ' ')}. La celda aproxima su localización y no acredita dominio sobre todo el entorno rural. Corte anual por la situación al final del año; conquista o evacuación dentro del año se documentan en las fuentes.`, {limitedCore:true, ...(id === 'Tunis' ? {authorityCondition:'ocupación'} : {})}));
    const pieces = [];
    for (const p of chronology) {
      let cursor = p.from;
      for (const h of held.filter(h => h.through >= p.from && h.from <= p.through)) {
        if (h.from > cursor) pieces.push({...p, from: cursor, through: h.from - 1});
        cursor = Math.max(cursor, h.through + 1);
      }
      if (cursor <= p.through) pieces.push({...p, from: cursor, through: p.through});
    }
    for (const p of [...pieces, ...held].sort((a, b) => a.from - b.from)) phase(id.replaceAll('_', ' '), p, [id]);
  }
}

const ids = [...cellsByZone.values()].flat().sort();
const review = {
  schema: 1, reviewedAt: '2026-10-24',
  scope: {name: 'Norte de África, Levante y Chipre', from: FROM, through: THROUGH, ids},
  precedenceIds: ids, limitedCore: false, assignments, sources,
  limitations: [
    'Las zonas agrupan celdas por su centroide: Marruecos, el Magreb central en tres franjas, Ifriqiya, Tripolitania, Cirenaica, el Fezzán, el Sáhara, Egipto y Levante.',
    'Los cortes anuales son convencionales. Las ocupaciones breves, los tributos y las fragmentaciones internas (zawiya de Dila, emires hintata, ramas hafsíes) se mencionan en las notas sin dibujar fronteras propias.',
    'Las plazas europeas ocupan celdas de referencia, con alcance limitado al núcleo; sus superficies no reconstruyen el perímetro de las fortificaciones. Los años de transición siguen la situación al cierre del año. No hay celdas independientes para Alcácer Ceguer, Mazalquivir, La Goleta ni los peñones; no se les asigna toda una ciudad o provincia vecina.',
    'El desierto y las estepas se muestran como tierras de autoridad nómada: no prueban ausencia de vínculos con los Estados vecinos.',
  ],
};
fs.writeFileSync(mapDataFile('north-africa-levant-review.json'), JSON.stringify(review, null, 2) + '\n');
fs.writeFileSync(path.join(projectRoot, 'src/cartography/regions/northAfricaLevantRouteData.json'), JSON.stringify(compactBalkanRoutes(review)) + '\n');
console.log(`Norte de África y Levante: ${ids.length} celdas, ${assignments.length} fases.`);
console.log(Object.fromEntries([...cellsByZone].map(([zone, list]) => [zone, list.length])));
