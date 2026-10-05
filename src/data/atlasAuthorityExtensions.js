// These dates extend a reviewed person's attribution, not the lifetime of
// every layer in the Burgundian laboratory. Geometry alone proves no control.
export const NETHERLANDS_TERRITORIES = Object.freeze(['Flandes', 'Brabante', 'Limburgo',
  'Holanda', 'Henao', 'Zelanda', 'Artois', 'Namur', 'Luxemburgo', 'Frisia', 'Utrecht',
  'Overijssel', 'Drente', 'Groninga', 'Güeldres', 'Señorío de Malinas']);

export const PHILIP_SUCCESSION_SOURCE = Object.freeze({
  title: 'Rijksmuseum · Carlos V entrega el gobierno de los Países Bajos a Felipe II, 1555',
  url: 'https://www.rijksmuseum.nl/nl/collectie/object/Keizer-Karel-V-draagt-het-bestuur-van-de-Nederlanden-over-aan-zijn-zoon-Filips-II-1555--6ab2467200c47e464e878015c6518766',
});
export const REVOLT_SOURCE = Object.freeze({
  title: 'Universiteit Leiden · La separación y la guerra en los Países Bajos',
  url: 'https://dutchrevolt.library.universiteitleiden.nl/nederlands/het-verhaal/6-de-geregelde-oorlog/',
});

export function authorityExtensionFor(name, year, personId = null) {
  if (year < 1556 || year > 1598 || !NETHERLANDS_TERRITORIES.includes(name)) return null;
  if (personId && !['FEL2ESP', 'MARGPARMA'].includes(personId)) return null;
  return {referenceYear: 1555, source: PHILIP_SUCCESSION_SOURCE,
    note: 'Se reutiliza la aproximación regional de 1555 para el mandato registrado. La revuelta y los títulos posteriores se distinguen de la posesión efectiva.'};
}
