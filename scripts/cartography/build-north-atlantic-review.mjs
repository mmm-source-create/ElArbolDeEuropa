// 6.0.13 regional review: Ireland, Wales and Man, Iceland, Gotland, Finland,
// Lapland, Kola, Greenland and Jan Mayen, 1200–1800. It only fills the
// cell-years that no other layer colours (computed from the common map with
// this review removed), so it never overrides earlier reviews. Cells are
// grouped by zone; each zone has a complete chronology and every phase is
// clipped to the uncoloured years of each cell. The precision is regional:
// Gaelic lordships, Welsh principalities and Sámi tax lands that shared a
// zone are named in the notes rather than given borders.
// Usage: node scripts/cartography/build-north-atlantic-review.mjs
import fs from 'node:fs';
import path from 'node:path';
import {mapDataFile, projectRoot} from '../lib/project-paths.mjs';
import {compactBalkanRoutes} from './build-balkans-routes.mjs';
import {execFileSync} from 'node:child_process';

// The common map reads this review's own routes; empty them before loading it
// so that the gaps are computed without the previous run.
const ROUTES = path.join(projectRoot, 'src/cartography/regions/northAtlanticRouteData.json');
const RESIDUAL = process.argv[2] === '--residual';
if (!RESIDUAL) fs.writeFileSync(ROUTES, JSON.stringify({coverageIds: [], assignments: [], authorityScopes: [], sources: {}}) + '\n');
const {PERSONAS} = await import('../../src/data/personas.js');
const {europeMosaicAt} = await import('../../src/cartography/europePanorama.js');
const {applyRegionalReview} = await import('./apply-regional-review.mjs');
const readFile = name => JSON.parse(fs.readFileSync(mapDataFile(name), 'utf8'));
// Child mode: the cell-years of the current review still empty with its routes loaded.
if (RESIDUAL) {
  const current = readFile('north-atlantic-review.json');
  const applied = readFile('corridor-locations.json');
  applied.additionalTerritories = applied.additionalTerritories.filter(layer => !new Set(applied.northAtlanticReview?.layerNames || []).has(layer.name));
  delete applied.northAtlanticReview;
  applyRegionalReview(applied, current, 'northAtlanticReview', 'Atlántico norte');
  applied.burgundy = readFile('burgundian-locations.json');
  const out = {};
  for (let year = 1200; year <= 1800; year++) {
    const mosaic = europeMosaicAt(applied, year, PERSONAS);
    for (const id of current.scope.ids) if (!mosaic.byLocation.has(id)) (out[id] ||= []).push(year);
  }
  process.stdout.write(JSON.stringify(out));
  process.exit(0);
}

