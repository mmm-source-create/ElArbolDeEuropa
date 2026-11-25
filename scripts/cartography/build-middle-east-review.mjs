// 6.0.14 regional review: Mesopotamia, Persia, Arabia, the Caucasus and the
// lands east of the Caspian (Turan, Khorasan, Afghanistan, Baluchistan and
// Sind), 1200–1800, plus six isolated cells elsewhere. Like the North
// Atlantic review it only fills the cell-years that no other layer colours,
// computed from the common map with this review removed; a child process
// then applies it with its routes loaded and adds the years still empty.
// Zones come from longitude and latitude (the map's projection is close to
// linear here: lon = (x − 563) / 3.3, lat = (359 − y) / 4.3) and from the
// names of desert cells. Deserts and nomad lands take sand tones.
// Usage: node scripts/cartography/build-middle-east-review.mjs
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {mapDataFile, projectRoot} from '../lib/project-paths.mjs';
import {compactBalkanRoutes} from './build-balkans-routes.mjs';

const ROUTES = path.join(projectRoot, 'src/cartography/regions/middleEastRouteData.json');
const RESIDUAL = process.argv[2] === '--residual';
if (!RESIDUAL) fs.writeFileSync(ROUTES, JSON.stringify({coverageIds: [], assignments: [], authorityScopes: [], sources: {}}) + '\n');
const {PERSONAS} = await import('../../src/data/personas.js');
const {europeMosaicAt} = await import('../../src/cartography/europePanorama.js');
const {territorialIdentity} = await import('../../src/cartography/territorialIdentity.js');
const {applyRegionalReview} = await import('./apply-regional-review.mjs');

const FROM = 1200, THROUGH = 1800, KEY = 'middleEastReview', CORRIDOR = 'Oriente Medio y Asia central';
const read = name => JSON.parse(fs.readFileSync(mapDataFile(name), 'utf8'));

if (RESIDUAL) {
  const current = read('middle-east-review.json');
  const applied = read('corridor-locations.json');
  const own = new Set(applied[KEY]?.layerNames || []);
  applied.additionalTerritories = applied.additionalTerritories.filter(layer => !own.has(layer.name));
  delete applied[KEY];
  applyRegionalReview(applied, current, KEY, CORRIDOR);
  applied.burgundy = read('burgundian-locations.json');
  const out = {};
  for (let year = FROM; year <= THROUGH; year++) {
    const mosaic = europeMosaicAt(applied, year, PERSONAS);
    for (const id of current.scope.ids) if (!mosaic.byLocation.has(id)) (out[id] ||= []).push(year);
  }
  process.stdout.write(JSON.stringify(out));
  process.exit(0);
}

const T = (slug, title, locator) => ({title: `Treccani · ${title}`, url: `https://www.treccani.it/enciclopedia/${slug}/`, locator});
const sources = {
  persia: T('persia', 'Persia', 'Historia de Persia: dominio corasmio, conquista mongola e ilkhanes; fragmentación del siglo XIV; Tamerlán y los timúridas; turcomanos Qara Qoyunlu y Aq Qoyunlu; safávidas desde 1501; invasión afgana de 1722; Nadir Shah, los zand y los qayar.'),
  ilkhan: T('ilkhan', 'Īlkhān', 'Dinastía mongola de Persia fundada por Hülegü (1256–1258) y su disolución tras la muerte de Abu Said (1335).'),
  gialairidi: T('gialairidi', 'Gialàiridi', 'Dinastía mongola de Bagdad y Tabriz tras la disolución del Ilkanato, en el siglo XIV y comienzos del XV.'),
  salghuridi: T('salghuridi', 'Salghùridi', 'Atabegs turcos del Fars (siglos XII–XIII), tributarios de los mongoles.'),
  timuridi: T('timuridi', 'Timùridi', 'Imperio de Tamerlán y de sus sucesores en Persia y Transoxiana hasta comienzos del siglo XVI.'),
  safavidi: T('safavidi', 'Ṣafàvidi', 'Dinastía persa desde Ismail I (1501) hasta la invasión afgana y el final de la dinastía en el siglo XVIII.'),
  zand: T('zand', 'Zand', 'Dinastía de Karim Khan Zand, con capital en Shiraz, en la segunda mitad del siglo XVIII.'),
  iraq: T('iraq', 'Iraq', 'Mesopotamia: fin del califato abasí (1258), ilkhanes, gialàiridi, turcomanos, safávidas y dominio otomano desde 1534, con la reconquista persa de 1623–1638.'),
  baghdad: T('baghdad', 'Baghdad', 'Saqueo mongol de 1258; disputa entre otomanos y safávidas en los siglos XVI y XVII.'),
  mosul: T('mosul', 'Mosul', 'Ciudad de la alta Mesopotamia bajo zenguíes y Badr al-Din Lulu, mongoles, turcomanos y otomanos.'),
  tabriz: T('tabriz', 'Tabriz', 'Capital ilkhaní, gialàiride, turcomana y safávida; ocupaciones otomanas en los siglos XVI y XVIII.'),
  kerman: T('kerman', 'Kerman', 'Provincia del sudeste de Persia; dinastía de los Qutlugh-khan bajo los mongoles.'),
  khorasan: T('khorasan', 'Khorasan', 'Región oriental de Persia: corasmios, mongoles, sarbadáridas y kart, timúridas, safávidas y los afsáridas de Shahrokh.'),
  herat: T('herat', 'Herat', 'Capital de los kart y de los timúridas; disputada entre safávidas y uzbekos; afgana desde 1747.'),
  afghanistan: T('afghanistan', 'Afghanistan', 'Gúridas, mongoles, timúridas, mogoles y safávidas; los hotakíes (1709) y el Estado de Ahmad Shah Durrani (1747).'),
  durrani: T('durrani', 'Durrānī', 'Dinastía afgana fundada por Ahmad Shah en 1747.'),
  mogol: T('mogol', 'Mogòl', 'Imperio de Babur y de sus sucesores, con Kabul y, a intervalos, Kandahar.'),
  belucistan: T('belucistan', 'Belucistan', 'Tierras de los baluchis y del janato de Kalat, desde el siglo XVII.'),
  sind: T('sind', 'Sind', 'Dinastías del Sind: Soomra, Samma, Arghun y Tarján, provincia mogola, Kalhora y Talpur.'),
  georgia: T('georgia', 'Georgia', 'Reino de Georgia; división hacia 1490 en Kartli, Kajetia e Imericia y los principados de Mingrelia, Guria y Abjasia; unión de Kartli y Kajetia (1762).'),
  mingrelia: T('mingrelia', 'Mingrelia', 'Principado de Georgia occidental, entre Imericia y Abjasia.'),
  azerbaigian: T('azerbaigian', 'Azerbaigian', 'Shirván y Arrán: shirvanshahs, safávidas, ocupaciones otomana y rusa (1722–1735) y janatos de la segunda mitad del siglo XVIII.'),
  derbent: T('derbent', 'Derbent', 'Ciudad caspia en el paso del Cáucaso oriental, de los emires locales, los mongoles, los shirvanshahs y Persia.'),
  daghestan: T('daghestan', 'Daghestàn', 'Comunidades montañesas y el shamjalato de los cumucos, sin un Estado unitario.'),
  alani: T('alani', 'Alani', 'Reino de los alanos en el Cáucaso norte hasta la conquista mongola (1238–1239).'),
  arabia: T('arabia', 'Arabia', 'Tribus beduinas del interior; jerifato de La Meca bajo los mamelucos y los otomanos; Al-Hasa; el Estado saudí de Diriyah desde 1744.'),
  kuwait: T('kuwait', 'Kuwait', 'Costa del noreste de Arabia bajo los Banu Jálid y el jeque de Kuwait en el siglo XVIII.'),
  oman: T('oman', 'Oman', 'Reino de Ormuz y fortalezas portuguesas; expulsión de los portugueses por los imanes Yaruba (1650) y dinastía Al Said (1744).'),
  uzbekistan: T('uzbekistan', 'Uzbekistan', 'Corasmia y Transoxiana: corasmios, mongoles y Chagatai, timúridas, uzbekos de Shaybani; janatos de Jiva y Bujará.'),
  turkmenistan: T('turkmenistan', 'Turkmenistan', 'Tribus turcomanas del Karakum, con Merv y los oasis disputados entre Persia, Jiva y Bujará.'),
  kazakistan: T('kazakistan', 'Kazakistan', 'Estepa de los cumanos, la Horda de Oro, los uzbekos y el janato kazajo desde el siglo XV.'),
  calmucchi: T('calmucchi', 'Calmucchi', 'Kalmukos establecidos en el bajo Volga y la estepa caspia desde comienzos del siglo XVII; éxodo de 1771.'),
  samarcanda: T('samarcanda', 'Samarcanda', 'Capital de Tamerlán; uzbeka desde comienzos del siglo XVI.'),
  balkh: T('balkh', 'Balkh', 'Ciudad del Afganistán septentrional, timúrida, uzbeka y afgana.'),
  mamelucchi: T('mamelucchi', 'Mamelucchi', 'Sultanato mameluco de Egipto y Siria (1250–1517).'),
  egitto: T('egitto', 'Egitto', 'Egipto ayubí, mameluco y otomano.'),
  tunisia: T('tunisia', 'Tunisia', 'Túnez hafsí y regencia otomana.'),
  renania: T('renania', 'Renania', 'Territorios renanos alrededor de Colonia.'),
  danimarca: T('danimarca', 'Danimarca', 'Costas y estrechos daneses.'),
};

