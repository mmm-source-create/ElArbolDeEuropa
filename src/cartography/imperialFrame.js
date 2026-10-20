// Marco jurídico regional del Sacro Imperio, separado de los gobiernos
// efectivos de cada emperador. Los polígonos del SVG no son fronteras feudales.
// Véase docs/CARTOGRAFIA_SACRO_IMPERIO.md para fuentes, cortes y exclusiones.

// El Imperio duró de 962 a 1806; el marco cubre todo el recorrido del mapa.
export const IMPERIAL_FRAME_RANGE = Object.freeze({from: 1106, through: 1800});

const GERMAN_CORE = [
  'Emsland','Wesermarch','East_Friesland','Aller','Elbmarch','Luneburger_Heide',
  'Holstein','Vorpommern','Stettin','Seenplatte','Schwerin','Lubeck','Neumark',
  'Lower_Carniola','Upper_Carniola','Gorizia','Lower_Styria','Middle_Styria',
  'Lower_Carinthia','Upper_Carinthia','South_Tirol','Pongau','Upper_Styria',
  'Eastern_Styria','Ober_dem_Wienerwald','Traungau','Unter_dem_Wienerwald',
  'Salzburger_Land','Unterinntal','Oberinntal','Pinzgau','Schaunberg','Gauboden',
  'Bayerischer_Wald','Muhlviertel','Oberpfalzer_Wald','Vogtland','Thuringer_Becken',
  'Harz','Magdeburger_Borde','Hunsruck','Sarregueminois','Rhine_Valley',
  'Schwarzwald','Swabian_Alb','Eastern_Upper_Swabia','Munchner_Schotterebene',
  'Alpenvorland','Chiemgau','Allgau','Western_Upper_Swabia','Hegau',
  'Hohenloher_Ebene','Franconian_Alb','Erzgebirge','Leipziger_Bucht',
  'Frankische_Schweiz','Donau_Moos','Tauberfranken','Odenwald','Untermain',
  'Palatinate','Kraichgau','Neckar','Eifel','Koln_Bucht','Julich',
  'Bergisches_Land','Ruhr','Munsterland','Ostwestphalia','Hanover','Leine',
  'Middle_Weser','Lippe','Hessen_Bergland','Vogelsberg','Spessart',
  'Main_Franconia','Ries','Wetterau','Taunus','Sauerland','Westerwald',
  'Thuringer_Wald','Frankenwald','Elbtal','Niederlausitz','Oberlausitz',
  'Flaming','Mittelmark','Uckermark','Prignitz','Altmark','Saale','Brunswick',
  'Unter_dem_Manhartsberg','Ober_dem_Manhartsberg','Vorarlberg',
];

const BOHEMIAN_CROWN = [
  'Hradecko','Hradistsko','Brnensko','Znojemsko','Olomoucko','Chrudimsko',
  'Boleslavsko','Prague','Bechinsko','Prachensko','Zatecko','Litomericko',
  'Chebsko','Plzensko',
];

// Las tierras de la Corona de Bohemia no integraban un círculo imperial.
const SILESIA = ['Olesnica','Opole','Tesin','Opavsko','Wroclaw','Swidnica','Legnica','Glogow','Zagan'];
const BURGUNDIAN_CIRCLE = [
  'Brabant','Namur','Liege','Loon','Limburg','Niederrhein','Gelderland',
  'Kempenland','Antwerp','Hainaut','East_Luxembourg','West_Luxembourg',
];
const NORTHERN_NETHERLANDS = [
  'Ommelanden','Friesland','Overijssel','North_Holland','South_Holland','Drenthe',
];
const SWISS_CONFEDERATION = [
  'Thurgau','Aargau','Bern','Vaud','Neuchatel','Waldstatte','Graubunden',
  'Ticino','Oberwallis',
];
const IMPERIAL_ITALY = [
  'Milano','Monza','Pavia','Cremona','Novara','Alessandria','Mantua',
  'Modena','Reggioem','Monferrato','Savoy','Aosta','Torino','Mondovi',
];
const ALSACE_AND_METZ = [
  'Lower_Alsace','Upper_Alsace','Vosges','Pays_Messin',
];
// El Franco Condado siguió siendo un feudo imperial hasta su cesión a Francia
// en el tratado de Nimega de 1678; el ducado de Borgoña no se incluye.
const COUNTY_OF_BURGUNDY = ['Amont','Millieu','Aval'];

