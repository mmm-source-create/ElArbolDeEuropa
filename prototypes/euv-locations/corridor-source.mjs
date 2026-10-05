// Transfer existing *territorial* versions, not each ruler's combined titles.
// This keeps Castile, Aragon, Naples, Milan, etc. separate even when one
// person governed several of them. Geometry is only a candidate crosswalk.
import fs from 'node:fs';
import { idsDeReinoEnAño, REINO_A_IDS, REINO_COLOR, REINO_VERSIONES } from '../../src/Territorios.jsx';
import { imperialFrameIds } from '../../src/data/imperialFrame.js';

const FROM = 1400;
const THROUGH = 1650;
const corridors = {
  Iberia: [
    'Castilla', 'León', 'Navarra', 'Granada', 'Portugal',
    'Aragón', 'Condado de Barcelona', 'Valencia', 'Mallorca', 'Cerdeña', 'Trinacria',
  ],
  Italia: [
    'Nápoles', 'Milán', 'Venecia', 'Saboya', 'Piamonte',
    'Estados Pontificios', 'Florencia', 'Toscana', 'Mantua',
    'Módena', 'Ferrara', 'Urbino', 'Parma', 'Monferrato', 'Saluzzo',
  ],
  Centroeuropa: [
    'Austria', 'Austria Interior', 'Tirol', 'Baviera',
    'Palatinado', 'Bohemia', 'Hungría',
    'Principado episcopal de Brixen', 'Principado episcopal de Trento',
    'Arzobispado principesco de Salzburgo',
  ],
  'Europa septentrional y oriental': [
    'Corona de Polonia', 'Ducado de Mazovia', 'Prusia Real',
    'Prusia de la Orden', 'Prusia ducal', 'Gran Ducado de Lituania',
    'Principado episcopal de Warmia', 'Livonia del Commonwealth',
    'Livonia sueca', 'Estonia sueca', 'Ducado de Curlandia',
    'Riga libre', 'Riga bajo la Mancomunidad', 'Riga bajo Suecia',
    'Reino de Dinamarca', 'Reino de Noruega', 'Reino de Suecia',
    'Ducado de Schleswig', 'Ducado de Holstein', 'Mecklemburgo',
    'Ducado de Pomerania', 'Pomerania bajo ocupación sueca',
    'Pomerania sueca', 'Pomerania de Brandeburgo', 'Señorío sueco de Wismar',
    'Ösel bajo Dinamarca', 'Ösel bajo Suecia',
    'Moscovia y Zarato de Rusia', 'República de Nóvgorod',
    'República de Pskov', 'Principado de Tver', 'Principado de Riazán',
    'Kanato de Kazán', 'Islas Feroe bajo la Corona noruega',
  ],
  'Francia e islas británicas': [
    'Francia', 'Bretaña', 'Provenza', 'Inglaterra', 'Escocia',
    'Plaza inglesa de Calais', 'Plazas inglesas de Guyena',
    'Núcleo inglés en Irlanda', 'Señorío de Man', 'Bailiazgo de Jersey',
  ],
  'Borgoña e Imperio': [
    'Marco jurídico del Sacro Imperio',
  ],
};

// The existing France shape includes territories before their incorporation,
// and the old Provence shape is Avignon plus Nice rather than Provence. Keep
// the jurisdictions distinct until a dated union, and omit early French
// wartime borders rather than passing the old blanket polygon off as fact.
const BRITTANY_OLD = ['Nantais', 'Vannetais', 'Ploermel', 'Rennais', 'Tregor', 'Cornouaille'];
const PROVENCE_OLD = ['Aquisextain', 'Dracenois', 'Dignois'];
const SCOTLAND_OLD = idsDeReinoEnAño('Inglaterra', 1707)
  .filter(id => !idsDeReinoEnAño('Inglaterra', 1600).includes(id));
const FRENCH_SEPARATE = new Set([
  ...BRITTANY_OLD, 'Dijonnais', 'Autunnais', 'Auxerrois', 'Ponthieu',
  'Nevernais', 'Bearn_Bigorre', 'Jersey',
]);

// The Atlas's single post-1386 polygon lists anachronistically absorbs
// Mazovia, Pomerania and Moldavian vassals. This pilot separates the
// jurisdictions before applying the same geometric crosswalk as the others.
const POLAND_EXCLUDE = new Set([
  'Czersk', 'Warsaw', 'Lomza', 'Ciechanow', 'Rawa', 'Plock',
  'Stolp', 'Koslin', 'Basarabia', 'Barlad', 'Bacau', 'Orhei',
  'Iasi', 'Balti_Moldova', 'Dorohei', 'Suceava',
]);
const POLAND_CORE = idsDeReinoEnAño('Polonia', 1400).filter(id => !POLAND_EXCLUDE.has(id));
const LITHUANIA_CORE = [
  'Medininkai', 'Siauliai', 'Upyte', 'Vilnius', 'Vilkmerge', 'Raseiniai',
  'Kaunas', 'Suwalki', 'Trakai', 'Bresta', 'Kobryn', 'Vawkavysk',
  'Slonin', 'Grodno', 'Lida', 'Dzisna', 'Vitebsk', 'Breslauja',
  'Svir', 'Lahoysk', 'Barysaw', 'Ashmyany', 'Minsk', 'Novogrudok',
  'Orsha', 'Mogilev', 'Mstsislaw', 'Rechytsa', 'Slutsk', 'Kletsk',
  'Pinsk', 'Mazyr', 'Turov',
];
const LITHUANIA_TRANSFER_1569 = [
  'Podlasie', 'Lutsk', 'Rivne', 'Zviahel', 'Zhytomyr', 'Porossia',
  'Vinnytsia', 'Torgovytsia', 'Bratslav', 'Cherkasy', 'Kyiv',
  'Chornobyl', 'Ovruch', 'Olevsk',
];

