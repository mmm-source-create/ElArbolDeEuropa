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
    active: active[name] || null, versions };
}));

const output = new URL('./corridor-source.json', import.meta.url);
fs.writeFileSync(output, `${JSON.stringify({ from: FROM, through: THROUGH,
  basis: 'REINO_A_IDS and REINO_VERSIONES through idsDeReinoEnAño; territorial scope only',
  territories }, null, 2)}\n`);
console.log(`Wrote ${territories.length} territories to ${output.pathname}`);
