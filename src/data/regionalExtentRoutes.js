// Resolve a reviewed mandate to its regional surface. An absent mandate stays
// absent; occupying Olomouc or holding the imperial crown grants no province.
const REGIONAL_ALIASES = Object.freeze({
  'Silesia real (Wrocław y Środa)': 'Silesia · soberanía de la Corona',
  'Silesia real (Głogów)': 'Silesia · soberanía de la Corona',
  'Silesia (ocupación prusiana de 1741)': 'Silesia · ocupación prusiana',
  'Silesia prusiana (núcleos)': 'Silesia · parte prusiana',
  'Silesia austríaca (núcleo de Teschen)': 'Silesia · remanente austríaco',
  'Sicilia': 'Reino de Sicilia antes de 1282',
  'Morea veneciana (núcleos)': 'Morea veneciana · superficie regional',
});

export function regionalExtentJurisdictions(names, territory, year, personId) {
  const resolved = names.map(name => {
    // George's locally recognised authority is not a documented mandate over
    // every duchy. Preserve that reviewed local scope during the Hussite split.
    if (territory === 'Silesia' && (['JORGEPODE', 'FED5PALBOH'].includes(personId)
      || personId === 'FERN2EMP' && year === 1619)) return name;
    return REGIONAL_ALIASES[name] || name;
  });
  if (territory === 'Imperio otomano') resolved.push('Anatolia otomana · Bitinia y expansión occidental',
    'Anatolia otomana · Candar y costa póntica', 'Anatolia otomana · Karaman',
    'Anatolia otomana · provincias orientales', 'Anatolia otomana · Van',
    'Anatolia otomana · frontera de Kars', 'Islas egeas otomanas');
  return [...new Set(resolved)];
}

export function supersededRegionalLayers(data, year) {
  const entries = [...(data?.territories || []), ...(data?.additionalTerritories || [])];
  return new Set(entries.filter(entry => entry.supersedes?.length && entry.coverage?.from <= year
    && year <= entry.coverage.through).flatMap(entry => entry.supersedes));
}