// The previous atlas map has regional polygons, not the modern EU V
// locations. These source polygons are only a crosswalk; dated local
// corrections below handle the transitions the old map cannot express.
const SWEDEN_CORE = [
  'Vastergotland', 'Ostergotland', 'Sodermanland', 'Uppland', 'Dalarna',
  'Varmland', 'Gastrikland', 'Halsingland', 'Angermanland', 'Vasterbotten',
  'Sodra_Osterbotten', 'Norra_Osterbotten', 'Ostra_Smaland',
  'Finland', 'Tavastland', 'Nyland', 'Savolax',
];
const NORWAY_CORE = [
  'Agder', 'Bergenhus', 'Buskerud', 'Finnmark', 'Hedmark', 'Nordland',
  'Nor_Trondelag', 'Sor_Trondelag', 'Oppland', 'Rogaland', 'Romsdalen',
  'Sogn', 'Vestfold', 'Bohus', 'Jamtland',
];
const DENMARK_CORE = [
  'Western_Jutland', 'Eastern_Jutland', 'Vendsyssel_Thy', 'Zealand', 'Funen',
  'Halland', 'Blekinge', 'Gotland',
];
const POMERANIA_OLD = ['Stettin', 'Stolp', 'Koslin'];
const MOSCOVY_CORE = ['Moscow', 'Vladimir', 'Kostroma'];

// Direct location additions are used only for named cities/islands that the
// old Atlas SVG has no polygon for. They are marked as point proxies in the
// layer notes and do not assert a surveyed boundary.
const datedCorrections = [
  { territory: 'Riga libre', id: 'Riga', action: 'add', from: 1561, through: 1580,
    reason: 'Riga is represented by its city location only; the autonomous city is not expanded into a territorial polygon.',
    source: 'https://enciklopedija.lv/skirklis/198863' },
  { territory: 'Riga bajo la Mancomunidad', id: 'Riga', action: 'add', from: 1581, through: 1620,
    reason: 'The city submitted to the Polish-Lithuanian Commonwealth in 1581; this location marker does not define its hinterland.',
    source: 'https://www.rigamuz.lv/rvkm/en/ekspoz_eng/riga-history-riga-under-the-polish-and-swedish-rule-1581-1710/' },
  { territory: 'Riga bajo Suecia', id: 'Riga', action: 'add', from: 1621, through: 1650,
    reason: 'Sweden captured Riga in 1621; the city location is a point proxy, not the whole Swedish Livonia border.',
    source: 'https://www.riga.lv/en/rigas-vesture' },
  { territory: 'Livonia del Commonwealth', id: 'Riga', action: 'remove', from: 1569, through: 1628,
    reason: 'Riga is tracked as a separate city jurisdiction, so the regional Livonia layer does not repaint its urban marker.',
    source: 'https://enciklopedija.lv/skirklis/198863' },
  { territory: 'Ösel bajo Dinamarca', id: 'Kuressaare', action: 'add', from: 1559, through: 1644,
    reason: 'Kuressaare is a city-level proxy for Danish possession of Ösel from 1559; it does not draw the island boundary.',
    source: 'https://lex.dk/Saaremaa' },
  { territory: 'Ösel bajo Suecia', id: 'Kuressaare', action: 'add', from: 1645, through: 1650,
    reason: 'Ösel passed to Sweden in the Treaty of Brömsebro; Kuressaare is shown only as a location proxy.',
    source: 'https://lex.dk/Br%C3%B6msebro' },
  { territory: 'Reino de Noruega', id: 'Orkney', action: 'add', from: 1400, through: 1468,
    reason: 'Orkney remained under the Norwegian crown until its transfer to Scotland in 1469; this is a point proxy, not a boundary.',
    source: 'https://www.historicenvironment.scot/visit/all/maeshowe-chambered-cairn/history-and-stories/' },
  { territory: 'Reino de Noruega', id: 'Shetland', action: 'add', from: 1400, through: 1468,
    reason: 'Shetland passed from Norway to Scotland in 1469; this is a point proxy, not a boundary.',
    source: 'https://www.historicenvironment.scot/visit/all/jarlshof-prehistoric-and-norse-settlement/history-and-stories/' },
  { territory: 'Islas Feroe bajo la Corona noruega', id: 'Torshavn', action: 'add', from: 1400, through: 1650,
    reason: 'Tórshavn is only a city marker for the Faroes, which remained a Norwegian dependency under the Danish-Norwegian monarchy; no island boundary is inferred.',
    source: 'https://www.faroeislands.fo/the-big-picture/history-of-the-faroe-islands/historical-timeline' },
  { territory: 'Pomerania sueca', id: 'Rugen', action: 'add', from: 1648, through: 1650,
    reason: 'Rügen was included in the Swedish part assigned at Westphalia; the city/region ID is a cartographic proxy.',
    source: 'https://historiapomorza.pl/en/epoka/swedish-pomerania-1637-1815/' },
  { territory: 'Señorío sueco de Wismar', id: 'Wismar', action: 'add', from: 1648, through: 1650,
    reason: 'Westphalia assigned Wismar to Sweden as an imperial fief; this city marker does not imply control of Mecklenburg.',
    source: 'https://germanhistorydocs.org/en/from-the-reformations-to-the-thirty-years-war-1500-1648/peace-treaties-of-westphalia-october-14-24-1648' },
  { territory: 'Mecklemburgo', id: 'Wismar', action: 'remove', from: 1648, through: 1650,
    reason: 'Wismar is separated as a Swedish imperial fief after Westphalia; it is not painted as ordinary Mecklenburg territory.',
    source: 'https://germanhistorydocs.org/en/from-the-reformations-to-the-thirty-years-war-1500-1648/peace-treaties-of-westphalia-october-14-24-1648' },
  { territory: 'República de Nóvgorod', id: 'Novgorod', action: 'add', from: 1400, through: 1477,
    reason: 'Novgorod is represented by its city location; no border is inferred from the point.',
    source: 'https://www.cambridge.org/core/books/abs/cambridge-history-of-russia/growth-of-muscovy-14621533/BCBC6FD430448E9337252DFBCE9069EE' },
  { territory: 'Moscovia y Zarato de Rusia', id: 'Novgorod', action: 'add', from: 1478, through: 1650,
    reason: 'Ivan III annexed Novgorod in 1478; the new-map city location supplements the older regional crosswalk.',
    source: 'https://www.cambridge.org/core/books/abs/cambridge-history-of-russia/growth-of-muscovy-14621533/BCBC6FD430448E9337252DFBCE9069EE' },
];

