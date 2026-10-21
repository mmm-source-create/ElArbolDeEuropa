import {slugPublico} from '../domain/people/personLabels.js';

import {DINASTIA_ALIASES} from './dynastyNames.js';
export {DINASTIA_ALIASES,dynastyAliasesFor} from './dynastyNames.js';
export const canonicalDynasty = name => DINASTIA_ALIASES[name] || name;
const aliasesBySlug = Object.fromEntries(Object.entries(DINASTIA_ALIASES).map(([alias,target])=>[slugPublico(alias),slugPublico(target)]));
export const canonicalDynastySlug = slug => aliasesBySlug[slug] || slug;
