import {franceLowCountriesPoliticalKeys} from './franceLowCountriesRoutes.js';
import {ORANGE_NASSAU, FRENCH_CROWN_COLOR, BURGUNDIAN_COLOR} from './mapColors.js';
import {FRANCE_LOW_COUNTRIES_IDENTITIES} from './franceLowCountriesRoutes.js';
import {IBERIA_ITALY_IDENTITIES} from './iberiaItalyRoutes.js';
// A survey label, an owner and a control episode are not territorial identity.
import {BOSNIA_HUM_IDENTITIES} from './bosniaHumRoutes.js';
import {POSAVINA_RAGUSA_IDENTITIES} from './posavinaRagusaRoutes.js';
import {BALKANS_FULL_IDENTITIES} from './balkansFullRoutes.js';
const ALIASES = Object.freeze({
  ...BOSNIA_HUM_IDENTITIES,
  ...POSAVINA_RAGUSA_IDENTITIES,
  ...BALKANS_FULL_IDENTITIES,
  ...IBERIA_ITALY_IDENTITIES,
  ...FRANCE_LOW_COUNTRIES_IDENTITIES,
  // Direct Ottoman provinces are scopes of one state, not new sovereign
  // entities. Their names and evidence remain in scopes and in title records.
  'Hungría otomana': 'Imperio otomano',
  'Bosnia y Herzegovina otomanas': 'Imperio otomano',
  'Balcanes meridionales otomanos': 'Imperio otomano',
  'Dobruja otomana': 'Imperio otomano',
  'Lika otomana': 'Imperio otomano',
  'Makarska otomana': 'Imperio otomano',
  'Anatolia otomana · Bitinia y expansión occidental': 'Imperio otomano',
  'Anatolia otomana · Candar y costa póntica': 'Imperio otomano',
  'Anatolia otomana · Karaman': 'Imperio otomano',
  'Anatolia otomana · provincias orientales': 'Imperio otomano',
  'Anatolia otomana · Van': 'Imperio otomano',
  'Anatolia otomana · frontera de Kars': 'Imperio otomano',
  'Islas egeas otomanas': 'Imperio otomano',
  'Donji Kraji': 'Reino de Bosnia',
  'Glaž': 'Reino de Bosnia',
  'Núcleo de Herzegovina': 'Herzegovina',
  'Banato de Usora y Soli': 'Usora y Soli',
  'Banato de Srebrenik': 'Srebrenik',
  'Señorío de Travunia': 'Travunia',
  'Carintia habsbúrgica antes de Neuberg': 'Carintia',
  'Ducado de Estiria': 'Estiria',
  'Carniola habsbúrgica antes de Neuberg': 'Carniola',
  'Eslavonia disputada (núcleos)': 'Eslavonia',
  'Gobierno de Bihar de Imre Czibak': 'Condado de Bihar',
  'Gobierno de Temesvár de Bálint Török': 'Condado de Temes',
  'Gobierno de Temes de Péter Petrovics': 'Condado de Temes',
  'Silesia austríaca': 'Silesia',
  'Silesia real (Wrocław y Środa)': 'Silesia',
  'Silesia real (Głogów)': 'Silesia',
  'Silesia · soberanía de la Corona': 'Silesia',
  'Silesia · ocupación prusiana': 'Silesia',
  'Silesia · parte prusiana': 'Silesia',
  'Silesia · remanente austríaco': 'Silesia',
  'Silesia (ocupación prusiana de 1741)': 'Silesia',
  'Silesia prusiana (núcleos)': 'Silesia',
  'Silesia austríaca (núcleo de Teschen)': 'Silesia',
  'Moravia (núcleo de Brno)': 'Moravia',
  'Moravia (núcleo de Olomouc)': 'Moravia',
  'Margraviato de Moravia': 'Moravia',
  'Reino de Dinamarca': 'Dinamarca',
  'Reino de Noruega': 'Noruega',
  'Islas Feroe bajo la Corona noruega': 'Islas Feroe',
  'Islandia bajo la Corona noruega': 'Islandia',
  'Moldavia · comarcas meridionales': 'Principado de Moldavia',
  'Bosnia': 'Reino de Bosnia',
  'Valaquia': 'Principado de Valaquia',
  'Moldavia': 'Principado de Moldavia',
  'Bosnia · relieve interior': 'Reino de Bosnia',
  'Valaquia · comarcas interiores': 'Principado de Valaquia',
  'Moldavia · valles interiores orientales': 'Principado de Moldavia',
  'Istria veneciana': 'Venecia',
  'Istria bajo administración austríaca': 'Austria',
  'Reino de Suecia': 'Suecia',
  'Reino de Gran Bretaña': 'Gran Bretaña',
  'Corona de Polonia': 'Polonia',
  'Gran Ducado de Lituania': 'Lituania',
  'Núcleo inglés en Irlanda': 'Irlanda',
  'Núcleos borgoñones y anexiones bajo Francia': 'Francia',
  'República francesa': 'Francia',
  'Transilvania habsbúrgica': 'Transilvania',
  'Morea veneciana (núcleos)': 'Morea',
  'Morea veneciana · superficie regional': 'Morea',
  'Normandía · ocupación inglesa': 'Ducado de Normandía',
  'Bulgaria · gobierno rival en Tarnovo': 'Bulgaria',
  'Hungría real': 'Hungría',
  'Núcleo oriental de Zápolya': 'Hungría',
  'Croacia medieval': 'Croacia',
  'Eslavonia medieval': 'Eslavonia',
  'Transilvania medieval': 'Transilvania',
  'Touraine angevina': 'Touraine',
  'Condado de Anjou': 'Anjou',
  'Condado de Foix': 'Foix',
  'Vizcondado de Bearne': 'Bearne',
  'Condado de Armagnac': 'Armagnac',
  'Condado de Champaña': 'Champaña',
  'Electorado de Hannover': 'Hannover',
  'Margraviato de Meißen': 'Meißen',
  'Meißen · administración regia': 'Meißen',
  'Landgraviato de Turingia': 'Turingia',
  'Bulgaria · Chaka en Tarnovo': 'Bulgaria',
  'Condado de Nassau': 'Nassau',
  'Ducado de Suabia': 'Suabia',
  'Despotado de Dobruja': 'Dobruja',
  'Epiro de los Tocco': 'Epiro',
  'Despotado de Serbia': 'Serbia',
  Tarnovo: 'Zarato de Tarnovo',
  'Reino de Sicilia': 'Sicilia',
  'Reino de Sicilia antes de 1282': 'Sicilia',
  'Señorío de Ioannina': 'Despotado de Ioannina',
  'Señorío genovés de Lesbos': 'Señorío de Lesbos',
  'República napolitana': 'República Partenopea',
  'Monarquía de los Habsburgo': 'Austria',
  'Imperio ruso': 'Rusia',
  'Armenia de Cilicia': 'Armenia cilicia',
  'Imperio safávida': 'Persia',
});