const FROM = 1200, THROUGH = 1800, KEY = 'northAtlanticReview';
const read = name => JSON.parse(fs.readFileSync(mapDataFile(name), 'utf8'));
const T = slug => `https://www.treccani.it/enciclopedia/${slug}/`;
const sources = {
  irlanda: {title: 'Treccani · Irlanda', url: T('irlanda'), locator: 'Provincias de Ulster, Leinster, Connacht, Desmond y Thomond; caballeros normandos en 1170 y reparto de tierras por Enrique II; estatutos de Kilkenny (1367); título de rey de Irlanda (1541); centralismo administrativo desde Jacobo I (1603).'},
  galles: {title: 'Treccani · Galles', url: T('galles'), locator: 'Reinos de Gwynedd, Powys y Deheubarth; paz de Montgomery (1267); muerte de Llywelyn II (1282) e incorporación por Eduardo I (1284).'},
  man: {title: 'Treccani · Man', url: T('man'), locator: 'Reino de Godred Crovan; Escocia en 1266; protección de Eduardo I en 1290; Robert Bruce en 1313; inglesa desde 1346; los Stanley desde 1406, los Atholl después y compra por el Parlamento en 1765.'},
  islanda: {title: 'Treccani · Islanda', url: T('islanda'), locator: 'Independencia, con el Althing, hasta el «viejo tratado» de 1264 con Haakon IV, que reconoce la alta soberanía de Noruega.'},
  gotland: {title: 'Treccani · Gotland', url: T('gotland'), locator: 'Autónoma bajo la alta soberanía de los reyes de Suecia; ocupada por Dinamarca en 1361; devastada por piratas a fines del siglo XIV; de la Orden Teutónica en 1398–1408.'},
  visby: {title: 'Treccani · Visby', url: T('visby'), locator: 'Gran emporio de la Hansa; danesa desde 1361 tras un largo asedio.'},
  finlandia: {title: 'Treccani · Finlandia', url: T('finlandia'), locator: 'Cruzadas suecas, Viborg (1293) y paz de Pähkinälinna (1323), que fija la frontera oriental sueca desde el istmo de Carelia hasta el golfo de Botnia.'},
  finland: {title: 'VLE · Suomijos istorija', url: 'https://www.vle.lt/straipsnis/suomijos-istorija/', locator: 'Fronteras de Nöteborg 1323, Stolbovo 1617, Nystad 1721 y Åbo 1743; Finlandia occidental continúa sueca hasta 1809.'},
  karelia: {title: 'VLE · Karelijos istorija', url: 'https://www.vle.lt/straipsnis/karelijos-istorija/', locator: 'Carelia vinculada con Nóvgorod; partición de 1323 y transferencia a Suecia en 1617.'},
  kajaani: {title: 'Store norske leksikon · Kajana', url: 'https://snl.no/Kajaani', locator: 'Kajana (Kajaani), en Kainuu, fundada en 1604.'},
  lapponia: {title: 'Treccani · Lapponia', url: T('lapponia'), locator: 'Región de los sami sin límites precisos, repartida entre Suecia, Noruega, Finlandia y Rusia.'},
  lappekodisillen: {title: 'Store norske leksikon · Lappekodisillen', url: 'https://snl.no/Lappekodisillen', locator: 'Codicilo del tratado de fronteras de 1751 entre Dinamarca-Noruega y Suecia (con Finlandia): ciudadanía, impuestos y paso de los sami con sus renos.'},
  kola: {title: 'Store norske leksikon · Kolahalvøya', url: 'https://snl.no/Kolahalv%C3%B8ya', locator: 'Interés de la república de Nóvgorod desde el siglo XII; bajo el principado de Moscú desde 1478.'},
  groenlandiaSnl: {title: 'Store norske leksikon · Grønlands historie', url: 'https://snl.no/Gr%C3%B8nlands_historie', locator: 'Austerbygd y Vesterbygd; acuerdo de 1261 con Haakon Haakonsson, que une las colonias nórdicas al reino noruego; Austerbygd habitada hasta hacia 1450.'},
  groenlandia: {title: 'Treccani · Groenlandia', url: T('groenlandia'), locator: 'Fin de los contactos con Europa a fines del siglo XV; colonos fundidos con los inuit; Egede en 1721 y colonia danesa desde 1721, extendida durante el siglo XVIII.'},
  janMayen: {title: 'Store norske leksikon · Jan Mayen', url: 'https://snl.no/Jan_Mayen', locator: 'Isla bautizada por Jan Jacobsz May, que llegó en 1614; sin población permanente.'},
};

const P = (from, through, identity, governmentTerritories, sourceKeys, note, extra = {}) => ({from, through, identity, governmentTerritories, sourceKeys, note, ...extra});
const LORDSHIP = (from, through, note) => P(from, through, 'Irlanda', ['Irlanda'], ['irlanda'], note || 'Señorío de Irlanda de los reyes de Inglaterra.');
const KINGDOM = (from, note) => P(from, THROUGH, 'Irlanda', ['Irlanda'], ['irlanda'], note || 'Reino de Irlanda, bajo los reyes de Inglaterra y, desde 1707, de Gran Bretaña.');
const AFTER_1603 = KINGDOM(1603, 'Reino de Irlanda: desde Jacobo I (1603), la administración de la Corona se extiende a los antiguos señoríos gaélicos.');
const LOCAL = {authorityCondition: 'autoridad regional'};