const specialSeries = {
  Francia: year => [
    ...idsDeReinoEnAño('Francia', year).filter(id => !FRENCH_SEPARATE.has(id)),
    ...(year >= 1477 ? ['Dijonnais', 'Autunnais', 'Auxerrois', 'Ponthieu'] : []),
    ...(year >= 1486 ? PROVENCE_OLD : []),
    ...(year >= 1532 ? BRITTANY_OLD : []),
    ...(year >= 1620 ? ['Bearn_Bigorre'] : []),
  ],
  Bretaña: () => BRITTANY_OLD,
  Provenza: () => PROVENCE_OLD,
  Escocia: () => SCOTLAND_OLD,
  'Plaza inglesa de Calais': () => [],
  'Plazas inglesas de Guyena': () => [],
  'Núcleo inglés en Irlanda': () => [],
  'Señorío de Man': () => [],
  'Bailiazgo de Jersey': () => [],
  'Marco jurídico del Sacro Imperio': year => imperialFrameIds(year),
  // Only independently sourced locations are colored. The broader, often
  // overlapping ecclesiastical jurisdictions remain open for later audit.
  'Principado episcopal de Brixen': () => [],
  'Principado episcopal de Trento': () => [],
  'Arzobispado principesco de Salzburgo': () => [],
  'Corona de Polonia': year => [
    ...POLAND_CORE,
    ...(year >= 1462 ? ['Rawa'] : []),
    ...(year >= 1495 ? ['Plock'] : []),
    ...(year >= 1526 ? ['Czersk', 'Warsaw', 'Lomza', 'Ciechanow'] : []),
    ...(year >= 1569 ? LITHUANIA_TRANSFER_1569 : []),
  ],
  'Ducado de Mazovia': year => [
    ...(year < 1526 ? ['Czersk', 'Warsaw', 'Lomza', 'Ciechanow'] : []),
    ...(year < 1495 ? ['Plock'] : []),
    ...(year < 1462 ? ['Rawa'] : []),
  ],
  'Prusia Real': year => year >= 1466 ? ['Danzig', 'Chelmno'] : [],
  'Principado episcopal de Warmia': year => year >= 1466 ? ['Warmia'] : [],
  'Prusia de la Orden': year => year <= 1524 ? [
    ...idsDeReinoEnAño('Prusia', year),
    ...(year < 1454 ? ['Danzig', 'Chelmno', 'Warmia'] : []),
  ] : [],
  'Prusia ducal': year => year >= 1525 ? idsDeReinoEnAño('Prusia', year) : [],
  'Gran Ducado de Lituania': year => [
    ...LITHUANIA_CORE,
    ...(year < 1569 ? LITHUANIA_TRANSFER_1569 : []),
  ],
  'Livonia del Commonwealth': year => year >= 1561 && year <= 1628
    ? ['North_Livonia', 'Inner_Livonia', 'South_Livonia'] : [],
  'Livonia sueca': year => year >= 1629 ? ['North_Livonia', 'Inner_Livonia'] : [],
  'Estonia sueca': year => year >= 1561 ? ['Estonia'] : [],
  'Ducado de Curlandia': year => year >= 1561 ? ['Courland'] : [],
  'Riga libre': () => [],
  'Riga bajo la Mancomunidad': () => [],
  'Riga bajo Suecia': () => [],
  'Reino de Dinamarca': year => [
    ...DENMARK_CORE.filter(id => !['Halland', 'Gotland'].includes(id) || year < 1645),
    ...(year < 1645 ? ['Halland', 'Gotland'] : []),
  ],
  'Reino de Noruega': year => [
    ...NORWAY_CORE.filter(id => !['Jamtland'].includes(id) || year < 1645),
  ],
  'Islas Feroe bajo la Corona noruega': () => [],
  'Reino de Suecia': year => [
    ...SWEDEN_CORE,
    ...(year >= 1645 ? ['Jamtland', 'Halland', 'Gotland'] : []),
  ],
  'Ducado de Schleswig': () => ['Slesvig'],
  'Ducado de Holstein': () => ['Holstein'],
  Mecklemburgo: () => ['Schwerin'],
  'Ducado de Pomerania': year => year <= 1636 ? POMERANIA_OLD : [],
  'Pomerania bajo ocupación sueca': year => year >= 1630 && year <= 1647 ? POMERANIA_OLD : [],
  'Pomerania sueca': year => year >= 1648 ? ['Stettin'] : [],
  'Pomerania de Brandeburgo': year => year >= 1648 ? ['Stolp', 'Koslin'] : [],
  'Señorío sueco de Wismar': () => [],
  'Ösel bajo Dinamarca': () => [],
  'Ösel bajo Suecia': () => [],
  'Moscovia y Zarato de Rusia': year => [
    ...MOSCOVY_CORE,
    ...(year >= 1463 ? ['Yaroslavl'] : []),
    ...(year >= 1474 ? ['Rostov'] : []),
    ...(year >= 1485 ? ['Tver', 'Tverskaya'] : []),
    ...(year >= 1510 ? ['North_Pskov', 'South_Pskov'] : []),
    ...(year >= 1514 && year <= 1610 || year >= 1634 ? ['Smolensk'] : []),
    ...(year >= 1521 ? ['Ryazan'] : []),
    ...(year >= 1552 ? ['Kazan'] : []),
  ],
  'República de Nóvgorod': () => [],
  'República de Pskov': year => year <= 1509 ? ['North_Pskov', 'South_Pskov'] : [],
  'Principado de Tver': year => year <= 1484 ? ['Tver', 'Tverskaya'] : [],
  'Principado de Riazán': year => year <= 1520 ? ['Ryazan'] : [],
  'Kanato de Kazán': year => year <= 1551 ? ['Kazan'] : [],
};