const P = (from, through, identity, sourceKeys, note, extra = {}) => ({from, through, identity, sourceKeys, note, ...extra});
const LOCAL = {authorityCondition: 'autoridad regional'};
const EMPTY = {authorityCondition: 'sin poblamiento documentado'};
const TRIBUTE = {authorityCondition: 'autonomía tributaria'};
// 6.3.0: the sharifs of Mecca were not tributaries (they received the sultan's
// payments); the sovereignty is the hejaz-ottoman relation in tributaryRelations.js.
const SUZERAINTY = {authorityCondition: 'autoridad regional'};

// Shared runs of the Iranian plateau.
const MONGOL_PERSIA = [
  P(1231, 1255, 'Imperio mongol', ['persia'], 'Conquista mongola tras la caída de Jalal al-Din (1231).'),
  P(1256, 1335, 'Ilkanato', ['ilkhan', 'persia'], 'Ilkanato de Hülegü y sus sucesores.'),
];
const LATE_PERSIA = [
  P(1501, 1721, 'Persia', ['safavidi', 'persia'], 'Persia safávida.'),
  P(1722, 1728, 'Persia', ['persia', 'afghanistan'], 'Invasión afgana de los hotakíes (Isfahán, 1722) y guerras de Tahmasp II y Nadir; el mapa no separa los frentes.', {authorityCondition: 'control disputado'}),
  P(1729, 1800, 'Persia', ['persia', 'zand'], 'Persia de Nadir Shah (1736), de los zand (1751–1794) y de los qayar; los janatos locales no se separan.'),
];
const CHRONOLOGY = {
  // Mesopotamia and the Jazira.
  'iraq-sur': [
    P(FROM, 1258, 'Califato abasí', ['iraq', 'baghdad'], 'Califato abasí de Bagdad hasta el saqueo mongol de 1258.'),
    P(1259, 1335, 'Ilkanato', ['ilkhan', 'iraq'], 'Mesopotamia ilkhaní.'),
    P(1336, 1410, 'Jalayiríes', ['gialairidi', 'iraq'], 'Bagdad de los gialàiridi, con la ocupación de Tamerlán (1393–1405) incluida.'),
    P(1411, 1467, 'Qara Qoyunlu', ['iraq'], 'Turcomanos Qara Qoyunlu.'),
    P(1468, 1507, 'Aq Qoyunlu', ['iraq'], 'Turcomanos Aq Qoyunlu.'),
    P(1508, 1533, 'Persia', ['safavidi', 'iraq'], 'Bagdad safávida (1508).'),
    P(1534, 1622, 'Imperio otomano', ['iraq', 'baghdad'], 'Conquista otomana de Bagdad (1534) y de Basora (1546).'),
    P(1623, 1638, 'Persia', ['iraq', 'baghdad'], 'Reconquista persa de Bagdad por Abbás I (1623) hasta 1638.'),
    P(1639, THROUGH, 'Imperio otomano', ['iraq', 'baghdad'], 'Bagdad y Basora otomanas; desde 1704 los pachás mamelucos gobiernan con amplia autonomía.'),
  ],
  'iraq-norte': [
    P(FROM, 1261, 'Atabegato de Mosul', ['mosul'], 'Mosul de los zenguíes y de Badr al-Din Lulu (1233–1259).'),
    P(1262, 1335, 'Ilkanato', ['ilkhan', 'mosul'], 'Alta Mesopotamia ilkhaní.'),
    P(1336, 1410, 'Jalayiríes', ['gialairidi', 'mosul'], 'Alta Mesopotamia de los gialàiridi.'),
    P(1411, 1467, 'Qara Qoyunlu', ['mosul'], 'Turcomanos Qara Qoyunlu.'),
    P(1468, 1507, 'Aq Qoyunlu', ['mosul'], 'Turcomanos Aq Qoyunlu.'),
    P(1508, 1516, 'Persia', ['safavidi', 'mosul'], 'Dominio safávida.'),
    P(1517, THROUGH, 'Imperio otomano', ['mosul', 'iraq'], 'Mosul otomana desde las campañas de Selim I; los emiratos kurdos conservan sus señores.'),
  ],
  jazira: [
    P(FROM, 1259, 'Sultanato ayubí', ['mosul'], 'Yazira ayubí.'),
    P(1260, 1340, 'Ilkanato', ['ilkhan'], 'Yazira bajo los mongoles.'),
    P(1341, 1402, 'Yazira · poderes locales', ['mosul'], 'Emires artúquidas y tribus de la Yazira entre mamelucos y gialàiridi.', LOCAL),
    P(1403, 1507, 'Aq Qoyunlu', ['mosul'], 'Turcomanos Aq Qoyunlu, desde Diyarbakır.'),
    P(1508, 1516, 'Persia', ['safavidi'], 'Dominio safávida.'),
    P(1517, THROUGH, 'Imperio otomano', ['mosul'], 'Yazira otomana.'),
  ],
  'desierto-sirio': [P(FROM, THROUGH, 'Desierto sirio · tribus beduinas', ['arabia', 'iraq'], 'Estepa y desierto de las tribus beduinas entre Siria y Mesopotamia.', LOCAL)],
  // Arabia.
  hiyaz: [
    P(FROM, 1516, 'Jerifato de La Meca', ['arabia', 'mamelucchi'], 'Jerifes de La Meca y emires de Medina, bajo la soberanía de los ayubíes y, desde la década de 1260, de los mamelucos.', LOCAL),
    P(1517, THROUGH, 'Jerifato de La Meca', ['arabia'], 'Los jerifes reconocen la soberanía del sultán otomano desde 1517 y conservan el gobierno del Hiyaz; reciben sus asignaciones y no le pagan tributo.', SUZERAINTY),
  ],
  'arabia-tribus': [P(FROM, THROUGH, 'Arabia · tribus beduinas', ['arabia'], 'Desiertos del Nafud, el Dahna y el norte de Arabia, de las tribus beduinas (Shammar, Anaza y otras).', LOCAL)],
  najd: [
    P(FROM, 1743, 'Arabia · tribus beduinas', ['arabia'], 'Oasis y tribus del Nachd sin un Estado común.', LOCAL),
    P(1744, THROUGH, 'Emirato de Diriyah', ['arabia'], 'Primer Estado saudí: pacto de Diriyah (1744) y expansión por el Nachd; Riad en 1773.'),
  ],
  'najd-norte': [
    P(FROM, 1791, 'Arabia · tribus beduinas', ['arabia'], 'Yabal Shammar y el norte del Nachd, de las tribus.', LOCAL),
    P(1792, THROUGH, 'Emirato de Diriyah', ['arabia'], 'Expansión del Estado saudí hacia el norte en la década de 1790.'),
  ],
  hasa: [
    P(FROM, 1252, 'Emirato uyúnida', ['arabia'], 'Uyúnidas de Al-Hasa.'),
    P(1253, 1416, 'Al-Hasa · poderes locales', ['arabia'], 'Usfúridas y otros linajes de la costa oriental.', LOCAL),
    P(1417, 1523, 'Emirato yábrida', ['arabia'], 'Yábridas de Al-Hasa.'),
    P(1524, 1549, 'Al-Hasa · poderes locales', ['arabia'], 'Tribus de la costa oriental tras los yábridas.', LOCAL),
    P(1550, 1669, 'Imperio otomano', ['arabia'], 'Eyalato otomano de Lahsa.'),
    P(1670, 1794, 'Emirato de los Banu Jálid', ['arabia', 'kuwait'], 'Banu Jálid, señores de Al-Hasa, Qatif y la costa de Kuwait.'),
    P(1795, THROUGH, 'Emirato de Diriyah', ['arabia'], 'Conquista saudí de Al-Hasa (1795).'),
  ],
  bahrein: [
    P(FROM, 1520, 'Al-Hasa · poderes locales', ['arabia', 'oman'], 'Bahréin bajo linajes de la costa y la influencia de Ormuz.', LOCAL),
    P(1521, 1601, 'Reino de Ormuz', ['oman'], 'Bahréin, de Ormuz y de su protector portugués (1521–1602).', TRIBUTE),
    P(1602, 1716, 'Persia', ['oman', 'persia'], 'Bahréin persa desde 1602.'),
    P(1717, 1782, 'Al-Hasa · poderes locales', ['oman', 'persia'], 'Disputado entre Omán, Persia y los jeques de Bushehr.', {authorityCondition: 'control disputado'}),
    P(1783, THROUGH, 'Bahréin', ['arabia'], 'Los Al Jalifa toman Bahréin en 1783.'),
  ],
  'costa-tribus': [P(FROM, THROUGH, 'Costa de Omán · tribus', ['oman'], 'Costa y desierto de los Bani Yas y los Qawasim, sin un Estado común.', LOCAL)],
  'oman-norte': [
    P(FROM, 1514, 'Reino de Ormuz', ['oman'], 'Costas de Omán bajo el reino de Ormuz.'),
    P(1515, 1621, 'Reino de Ormuz', ['oman'], 'Ormuz y sus costas bajo protección portuguesa (1515–1622).', TRIBUTE),
    P(1622, THROUGH, 'Imanato de Omán', ['oman'], 'Imanes Yaruba, que expulsan a los portugueses (1650), y Al Said desde 1744.'),
  ],
  // Iran.
  'azerbaiyan-iran': [
    P(FROM, 1224, 'Atabegato de Azerbaiyán', ['tabriz', 'persia'], 'Atabegs ildegúzidas de Tabriz.'),
    P(1225, 1230, 'Imperio corasmio', ['persia'], 'Jalal al-Din Mingburnu toma Tabriz (1225).'),
    ...MONGOL_PERSIA,
    P(1336, 1356, 'Chobánidas', ['tabriz'], 'Chobánidas de Tabriz.'),
    P(1357, 1384, 'Jalayiríes', ['gialairidi', 'tabriz'], 'Tabriz de los gialàiridi.'),
    P(1385, 1405, 'Imperio timúrida', ['timuridi'], 'Conquista de Tamerlán.'),
    P(1406, 1467, 'Qara Qoyunlu', ['tabriz'], 'Tabriz, capital de los Qara Qoyunlu.'),
    P(1468, 1500, 'Aq Qoyunlu', ['tabriz'], 'Tabriz, capital de los Aq Qoyunlu.'),
    P(1501, 1584, 'Persia', ['safavidi', 'tabriz'], 'Tabriz, primera capital safávida.'),
    P(1585, 1602, 'Imperio otomano', ['tabriz'], 'Ocupación otomana de Tabriz (1585–1603).', {authorityCondition: 'ocupación'}),
    P(1603, 1724, 'Persia', ['safavidi', 'tabriz'], 'Reconquista de Abbás I (1603).'),
    P(1725, 1729, 'Imperio otomano', ['tabriz'], 'Ocupación otomana de 1725–1730.', {authorityCondition: 'ocupación'}),
    P(1730, THROUGH, 'Persia', ['persia', 'tabriz'], 'Persia afsárida, zand y qayar; los janatos de Azerbaiyán no se separan.'),
  ],
  'iran-centro': [
    P(FROM, 1230, 'Imperio corasmio', ['persia'], 'Irak persa bajo los sha de Corasmia hasta Jalal al-Din.'),
    ...MONGOL_PERSIA,
    P(1336, 1392, 'Jalayiríes', ['gialairidi', 'persia'], 'Sucesores del Ilkanato (gialàiridi, muzafáridas e injúidas) que el mapa no separa.', LOCAL),
    P(1393, 1446, 'Imperio timúrida', ['timuridi'], 'Persia timúrida de Tamerlán y Shah Rukh.'),
    P(1447, 1467, 'Qara Qoyunlu', ['persia'], 'Expansión de los Qara Qoyunlu tras Shah Rukh.'),
    P(1468, 1500, 'Aq Qoyunlu', ['persia'], 'Aq Qoyunlu.'),
    ...LATE_PERSIA,
  ],
  fars: [
    P(FROM, 1286, 'Atabegato salgúrida', ['salghuridi'], 'Atabegs salgúridas del Fars, tributarios de corasmios y mongoles.'),
    P(1287, 1335, 'Ilkanato', ['ilkhan'], 'Fars ilkhaní.'),
    P(1336, 1392, 'Jalayiríes', ['persia'], 'Injúidas y muzafáridas en Shiraz, que el mapa no separa de los demás sucesores del Ilkanato.', LOCAL),
    P(1393, 1446, 'Imperio timúrida', ['timuridi'], 'Fars timúrida.'),
    P(1447, 1467, 'Qara Qoyunlu', ['persia'], 'Qara Qoyunlu.'),
    P(1468, 1500, 'Aq Qoyunlu', ['persia'], 'Aq Qoyunlu.'),
    ...LATE_PERSIA,
  ],
  kerman: [
    P(FROM, 1221, 'Imperio corasmio', ['persia', 'kerman'], 'Kerman corasmio.'),
    P(1222, 1306, 'Kanato de Kirman', ['kerman'], 'Qutlugh-khan de Kerman, vasallos de los mongoles.'),
    P(1307, 1339, 'Ilkanato', ['ilkhan', 'kerman'], 'Kerman ilkhaní.'),
    P(1340, 1392, 'Jalayiríes', ['persia', 'kerman'], 'Muzafáridas de Kerman, que el mapa no separa de los demás sucesores del Ilkanato.', LOCAL),
    P(1393, 1446, 'Imperio timúrida', ['timuridi'], 'Kerman timúrida.'),
    P(1447, 1467, 'Qara Qoyunlu', ['persia'], 'Qara Qoyunlu.'),
    P(1468, 1500, 'Aq Qoyunlu', ['persia'], 'Aq Qoyunlu.'),
    ...LATE_PERSIA,
  ],
  ormuz: [
    P(FROM, 1514, 'Reino de Ormuz', ['oman', 'persia'], 'Reino de Ormuz y sus costas.'),
    P(1515, 1621, 'Reino de Ormuz', ['oman'], 'Ormuz bajo protección portuguesa hasta su toma por Persia y la Compañía inglesa (1622).', TRIBUTE),
    P(1622, THROUGH, 'Persia', ['safavidi', 'persia'], 'Costa persa del Golfo; Bandar Abbás.'),
  ],
  khorasan: [
    P(FROM, 1220, 'Imperio corasmio', ['khorasan'], 'Jorasán corasmio.'),
    P(1221, 1255, 'Imperio mongol', ['khorasan'], 'Conquista mongola (1220–1221).'),
    P(1256, 1335, 'Ilkanato', ['ilkhan', 'khorasan'], 'Jorasán ilkhaní.'),
    P(1336, 1380, 'Sarbadáridas y kart', ['khorasan'], 'Sarbadáridas de Sabzevar y kart de Herat, que el mapa no separa.', LOCAL),
    P(1381, 1506, 'Imperio timúrida', ['timuridi', 'khorasan'], 'Jorasán timúrida; Herat, capital de Shah Rukh.'),
    P(1507, 1509, 'Kanato uzbeko', ['khorasan'], 'Conquista uzbeka de Muhammad Shaybani.'),
    P(1510, 1747, 'Persia', ['safavidi', 'khorasan'], 'Jorasán safávida y afsárida; incursiones uzbekas.'),
    P(1748, 1795, 'Jorasán afsárida', ['khorasan'], 'Shahrokh, nieto de Nadir Shah, gobierna Mashhad bajo la protección de Ahmad Shah Durrani.'),
    P(1796, THROUGH, 'Persia', ['persia', 'khorasan'], 'Toma de Mashhad por Agha Mohammad Khan Qayar (1796).'),
  ],
  makran: [P(FROM, THROUGH, 'Makrán · poderes locales', ['belucistan', 'persia'], 'Jefes baluchis del Makrán persa, bajo una soberanía persa nominal.', LOCAL)],
  // Afghanistan, Baluchistan and Sind.
  herat: [
    P(FROM, 1215, 'Sultanato gúrida', ['afghanistan'], 'Sultanato de los gúridas.'),
    P(1216, 1220, 'Imperio corasmio', ['afghanistan'], 'Conquista corasmia.'),
    P(1221, 1244, 'Imperio mongol', ['afghanistan'], 'Conquista mongola.'),
    P(1245, 1380, 'Sarbadáridas y kart', ['herat'], 'Malik kart de Herat, vasallos de los mongoles.'),
    P(1381, 1506, 'Imperio timúrida', ['timuridi', 'herat'], 'Herat timúrida.'),
    P(1507, 1509, 'Kanato uzbeko', ['herat'], 'Conquista uzbeka.'),
    P(1510, 1716, 'Persia', ['safavidi', 'herat'], 'Herat safávida, disputada con los uzbekos.'),
    P(1717, 1731, 'Afganos abdalíes', ['herat', 'afghanistan'], 'Los abdalíes de Herat se separan de Persia.'),
    P(1732, 1746, 'Persia', ['herat'], 'Conquista de Nadir Shah.'),
    P(1747, THROUGH, 'Imperio durrani', ['durrani', 'herat'], 'Imperio de Ahmad Shah Durrani.'),
  ],
  kandahar: [
    P(FROM, 1215, 'Sultanato gúrida', ['afghanistan'], 'Sultanato de los gúridas.'),
    P(1216, 1220, 'Imperio corasmio', ['afghanistan'], 'Conquista corasmia.'),
    P(1221, 1380, 'Imperio mongol', ['afghanistan'], 'Mongoles, kart y Chagatai, que el mapa no separa.', LOCAL),
    P(1381, 1506, 'Imperio timúrida', ['timuridi'], 'Kandahar timúrida.'),
    P(1507, 1557, 'Imperio mogol', ['mogol', 'afghanistan'], 'Babur y sus sucesores (Kandahar, 1522).'),
    P(1558, 1594, 'Persia', ['safavidi'], 'Kandahar safávida.'),
    P(1595, 1621, 'Imperio mogol', ['mogol'], 'Kandahar mogola.'),
    P(1622, 1708, 'Persia', ['safavidi'], 'Kandahar safávida (1622; mogola de 1638 a 1649).'),
    P(1709, 1737, 'Afganos hotakíes', ['afghanistan'], 'Mirwais Hotak y sus sucesores.'),
    P(1738, 1746, 'Persia', ['persia'], 'Conquista de Nadir Shah.'),
    P(1747, THROUGH, 'Imperio durrani', ['durrani'], 'Kandahar, capital de Ahmad Shah Durrani.'),
  ],
  ghazni: [
    P(FROM, 1215, 'Sultanato gúrida', ['afghanistan'], 'Sultanato de los gúridas.'),
    P(1216, 1220, 'Imperio corasmio', ['afghanistan'], 'Conquista corasmia.'),
    P(1221, 1380, 'Imperio mongol', ['afghanistan'], 'Mongoles y Chagatai, que el mapa no separa.', LOCAL),
    P(1381, 1503, 'Imperio timúrida', ['timuridi'], 'Kabul y Gazni timúridas.'),
    P(1504, 1737, 'Imperio mogol', ['mogol'], 'Kabul de Babur (1504) y provincia mogola.'),
    P(1738, 1746, 'Persia', ['persia'], 'Conquista de Nadir Shah.'),
    P(1747, THROUGH, 'Imperio durrani', ['durrani'], 'Imperio durrani.'),
  ],
  balj: [
    P(FROM, 1220, 'Imperio corasmio', ['balkh'], 'Balj gúrida y corasmia.'),
    P(1221, 1369, 'Kanato de Chagatai', ['balkh', 'uzbekistan'], 'Kanato de Chagatai.'),
    P(1370, 1506, 'Imperio timúrida', ['timuridi', 'balkh'], 'Balj timúrida.'),
    P(1507, 1750, 'Kanato de Bujará', ['balkh', 'uzbekistan'], 'Balj uzbeka (con la campaña mogola de 1646–1647 y la de Nadir Shah).'),
    P(1751, THROUGH, 'Imperio durrani', ['durrani', 'balkh'], 'Balj durrani.'),
  ],
  kalat: [
    P(FROM, 1665, 'Baluchistán · poderes locales', ['belucistan'], 'Tribus baluchis y brahuis.', LOCAL),
    P(1666, THROUGH, 'Kanato de Kalat', ['belucistan'], 'Janato de Kalat, tributario de los durrani desde 1758.'),
  ],
  sind: [
    P(FROM, 1350, 'Sind · Soomras', ['sind'], 'Dinastía Soomra.'),
    P(1351, 1519, 'Sultanato samma', ['sind'], 'Dinastía Samma de Thatta.'),
    P(1520, 1590, 'Sind · Arghun y Tarján', ['sind'], 'Arghun y Tarján.'),
    P(1591, 1736, 'Imperio mogol', ['sind', 'mogol'], 'Provincia mogola.'),
    P(1737, 1782, 'Sind de los Kalhora', ['sind'], 'Kalhora, tributarios de Nadir Shah y de los durrani.'),
    P(1783, THROUGH, 'Sind de los Talpur', ['sind'], 'Mires Talpur.'),
  ],
  // Turan.
  jorezm: [
    P(FROM, 1220, 'Imperio corasmio', ['uzbekistan'], 'Corasmia, centro del imperio de los sha.'),
    P(1221, 1360, 'Horda de Oro', ['uzbekistan', 'kazakistan'], 'Corasmia del norte bajo la Horda de Oro.'),
    P(1361, 1387, 'Sufíes de Corasmia', ['uzbekistan'], 'Dinastía de los sufíes de Urgench.'),
    P(1388, 1504, 'Imperio timúrida', ['timuridi'], 'Corasmia timúrida.'),
    P(1505, 1510, 'Kanato uzbeko', ['uzbekistan'], 'Conquista de Muhammad Shaybani.'),
    P(1511, THROUGH, 'Kanato de Jiva', ['uzbekistan'], 'Janato de Jiva; conquista de Nadir Shah (1740) incluida.'),
  ],
  transoxiana: [
    P(FROM, 1219, 'Imperio corasmio', ['uzbekistan', 'samarcanda'], 'Transoxiana corasmia.'),
    P(1220, 1369, 'Kanato de Chagatai', ['uzbekistan'], 'Kanato de Chagatai.'),
    P(1370, 1499, 'Imperio timúrida', ['timuridi', 'samarcanda'], 'Samarcanda, capital de Tamerlán.'),
    P(1500, THROUGH, 'Kanato de Bujará', ['uzbekistan', 'samarcanda'], 'Uzbekos shaybánidas, janíes y mangit de Bujará.'),
  ],
  chach: [
    P(FROM, 1219, 'Imperio corasmio', ['uzbekistan'], 'Chach corasmio.'),
    P(1220, 1369, 'Kanato de Chagatai', ['uzbekistan'], 'Kanato de Chagatai.'),
    P(1370, 1499, 'Imperio timúrida', ['timuridi'], 'Tashkent timúrida.'),
    P(1500, 1597, 'Kanato de Bujará', ['uzbekistan'], 'Uzbekos shaybánidas.'),
    P(1598, THROUGH, 'Kanato kazajo', ['kazakistan'], 'Tashkent y el Syr Daria medio bajo los kazajos.'),
  ],
  sirdaria: [
    P(FROM, 1219, 'Imperio corasmio', ['kazakistan'], 'Otrar y el Syr Daria corasmios.'),
    P(1220, 1369, 'Kanato de Chagatai', ['kazakistan'], 'Kanato de Chagatai y Horda Blanca, que el mapa no separa.'),
    P(1370, 1427, 'Imperio timúrida', ['timuridi'], 'Otrar y Sawran timúridas.'),
    P(1428, 1467, 'Kanato uzbeko', ['kazakistan'], 'Uzbekos de Abu-l-Jayr.'),
    P(1468, THROUGH, 'Kanato kazajo', ['kazakistan'], 'Janato kazajo; Turkestán, su capital.'),
  ],
  'estepa-kazaja': [
    P(FROM, 1219, 'Confederaciones cumanas', ['kazakistan'], 'Estepa de los cumanos y kipchakos.', LOCAL),
    P(1220, 1239, 'Imperio mongol', ['kazakistan'], 'Conquista mongola.'),
    P(1240, 1427, 'Horda de Oro', ['kazakistan'], 'Horda de Oro y Horda Blanca.'),
    P(1428, 1467, 'Kanato uzbeko', ['kazakistan'], 'Uzbekos de Abu-l-Jayr.'),
    P(1468, THROUGH, 'Kanato kazajo', ['kazakistan'], 'Janato kazajo y sus tres hordas.'),
  ],
  'estepa-oeste': [
    P(FROM, 1219, 'Confederaciones cumanas', ['kazakistan'], 'Estepa de los cumanos y kipchakos.', LOCAL),
    P(1220, 1239, 'Imperio mongol', ['kazakistan'], 'Conquista mongola.'),
    P(1240, 1427, 'Horda de Oro', ['kazakistan'], 'Horda de Oro.'),
    P(1428, 1467, 'Kanato uzbeko', ['kazakistan'], 'Uzbekos de Abu-l-Jayr.'),
    P(1468, 1633, 'Horda de Nogái', ['kazakistan'], 'Horda de los nogái, entre el Volga y el Emba.'),
    P(1634, 1770, 'Kanato calmuco', ['calmucchi'], 'Kalmukos de la estepa caspia hasta su éxodo de 1771.'),
    P(1771, THROUGH, 'Kanato kazajo', ['kazakistan', 'calmucchi'], 'Kazajos de la Horda Menor.'),
  ],
  mangyshlak: [
    P(FROM, 1219, 'Confederaciones cumanas', ['kazakistan'], 'Estepa de los cumanos y kipchakos.', LOCAL),
    P(1220, 1239, 'Imperio mongol', ['kazakistan'], 'Conquista mongola.'),
    P(1240, 1427, 'Horda de Oro', ['kazakistan'], 'Horda de Oro.'),
    P(1428, 1467, 'Kanato uzbeko', ['kazakistan'], 'Uzbekos de Abu-l-Jayr.'),
    P(1468, 1633, 'Horda de Nogái', ['kazakistan'], 'Nogái del Mangyshlak y del Ustyurt.'),
    P(1634, 1770, 'Turcomanos · tribus', ['turkmenistan', 'calmucchi'], 'Turcomanos del Mangyshlak y kalmukos, que el mapa no separa.', LOCAL),
    P(1771, THROUGH, 'Kanato kazajo', ['kazakistan'], 'Kazajos de la Horda Menor.'),
  ],
  turcomanos: [P(FROM, THROUGH, 'Turcomanos · tribus', ['turkmenistan'], 'Tribus turcomanas del Karakum, del Balján y de los oasis del Kopet Dag, bajo una soberanía lejana de Corasmia, los mongoles, Persia o Jiva.', LOCAL)],
  merv: [
    P(FROM, 1220, 'Imperio corasmio', ['turkmenistan'], 'Merv corasmia.'),
    P(1221, 1255, 'Imperio mongol', ['turkmenistan'], 'Destrucción mongola de Merv (1221).'),
    P(1256, 1335, 'Ilkanato', ['ilkhan'], 'Merv ilkhaní.'),
    P(1336, 1380, 'Kanato de Chagatai', ['turkmenistan'], 'Merv entre los Chagatai y los poderes de Jorasán.', LOCAL),
    P(1381, 1506, 'Imperio timúrida', ['timuridi'], 'Merv timúrida.'),
    P(1507, 1600, 'Kanato de Bujará', ['turkmenistan'], 'Merv disputada entre uzbekos y safávidas.', {authorityCondition: 'control disputado'}),
    P(1601, 1747, 'Persia', ['turkmenistan', 'safavidi'], 'Merv persa desde Abbás I.'),
    P(1748, 1784, 'Turcomanos · tribus', ['turkmenistan'], 'Jefes locales de Merv tras la muerte de Nadir Shah.', LOCAL),
    P(1785, THROUGH, 'Kanato de Bujará', ['turkmenistan'], 'Conquista de Shah Murad de Bujará (1785).'),
  ],
  // Deserts.
  'desierto-iran': [P(FROM, THROUGH, 'Desiertos de Kavir y Lut', ['persia'], 'Desiertos salinos del interior de Persia, sin poblamiento estable.', EMPTY)],
  'desierto-turan': [P(FROM, THROUGH, 'Desiertos de Turán', ['uzbekistan', 'kazakistan'], 'Kizilkum, Ustyurt, la estepa del Hambre y los arenales del Aral, de paso de nómadas.', EMPTY)],
  'desierto-registan': [P(FROM, THROUGH, 'Desiertos de Registán y Jarán', ['afghanistan', 'belucistan'], 'Desiertos del sur de Afganistán y del Baluchistán.', EMPTY)],
  // The Caucasus.
  circasia: [P(FROM, THROUGH, 'Principados y comunidades circasianas', ['daghestan'], 'Costa y montañas de los circasianos y abjasios del norte, sin un Estado común.', LOCAL)],
  'caucaso-norte': [
    P(FROM, 1238, 'Alania', ['alani'], 'Reino de los alanos.'),
    P(1239, THROUGH, 'Cáucaso norte · poderes locales', ['daghestan', 'alani'], 'Cabardinos, osetios, chechenos e ingusetios tras la conquista mongola, sin un Estado común.', LOCAL),
  ],
  daguestan: [P(FROM, THROUGH, 'Daguestán · poderes locales', ['daghestan'], 'Shamjalato cumuco y comunidades libres del Daguestán.', LOCAL)],
  abjasia: [
    P(FROM, 1489, 'Georgia', ['georgia'], 'Reino de Georgia.'),
    P(1490, 1577, 'Principado de Abjasia', ['georgia', 'mingrelia'], 'Principado de los Shervashidze tras la división del reino.', LOCAL),
    P(1578, THROUGH, 'Principado de Abjasia', ['georgia'], 'Abjasia bajo la soberanía otomana.', TRIBUTE),
  ],
  adjara: [
    P(FROM, 1489, 'Georgia', ['georgia'], 'Reino de Georgia.'),
    P(1490, 1546, 'Reino de Imericia', ['georgia'], 'Guria y Adjaria, dentro del ámbito de Imericia.', LOCAL),
    P(1547, THROUGH, 'Imperio otomano', ['georgia'], 'Adjaria y Batumi otomanas.'),
  ],
  'georgia-oeste': [
    P(FROM, 1489, 'Georgia', ['georgia'], 'Reino de Georgia.'),
    P(1490, THROUGH, 'Reino de Imericia', ['georgia', 'mingrelia'], 'Imericia, con los principados de Mingrelia y Guria; tributaria de los otomanos desde 1555.'),
  ],
  kartli: [
    P(FROM, 1489, 'Georgia', ['georgia'], 'Reino de Georgia.'),
    P(1490, 1761, 'Reino de Kartli', ['georgia'], 'Reino de Kartli, vasallo de Persia; ocupaciones otomanas de Tiflis (1578–1606 y 1723–1735).'),
    P(1762, THROUGH, 'Reino de Kartli-Kajetia', ['georgia'], 'Unión de Kartli y Kajetia bajo Heraclio II (1762).'),
  ],
  kajetia: [
    P(FROM, 1489, 'Georgia', ['georgia'], 'Reino de Georgia.'),
    P(1490, 1761, 'Reino de Kajetia', ['georgia'], 'Reino de Kajetia, vasallo de Persia.'),
    P(1762, THROUGH, 'Reino de Kartli-Kajetia', ['georgia'], 'Unión de Kartli y Kajetia bajo Heraclio II (1762).'),
  ],
  shirvan: [
    P(FROM, 1537, 'Shirván', ['azerbaigian', 'derbent'], 'Shirvanshahs, vasallos de mongoles, timúridas y turcomanos.'),
    P(1538, 1577, 'Persia', ['safavidi', 'azerbaigian'], 'Anexión safávida (1538).'),
    P(1578, 1606, 'Imperio otomano', ['azerbaigian'], 'Conquista otomana (1578).'),
    P(1607, 1722, 'Persia', ['safavidi', 'azerbaigian'], 'Reconquista de Abbás I.'),
    P(1723, 1734, 'Imperio otomano', ['azerbaigian'], 'Shirván otomano; Bakú y Derbent, rusos (1722–1735), no se separan.', {authorityCondition: 'ocupación'}),
    P(1735, 1747, 'Persia', ['azerbaigian'], 'Persia de Nadir Shah.'),
    P(1748, THROUGH, 'Kanatos del Cáucaso', ['azerbaigian'], 'Janatos de Shirván, Bakú, Quba y Derbent tras la muerte de Nadir Shah.', LOCAL),
  ],
  arran: [
    P(FROM, 1224, 'Atabegato de Azerbaiyán', ['azerbaigian'], 'Arrán de los ildegúzidas.'),
    P(1225, 1230, 'Imperio corasmio', ['azerbaigian'], 'Jalal al-Din.'),
    ...MONGOL_PERSIA,
    P(1336, 1356, 'Chobánidas', ['azerbaigian'], 'Chobánidas.'),
    P(1357, 1384, 'Jalayiríes', ['gialairidi'], 'Gialàiridi.'),
    P(1385, 1405, 'Imperio timúrida', ['timuridi'], 'Tamerlán.'),
    P(1406, 1467, 'Qara Qoyunlu', ['azerbaigian'], 'Qara Qoyunlu.'),
    P(1468, 1500, 'Aq Qoyunlu', ['azerbaigian'], 'Aq Qoyunlu.'),
    P(1501, 1587, 'Persia', ['safavidi'], 'Ganyá y Karabaj safávidas.'),
    P(1588, 1606, 'Imperio otomano', ['azerbaigian'], 'Conquista otomana.'),
    P(1607, 1722, 'Persia', ['safavidi'], 'Reconquista de Abbás I.'),
    P(1723, 1734, 'Imperio otomano', ['azerbaigian'], 'Ocupación otomana.', {authorityCondition: 'ocupación'}),
    P(1735, 1747, 'Persia', ['azerbaigian'], 'Persia de Nadir Shah.'),
    P(1748, THROUGH, 'Kanatos del Cáucaso', ['azerbaigian'], 'Janatos de Ganyá y Karabaj.', LOCAL),
  ],
  derbent: [
    P(FROM, 1238, 'Emirato de Derbent', ['derbent'], 'Emires de Derbent.'),
    P(1239, 1255, 'Imperio mongol', ['derbent'], 'Conquista mongola.'),
    P(1256, 1335, 'Ilkanato', ['derbent', 'ilkhan'], 'Frontera ilkhaní frente a la Horda de Oro.'),
    P(1336, 1537, 'Shirván', ['derbent', 'azerbaigian'], 'Derbent de los shirvanshahs.'),
    P(1538, 1577, 'Persia', ['derbent'], 'Derbent safávida.'),
    P(1578, 1606, 'Imperio otomano', ['derbent'], 'Conquista otomana.'),
    P(1607, 1721, 'Persia', ['derbent'], 'Derbent safávida.'),
    P(1722, 1735, 'Rusia', ['derbent', 'azerbaigian'], 'Campaña persa de Pedro I: Derbent rusa (1722–1735).'),
    P(1736, 1747, 'Persia', ['derbent'], 'Persia de Nadir Shah.'),
    P(1748, THROUGH, 'Kanatos del Cáucaso', ['derbent'], 'Janato de Derbent, unido a Quba.', LOCAL),
  ],
};