const CHRONOLOGY = {
  'tir-chonaill': [P(FROM, 1606, 'Tír Chonaill', ['Tír Chonaill', 'Condado de Tyrconnell'], ['irlanda'], 'Señorío de los O’Donnell en el noroeste del Ulster.'),
    KINGDOM(1607, 'Reino de Irlanda tras el último señor O’Donnell registrado (1607).')],
  'tir-eoghain': [P(FROM, 1606, 'Tír Eoghain', ['Tír Eoghain', 'Condado de Tyrone'], ['irlanda'], 'Señorío de los O’Neill en el Ulster central; Fermanagh (Maguire) y el país de los O’Cahan no se separan.'),
    KINGDOM(1607, 'Reino de Irlanda tras el último señor O’Neill registrado (1607).')],
  'ulster-este': [P(FROM, 1326, 'Condado de Ulster', ['Condado de Ulster'], ['irlanda'], 'Condado anglonormando de Ulster, dentro del señorío de Irlanda.'),
    P(1327, 1602, 'Ulster gaélico', [], ['irlanda'], 'Tras el último conde de Ulster registrado, linajes gaélicos (O’Neill de Clandeboye) y escoceses (MacDonnell) que el mapa no separa; la Corona retuvo enclaves como Carrickfergus.', LOCAL),
    AFTER_1603],
  'breifne-oriel': [P(FROM, 1602, 'Ulster gaélico', [], ['irlanda'], 'Breifne (O’Rourke y O’Reilly) y Oriel (MacMahon): señoríos gaélicos que el mapa no separa.', LOCAL), AFTER_1603],
  connacht: [P(FROM, 1274, 'Connacht', ['Connacht'], ['irlanda'], 'Reino de Connacht de los O’Conor.'),
    P(1275, 1602, 'Connacht', ['Connacht', 'Clanricarde', 'Vizcondado de Mayo'], ['irlanda'], 'Señoríos de los de Burgh (Clanricarde y Mayo) y de los O’Conor tras la llegada anglonormanda; el mapa no los separa.', LOCAL),
    AFTER_1603],
  midlands: [LORDSHIP(FROM, 1540, 'Meath y el interior del señorío de Irlanda, con señoríos gaélicos (O’Farrell, O’Connor Faly, O’More) que el mapa no separa.'), KINGDOM(1541)],
  'leinster-sur': [LORDSHIP(FROM, 1346, 'Leinster anglonormando, dentro del señorío de Irlanda.'),
    P(1347, 1602, 'Leinster', ['Leinster'], ['irlanda'], 'Reino gaélico de los MacMurrough Kavanagh en el sur del Leinster; Kilkenny, sede de los Butler, y los O’Byrne de Wicklow no se separan.', {authorityCondition: 'control disputado'}),
    AFTER_1603],
  ormond: [LORDSHIP(FROM, 1538, 'Tierras de los Butler dentro del señorío de Irlanda; el condado de Ormond se registra en el Atlas desde 1539.'), KINGDOM(1541)],
  'desmond-geraldino': [LORDSHIP(FROM, 1519, 'Tierras de los FitzGerald de Desmond dentro del señorío de Irlanda; el condado de Desmond se registra en el Atlas desde 1520.'),
    P(1520, 1583, 'Condado de Desmond', ['Condado de Desmond'], ['irlanda'], 'Condado de los FitzGerald de Desmond.'),
    KINGDOM(1584, 'Reino de Irlanda tras el último conde de Desmond registrado (1583).')],
  thomond: [P(FROM, 1602, 'Thomond', ['Thomond', 'Condado de Thomond'], ['irlanda'], 'Reino y, desde 1543, condado de los O’Brien.'), AFTER_1603],
  'desmond-maccarthy': [P(FROM, 1602, 'Desmond', ['Desmond'], ['irlanda'], 'Reino y señorío de los MacCarthy Mór en el suroeste.'), AFTER_1603],
  'ciudades-reales': [LORDSHIP(FROM, 1540, 'Ciudades portuarias del rey en el señorío de Irlanda.'), KINGDOM(1541)],
  gales: [P(FROM, 1282, 'Gales', [], ['galles'], 'Principados galeses (Gwynedd, Powys, Deheubarth) y señoríos de la Marca, que el mapa no separa, hasta la muerte de Llywelyn II (1282).', LOCAL)],
  man: [P(FROM, 1265, 'Reino de Man y las Islas', [], ['man'], 'Reino de los descendientes de Godred Crovan.'),
    P(1266, 1289, 'Escocia', [], ['man'], 'Man, de la Corona escocesa desde 1266.'),
    P(1290, 1312, 'Inglaterra', [], ['man'], 'Bajo la protección de Eduardo I desde 1290.', {authorityCondition: 'control disputado'}),
    P(1313, 1345, 'Escocia', [], ['man'], 'Conquista de Robert Bruce (1313).', {authorityCondition: 'control disputado'}),
    P(1346, 1405, 'Inglaterra', [], ['man'], 'Inglesa desde 1346, con Eduardo III.'),
    P(1406, 1764, 'Señorío de Man', [], ['man'], 'Señores de Man: los Stanley desde 1406 y después los Atholl.'),
    P(1765, THROUGH, 'Gran Bretaña', [], ['man'], 'El Parlamento compró los derechos de los Atholl en 1765.')],
  islandia: [P(FROM, 1263, 'Mancomunidad islandesa', [], ['islanda'], 'Islandia sin rey, con el Althing, hasta el «viejo tratado» con Haakon IV (1264).')],
  gotland: [P(FROM, 1360, 'Gotland y Visby', [], ['gotland', 'visby'], 'Gotland autónoma bajo la alta soberanía de los reyes de Suecia; Visby, gran emporio de la Hansa.', {authorityCondition: 'autonomía tributaria'}),
    P(1361, 1397, 'Gotland y Visby', [], ['gotland'], 'Ocupada por Dinamarca en 1361 y devastada por piratas a fines del siglo XIV.', {authorityCondition: 'control disputado'}),
    P(1398, 1407, 'Prusia de la Orden', [], ['gotland'], 'Posesión de la Orden Teutónica (1398–1408).')],
  'finlandia-sur': [P(FROM, 1249, 'Comunidades finesas', [], ['finlandia'], 'Tierras de los finlandeses propios y los tavastios antes de la conquista sueca; las cruzadas y fortalezas suecas no se fechan por separado.', LOCAL)],
  'finlandia-centro': [P(FROM, 1322, 'Comunidades finesas', [], ['finlandia', 'finland'], 'Tierras finesas y de frontera hasta la paz de Pähkinälinna (1323), que llevó la frontera sueca hasta el golfo de Botnia.', LOCAL),
    P(1323, THROUGH, 'Suecia', ['Suecia'], ['finlandia', 'finland'], 'Finlandia sueca desde la paz de Pähkinälinna.')],
  laponia: [P(FROM, 1750, 'Laponia', [], ['lapponia', 'lappekodisillen'], 'Tierras de los sami sin frontera fija; Noruega, Suecia y Nóvgorod, después Rusia, cobraban tributo en zonas que se superponían.', {authorityCondition: 'autonomía tributaria'}),
    P(1751, THROUGH, 'Suecia', ['Suecia'], ['lappekodisillen'], 'Laponia sueca y finlandesa desde el tratado de fronteras de 1751.')],
  'laponia-noruega': [P(FROM, 1750, 'Laponia', [], ['lapponia', 'lappekodisillen'], 'Tierras de los sami sin frontera fija; Noruega, Suecia y Nóvgorod, después Rusia, cobraban tributo en zonas que se superponían.', {authorityCondition: 'autonomía tributaria'}),
    P(1751, THROUGH, 'Noruega', ['Noruega'], ['lappekodisillen'], 'Interior de Finnmark, noruego desde el tratado de fronteras de 1751.')],
  kola: [P(FROM, 1477, 'República de Nóvgorod', [], ['kola'], 'Laponia de Kola, tierras de tributo de Nóvgorod.', {authorityCondition: 'autonomía tributaria'}),
    P(1478, THROUGH, 'Rusia', ['Rusia'], ['kola'], 'Bajo Moscú desde 1478.')],
  kainuu: [P(FROM, 1603, 'Carelia y Kainuu', [], ['finlandia', 'finland'], 'Tierras de frontera al norte de la línea de Pähkinälinna, disputadas entre Suecia y Nóvgorod, después Rusia.', {authorityCondition: 'control disputado'}),
    P(1604, THROUGH, 'Suecia', ['Suecia'], ['kajaani', 'finland'], 'Kainuu sueca: Kajana, fundada en 1604.')],
  'carelia-norte': [P(FROM, 1616, 'Carelia y Kainuu', [], ['karelia', 'finlandia'], 'Carelia septentrional, vinculada a Nóvgorod y después a Rusia, al este de la línea de 1323.', {authorityCondition: 'control disputado'}),
    P(1617, THROUGH, 'Suecia', ['Suecia'], ['karelia', 'finland'], 'Sueca desde la paz de Stolbovo (1617).')],
  groenlandia: [P(FROM, 1260, 'Groenlandia nórdica', [], ['groenlandiaSnl'], 'Austerbygd, la colonia nórdica del sur, con asamblea propia.'),
    P(1261, 1449, 'Noruega', ['Noruega'], ['groenlandiaSnl'], 'Las colonias nórdicas, unidas al reino noruego desde 1261; la Austerbygd se mantuvo hasta hacia 1450.'),
    P(1450, 1720, 'Groenlandia inuit', [], ['groenlandia', 'groenlandiaSnl'], 'Sin colonias europeas: tierras de los inuit.', {authorityCondition: 'autoridad regional'}),
    P(1721, THROUGH, 'Dinamarca', [], ['groenlandia'], 'Colonia danesa desde 1721; la ocupación se extendió a lo largo del siglo XVIII.')],
  'jan-mayen': [P(FROM, THROUGH, 'Islas sin autoridad política documentada', [], ['janMayen'], 'Isla deshabitada, bautizada en 1614.')],
};

