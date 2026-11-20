// 6.0.10: A–Z people index helpers, shared by the page and the tests.
import {normalizarBusquedaPublica} from '../../domain/people/personLabels.js';

export const PEOPLE_INDEX_PATHS = {es: '/es/personas/indice', en: '/en/people/index'};

export const indexLetter = name => {
  const letter = normalizarBusquedaPublica(name).charAt(0).toUpperCase();
  return /[A-Z]/.test(letter) ? letter : '#';
};

export function groupByLetter(items) {
  const groups = new Map();
  for (const item of items) {
    const letter = indexLetter(item.n);
    if (!groups.has(letter)) groups.set(letter, []);
    groups.get(letter).push(item);
  }
  return [...groups].sort(([a], [b]) => (a === '#') - (b === '#') || a.localeCompare(b));
}
