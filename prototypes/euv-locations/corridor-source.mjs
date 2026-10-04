// Transfer existing *territorial* versions, not each ruler's combined titles.
// This keeps Castile, Aragon, Naples, Milan, etc. separate even when one
// person governed several of them. Geometry is only a candidate crosswalk.
import fs from 'node:fs';
import { idsDeReinoEnAño, REINO_COLOR } from '../../src/Territorios.jsx';

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
  'Polonia–Lituania': [
    'Corona de Polonia', 'Ducado de Mazovia', 'Prusia Real',
    'Prusia de la Orden', 'Prusia ducal', 'Gran Ducado de Lituania',
  ],
};

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
const specialSeries = {
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
  'Prusia Real': year => year >= 1466 ? ['Danzig', 'Chelmno', 'Warmia'] : [],
  'Prusia de la Orden': year => year <= 1524 ? [
    ...idsDeReinoEnAño('Prusia', year),
    ...(year < 1454 ? ['Danzig', 'Chelmno', 'Warmia'] : []),
  ] : [],
  'Prusia ducal': year => year >= 1525 ? idsDeReinoEnAño('Prusia', year) : [],
  'Gran Ducado de Lituania': year => [
    ...LITHUANIA_CORE,
    ...(year < 1569 ? LITHUANIA_TRANSFER_1569 : []),
  ],
};

// A territorial label can outlive its independent government in the Atlas.
// Keep the old shape available for audit, but stop painting it as a separate
// political map after incorporation into a successor jurisdiction.
const active = {
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
  'Prusia Real': { from: 1466, through: 1569, reason: 'La Prusia Real se integró en la Corona en 1466; ocupaciones posteriores a 1569 quedan por fechar en este corredor.',
    source: 'https://zpe.gov.pl/a/polskie-dynastie-jagiellonowie/D12LkQne7' },
  'Prusia de la Orden': { through: 1524, reason: 'El estado de la Orden Teutónica fue secularizado como Ducado de Prusia en 1525.',
    source: 'https://zpe.gov.pl/a/prezentacja-multimedialna/DbYm1LK96' },
  'Prusia ducal': { from: 1525, through: 1569, reason: 'Ducado separado y feudo polaco desde 1525; cambios posteriores a 1569 quedan por auditar.',
    source: 'https://zpe.gov.pl/a/prezentacja-multimedialna/DbYm1LK96' },
  'Corona de Polonia': { through: 1569, reason: 'La frontera de este corredor se ha auditado hasta la Unión de Lublin de 1569; conflictos y cambios posteriores quedan por fechar.',
    source: 'https://agad.gov.pl/inwentarze/Metr_Korx.xml' },
  'Gran Ducado de Lituania': { through: 1569, reason: 'La frontera de este corredor se ha auditado hasta la Unión de Lublin de 1569; los cambios posteriores quedan por fechar.',
    source: 'https://agad.gov.pl/inwentarze/Metr_Korx.xml' },
};

const notes = {
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
  'Prusia Real': 'Provincia de la Corona desde 1466, distinta de Prusia ducal. Warmia conserva su condición eclesiástica dentro de esta agrupación cartográfica.',
  'Prusia de la Orden': 'Remanente de la Orden tras la Segunda Paz de Toruń; su sujeción feudal a Polonia no equivale a incorporación.',
  'Prusia ducal': 'Sucesor secularizado del Estado de la Orden desde 1525, feudo polaco; la propia entidad mantiene color separado.',
  'Gran Ducado de Lituania': 'Núcleo occidental y voivodatos cuya transferencia de 1569 se ha revisado. La frontera oriental y el litoral del mar Negro quedan deliberadamente grises hasta una auditoría fechada.',
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
    'Principado episcopal de Brixen': '#96814e',
    'Principado episcopal de Trento': '#907050',
    'Arzobispado principesco de Salzburgo': '#8a6948',
    'Corona de Polonia': REINO_COLOR.Polonia, 'Ducado de Mazovia': '#b7789d',
    'Prusia Real': '#ae4e9b', 'Prusia de la Orden': '#495672',
    'Prusia ducal': REINO_COLOR.Prusia, 'Gran Ducado de Lituania': REINO_COLOR.Lituania,
  };
  return { corridor, name, color: colors[name] || REINO_COLOR[name] || '#735f4c',
    active: active[name] || null, note: notes[name] || null, versions };
}));

const output = new URL('./corridor-source.json', import.meta.url);
fs.writeFileSync(output, `${JSON.stringify({ from: FROM, through: THROUGH,
  basis: 'REINO_A_IDS and REINO_VERSIONES through idsDeReinoEnAño; Polonia–Lituania has explicit dated corrections; territorial scope only',
  territories }, null, 2)}\n`);
console.log(`Wrote ${territories.length} territories to ${output.pathname}`);
