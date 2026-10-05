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

export function applyMapBorderCorrections(ids, territory, year) {
  const correction = cerdanyaBorderCorrection(territory, year);
  if (!correction) return ids;
  const corrected = new Set(ids);
  if (correction.action === 'remove') corrected.delete(correction.id);
  else corrected.add(correction.id);
  return [...corrected];
}