// Zones. lon/lat from the map projection; boundaries follow rivers and
// mountain lines approximately (regional precision).
const LL = ([x, y]) => ({lon: (x - 563) / 3.3, lat: (359 - y) / 4.3});
// Cells the linear projection places on the wrong side of a boundary.
const OVERRIDES = {
  Sukhumi: 'abjasia', Anacopia: 'abjasia', Pitsunda: 'abjasia', Bedia: 'abjasia',
  Ushguli: 'georgia-oeste', Lentekhi: 'georgia-oeste', Lata_Georgia: 'georgia-oeste', Shamkir: 'arran',
  Merv: 'merv', Hazarasp: 'jorezm', Pulzhai: 'jorezm', Qonirat: 'jorezm', Shimbay: 'jorezm', Khurgancha: 'jorezm',
  Gamrun: 'ormuz', Julfar: 'oman-norte', Khor_Fakkan: 'oman-norte', Shikarpur: 'sind', Kalmat: 'kalat', Qasr_e_Qand: 'makran',
  Badra: 'iraq-sur', Bakusaya: 'iraq-sur', Al_Madar: 'iraq-sur', Ash_Shuaybah: 'hasa',
};
const NEIGHBOUR = new Set(['Bizerte', 'Sejnane', 'Bergheim', 'Kattegatt', 'El_Qoseir', 'Connector_Egypt16']);
function zoneOf({id, centroid}) {
  if (NEIGHBOUR.has(id)) return 'vecino';
  if (/^Dasht_(Kavir|Lut)\d/.test(id)) return 'desierto-iran';
  if (/^(Kyzylkum_Desert|Aral_Karakum_Desert|Hunger_Steppe|Ust_Yurt_Plateau)/.test(id)) return 'desierto-turan';
  if (/^Karakum_Desert/.test(id)) return 'turcomanos';
  if (/^(Kharan_Desert|Dasht_Registan|Dasht_Margoh)/.test(id)) return 'desierto-registan';
  if (/^(Syrian_Desert|Aba_Al_Qur)/.test(id)) return 'desierto-sirio';
  if (/^(An_Nafud|Ad_Dahna)/.test(id)) return 'arabia-tribus';
  if (id === 'Derbent') return 'derbent';
  if (id === 'Manama') return 'bahrein';
  if (OVERRIDES[id]) return OVERRIDES[id];
  const {lon, lat} = LL(centroid);
  // Arabia.
  const arabian = (lon < 48.3 && lat < 29.6) || (lon >= 48.3 && lon < 51.5 && lat < 28.4) || (lon >= 51.5 && lat < 26.4 && (lon < 56.6 || lat < 25));
  if (arabian && lon >= 34.6 && lon < 60) {
    if (lon < 41.2) return lat < 27.2 ? 'hiyaz' : 'arabia-tribus';
    if (lon < 48.3 && !(lon >= 47.4 && lat >= 28.5)) return lat >= 26.6 && lon < 44.5 ? 'najd-norte' : 'najd';
    if (lon < 51.5 || lat >= 24.4 && lon < 51.9) return 'hasa';
    return lon < 55.4 ? 'costa-tribus' : 'oman-norte';
  }
  // Mesopotamia and the Jazira.
  if (lat >= 29.6 && lat < 37.6) {
    if (lon < 42.3 && lat >= 35.3) return 'jazira';
    const iraqLimit = lat > 34.8 ? 44.8 : lat > 33 ? 45.5 : lat > 31.5 ? 46.1 : 48.0;
    if (lon < iraqLimit) return lat > 34.8 ? 'iraq-norte' : 'iraq-sur';
  }
  // The Caucasus.
  if (lat >= 38.9 && lon < 50.5) {
    if (lat >= 43.2) return lon < 41.6 ? 'circasia' : lon < 46.5 ? 'caucaso-norte' : 'daguestan';
    if (lon >= 46.3 && lat >= 41.75) return 'daguestan';
    if (lon < 41.9 && lat >= 42.3) return 'abjasia';
    if (lon < 42.4 && lat < 41.9) return 'adjara';
    if (lon < 43.8) return 'georgia-oeste';
    if ((lat >= 41 && lon < 46.6) || (lat >= 40.4 && lon < 45.4)) return lon < 45.3 ? 'kartli' : 'kajetia';
    if (lon >= 48.4 || (lat >= 40.3 && lon >= 47.2)) return 'shirvan';
    return 'arran';
  }
  // Turan, east of the Caspian.
  const turan = (lon >= 50.5 && lat >= 41) || (lon >= 53.8 && lon < 56 && lat >= 37.4) || (lon >= 56 && lon < 61.2 && lat >= 37.9) || (lon >= 61.2 && lat >= 37.3);
  if (turan) {
    if (lat >= 46.0 || (lat >= 43.4 && lon >= 58.5 && lon < 61.5)) return lon >= 58.5 ? 'estepa-kazaja' : 'estepa-oeste';
    if (lon >= 58.8 && lon < 62.0 && lat >= 40.8 && lat < 43.6) return 'jorezm';
    if ((lat >= 43.4 && lon >= 61.5) || (lat >= 42.4 && lon >= 66.0)) return 'sirdaria';
    if (lon >= 62.0) return lon >= 68.5 ? 'chach' : 'transoxiana';
    if (lon >= 51 && lat >= 41.0) return 'mangyshlak';
    return 'turcomanos';
  }
  // Afghanistan, Baluchistan, Sind and Merv.
  if (lon >= 61.2) {
    if (lon >= 67.0 && lat < 27.6) return 'sind';
    if (lat < 30.6 && lon >= 61.6) return 'kalat';
    if (lat >= 35.6) return lon >= 63.0 ? 'balj' : 'merv';
    if (lon < 63.6) return 'herat';
    return lat < 32.6 && lon < 67.0 ? 'kandahar' : 'ghazni';
  }
  // Iran.
  if (lat >= 36.6 && lon < 49.2) return 'azerbaiyan-iran';
  if (lat < 27.3 && lon >= 53.6 && lon < 58.6) return 'ormuz';
  if ((lat < 27.3 && lon >= 58.6) || (lat < 28.5 && lon >= 59.5)) return 'makran';
  if (lat < 31.3 && lon >= 50 && lon < 55.3) return 'fars';
  if (lat < 32.0 && lon >= 55.3) return 'kerman';
  if (lon >= 55.0 && lat >= 32.0) return 'khorasan';
  return 'iran-centro';
}