// Ireland cell by cell; the rest by centroid.
const IRELAND = {
  'tir-chonaill': ['Inishowen', 'Kilmacrennan', 'Raphoe', 'Donegal'],
  'tir-eoghain': ['Strabane', 'Dungannon', 'Clogher', 'Coleraine', 'Derry', 'Magherafelt', 'Armagh', 'Enniskillen', 'Belcoo'],
  'ulster-este': ['Ballycastle', 'Dunluce', 'Ballymena', 'Carrickfergus', 'Belfast', 'Newtownards', 'Downpatrick', 'Iveagh'],
  'breifne-oriel': ['Dromahair', 'Leitrim', 'Killeshandra', 'Cavan', 'Killycolly', 'Monaghan', 'Carrickmacross', 'Oriel'],
  connacht: ['Sligo', 'Erris', 'Skreen', 'Ballaghaderreen', 'Roscommon', 'Burrishoole', 'Castlereagh', 'Castlebar', 'Tuam', 'Kilconnell', 'Clifden', 'Athlone', 'Galway', 'Athenry', 'Moycarn'],
  midlands: ['Longford', 'Kells', 'Ardagh', 'Mullingar', 'Ballymore', 'Tullamore', 'Daingean', 'Dunamase'],
  'leinster-sur': ['Wicklow_Mountains', 'Wicklow', 'Glendalough', 'Carlow', 'Ferns', 'New_Ross', 'Wexford', 'Kilkenny', 'Cullahill'],
  ormond: ['Nenagh', 'Roscrea', 'Cashel', 'Clonmel', 'Tipperary', 'Carrickbeg'],
  'desmond-geraldino': ['Castleconnell', 'Limerick', 'Adare', 'Killmallock', 'Tralee', 'Dingle', 'Fermoy', 'Youghal', 'Dungarvan'],
  thomond: ['Ennis', 'Bunratty', 'Moyarta'],
  'desmond-maccarthy': ['Dunhallow', 'Killarney', 'Muskerry', 'Carbery', 'Kilbrittain'],
  'ciudades-reales': ['Waterford', 'Cork', 'Kinsale', 'Dundalk', 'Drogheda'],
};
const irelandZone = new Map(Object.entries(IRELAND).flatMap(([zone, ids]) => ids.map(id => [id, zone])));
const KOLA = new Set(['Prirechnyi', 'Lapland_Taiga2', 'Koliskoj']);
const KAINUU = new Set(['Kajana', 'Paltamo', 'Sotkamo', 'Suomussalmi', 'Kuhmo', 'Kuusamo']);
const NORTH_KARELIA = new Set(['Nurmes', 'Juuka', 'Joensuu']);
const GOTLAND = new Set(['Visby', 'Hoborg', 'Slite']);
const LAPLAND = new Set(['Volgsjo', 'Tarna', 'Asele', 'Silbojock', 'Stensele', 'Sorsele', 'Kvikkjock', 'Sarek', 'Ortrask', 'Arjeplog', 'Arvidsjaur', 'Lycksele',
  'Abisko', 'Jokkmokk', 'Akkajaur', 'Porjus', 'Nikkaluokta', 'Socksjock', 'Raunala', 'Gellivaara', 'Juckasjarvi', 'Kasivarren', 'Korpilombo', 'Enontakis',
  'Mourionska', 'Nunnanen', 'Korvala', 'Sodankyla', 'Ivalo', 'Utsjoki', 'Enare', 'Kemijarvi', 'Savukoski', 'Lapland_Taiga1', 'Salla', 'Suonikyla']);