// Bloques del SVG antiguo que solo pertenecen al marco medieval. Salen antes
// de 1512, de modo que no abren huecos artificiales en el periodo de los círculos.
// Provenza, condado del reino de Arlés, pasa a la Corona francesa en 1481
// (unión de 1486): https://www.treccani.it/enciclopedia/provenza/
const PROVENCE = ['Aquisextain','Dracenois','Dignois','Avignonnais'];
// Ciudades del reino de Italia hasta su paso a los Estados Pontificios (Parma
// y Piacenza, 1512) o a la Terraferma veneciana (Vicenza 1404, Verona y Padua
// 1405, Brescia y Bergamo con la paz de Ferrara de 1428). Fuentes en la documentación.
const PARMA_PIACENZA = ['Parma','Piacenza'];
// Principado temporal de los patriarcas de Aquilea (1077–1420):
// https://www.consiglio.regione.fvg.it/pagineinterne/Portale/comunicatiStampaDettaglio.aspx?ID=541304
const FRIULI = ['Friuli'];

// Tierras eslavas al este del Elba que el marco incorpora en 1181, cuando
// Pomerania se convierte en feudo imperial y el mapa de 1180 ya muestra
// Brandeburgo, Mecklemburgo y Wagria bajo príncipes del Imperio. Las etapas
// anteriores de la conquista (1143, 1157, 1167) se omiten por prudencia.
const TRANS_ELBIAN_LANDS = [
  'Lubeck','Schwerin','Seenplatte','Vorpommern','Stettin','Uckermark',
  'Prignitz','Mittelmark','Flaming',
];
// Tierras al norte del Elba y del Elde y Pomerania, cedidas a Valdemar II por
// la bula de oro de Federico II (diciembre de 1214) y recuperadas tras
// Bornhöved (1227): https://geschichte-s-h.de/aktuelles/luebeck-feiert-800-jahre-reichsfreiheitsbrief/
const DANISH_CESSION = ['Holstein','Lubeck','Schwerin','Seenplatte','Vorpommern','Stettin','Uckermark'];
// Güeldres y la Meierij de Bolduque (Kempenland) forman parte de la República
// neerlandesa reconocida en Münster y Westfalia (1648).
const DUTCH_REPUBLIC_SOUTH = ['Gelderland','Kempenland'];
// Anexión de los Países Bajos austríacos y de Lieja a Francia, 1 de octubre de
// 1795: https://agatha.arch.be/fr/data/ead/BE-A0510_000273_808060/
const FRENCH_ANNEXATION_1795 = [
  'Brabant','Namur','Liege','Loon','Limburg','Antwerp','Hainaut',
  'East_Luxembourg','West_Luxembourg',
];
// República Cisalpina (29 de junio de 1797), reconocida en Campo Formio:
// https://lombardiabeniculturali.it/istituzioni/storia/?unita=04.02
const CISALPINE_1797 = ['Milano','Monza','Pavia','Cremona','Mantua','Modena','Reggioem'];

// Celdas EU V del Delfinado y del Valentinois, sin región equivalente en el
// SVG antiguo. El delfín Humberto II cede el Delfinado al heredero francés en
// 1349: https://www.treccani.it/enciclopedia/delfinato/
const DAUPHINE = [
  'Briancon','Condorcet','Cottian_Alps1','Dauphine_Alps1','Dauphine_Alps2','Die',
  'Gap','Grenoble','La_Mure','La_Tour_du_Pin','Mevouillon','Pragelato','Romans',
  'Saint_Marceilin','Valence','Vercors_Massif','Vienne',
];
const SWIDNICA_JAWOR = ['Jawor','Kamienna_Gora','Niemcza','Rychbach','Swidnica'];

const span = (ids, from, through = IMPERIAL_FRAME_RANGE.through) => ({ids, from, through});
const { from: FIRST } = IMPERIAL_FRAME_RANGE;

// Cada año refleja los actos jurídicos de ese mismo año, como Westfalia en
// 1648 y Nimega en 1678. La excepción es 1792, que conserva la referencia
// del IEG al 1 de enero; Saboya sale en 1793.
const REGION_SPANS = [
  span(GERMAN_CORE, FIRST), span(BOHEMIAN_CROWN, FIRST),
  span(BURGUNDIAN_CIRCLE, FIRST), span(IMPERIAL_ITALY, FIRST),
  // Paz de Trenčín: https://ome-lexikon.uni-oldenburg.de/regionen/schlesien
  span(SILESIA, 1335),
  // https://germanhistorydocs.org/en/from-the-reformations-to-the-thirty-years-war-1500-1648/peace-treaties-of-westphalia-october-14-24-1648
  span(NORTHERN_NETHERLANDS, FIRST, 1647), span(SWISS_CONFEDERATION, FIRST, 1647),
  span(ALSACE_AND_METZ, FIRST, 1647),
  // https://documentsdedroitinternational.fr/1678-17-septembre-traite-de-nimegue/
  span(COUNTY_OF_BURGUNDY, FIRST, 1677),
  span(PROVENCE, FIRST, 1480),
  span(PARMA_PIACENZA, FIRST, 1511),
  span(['Vicenza'], FIRST, 1403), span(['Verona','Padua'], FIRST, 1404),
  span(FRIULI, FIRST, 1419), span(['Brescia','Bergamo'], FIRST, 1427),
];