if (process.argv[2] === '--zones') {
  const missingIds = new Set(JSON.parse(fs.readFileSync(process.argv[3], 'utf8')).map(cell => cell.id));
  const zones = {};
  for (const cell of read('location-inventory.json').cells) if (missingIds.has(cell.id)) (zones[zoneOf(cell)] ||= []).push(cell.id);
  for (const [zone, ids] of Object.entries(zones).sort()) console.log(zone.padEnd(18), String(ids.length).padStart(4), ids.join(' '));
  process.exit(0);
}

// Uncoloured cell-years on the common map without this review.
const data = read('corridor-locations.json');
const ownNames = new Set(data[KEY]?.layerNames || []);
data.additionalTerritories = data.additionalTerritories.filter(layer => !ownNames.has(layer.name));
delete data[KEY];
data.burgundy = read('burgundian-locations.json');
const inventory = read('location-inventory.json').cells.filter(cell => cell.visible && cell.centroid);
const byId = new Map(inventory.map(cell => [cell.id, cell]));
const distance = (a, b) => Math.hypot(a.centroid[0] - b.centroid[0], a.centroid[1] - b.centroid[1]);
const nearby = new Map([...NEIGHBOUR].filter(id => byId.has(id)).map(id => [id, inventory.filter(cell => !NEIGHBOUR.has(cell.id) && cell.id !== id)
  .sort((a, b) => distance(a, byId.get(id)) - distance(b, byId.get(id))).slice(0, 12)]));