function zoneOf({id, centroid: [x, y]}, gaps) {
  if (irelandZone.has(id)) return irelandZone.get(id);
  if (id === 'Eiriksfjord') return 'groenlandia';
  if (id === 'Jan_Mayen') return 'jan-mayen';
  if (id === 'Mann') return 'man';
  if (GOTLAND.has(id)) return 'gotland';
  if (KOLA.has(id)) return 'kola';
  if (KAINUU.has(id)) return 'kainuu';
  if (NORTH_KARELIA.has(id)) return 'carelia-norte';
  if (id === 'North_Skanderna') return 'laponia-noruega';
  if (LAPLAND.has(id)) return 'laponia';
  if (x < 520 && y > 50 && y < 72) return 'islandia';
  if (x >= 545 && x < 555 && y > 120 && y < 133) return 'gales';
  // Finland: the south-west was only uncoloured before 1250, the centre and
  // Ostrobothnia before 1323.
  if (x >= 632 && x < 662 && y >= 52 && y < 90) return gaps.every(([, through]) => through <= 1249) ? 'finlandia-sur' : 'finlandia-centro';
  return null;
}

// Uncoloured years on the common map without this review.
const data = read('corridor-locations.json');
const ownNames = new Set(data[KEY]?.layerNames || []);
data.additionalTerritories = data.additionalTerritories.filter(layer => !ownNames.has(layer.name));
delete data[KEY];
data.burgundy = read('burgundian-locations.json');
const inventory = read('location-inventory.json').cells.filter(cell => cell.visible && cell.centroid && cell.centroid[1] < 140 && cell.centroid[0] < 700);
const missing = new Map(inventory.map(cell => [cell.id, []]));
for (let year = FROM; year <= THROUGH; year++) {
  const mosaic = europeMosaicAt(data, year, PERSONAS);
  for (const cell of inventory) if (!mosaic.byLocation.has(cell.id)) missing.get(cell.id).push(year);
}
const intervals = years => years.reduce((list, year) => { const last = list.at(-1); if (last && last[1] === year - 1) last[1] = year; else list.push([year, year]); return list; }, []);

