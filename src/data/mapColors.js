// One shared swatch for the dynasty, the Republic and its delegated offices.
export const ORANGE_NASSAU = '#C08A38';
export const FRENCH_CROWN_COLOR = '#295D8E';
export const BURGUNDIAN_COLOR = '#8E295C';
export function authorityColor(entry, territorialColor) {
  if (entry.color) return entry.color;
  const government = entry.government;
  if (/estat[uú]der/i.test(government?.titulo || '') || government?.clase === 'estatuderato') return ORANGE_NASSAU;
  if (entry.kind === 'delegated' || ['regencia','gobierno delegado'].includes(government?.condicion)
      || /gobernador|regente|virrey/i.test(government?.titulo || '')) return '#907085';
  return territorialColor;
}
