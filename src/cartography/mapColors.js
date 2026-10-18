import {fnv1a} from '../utils/hash.js';
import {FRENCH_FIEF_TINTS} from './frenchFiefTints.js';
// One shared swatch for the dynasty, the Republic and its delegated offices.
export const ORANGE_NASSAU = '#C08A38';
export const FRENCH_CROWN_COLOR = '#295D8E';
export const BURGUNDIAN_COLOR = '#8E295C';
export const ENGLISH_CROWN_COLOR = '#7A4F3B';
// The Commonwealth stays apart from the violet Bohemian crown, Moravia and
// Transylvania that border it.
export const POLAND_LITHUANIA_COLOR = '#C4627A';
// Lighter tints of the royal blue: a fief or apanage reads as part of the
// kingdom, while each principality keeps a tone of its own. Neighbours never
// share a tint (see build-french-fief-tints.mjs).
const FALLBACK_TINTS = ['#5B84B1', '#7FA3C7', '#47739C', '#6E8FB8', '#4E91B0', '#3F7AA6'];
export const frenchFiefColor = identity => FRENCH_FIEF_TINTS[identity]
  || FALLBACK_TINTS[fnv1a(identity) % FALLBACK_TINTS.length];
export function authorityColor(entry, territorialColor) {
  if (entry.color) return entry.color;
  const government = entry.government;
  if (/estat[uú]der/i.test(government?.titulo || '') || government?.clase === 'estatuderato'
      || government?.territorio === 'Países Bajos' && /regencia del cargo hereditario/i.test(government?.nota || '')) return ORANGE_NASSAU;
  if (entry.kind === 'delegated' || ['regencia','gobierno delegado'].includes(government?.condicion)
      || /gobernador|regente|virrey/i.test(government?.titulo || '')) return '#907085';
  return territorialColor;
}