const missing = new Map(inventory.map(cell => [cell.id, []]));
const neighbourIdentity = new Map([...nearby.keys()].map(id => [id, new Map()]));
for (let year = FROM; year <= THROUGH; year++) {
  const mosaic = europeMosaicAt(data, year, PERSONAS);
  for (const cell of inventory) if (!mosaic.byLocation.has(cell.id)) missing.get(cell.id).push(year);
  for (const [id, cells] of nearby) {
    const near = cells.find(cell => mosaic.byLocation.has(cell.id));
    const layer = near && mosaic.byLocation.get(near.id)[0];
    if (layer) neighbourIdentity.get(id).set(year, territorialIdentity(layer.name));
  }
}
const intervals = years => years.reduce((list, year) => { const last = list.at(-1); if (last && last[1] === year - 1) last[1] = year; else list.push([year, year]); return list; }, []);
const NEIGHBOUR_SOURCES = {Bizerte: ['tunisia'], Sejnane: ['tunisia'], Bergheim: ['renania'], Kattegatt: ['danimarca'], El_Qoseir: ['egitto'], Connector_Egypt16: ['egitto']};

function neighbourPhases(id, gaps) {
  const phases = [];
  for (const [from, through] of gaps) for (let year = from; year <= through; year++) {
    const identity = neighbourIdentity.get(id)?.get(year);
    if (!identity) continue;
    const last = phases.at(-1);
    if (last && last.identity === identity && last.through === year - 1) last.through = year;
    else phases.push(P(year, year, identity, NEIGHBOUR_SOURCES[id], 'Celda pequeña aislada: sigue al territorio vecino en cada año.'));
  }
  return phases;
}