// A territorial label can outlive its independent government in the Atlas.
// Keep the old shape available for audit, but stop painting it as a separate
// political map after incorporation into a successor jurisdiction.
const active = {
  Francia: { from: 1453, reason: 'Antes de 1453 las ocupaciones de la Guerra de los Cien Años necesitan capas fechadas locales; el agregado queda gris.',
    source: 'https://www.nationalarchives.gov.uk/help-with-your-research/research-guides/french-lands-english-kings/' },
  Bretaña: { through: 1531, reason: 'El ducado se unió a la Corona francesa en 1532; el matrimonio dinástico anterior no lo borró.',
    source: 'https://ccfr.bnf.fr/portailccfr/ark:/16871/004D36F12606' },
  Provenza: { through: 1485, reason: 'La unión formal del condado de Provenza a la Corona francesa está documentada en las letras de octubre de 1486.',
    source: 'https://ccfr.bnf.fr/portailccfr/ark:/16871/004D22012314' },
  'Plaza inglesa de Calais': { through: 1557, reason: 'Calais y su marcha permanecieron en manos inglesas hasta comienzos de 1558.',
    source: 'https://www.nationalarchives.gov.uk/help-with-your-research/research-guides/french-lands-english-kings/' },
  'Plazas inglesas de Guyena': { through: 1452, reason: 'Solo se muestran los núcleos documentados; la situación de Burdeos cambió en 1451–1453 y no se generaliza a toda Guyena.',
    source: 'https://discovery.nationalarchives.gov.uk/details/r/C3621' },
  'Señorío de Man': { from: 1406, reason: 'El señorío de los Stanley se estableció por concesión inglesa en 1406; la jurisdicción insular era distinta de Inglaterra y Escocia.',
    source: 'https://manxnationalheritage.im/news/medieval-ring-declared-treasure/' },
  Florencia: { through: 1568, reason: 'Desde 1569 se muestra el Gran Ducado de Toscana.',
    source: 'https://www.treccani.it/enciclopedia/giovanna-d-austria-granduchessa-di-toscana_(Dizionario-Biografico)/' },
  Toscana: { from: 1569, reason: 'Título granducal concedido a Cosme I en 1569.',
    source: 'https://www.treccani.it/enciclopedia/giovanna-d-austria-granduchessa-di-toscana_(Dizionario-Biografico)/' },
  Ferrara: { through: 1597, reason: 'El ducado de Ferrara fue devuelto a los Estados Pontificios en 1598.',
    source: 'https://www.treccani.it/enciclopedia/ferrara_(Enciclopedia-Italiana)/' },
  Urbino: { through: 1630, reason: 'El ducado fue integrado en los Estados Pontificios en 1631.',
    source: 'https://www.treccani.it/enciclopedia/stato-pontificio/' },
  Saluzzo: { through: 1600, reason: 'El marquesado pasó formalmente a Saboya por el tratado de Lyon de 1601; su ocupación desde 1588 requiere otra capa.',
    source: 'https://www.treccani.it/enciclopedia/marchesato-di-saluzzo_(Dizionario-di-Storia)/' },
  Parma: { from: 1545, reason: 'El ducado separado de Parma y Piacenza se creó en 1545; los gobiernos anteriores requieren sus propias jurisdicciones.',
    source: 'https://www.treccani.it/enciclopedia/parma-e-piacenza-ducato-di_(Dizionario-di-Storia)/' },
  Baviera: { from: 1505, reason: 'Antes de la reunificación de 1505 había ducados bávaros de distintas ramas; esta capa solo muestra el núcleo reunido.',
    source: 'https://www.historisches-lexikon-bayerns.de/Lexikon/K%C3%B6lner_Schiedsspruch%2C_30._Juli_1505' },
  Hungría: { through: 1525, reason: 'Después de Mohács (1526), título y control se disputaron; no se debe proyectar el reino medieval completo sobre la Hungría real, Transilvania y el dominio otomano.',
    source: 'https://www.habsburger.net/en/chapter/ferdinand-i-new-crowns-habsburgs' },
  'Ducado de Mazovia': { through: 1525, reason: 'El último ducado mazoviano fue incorporado a la Corona en 1526; Rawa y Płock habían pasado antes.',
    source: 'https://agad.gov.pl/?page_id=486' },
  'Prusia Real': { from: 1466, through: 1650, reason: 'Provincia autónoma dentro de la Corona polaca; conserva identidad regional sin convertirse en un Estado vecino.',
    source: 'https://zpe.gov.pl/a/polskie-dynastie-jagiellonowie/D12LkQne7' },
  'Principado episcopal de Warmia': { from: 1466, through: 1650, reason: 'Warmia se muestra como principado episcopal diferenciado tras la Segunda Paz de Toruń; no se dibuja como parte de la administración ordinaria de la Corona.',
    source: 'https://www.agad.gov.pl/mow/unia2C_eng.pdf' },
  'Prusia de la Orden': { through: 1524, reason: 'El estado de la Orden Teutónica fue secularizado como Ducado de Prusia en 1525.',
    source: 'https://zpe.gov.pl/a/prezentacja-multimedialna/DbYm1LK96' },
  'Prusia ducal': { from: 1525, through: 1650, reason: 'Ducado separado y feudo polaco desde 1525; la unión personal con Brandeburgo desde 1618 no lo incorporó a la Corona.',
    source: 'https://zpe.gov.pl/a/prezentacja-multimedialna/DbYm1LK96' },
  'Corona de Polonia': { through: 1650, reason: 'Se prolonga la configuración posterior a Lublin; las tierras transferidas en 1569 pasan a la Corona, sin absorber Curlandia ni la Prusia ducal.',
    source: 'https://www.agad.gov.pl/mow/unia2C_eng.pdf' },
  'Gran Ducado de Lituania': { through: 1650, reason: 'La unión de 1569 creó una comunidad política común, pero el Gran Ducado mantuvo gobierno y territorio propios después de las transferencias a la Corona.',
    source: 'https://www.agad.gov.pl/mow/unia2C_eng.pdf' },
  'Livonia del Commonwealth': { from: 1569, through: 1628, reason: 'Livonia se incorporó en 1569 como condominio de Corona y Gran Ducado; Altmark en 1629 transfirió la mayor parte a Suecia y Latgale permaneció en la Mancomunidad.',
    source: 'https://www.agad.gov.pl/mow/unia2C_eng.pdf' },
  'Livonia sueca': { from: 1629, through: 1650, reason: 'Se muestra la posesión reconocida por Altmark; no se retrotrae la frontera sueca a la capitulación de Estonia de 1561.',
    source: 'https://onlinelibrary.wiley.com/doi/full/10.1111/ehr.13410' },
  'Estonia sueca': { from: 1561, through: 1650, reason: 'Tallin y Harju-Viru aceptaron el gobierno sueco en 1561; el color no implica control sueco de toda Livonia.',
    source: 'https://ojs.utlib.ee/index.php/EAA/article/view/AA.2017.1.02' },
  'Ducado de Curlandia': { from: 1561, through: 1650, reason: 'Ducado autónomo y feudo de la Mancomunidad desde 1561; se conserva separado de Polonia-Lituania.',
    source: 'https://dspace.lu.lv/items/8812084a-b442-4c43-b827-e490e42aac55' },
  'Riga libre': { from: 1561, through: 1580, reason: 'Riga se representa solo como ciudad; su estatus cambió durante la disolución de la Confederación Livona.',
    source: 'https://www.britannica.com/place/Riga/History' },
  'Riga bajo la Mancomunidad': { from: 1581, through: 1620, reason: 'La ciudad pasó a la Mancomunidad; se marca solo Riga, no toda Livonia.',
    source: 'https://www.britannica.com/place/Riga/History' },
  'Riga bajo Suecia': { from: 1621, through: 1650, reason: 'Suecia tomó Riga en 1621; Altmark reconoció en 1629 la posesión de la mayor parte de Livonia.',
    source: 'https://www.britannica.com/place/Riga/History' },
  'Reino de Dinamarca': { from: 1400, through: 1650, reason: 'Reino propio dentro de la Unión de Kalmar y luego de la monarquía danesa-noruega; Schleswig y Holstein permanecen como ducados distintos.',
    source: 'https://snl.no/Kalmarunionen' },
  'Reino de Noruega': { from: 1400, through: 1650, reason: 'Reino diferenciado bajo la misma monarquía que Dinamarca; la subordinación institucional de 1537 no convierte Noruega en Dinamarca.',
    source: 'https://snl.no/Kalmarunionen' },
  'Islas Feroe bajo la Corona noruega': { from: 1400, through: 1650, reason: 'Dependencia de la Corona noruega durante la unión con Dinamarca; Tórshavn es un punto cartográfico y no un perímetro territorial.',
    source: 'https://www.faroeislands.fo/the-big-picture/history-of-the-faroe-islands/historical-timeline' },
  'Reino de Suecia': { from: 1400, through: 1650, reason: 'Reino separado de Dinamarca y Noruega desde 1523; antes conserva una capa propia para no confundir unión personal con incorporación.',
    source: 'https://snl.no/Kalmarunionen' },
  'Ducado de Schleswig': { from: 1400, through: 1650, reason: 'Ducado ligado a la Corona danesa, pero jurisdicción distinta del Reino de Dinamarca; unido dinásticamente a Holstein desde 1460.',
    source: 'https://www.schleswig-holstein.de/DE/fachinhalte/L/landeskundegeschichte/Chronologie_Augenblicke_Landesgeschichte/1460_VertragRipen' },
  'Ducado de Holstein': { from: 1400, through: 1650, reason: 'Ducado separado, parte del Sacro Imperio y gobernado por los reyes daneses como duques; no se colorea como Dinamarca.',
    source: 'https://www.schleswig-holstein.de/DE/fachinhalte/L/landeskundegeschichte/Chronologie_Augenblicke_Landesgeschichte/1460_VertragRipen' },
  Mecklemburgo: { from: 1400, through: 1650, reason: 'Un polígono aproxima el ducado; Wismar se separa como feudo sueco desde 1648 y aquí no se dividen las ramas de Schwerin y Güstrow.',
    source: 'https://germanhistorydocs.org/en/from-the-reformations-to-the-thirty-years-war-1500-1648/peace-treaties-of-westphalia-october-14-24-1648' },
  'Ducado de Pomerania': { from: 1400, through: 1636, reason: 'Ducado de los Griffins hasta la muerte de Bogislaw XIV en 1637; después la sucesión quedó disputada.',
    source: 'https://historiapomorza.pl/en/epoka/the-duchy-of-pomerania-and-the-thirty-years-war/' },
  'Pomerania bajo ocupación sueca': { from: 1630, through: 1647, reason: 'Capa de control militar sueco desde 1630. Tras la muerte del último duque en 1637 la sucesión siguió disputada; no se presenta como cesión legal anterior a Westfalia.',
    source: 'https://historiapomorza.pl/en/epoka/swedish-pomerania-1637-1815/' },
  'Pomerania sueca': { from: 1648, through: 1650, reason: 'Westfalia asignó la parte occidental a Suecia; el deslinde local se fijó en 1653, por lo que Stettin y Rügen son proxies.',
    source: 'https://historiapomorza.pl/en/epoka/swedish-pomerania-1637-1815/' },
  'Pomerania de Brandeburgo': { from: 1648, through: 1650, reason: 'Westfalia reconoció la sucesión de Brandeburgo en la parte oriental; el deslinde local no quedó fijado hasta 1653.',
    source: 'https://historiapomorza.pl/en/epoka/pomerania-in-the-brandenburg-period-1648-1653-1701-1713/' },
  'Señorío sueco de Wismar': { from: 1648, through: 1650, reason: 'Wismar fue asignada a Suecia como feudo imperial; el marcador de ciudad no representa el ducado de Mecklemburgo.',
    source: 'https://germanhistorydocs.org/en/from-the-reformations-to-the-thirty-years-war-1500-1648/peace-treaties-of-westphalia-october-14-24-1648' },
  'Ösel bajo Dinamarca': { from: 1559, through: 1644, reason: 'Kuressaare marca la posesión danesa de Ösel como punto; no se dibuja un perímetro insular.',
    source: 'https://lex.dk/Br%C3%B6msebro' },
  'Ösel bajo Suecia': { from: 1645, through: 1650, reason: 'Ösel pasó a Suecia en 1645; Kuressaare es únicamente un marcador cartográfico.',
    source: 'https://lex.dk/Br%C3%B6msebro' },
  'Moscovia y Zarato de Rusia': { from: 1400, through: 1650, reason: 'La capa sigue adquisiciones fechadas de Moscovia y el Zarato; Nóvgorod, Pskov, Tver, Riazán y Kazán se separan hasta sus anexiones.',
    source: 'https://www.cambridge.org/core/books/abs/cambridge-history-of-russia/growth-of-muscovy-14621533/BCBC6FD430448E9337252DFBCE9069EE' },
  'República de Nóvgorod': { from: 1400, through: 1477, reason: 'República independiente hasta la anexión moscovita de 1478; se representa solo la ciudad, sin inventar sus fronteras.',
    source: 'https://www.cambridge.org/core/books/abs/cambridge-history-of-russia/growth-of-muscovy-14621533/BCBC6FD430448E9337252DFBCE9069EE' },
  'República de Pskov': { from: 1400, through: 1509, reason: 'República independiente hasta la anexión de 1510; la equivalencia regional es aproximada.',
    source: 'https://pskov.ru/region/istoriya/prisoedinenie-k-moskve' },
  'Principado de Tver': { from: 1400, through: 1484, reason: 'Principado separado hasta la anexión moscovita de 1485.',
    source: 'https://www.tver.ru/en/about/history/xv-xvii.php' },
  'Principado de Riazán': { from: 1400, through: 1520, reason: 'Principado separado hasta su incorporación a Moscovia en 1521.',
    source: 'https://www.cambridge.org/core/books/abs/cambridge-history-of-russia/growth-of-muscovy-14621533/BCBC6FD430448E9337252DFBCE9069EE' },
  'Kanato de Kazán': { from: 1400, through: 1551, reason: 'Kanato independiente hasta la conquista moscovita de 1552.',
    source: 'https://assets.cambridge.org/052181/2275/frontmatter/0521812275_frontmatter.htm' },
  'Marco jurídico del Sacro Imperio': { from: 1512, reason: 'Referencia institucional desde la organización de los círculos imperiales; no es una posesión territorial del emperador.',
    source: 'https://germanhistorydocs.org/en/from-the-reformations-to-the-thirty-years-war-1500-1648/ghdi:map-2809' },
};