const REGION_WITHDRAWALS = [
  // Pomerania, investida en 1181: https://ome-lexikon.uni-oldenburg.de/regionen/pommern
  span(TRANS_ELBIAN_LANDS, FIRST, 1180),
  // Expansión ascania de la Nueva Marca hacia 1250 (convención regional).
  span(['Neumark'], FIRST, 1249),
  span(DANISH_CESSION, 1214, 1226),
  // Cremona y la Ghiara d'Adda, venecianas entre la paz de Blois y Agnadello.
  span(['Cremona'], 1499, 1508),
  span(DUTCH_REPUBLIC_SOUTH, 1648),
  // Reunión de Saboya a Francia, 27 de noviembre de 1792:
  // https://mjp.univ-perp.fr/france/d1792savoie.htm
  span(['Savoy'], 1793),
  span(FRENCH_ANNEXATION_1795, 1795),
  span(CISALPINE_1797, 1797),
];

const CELL_ADDITIONS = [
  span(DAUPHINE, FIRST, 1348),
  // Tratado de abril de 1312, que confirma la anexión de 1307 y cede al rey el
  // poder temporal del arzobispo: https://www.treccani.it/enciclopedia/lione_(Enciclopedia-Italiana)/
  span(['Lyon'], FIRST, 1311),
  // Carta de libertad imperial de Lübeck, junio de 1226 (fuente de DANISH_CESSION).
  span(['Lubeck'], 1226, 1226),
  // Pordenone sigue bajo los duques de Austria cuando el Friuli patriarcal pasa
  // a Venecia: https://www.treccani.it/enciclopedia/venezia-e-l-entroterra_%28Storia-di-Venezia%29/
  span(['Pordenone'], 1420, 1507),
];

const CELL_WITHDRAWALS = [
  // Wagria, al este del limes sajón, dentro de la región antigua de Holstein.
  span(['Plon','Segeberg'], FIRST, 1180),
  // Principado de Rügen, feudo danés hasta la herencia pomerana de 1325.
  span(['Rugen','Stralsund','Grimmen'], FIRST, 1324),
  // Tierra de Lebus bajo los Piast hasta 1249; Santok, castellanía polaca hasta 1259.
  span(['Lebus'], FIRST, 1249), span(['Santok'], FIRST, 1259),
  // Hamburgo, en la orilla norte del Elba, entra en la cesión danesa.
  span(['Hamburg'], 1214, 1226),
  // Señorío de Rostock bajo protectorado danés.
  span(['Rostock','Doberan'], 1300, 1322),
  // Ducados piastas de Świdnica-Jawor, unidos a la Corona bohemia en 1392.
  span(SWIDNICA_JAWOR, 1335, 1391),
  // Aviñón, vendida al papa en 1348 con renuncia imperial.
  span(['Avignon'], 1348),
  // Faucigny, herencia de los delfines, sigue al Delfinado hasta el
  // intercambio con Saboya de 1355.
  span(['Faucigny','La_Roche_Sur_Foron','Sallanches'], 1349, 1354),
  // Alto Isonzo patriarcal, conquistado por Venecia con el Friuli.
  span(['Tolmin'], 1420, 1508),
  // Ducado de Siewierz, comprado por el obispo de Cracovia en 1443 e
  // incorporado a Polonia en 1790.
  span(['Siewierz'], 1443),
  // Enclaves de regiones antiguas mayores que salen con la República
  // neerlandesa o la Confederación: Breda y Bergen op Zoom (Generalidad) y
  // Schaffhausen en 1648; Venlo, cuarto neerlandés de Güeldres, en 1713.
  span(['Breda','Bergen_Zoom','Schaffhausen'], 1648), span(['Venlo'], 1713),
  // Cesiones a Francia: Thionville y Montmédy, Pirineos (1659); Sarrebourg,
  // Vincennes (1661); Valenciennes y Maubeuge, Nimega (1678); Friburgo de
  // Brisgovia entre Nimega (1679) y Ryswick (1697); Landau, reunión de 1680;
  // Bitche y Sarreguemines con Lorena (1766); Saarwerden, incorporado en 1793.
  span(['Thionville','Montmedy'], 1659), span(['Sarrebourg'], 1661),
  span(['Valenciennes','Maubeuge'], 1678), span(['Freiburg'], 1679, 1696),
  span(['Landau_Rhineland'], 1680), span(['Bitche','Sarreguemines'], 1766),
  span(['Saarwerden'], 1793),
];

const covers = (entry, year) => entry.from <= year && year <= entry.through;
const inRange = year => Number.isFinite(year)
  && year >= IMPERIAL_FRAME_RANGE.from && year <= IMPERIAL_FRAME_RANGE.through;
