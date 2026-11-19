// 6.0.7: personal map scopes of the governors general of the Habsburg Netherlands.
// Each scope copies, year by year, the Netherlandish provinces that the governor's
// sovereign effectively holds in the Atlas, so the delegated office never paints the
// United Provinces, Liège or towns already lost. Writes the reviewed source file.
import fs from 'node:fs';
import path from 'node:path';
import {projectRoot} from '../lib/project-paths.mjs';
import {PERSONAS} from '../../src/data/personas.js';
import {mapAuthoritiesForPerson} from '../../src/cartography/mapAuthorities.js';

const reviewFile = path.join(projectRoot, 'data/cartography/france-low-countries-full-review.json');
const read = name => JSON.parse(fs.readFileSync(path.join(projectRoot, 'data/cartography', name)));
const data = read('corridor-locations.json'); data.burgundy = read('burgundian-locations.json');
const PROVINCES = new Set(['Flandes','Brabante','Limburgo','Holanda','Henao','Zelanda','Artois','Namur','Luxemburgo',
  'Frisia','Utrecht','Overijssel','Drente','Groninga','Güeldres','Señorío de Malinas','Tournai','Tournaisis','Señorío de Cuijk']);
export const SCOPE_NOTE = 'Ámbito del gobierno general limitado a las provincias que el soberano controla efectivamente en cada año del mapa. Se excluyen las Provincias Unidas, el principado de Lieja y las plazas perdidas; el cargo delegado no confiere los títulos provinciales.';
const GOVERNORS = ['ENGELBERT2NASSAU','GUILLERMOCROY','MARGAUST','MARIAAUST','EMANUELFILIBERTOSAB','MANSFELDPETER','ERNESTOAUST',
  'FUENTESCONDE','ALB7AUST','FERNCARDINFANTE','FRANCISCOMELO','MANUELMOURA','LEOPGUILLERMO','JUANJOSEAUST','CARACENA',
  'FRANCISCOMOURA','INIGOMELCHORVELASCO','MONTERREY','VILLAHERMOSA','ALEJFARNESIOPR','GRANA','GASTANAGA','MAX2EMANBAV',
  'ISIDOROCUEVA','EUGENIOSABOYA','DAUNWIRICH','HARRACH','MARIAANAGOV','CHARLESALEXLOR','MARIACRISTINATESCHEN',
  'ALBERTTESCHEN','CARLOSTESCHEN'];
const people = new Map(PERSONAS.map(p => [p.id, p]));
const sovereignIds = (id, year) => [...new Set(mapAuthoritiesForPerson(people.get(id), year, data)
  .filter(e => e.paint && PROVINCES.has(e.territory)).flatMap(e => e.ids))].sort();

const review = JSON.parse(fs.readFileSync(reviewFile, 'utf8'));
review.sources.govlist = {title:'Wikipedia · List of governors of the Habsburg Netherlands',
  url:'https://en.wikipedia.org/wiki/List_of_governors_of_the_Habsburg_Netherlands',
  locator:'Tabla de gobernadores: nombre, entrada y salida del cargo y soberano que los nombró; respalda el mandato, no la geometría.'};
review.authorityScopes = review.authorityScopes.filter(s => !(GOVERNORS.includes(s.personId) && s.territory === 'Países Bajos' && s.note === SCOPE_NOTE));
const scopes = [];
for (const id of GOVERNORS) {
  for (const g of people.get(id).gobiernos.filter(g => g.territorio === 'Países Bajos' && g.soberano)) {
    let current = null;
    for (let year = g.desde; year <= g.hasta; year++) {
      const ids = sovereignIds(g.soberano, year);
      if (!ids.length) throw new Error(`${id} ${year}: el soberano ${g.soberano} no tiene provincias en el mapa`);
      const sourceKeys = [...(year >= 1559 && year <= 1609 ? ['nlmap'] : []), 'belarchive', 'govlist'];
      if (current && current.through === year - 1 && current.ids.join() === ids.join() && current.sourceKeys.join() === sourceKeys.join()) current.through = year;
      else scopes.push(current = {personId:id, territory:'Países Bajos', from:year, through:year, ids, sourceKeys, note:SCOPE_NOTE});
    }
  }
}
review.authorityScopes.push(...scopes);
fs.writeFileSync(reviewFile, JSON.stringify(review, null, 2) + '\n');
console.log(`Gobernadores de los Países Bajos: ${GOVERNORS.length} personas, ${scopes.length} fases de ámbito.`);
