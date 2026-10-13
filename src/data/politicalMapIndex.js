import {gobiernosDe} from './personAccessors.js';
import {idsDeReinoEnAño} from '../Territorios.jsx';
import {imperialFrameIds} from './imperialFrame.js';
import {mapLocationsForGovernment, pilotImperialFrameFor} from './locationMapPilot.js';
import {mapAuthoritiesForPerson} from './mapAuthorities.js';
import {CHRONOLOGY_COLLECTIVE_AUTHORITIES} from './atlasChronologyCollectives.js';

// Hay años en los que la autoridad no puede atribuirse honestamente a una
// sola persona. Estas entradas se muestran en el inspector, sin inventar un
// gobierno personal en la base genealógica.
export const COLLECTIVE_AUTHORITIES = Object.freeze([
  ...CHRONOLOGY_COLLECTIVE_AUTHORITIES,
  {
    territorio: 'Comuna de Mljet', desde: 1345, hasta: 1409,
    nombre: 'Comuna de Mljet', cargo: 'Gobierno comunal',
    condicion: 'colectiva', certeza: 'documentado',
    nota: 'Autonomía estatutaria desde 1345 bajo el señorío monástico. La influencia de Ragusa no fija por sí sola el comienzo de su administración definitiva, fechado en 1410 por la entrada insular.',
    fuente: {title: 'Hrvatska enciklopedija · Mljet', url: 'https://enciklopedija.hr/clanak/mljet', locator: 'Estatuto y redención de prestaciones en 1345; incorporación definitiva en 1410.'},
  },
  {
    territorio: 'República de Ragusa', desde: 1200, hasta: 1357,
    nombre: 'Conde y consejo de la comuna de Ragusa', cargo: 'Gobierno comunal',
    condicion: 'colectiva', certeza: 'documentado',
    nota: 'Comuna bajo superioridad bizantina hasta 1205 y veneciana desde 1205; el conde veneciano no es un rey hereditario.',
    fuente: {title: 'Hrvatska enciklopedija · Dubrovačka Republika', url: 'https://enciklopedija.hr/clanak/dubrovacka-republika', locator: 'Gobierno comunal; conde y consejos; superioridad veneciana 1205–1358.'},
  },
  {
    territorio: 'República de Ragusa', desde: 1358, hasta: 1800,
    nombre: 'Rector y consejos de la República de Ragusa', cargo: 'Gobierno republicano',
    condicion: 'colectiva', certeza: 'documentado',
    nota: 'El rector presidía los consejos con un mandato mensual. El tributo al sultán, desde 1458, no eliminó el gobierno republicano ni hizo de Ragusa una provincia otomana.',
    fuente: {title: 'Hrvatska enciklopedija · Dubrovačka Republika', url: 'https://enciklopedija.hr/clanak/dubrovacka-republika', locator: 'Rector mensual, consejos republicanos, superioridad húngara y tributo otomano desde 1458.'},
  },
  {
    territorio: 'Tirol', desde: 1595, hasta: 1601,
    nombre: 'Comunidad de herederos Habsburgo', cargo: 'Administración de la casa',
    condicion: 'colectiva', certeza: 'inferido',
    nota: 'Tras Fernando II, Tirol volvió a la casa de Habsburgo. La fuente fecha el comienzo del gobierno delegado de Maximiliano III en 1602, pero no identifica aquí a un soberano personal exclusivo para 1595–1601.',
    fuente: {title:'Die Welt der Habsburger · Partición de la herencia austríaca',url:'https://www.habsburger.net/en/chapter/tripartite-division-austrian-inheritance'},
  },
]);

export const MAP_GEOMETRY_PRECISION = 'El mapa detallado usa celdas cartográficas como aproximaciones regionales; no reconstruye por sí solo la frontera exacta del feudo en este año.';

export function buildPoliticalMapIndex(personas, year, mapData = null, options = {}) {
  const regions = new Map();
  if (!Number.isInteger(year)) return regions;
  const push = (id, entry) => {
    if (!regions.has(id)) regions.set(id, []);
    regions.get(id).push(entry);
  };
  for (const person of personas) {
    if (!gobiernosDe(person).some(g => g.desde <= year && year <= g.hasta)) continue;
    for (const entry of mapAuthoritiesForPerson(person, year, mapData, options)) {
      for (const id of entry.ids) push(id, entry);
    }
  }
  for (const authority of COLLECTIVE_AUTHORITIES) {
    if (authority.desde > year || authority.hasta < year) continue;
    if (authority.periods && !authority.periods.some(period=>period.desde<=year&&year<=period.hasta)) continue;
    const legacyIds = idsDeReinoEnAño(authority.territorio, year);
    const ids = mapData
      ? mapLocationsForGovernment(mapData, authority, year, null, legacyIds)
      : legacyIds;
    for (const id of ids) {
      push(id, {person:null,government:null,claim:null,territory:authority.territorio,
        collective:authority,kind:authority.kind || 'collective',paint:true});
    }
  }
  return regions;
}

export function inspectMapRegion(regionId, year, index, mapData = null) {
  if (!regionId || !Number.isInteger(year)) return null;
  const allEntries = (index.get(regionId) || []).slice().sort((a,b) =>
    Number(Boolean(b.claim?.sources.length)) - Number(Boolean(a.claim?.sources.length)) ||
    a.territory.localeCompare(b.territory, 'es'));
  return {
    regionId, year, entries: allEntries.filter(e => e.paint !== false),
    claims: allEntries.filter(e => e.paint === false),
    imperialLegalFrame: (mapData
      ? pilotImperialFrameFor(mapData, year).includes(regionId)
      : imperialFrameIds(year).includes(regionId)),
    precision: MAP_GEOMETRY_PRECISION,
  };
}