function buildReview() {
  const groups = new Map();
  for (const cell of inventory) {
    const gaps = intervals(missing.get(cell.id));
    if (!gaps.length) continue;
    const zone = zoneOf(cell);
    const phases = zone === 'vecino' ? neighbourPhases(cell.id, gaps) : CHRONOLOGY[zone];
    if (!phases) continue;
    phases.forEach((phase, index) => {
      for (const [from, through] of gaps) {
        const a = Math.max(from, phase.from), b = Math.min(through, phase.through);
        if (a > b) continue;
        const key = zone === 'vecino' ? `${zone}|${cell.id}|${index}|${a}|${b}` : `${zone}|${index}|${a}|${b}`;
        if (!groups.has(key)) groups.set(key, {zone, phase, from: a, through: b, ids: []});
        groups.get(key).ids.push(cell.id);
      }
    });
  }
  let n = 0;
  const assignments = [...groups.values()].sort((a, b) => a.zone.localeCompare(b.zone) || a.from - b.from || a.ids[0].localeCompare(b.ids[0])).map(({zone, phase, from, through, ids}) => ({
    name: `${phase.identity} · ${from}–${through} · revisión Oriente Medio ${++n}`,
    identity: phase.identity, from, through, ids: ids.sort(), governmentTerritories: [],
    sourceKeys: phase.sourceKeys, precision: 'regional_approximation', limitedCore: false, note: phase.note,
    scopeLabel: `${zone} · ${from}–${through}`,
    ...(phase.authorityCondition ? {authorityCondition: phase.authorityCondition} : {}),
  }));
  const ids = [...new Set(assignments.flatMap(a => a.ids))].sort();
  return {
    schema: 1, reviewedAt: '2026-11-21',
    scope: {name: 'Mesopotamia, Persia, Arabia, Cáucaso, Turán, Afganistán, Baluchistán y Sind', from: FROM, through: THROUGH, ids},
    precedenceIds: [], limitedCore: false, assignments, sources,
    limitations: [
      'Solo se colorean los años en que ninguna otra capa del Atlas cubre la celda: la revisión no sustituye a las anteriores.',
      'Las zonas se trazan por longitud y latitud a partir de la proyección del mapa; las fronteras son aproximadas y la precisión es regional.',
      'Las tribus, los janatos y los señoríos que compartían una zona se nombran en las notas en vez de dibujarles fronteras.',
      'Seis celdas pequeñas aisladas (Bizerta, Sejnane, Bergheim, Kattegatt y dos de la costa egipcia del mar Rojo) siguen cada año al territorio vecino más cercano.',
    ],
  };
}

let review = buildReview();
const write = () => {
  fs.writeFileSync(mapDataFile('middle-east-review.json'), `${JSON.stringify(review, null, 2)}\n`);
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
write();
const unzoned = inventory.filter(cell => missing.get(cell.id).length && !review.scope.ids.includes(cell.id)).map(cell => cell.id);
console.log(`Oriente Medio: ${review.assignments.length} fases en ${review.scope.ids.length} celdas; sin zona: ${unzoned.join(', ') || 'ninguna'}`);
