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
export const ARAGON_CROWN_COLOR = '#BA3737';
// Tints of the Aragonese red for the Crown's vassals, chosen so that vassals
// bordering each other in the same years keep different tones. A city held by
// the king himself (Montpellier) takes the royal red or Majorca's tint.
const ARAGON_VASSAL_TINTS = Object.freeze({
  'Atenas': '#D9786C', 'Ducado de Neopatria': '#A6413A', 'Condado de Salona': '#E59A8E',
  'Mallorca': '#D9786C', 'Judicado de Arborea': '#D9786C', 'Vizcondado de Carcasona': '#D9786C', 'Vizcondados Trencavel': '#D9786C',
  'Bearne': '#C85C50', 'Condado de Bigorra': '#D9786C', 'Toulouse': '#E59A8E', 'Foix': '#A6413A', 'Pallars Sobirà': '#E59A8E', 'Provenza': '#C85C50',
});
export const aragonVassalColor = relation => relation.holder === 'Aragón' ? ARAGON_CROWN_COLOR
  : ARAGON_VASSAL_TINTS[relation.holder || relation.subject] || '#C85C50';
export function authorityColor(entry, territorialColor) {
  if (entry.color) return entry.color;
  const government = entry.government;
  if (/estat[uú]der/i.test(government?.titulo || '') || government?.clase === 'estatuderato'
      || government?.territorio === 'Países Bajos' && /regencia del cargo hereditario/i.test(government?.nota || '')) return ORANGE_NASSAU;
  if (entry.kind === 'delegated' || ['regencia','gobierno delegado'].includes(government?.condicion)
      || /gobernador|regente|virrey/i.test(government?.titulo || '')) return '#907085';
  return territorialColor;
}