function buildReview() {
const groups = new Map();
for (const cell of inventory) {
  const gaps = intervals(missing.get(cell.id));
  if (!gaps.length) continue;
  const zone = zoneOf(cell, gaps);
  if (!zone) continue;
  CHRONOLOGY[zone].forEach((phase, index) => {
    for (const [from, through] of gaps) {
      const a = Math.max(from, phase.from), b = Math.min(through, phase.through);
      if (a > b) continue;
      const key = `${zone}|${index}|${a}|${b}`;
      if (!groups.has(key)) groups.set(key, {zone, phase, from: a, through: b, ids: []});
      groups.get(key).ids.push(cell.id);
    }
  });
}
let n = 0;
const assignments = [...groups.values()].sort((a, b) => a.zone.localeCompare(b.zone) || a.from - b.from).map(({zone, phase, from, through, ids}) => ({
  name: `${phase.identity} · ${from}–${through} · revisión Atlántico norte ${++n}`,
  identity: phase.identity, from, through, ids: ids.sort(), governmentTerritories: phase.governmentTerritories,
  sourceKeys: phase.sourceKeys, precision: 'regional_approximation', limitedCore: false, note: phase.note,
  scopeLabel: `${zone} · ${from}–${through}`,
  ...(phase.authorityCondition ? {authorityCondition: phase.authorityCondition} : {}),
}));
const ids = [...new Set(assignments.flatMap(a => a.ids))].sort();
const review = {
  schema: 1, reviewedAt: '2026-11-21',
  scope: {name: 'Irlanda, Gales, Man, Islandia, Gotland, Finlandia, Laponia, Kola y Groenlandia', from: FROM, through: THROUGH, ids},
  precedenceIds: [], limitedCore: false, assignments, sources,
  limitations: [
    'Solo se colorean los años en que ninguna otra capa del Atlas cubre la celda: la revisión no sustituye a las anteriores.',
    'Las zonas agrupan señoríos gaélicos, principados galeses y tierras sami que el mapa no separa; las notas los nombran.',
    'Los cortes anuales son convencionales y la precisión es regional.',
  ],
};
return review;
}

