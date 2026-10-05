// Corrections that also apply outside the 1400–1650 research layer. A coarse
// Roussillon crosswalk must not turn Spanish Cerdanya into a permanent French
// possession after 1659. Documented occupations remain separate exceptions.
export const CERDANYA_SOURCE = Object.freeze({
  title: 'Turisme Cerdanya · Historia de la frontera y ocupaciones',
  url: 'https://cerdanya.org/fr/decouvrir/culture/histoire/',
  locator: 'Restitución de 1493; partición de 1659–1660; ocupaciones de 1708–1714 y 1812–1814',
});

export function cerdanyaBorderCorrection(territory, year) {
  if (!Number.isInteger(year) || year < 1493 || year > 1900
      || !['Francia', 'Condado de Barcelona', 'España'].includes(territory)) return null;
  const occupation = year >= 1708 && year <= 1714 || year >= 1812 && year <= 1814;
  return {
    id: 'Puigcerda', action: territory === 'Francia' ? occupation ? 'add' : 'remove' : 'add',
    occupation: territory === 'Francia' && occupation, source: CERDANYA_SOURCE,
    note: 'La Cerdanya fue restituida en 1493; Puigcerdà se conserva en la parte hispánica tras 1659. La celda no separa cada municipio de la frontera ni representa el enclave de Llívia. Las ocupaciones francesas documentadas se muestran con trama y no como una cesión permanente.',
  };
}

export const SOUTHERN_PYRENEES_SOURCE = Object.freeze({
  title: 'Generalitat de Catalunya · Pirineu Comtal',
  url: 'https://act.gencat.cat/wp-content/uploads/2012/06/RutaPirineuComtal.pdf',
  locator: 'Cerdanya, Berguedà y Ripollès; partición de la Cerdanya por el Tratado de los Pirineos',
});

// Visual review: this elongated cell lies south of Puigcerdà, between the
// Catalan Pyrenean valleys and Ripoll. Its English name is not a French claim.
// It is a regional approximation, not a surveyed border along the ridge.
export function southernPyreneesCorrection(territory, year) {
  if (!Number.isInteger(year) || year < 1493 || year > 1900
      || !['Francia', 'Condado de Barcelona', 'España'].includes(territory)) return null;
  return {id: 'South_Eastern_Pyrenees', action: territory === 'Francia' ? 'remove' : 'add',
    source: SOUTHERN_PYRENEES_SOURCE,
    note: 'La celda al sur de Puigcerdà aproxima el Pirineo catalán meridional; no se identifica con el Rosellón cedido a Francia. El contorno es orientativo y no separa cada valle o municipio.'};
}

export function applyMapBorderCorrections(ids, territory, year) {
  const corrections = [cerdanyaBorderCorrection(territory, year), southernPyreneesCorrection(territory, year)].filter(Boolean);
  if (!corrections.length) return ids;
  const corrected = new Set(ids);
  for (const correction of corrections) {
    if (correction.action === 'remove') corrected.delete(correction.id);
    else corrected.add(correction.id);
  }
  return [...corrected];
}
