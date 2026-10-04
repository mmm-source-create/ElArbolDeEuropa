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
};

const notes = {
  Austria: 'Ducado/archiducado danubiano: no equivale al conjunto de posesiones de la Casa de Austria.',
  'Austria Interior': 'Estiria, Carintia, Carniola y litoral habsbúrgico. Pitten y Wiener Neustadt seguían la rama estiria aunque hoy estén en Baja Austria.',
  Tirol: 'Condado del Tirol. Se excluyen los obispados de Brixen y Trento; Kufstein y Kitzbühel entran en 1504 y Lienz en 1500.',
  Baviera: 'Núcleo reunificado en 1505. Las ciudades imperiales, obispados y Pfalz-Neuburg conservan jurisdicción separada; la Alta Palatinado se incorpora en 1628.',
  Palatinado: 'Palatinado electoral, no todas las ramas Wittelsbach. La Alta Palatinado se transfiere a Baviera en 1628.',
  Bohemia: 'Tierras de la Corona de Bohemia: incluye Moravia y partes de Silesia, además del reino estricto.',
  Hungría: 'Corona compuesta de San Esteban antes de Mohács: incluye Croacia y Transilvania. Desde 1526 la partición queda sin colorear hasta modelar cada sucesor.',
};

const territories = Object.entries(corridors).flatMap(([corridor, names]) => names.map(name => {
  const versions = [];
  for (let year = FROM; year <= THROUGH; year++) {
    const oldIds = idsDeReinoEnAño(name, year);
    if (!versions.length || JSON.stringify(oldIds) !== JSON.stringify(versions.at(-1).oldIds)) {
      versions.push({ from: year, oldIds });
    }
  }
  return { corridor, name, color: REINO_COLOR[name] || '#735f4c',
    active: active[name] || null, note: notes[name] || null, versions };
}));

const output = new URL('./corridor-source.json', import.meta.url);
fs.writeFileSync(output, `${JSON.stringify({ from: FROM, through: THROUGH,
  basis: 'REINO_A_IDS and REINO_VERSIONES through idsDeReinoEnAño; territorial scope only',
  territories }, null, 2)}\n`);
console.log(`Wrote ${territories.length} territories to ${output.pathname}`);
