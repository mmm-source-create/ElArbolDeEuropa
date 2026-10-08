// A survey label, an owner and a control episode are not territorial identity.
const ALIASES = Object.freeze({
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
  'Condado de Anjou': 'Anjou',
  'Condado de Foix': 'Foix',
  'Vizcondado de Bearne': 'Bearne',
  'Condado de Armagnac': 'Armagnac',
  'Condado de Champaña': 'Champaña',
  'Electorado de Hannover': 'Hannover',
});

export const territorialIdentity = name => ALIASES[name] || name;

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
    Transilvania: year < 1570 ? 'Voivodato de Transilvania' : 'Principado de Transilvania', Morea: 'Morea',
    Hungría: 'Reino de Hungría', Croacia: 'Reino de Croacia',
    Bulgaria: 'Segundo Imperio búlgaro', Sirmia: 'Reino de Sirmia',
    Anjou: year < 1360 ? 'Condado de Anjou' : 'Ducado de Anjou',
    Foix: 'Condado de Foix', Bearne: 'Vizcondado de Bearne',
    Armagnac: 'Condado de Armagnac', Champaña: 'Condado de Champaña',
    Hannover: 'Electorado de Brunswick-Lüneburg (Hannover)',
    'Hungría otomana': year < 1541 ? 'Conquistas otomanas en Hungría' : 'Eyalatos otomanos de Hungría',
  };
  return labels[identity] || identity;
}

// The color depends on identity alone, not on alphabetic position, survey
// corridor or the number of other entities newly added to the atlas.
export function territorialColor(name) {
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

export function coalesceTerritorialLayers(layers, year) {
  const groups = new Map();
  for (const layer of layers) {
    const identity = territorialIdentity(layer.name);
    const scope = {name: layer.name, ids: [...layer.ids], note: layer.note,
      condition: layer.authorityCondition, sources: layer.sources || [],
      label: layer.name === 'Hungría real' ? 'Gobierno real occidental y septentrional'
        : layer.name === 'Núcleo oriental de Zápolya' ? 'Gobierno rival del reino oriental'
        : layer.name.includes('·') ? layer.name.split('·').slice(1).join('·').trim()
        : layer.authorityCondition || (layer.approximate ? 'Gobierno registrado' : 'Ámbito territorial revisado')};
    const existing = groups.get(identity);
    if (!existing) {
      groups.set(identity, {...layer, entityId: identity, displayName: territorialLabel(layer.name, year),
        ids: [...layer.ids], memberNames: [layer.name], scopes: [scope],
        mosaicColor: territorialColor(identity)});
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