// A reviewed scope hides the colours that registered rulers give to the cells
// in other years, so the review is applied in memory and the cell-years still
// empty are added to the gaps until nothing changes.
let review = buildReview();
const write = () => {
  fs.writeFileSync(mapDataFile('north-atlantic-review.json'), `${JSON.stringify(review, null, 2)}\n`);
  fs.writeFileSync(ROUTES, JSON.stringify(compactBalkanRoutes(review)) + '\n');
};
for (let pass = 1; pass <= 4; pass++) {
  write();
  const residual = JSON.parse(execFileSync(process.execPath, [process.argv[1], '--residual'], {maxBuffer: 1 << 28}).toString());
  let added = 0;
  for (const [id, years] of Object.entries(residual)) for (const year of years) {
    const list = missing.get(id);
    if (list && !list.includes(year)) { list.push(year); added++; }
  }
  if (!added) break;
  for (const years of missing.values()) years.sort((a, b) => a - b);
  console.log(`Pasada ${pass}: ${added} celda-años más`);
  review = buildReview();
}
const {assignments, scope: {ids}} = review;
fs.writeFileSync(mapDataFile('north-atlantic-review.json'), `${JSON.stringify(review, null, 2)}\n`);
fs.writeFileSync(ROUTES, JSON.stringify(compactBalkanRoutes(review)) + '\n');
console.log(`Atlántico norte: ${assignments.length} fases en ${ids.length} celdas`);