const idsIn = (entries, year) => entries.filter(entry => covers(entry, year)).flatMap(entry => entry.ids);

// Regiones del SVG antiguo. La capa es deliberadamente conservadora: omite
// lugares cuyo estatuto imperial no puede inferirse del nombre de una región.
export function imperialFrameIds(year) {
  if (!inRange(year)) return [];
  const withdrawn = new Set(idsIn(REGION_WITHDRAWALS, year));
  return [...new Set(idsIn(REGION_SPANS, year))].filter(id => !withdrawn.has(id));
}

// Ajustes en celdas EU V, después de traducir las regiones con el cruce
// geométrico: celdas sin región antigua y enclaves de estatuto distinto.
export function imperialFrameCellChanges(year) {
  if (!inRange(year)) return {add: [], remove: []};
  return {add: [...new Set(idsIn(CELL_ADDITIONS, year))],
    remove: [...new Set(idsIn(CELL_WITHDRAWALS, year))]};
}

const FRAME_NOTE = 'Capa de referencia jurídica, no un Estado unificado ni dominio directo del emperador. La frontera sigue siendo una aproximación regional y debe leerse debajo de las jurisdicciones efectivas.';
const REFERENCES = [
  {from: FIRST, through: 1250, title: 'UT Austin · Europa central, 1180',
    url: 'https://maps.lib.utexas.edu/maps/historical/central_europe.html',
    locator: 'Reinos de Alemania, Italia y Borgoña-Arlés y Corona de Bohemia; las tierras al este del Elba entran con la investidura de Pomerania de 1181.'},
  {from: 1251, through: 1449, title: 'IEG-MAPS · Alemania en 1378',
    url: 'https://www.ieg-maps.uni-mainz.de/mapsp/mapp378d.htm',
    locator: 'Territorios imperiales hacia 1378; los cortes de Silesia, el Delfinado, Provenza y la Terraferma veneciana tienen fuentes propias.'},
  {from: 1450, through: 1511, title: 'IEG-MAPS · Alemania en 1500',
    url: 'https://www.ieg-maps.uni-mainz.de/mapsp/mapp500d.htm',
    locator: 'Estados territoriales hacia 1500, antes de la organización de los círculos imperiales.'},
  {from: 1512, through: 1647, title: 'GHDI · Círculos imperiales hacia 1512',
    url: 'https://germanhistorydocs.org/en/from-the-reformations-to-the-thirty-years-war-1500-1648/ghdi:map-2809',
    locator: 'Referencia institucional desde la organización de los círculos imperiales; no es una posesión territorial del emperador.',
    note: 'Capa de referencia jurídica, no un Estado unificado ni dominio directo del emperador. Los círculos imperiales no abarcaron todas las tierras del Imperio. La frontera sigue siendo una aproximación regional y debe leerse debajo de las jurisdicciones efectivas.'},
  {from: 1648, through: 1791, title: 'GHDI · Europa central en 1648',
    url: 'https://germanhistorydocs.org/en/from-the-reformations-to-the-thirty-years-war-1500-1648/central-europe-1648',
    locator: 'Marco posterior a Westfalia, sin la República neerlandesa ni la Confederación suiza; Franco Condado cedido en 1678.'},
  {from: 1792, through: IMPERIAL_FRAME_RANGE.through, title: 'IEG-MAPS · Alemania en 1792',
    url: 'https://www.ieg-maps.uni-mainz.de/mapsp/mapp792d.htm',
    locator: 'Referencia al 1 de enero de 1792; se retiran Saboya (1793), los Países Bajos austríacos y Lieja (1795) y la Lombardía cisalpina (1797). La margen izquierda del Rin, ocupada, se mantiene hasta su cesión en Lunéville (1801).'},
];

// Fuente cartográfica principal del año; los cortes fechados citan la suya.
export function imperialFrameReference(year) {
  if (!inRange(year)) return null;
  const {title, url, locator, note} = REFERENCES.find(reference => covers(reference, year));
  return {title, url, locator, note: note || FRAME_NOTE};
}

// Bloques originales, en el orden con que corridor-source.mjs reproduce la
// capa aceptada del corredor (instantánea de 1512 y 1648).
export const IMPERIAL_FRAME_BLOCKS = Object.freeze({
  germanCore: GERMAN_CORE, bohemianCrown: BOHEMIAN_CROWN, burgundianCircle: BURGUNDIAN_CIRCLE,
  imperialItaly: IMPERIAL_ITALY, silesia: SILESIA, northernNetherlands: NORTHERN_NETHERLANDS,
  swissConfederation: SWISS_CONFEDERATION, alsaceAndMetz: ALSACE_AND_METZ,
  countyOfBurgundy: COUNTY_OF_BURGUNDY,
});