const notes = {
  Francia: 'Agregado francés conservador desde 1453: Bretaña entra en 1532, Provenza en 1486 y el ducado de Borgoña en 1477. Los feudos y ocupaciones discutidos se revisan por separado; antes de 1453 el gris no significa ausencia de Corona francesa.',
  Bretaña: 'Ducado separado hasta la unión formal de 1532. Incluye los seis polígonos bretones antiguos, no solo los tres de la ficha anterior.',
  Provenza: 'Núcleo provenzal de Aix, Draguignan y Digne. No usa Avignon, bajo el Papado, ni Nice o Barcelonnette, cedidos a Saboya en 1388. Se incorpora a Francia desde 1486.',
  Inglaterra: 'Reino inglés, con Gales bajo su Corona en esta escala; Escocia permanece separada incluso después de la unión personal de 1603. Calais y los núcleos de Guyena se registran aparte.',
  Escocia: 'Reino separado de Inglaterra durante todo este ensayo (1400–1650), incluso cuando comparten soberano desde 1603. Se corrigen las adscripciones erróneas del agregado antiguo: Man y las Feroe nunca se pintan como Escocia; Orkney y Shetland entran en 1469 y Berwick solo se muestra entre 1461 y 1481.',
  'Plaza inglesa de Calais': 'Solo Calais, no todo Artois ni toda la costa del canal. La plaza pasó a Francia a comienzos de 1558.',
  'Plazas inglesas de Guyena': 'Núcleos urbanos documentados, no una reconstrucción completa de Gasconia ni de las ocupaciones de la Guerra de los Cien Años.',
  'Núcleo inglés en Irlanda': 'Solo nueve locations urbanas y próximas a los núcleos de Dublin, Meath, Kildare y Louth. No equivale a una frontera cerrada ni al control efectivo de toda Irlanda; su extensión variable y la expansión Tudor quedan por fechar.',
  'Señorío de Man': 'La isla conserva una jurisdicción señorial propia bajo los Stanley desde 1406. Su vínculo feudal con la Corona inglesa no la convierte en parte del reino inglés.',
  'Bailiazgo de Jersey': 'Jersey mantuvo su vínculo separado con la Corona inglesa desde 1204. Durante la ocupación francesa de 1461–1467 se muestra bajo Francia y reaparece como bailiazgo a partir de 1468.',
  Austria: 'Ducado/archiducado danubiano: no equivale al conjunto de posesiones de la Casa de Austria.',
  'Austria Interior': 'Estiria, Carintia, Carniola y litoral habsbúrgico. Pitten y Wiener Neustadt seguían la rama estiria aunque hoy estén en Baja Austria.',
  Tirol: 'Condado del Tirol. Se excluyen los obispados de Brixen y Trento; Kufstein y Kitzbühel entran en 1504 y Lienz en 1500.',
  Baviera: 'Núcleo reunificado en 1505. Las ciudades imperiales, obispados y Pfalz-Neuburg conservan jurisdicción separada; la Alta Palatinado se incorpora en 1628.',
  Palatinado: 'Palatinado electoral, no todas las ramas Wittelsbach. La Alta Palatinado se transfiere a Baviera en 1628.',
  Bohemia: 'Tierras de la Corona de Bohemia: incluye Moravia y partes de Silesia, además del reino estricto.',
  Hungría: 'Corona compuesta de San Esteban antes de Mohács: incluye Croacia y Transilvania. Desde 1526 la partición queda sin colorear hasta modelar cada sucesor.',
  'Principado episcopal de Brixen': 'Solo los núcleos Brixen y Bruneck están identificados; el dominio temporal completo del obispo tenía jurisdicciones superpuestas y aún no está dibujado.',
  'Principado episcopal de Trento': 'Solo Trento y Cavalese/Fiemme están identificados. La autonomía de Fiemme dentro del principado y sus límites requieren una capa más fina.',
  'Arzobispado principesco de Salzburgo': 'Solo núcleos comprobados, incluido el enclave de Mühldorf; no equivale a toda la diócesis ni a una frontera cerrada del Estado eclesiástico.',
  'Corona de Polonia': 'Corona, no todos los dominios de los Jagellón. Mazovia se incorpora por etapas; los voivodatos transferidos desde Lituania se muestran desde 1569. Moldavia y Pomerania occidental no se absorben por vasallaje o proximidad.',
  'Ducado de Mazovia': 'Ducado vasallo pero políticamente distinto. Rawa sale en 1462, Płock en 1495 y el núcleo restante en 1526.',
  'Prusia Real': 'Provincia autónoma de la Corona desde 1466. Danzig y Chelmno se mantienen como regiones históricas, pero reciben el mismo color que la Corona polaca; Warmia queda en una capa episcopal propia.',
  'Prusia de la Orden': 'Remanente de la Orden tras la Segunda Paz de Toruń; su sujeción feudal a Polonia no equivale a incorporación.',
  'Prusia ducal': 'Ducado secular desde 1525 y feudo polaco. La unión personal con Brandeburgo desde 1618 no supuso incorporación ni convierte sus tierras en territorio de Brandeburgo.',
  'Gran Ducado de Lituania': 'Gobierno separado dentro de la Mancomunidad. En 1569 transfiere Podlaquia, Volinia, Bráclav y Kiev a la Corona polaca; las tierras orientales no verificadas siguen grises.',
  'Principado episcopal de Warmia': 'Se muestra solo el polígono regional heredado de Warmia; el príncipe-obispo conservó una jurisdicción diferenciada bajo la protección y autoridad superior polaca.',
  'Livonia del Commonwealth': 'Capa amplia de las tierras livonias incorporadas como condominio en 1569. La subdivisión antigua del mapa es aproximada; Riga se separa como ciudad y Latgale se conserva tras Altmark.',
  'Livonia sueca': 'Desde Altmark (1629), incluye las provincias antiguas North_Livonia e Inner_Livonia; Riga tiene su marcador urbano desde 1621. No se atribuye a Suecia Latgale.',
  'Estonia sueca': 'Solo la provincia antigua Estonia, desde la sumisión a Suecia en 1561. No equivale a todo el territorio de la actual Estonia ni a Livonia entera.',
  'Ducado de Curlandia': 'Ducado autónomo vasallo de la Mancomunidad, no provincia integrada de Polonia-Lituania. El polígono Courland es una aproximación al ducado y Semigalia.',
  'Riga libre': 'Solo el marcador de Riga; la condición política de la ciudad y su hinterland cambiaron durante la disolución de la Confederación Livona.',
  'Riga bajo la Mancomunidad': 'Marcador urbano desde la sumisión de 1581. La ciudad no se expande a todas las tierras de Livonia.',
  'Riga bajo Suecia': 'Marcador urbano desde la toma sueca de 1621; la posesión más amplia de Livonia queda en otra capa desde 1629.',
  'Reino de Dinamarca': 'El reino danés se dibuja separado de Noruega, Schleswig y Holstein. Halland y Gotland salen en 1645; Blekinge permanece danesa hasta después del corte del prototipo.',
  'Reino de Noruega': 'Reino bajo monarca común con Dinamarca; Noruega queda institucionalmente subordinada desde 1537, pero no se fusiona en el color danés. Orkney y Shetland se transfieren a Escocia en 1469.',
  'Islas Feroe bajo la Corona noruega': 'Dependencia noruega dentro de la monarquía danesa-noruega. Se representa únicamente con Tórshavn como punto de referencia; no se colorea como Dinamarca ni se infiere una frontera insular.',
  'Reino de Suecia': 'Se mantiene como reino distinto incluso durante la Unión de Kalmar. Jämtland, Halland y Gotland entran desde 1645; Ösel se muestra como marcador insular separado.',
  'Ducado de Schleswig': 'Ducado separado de Dinamarca. Se conserva separado del condado/ducado de Holstein aunque ambos tuvieran un mismo gobernante desde 1460.',
  'Ducado de Holstein': 'Jurisdicción del Sacro Imperio y patrimonio ducal propio bajo los reyes daneses; no se pinta como parte del Reino de Dinamarca.',
  Mecklemburgo: 'Ducado separado. La base disponible solo proporciona una región amplia; Wismar se representa como feudo sueco independiente del control general de Mecklemburgo desde 1648.',
  'Ducado de Pomerania': 'Territorio de los Griffins hasta la extinción de la línea ducal en 1637; el fallecimiento y la ocupación sueca abrieron una disputa sucesoria.',
  'Pomerania bajo ocupación sueca': 'Control militar efectivo desde 1630 sobre el ducado; la ocupación no elimina la soberanía del último duque antes de 1637 ni equivale a la partición legal de 1648.',
  'Pomerania sueca': 'Solo la parte occidental asignada a Suecia en Westfalia: Stettin y Rügen se usan como proxies. El límite exacto con Brandeburgo se fijó en 1653.',
  'Pomerania de Brandeburgo': 'Parte oriental asignada a Brandeburgo en Westfalia; Stolp y Koslin son proxies regionales, no un deslinde exacto anterior al tratado de 1653.',
  'Señorío sueco de Wismar': 'Localidad/feudo imperial asignado a Suecia en 1648. No representa la costa entera de Mecklemburgo ni una incorporación al Reino de Suecia.',
  'Ösel bajo Dinamarca': 'Solo Kuressaare como marcador de la posesión danesa de Ösel entre 1559 y 1644; no es un mapa de la isla.',
  'Ösel bajo Suecia': 'Solo Kuressaare como marcador tras la cesión de Ösel a Suecia en 1645; no es un mapa de la isla.',
  'Moscovia y Zarato de Rusia': 'Moscovia incorpora principados y repúblicas por fechas; el título de zar se adopta en 1547. Las ubicaciones de Novgorod, Pskov, Tver, Riazán y Kazán se asignan solo tras su anexión.',
  'República de Nóvgorod': 'Una localización urbana antes de la anexión de 1478; no se afirma que el mapa represente la vasta esfera comercial de la república.',
  'República de Pskov': 'Regiones antiguas aproximadas hasta la anexión de 1510; el mapa no presenta la república como un principado moscovita antes de esa fecha.',
  'Principado de Tver': 'Las regiones Tver y Tverskaya se separan de Moscovia hasta la anexión de 1485.',
  'Principado de Riazán': 'Región antigua de Ryazan separada hasta la incorporación moscovita de 1521.',
  'Kanato de Kazán': 'Región antigua de Kazan separada hasta la conquista de 1552; no se incorpora a Moscovia antes de esa fecha.',
  'Marco jurídico del Sacro Imperio': 'Capa de referencia jurídica, no un Estado unificado ni dominio directo del emperador. Los círculos imperiales no abarcaron todas las tierras del Imperio. La frontera sigue siendo una aproximación regional y debe leerse debajo de las jurisdicciones efectivas.',
};