export const territorialIdentity = name => {
  const target = ALIASES[name] || name;
  return ALIASES[target] || target;
};

export function territorialLabel(name, year) {
  const identity = territorialIdentity(name);
  const labels = {
    Carintia: 'Ducado de Carintia',
    Estiria: 'Ducado de Estiria',
    Carniola: year < 1364 ? 'Señorío de Carniola' : 'Ducado de Carniola',
    Eslavonia: 'Reino de Eslavonia',
    'Condado de Bihar': 'Condado de Bihar', 'Condado de Temes': 'Condado de Temes',
    Silesia: 'Ducados de Silesia', Moravia: 'Margraviato de Moravia',
    Bohemia: 'Reino de Bohemia', Polonia: 'Corona de Polonia',
    Lituania: year >= 1253 && year <= 1263 ? 'Reino de Lituania' : 'Gran Ducado de Lituania',
    Inglaterra: 'Reino de Inglaterra', Escocia: 'Reino de Escocia',
    Irlanda: year < 1542 ? 'Señorío de Irlanda' : 'Reino de Irlanda',
    Francia: year >= 1792 ? 'República francesa' : 'Reino de Francia',
    'Gran Bretaña': 'Reino de Gran Bretaña',
    Dinamarca: 'Reino de Dinamarca', Noruega: 'Reino de Noruega', Suecia: 'Reino de Suecia',
    Islandia: year < 1380 ? 'Islandia bajo la Corona noruega' : 'Islandia bajo la monarquía danesa y noruega',
    Transilvania: year >= 1765 ? 'Gran Principado de Transilvania' : year < 1570 ? 'Voivodato de Transilvania' : 'Principado de Transilvania', Morea: 'Despotado de Morea',
    Rusia: year >= 1721 ? 'Imperio ruso' : year >= 1547 ? 'Zarato de Rusia' : 'Gran Principado de Moscú',
    Hungría: 'Reino de Hungría', Croacia: 'Reino de Croacia',
    Bulgaria: 'Segundo Imperio búlgaro', Sirmia: 'Reino de Sirmia',
    Serbia: year < 1217 ? 'Gran principado de Serbia' : year < 1346 ? 'Reino de Serbia'
      : year <= 1371 ? 'Imperio de los serbios y griegos' : year < 1402 ? 'Principado de Serbia' : 'Despotado de Serbia',
    Prilep: 'Reino de Prilep', Kosovo: 'Señorío de los Branković',
    Atenas: year < 1260 ? 'Señorío de Atenas' : 'Ducado de Atenas',
    Acaya: 'Principado de Acaya', Epiro: 'Estado epirota',
    Tesalia: 'Señorío de Tesalia', Zeta: 'Señorío de Zeta',
    Montenegro: 'Montenegro · gobierno local', Salzburg: 'Arzobispado de Salzburgo',
    Anjou: year < 1360 ? 'Condado de Anjou' : 'Ducado de Anjou',
    Touraine: 'Condado de Touraine',
    Foix: 'Condado de Foix', Bearne: 'Vizcondado de Bearne',
    Armagnac: 'Condado de Armagnac', Champaña: 'Condado de Champaña',
    Hannover: 'Electorado de Brunswick-Lüneburg (Hannover)',
    'Meißen':'Margraviato de Meißen',Turingia:'Landgraviato de Turingia',Suabia:'Ducado de Suabia',Nassau:'Condado de Nassau',
    'Reino de Bosnia': year < 1377 ? 'Banato de Bosnia' : 'Reino de Bosnia',
    Hum: 'Señorío de Hum', Travunia: 'Señorío de Travunia',
    'Usora y Soli': 'Banato de Usora y Soli', Srebrenik: 'Banato de Srebrenik', Herzegovina: 'Ducado de San Sava (Herzegovina)',
    Dobruja:year<1370?'Principado de Karvuna':'Despotado de Dobruja',
    'Turingia ernestina':year<1547?'Sajonia ernestina · tierras de Turingia':'Ducado de Sajonia · tierras ernestinas',
    'Nassau-Dietz':year<1654?'Condado de Nassau-Dietz':year<1743?'Principado de Nassau-Dietz':'Principado de Nassau-Orange',
    'Ducado de Sajonia-Gotha':year<1672?'Ducado de Sajonia-Gotha':'Ducado de Sajonia-Gotha-Altenburg',
  };
  return labels[identity] || identity;
}

// The color depends on identity alone, not on alphabetic position, survey
// corridor or the number of other entities newly added to the atlas.
export function territorialColor(name) {
  if (['Holanda', 'Provincias Unidas', 'República Bátava'].includes(territorialIdentity(name))) return ORANGE_NASSAU;
  if (territorialIdentity(name) === 'Islas sin autoridad política documentada') return '#8d9da0';
  let hash = 2166136261;
  for (const char of territorialIdentity(name)) hash = Math.imul(hash ^ char.codePointAt(0), 16777619) >>> 0;
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
