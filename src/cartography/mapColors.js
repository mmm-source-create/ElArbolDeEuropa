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
// Tints of each overlord's colour for its tributaries and fiefs, in the same
// spirit: the dependency reads as the overlord's while neighbouring
// dependencies keep different tones (Wallachia, Moldavia and Transylvania all
// border each other and the Ottoman provinces). Poland's own magenta gives way
// to the Commonwealth's rose in 1569.
const TRIBUTARY_TINTS = Object.freeze({
  'wallachia-ottoman': '#6FA59B', 'moldavia-ottoman': '#A5CCC2', 'transylvania-ottoman': '#4F9A80',
  'crimea-ottoman': '#7DB3A6', 'serbia-ottoman': '#9CC9BC', 'byzantium-ottoman': '#A3CBC0', 'tarnovo-ottoman': '#5E9C8E',
  'morea-ottoman': '#8DBFB2', 'trebizond-ottoman': '#94C3B7', 'ragusa-ottoman': '#86BBAE', 'archipelago-ottoman': '#86BBAE',
  'courland-lithuania': '#7F6CB5', 'courland-commonwealth': '#DE9DAC',
  'prussia-order-poland': '#E9A3E0', 'perm-moscow': '#93A97F', 'novgorod-moscow': '#8FA67C',
  'granada-castile-jaen': '#F4EC94', 'murcia-castile-alcaraz': '#C9BE3E', 'menorca-mallorca-capdepera': '#C77A73',
  'brittany-angevin': '#B08A72',
});
export const tributaryColor = (relation, year) => relation.id === 'prussia-poland'
  ? (year >= 1569 ? '#E3A6B5' : '#E9A3E0') : TRIBUTARY_TINTS[relation.id] || '#9AA59A';
export function authorityColor(entry, territorialColor) {
  if (entry.color) return entry.color;
  const government = entry.government;
  if (/estat[uú]der/i.test(government?.titulo || '') || government?.clase === 'estatuderato'
      || government?.territorio === 'Países Bajos' && /regencia del cargo hereditario/i.test(government?.nota || '')) return ORANGE_NASSAU;
  if (entry.kind === 'delegated' || ['regencia','gobierno delegado'].includes(government?.condicion)
      || /gobernador|regente|virrey/i.test(government?.titulo || '')) return '#907085';
  return territorialColor;
}
