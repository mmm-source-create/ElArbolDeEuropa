import {GERMAN_SWISS_IDENTITIES} from './regions/germanSwissRoutes.js';
import {EASTERN_EUROPE_IDENTITIES} from './regions/easternEuropeRoutes.js';
import {NORTH_AFRICA_LEVANT_IDENTITIES} from './regions/northAfricaLevantRoutes.js';
import {EARLY_MEDIEVAL_IDENTITIES} from './regions/earlyMedievalRoutes.js';
import {POLAND_LITHUANIA_IDENTITIES} from './regions/polandLithuaniaRoutes.js';
import {franceLowCountriesPoliticalKeys} from './regions/franceLowCountriesRoutes.js';
import {ORANGE_NASSAU, FRENCH_CROWN_COLOR, BURGUNDIAN_COLOR, POLAND_LITHUANIA_COLOR} from './mapColors.js';
import {FRANCE_LOW_COUNTRIES_IDENTITIES} from './regions/franceLowCountriesRoutes.js';
import {IBERIA_ITALY_IDENTITIES} from './regions/iberiaItalyRoutes.js';
import {BOSNIA_HUM_IDENTITIES} from './regions/bosniaHumRoutes.js';
import {POSAVINA_RAGUSA_IDENTITIES} from './regions/posavinaRagusaRoutes.js';
import {BALKANS_FULL_IDENTITIES} from './regions/balkansFullRoutes.js';
import {fnv1a} from '../utils/hash.js';
import {EDITORIAL_ALIASES, identityIn, identityLabel} from './territorialNames.js';

// Las identidades de las rutas regionales solo afectan a celdas y ámbitos del mapa, nunca a territorios de mandato.
const ALIASES = Object.freeze({
  ...EASTERN_EUROPE_IDENTITIES,
  ...NORTH_AFRICA_LEVANT_IDENTITIES,
  ...EARLY_MEDIEVAL_IDENTITIES,
  ...POLAND_LITHUANIA_IDENTITIES,
  ...BOSNIA_HUM_IDENTITIES,
  ...POSAVINA_RAGUSA_IDENTITIES,
  ...BALKANS_FULL_IDENTITIES,
  ...IBERIA_ITALY_IDENTITIES,
  ...FRANCE_LOW_COUNTRIES_IDENTITIES,
  ...EDITORIAL_ALIASES,
  ...GERMAN_SWISS_IDENTITIES,

});

export const territorialIdentity = name => identityIn(ALIASES, name);

export function territorialLabel(name, year) {
  return identityLabel(territorialIdentity(name), year);
}

// The color depends on identity alone, not on alphabetic position, survey
// corridor or the number of other entities newly added to the atlas.
export function territorialColor(name) {
  if (['Holanda', 'Provincias Unidas', 'República Bátava'].includes(territorialIdentity(name))) return ORANGE_NASSAU;
  if (territorialIdentity(name) === 'Islas sin autoridad política documentada') return '#8d9da0';
  const hash = fnv1a(territorialIdentity(name));
  return `hsl(${(hash % 36000 / 100).toFixed(2)} ${58 + hash % 17}% ${40 + (hash >>> 8) % 10}%)`;
}

export function continuityJurisdictions(names, territory, year, personId) {
  if (['Dinamarca','Noruega','Suecia'].includes(territory)) return [...new Set([...names,'Reino de '+territory,
    ...(territory === 'Noruega' ? ['Islas Feroe bajo la Corona noruega'] : [])])];
  if (territory === 'Francia' || territory === 'República francesa')
    return ['Francia', ...(year >= 1651 ? ['Núcleos borgoñones y anexiones bajo Francia'] : [])];
  if (territory === 'Gran Bretaña') return year >= 1707 ? ['Reino de Gran Bretaña'] : [];
  if (territory === 'Carintia') return ['Carintia'];
  if (territory === 'Carniola') return ['Carniola'];
  if (territory === 'Ducado de Estiria') return ['Estiria'];
  if (territory === 'Eslavonia') return ['Eslavonia disputada (núcleos)'];
  if (territory === 'Condado de Bihar') return ['Gobierno de Bihar de Imre Czibak'];
  if (territory === 'Condado de Temes') return [personId === 'BALINTTOROK'
    ? 'Gobierno de Temesvár de Bálint Török' : 'Gobierno de Temes de Péter Petrovics'];
  if (territory === 'Moravia' && !['CRISTINASUE', 'FRED2PRUSSIA'].includes(personId)) return ['Margraviato de Moravia'];
  return names;
}

// Color integration follows dated political attribution, never proximity or a dynasty name.
export function politicalColorGroup(name, year) {
  if (year >= 1569 && year <= 1794 && ['Polonia', 'Lituania', 'Prusia Real', 'Livonia del Commonwealth', 'Livonia polaca', 'Principado episcopal de Warmia'].includes(territorialIdentity(name)))
    return {id:'polonia-lituania', color:POLAND_LITHUANIA_COLOR};
  const keys = franceLowCountriesPoliticalKeys(name, year);
  if (keys.includes('Provincias Unidas')) return {id:'republica-neerlandesa', color:ORANGE_NASSAU};
  if (keys.includes('República Bátava')) return {id:'republica-batava', color:ORANGE_NASSAU};
  if (keys.includes('Francia')) return {id:'corona-francesa', color:FRENCH_CROWN_COLOR};
  if (year >= 1549 && keys.includes('Países Bajos')) return {id:'paises-bajos-habsburgicos', color:BURGUNDIAN_COLOR};
  return null;
}

export function coalesceTerritorialLayers(layers, year) {
  const groups = new Map();
  for (const layer of layers) {
    const identity = territorialIdentity(layer.name);
    const polity = politicalColorGroup(layer.name, year);
    const groupKey = `${identity}\u0000${polity?.id || ''}`;
    const scope = {name: layer.name, ids: [...layer.ids], note: layer.note,
      condition: layer.authorityCondition, sources: layer.sources || [],
      label: layer.scopeLabel || (layer.name === 'Hungría real' ? 'Gobierno real occidental y septentrional'
        : layer.name === 'Núcleo oriental de Zápolya' ? 'Gobierno rival del reino oriental'
        : layer.name.includes('·') ? layer.name.split('·').slice(1).join('·').trim()
        : layer.authorityCondition || (layer.approximate ? 'Gobierno registrado' : 'Ámbito territorial revisado'))};
    const existing = groups.get(groupKey);
    if (!existing) {
      groups.set(groupKey, {...layer, entityId: identity, displayName: territorialLabel(layer.name, year),
        ids: [...layer.ids], memberNames: [layer.name], scopes: [scope],
        mosaicColor: polity?.color || territorialColor(identity), politicalColorGroup: polity?.id || null});
    } else {
      existing.ids = [...new Set([...existing.ids, ...layer.ids])];
      existing.memberNames.push(layer.name);
      existing.scopes.push(scope);
      existing.sources = [...new Map([...(existing.sources || []), ...(layer.sources || [])].map(s => [s.url, s])).values()];
      existing.holders = [...new Set([...(existing.holders || []), ...(layer.holders || [])])];
      if (layer.name === identity) {
        existing.name = layer.name;
        existing.note = layer.note;
        existing.corridor = layer.corridor;
      }
    }
  }
  return [...groups.values()];
}
