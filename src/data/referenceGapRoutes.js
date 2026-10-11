// Supplemental surfaces share the existing title's authority and evidence.
// Layer coverage decides when they paint; these aliases never extend dates.
export function referenceGapJurisdictions(names, territory) {
  const supplement = territory === 'Noruega' ? 'Islandia bajo la Corona noruega'
    : territory === 'Austria' ? 'Istria bajo administración austríaca'
    : territory === 'Moldavia' ? 'Moldavia · comarcas meridionales'
    : ['Venecia', 'República de Venecia'].includes(territory) ? 'Istria veneciana' : null;
  return supplement ? [...new Set([...names, supplement])] : names;
}