const territories = Object.entries(corridors).flatMap(([corridor, names]) => names.map(name => {
  const versions = [];
  for (let year = FROM; year <= THROUGH; year++) {
    const oldIds = specialSeries[name]?.(year) ?? idsDeReinoEnAño(name, year);
    if (!versions.length || JSON.stringify(oldIds) !== JSON.stringify(versions.at(-1).oldIds)) {
      versions.push({ from: year, oldIds });
    }
  }
  const colors = {
    'Plaza inglesa de Calais': REINO_COLOR.Inglaterra,
    'Plazas inglesas de Guyena': REINO_COLOR.Inglaterra,
    'Núcleo inglés en Irlanda': REINO_COLOR.Irlanda,
    'Señorío de Man': '#9b8160',
    'Bailiazgo de Jersey': REINO_COLOR.Inglaterra,
    'Principado episcopal de Brixen': '#96814e',
    'Principado episcopal de Trento': '#907050',
    'Arzobispado principesco de Salzburgo': '#8a6948',
    'Corona de Polonia': REINO_COLOR.Polonia, 'Ducado de Mazovia': '#b7789d',
    'Prusia Real': REINO_COLOR.Polonia, 'Prusia de la Orden': '#495672',
    'Prusia ducal': REINO_COLOR.Prusia, 'Gran Ducado de Lituania': REINO_COLOR.Lituania,
    'Principado episcopal de Warmia': '#947a55',
    'Livonia del Commonwealth': '#8b5aa5', 'Livonia sueca': '#607b96',
    'Estonia sueca': '#547493', 'Ducado de Curlandia': '#71854f',
    'Riga libre': '#8a8a6e', 'Riga bajo la Mancomunidad': REINO_COLOR.Polonia,
    'Riga bajo Suecia': '#607b96',
    'Reino de Dinamarca': '#8a554c', 'Reino de Noruega': '#6f7f88',
    'Islas Feroe bajo la Corona noruega': '#87907d',
    'Reino de Suecia': '#4d7192', 'Ducado de Schleswig': '#8b7464',
    'Ducado de Holstein': '#6f7180', Mecklemburgo: REINO_COLOR.Mecklemburgo,
    'Ducado de Pomerania': REINO_COLOR.Pomerania,
    'Pomerania bajo ocupación sueca': '#607b96', 'Pomerania sueca': '#607b96',
    'Pomerania de Brandeburgo': '#8a6d4f', 'Señorío sueco de Wismar': '#607b96',
    'Ösel bajo Dinamarca': '#8a554c', 'Ösel bajo Suecia': '#4d7192',
    'Moscovia y Zarato de Rusia': '#86694f', 'República de Nóvgorod': '#678b81',
    'República de Pskov': '#738c73', 'Principado de Tver': '#9a7d58',
    'Principado de Riazán': '#7f704f', 'Kanato de Kazán': '#8b794e',
    'Marco jurídico del Sacro Imperio': '#a49b8e',
  };
  return { corridor, name, color: colors[name] || REINO_COLOR[name] || '#735f4c',
    active: active[name] || null, note: notes[name] || null, versions };
}));

// Jajce remained a Hungarian frontier stronghold after the fall of the Bosnian kingdom.
territories.push({
  "corridor": "Hungría y Balcanes",
  "name": "Banato húngaro de Jajce",
  "color": "#a08545",
  "active": {
    "from": 1463,
    "through": 1526,
    "source": "https://www.enciklopedija.hr/clanak/jajce",
    "reason": "Fortaleza y núcleo del banato recuperados por Matías Corvino en 1463; caída en diciembre de 1527."
  },
  "note": "Se representa solo la celda de Jajce. No se atribuye toda Bosnia a Hungría ni se dibuja el perímetro completo del banato.",
  "versions": [
    {
      "from": 1400,
      "oldIds": []
    }
  ]
});
const denmarkLayer = territories.find(t => t.name === "Reino de Dinamarca");
denmarkLayer.note += " Incluye las celdas del núcleo de Escania, omitidas en la capa anterior.";

// The permanent Atlas map needs a geometric bridge for every legacy regional
// ID, not only the selected research corridors above. Preserve the full set of
// IDs used by the Atlas so the app can migrate uncorridored governments too.
const mapRegionIds = [...new Set([
  ...Object.values(REINO_A_IDS).flat(),
  ...Object.values(REINO_VERSIONES).flatMap(versions => versions.flatMap(version => version.ids)),
])].sort();

const output = new URL('./corridor-source.json', import.meta.url);
fs.writeFileSync(output, `${JSON.stringify({ from: FROM, through: THROUGH,
  basis: 'REINO_A_IDS and REINO_VERSIONES through idsDeReinoEnAño; historic borders and jurisdiction changes use dated source corrections; territorial scope only',
  territories, mapRegionIds, corrections: datedCorrections }, null, 2)}\n`);
console.log(`Wrote ${territories.length} territories to ${output.pathname}`);
