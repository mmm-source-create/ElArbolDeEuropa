import {slugPublico} from '../utils/personLabels.js';

export const DINASTIA_ALIASES = Object.freeze({'Capeto-Évreux':'Évreux'});
export const canonicalDynasty = name => DINASTIA_ALIASES[name] || name;
const aliasesBySlug = Object.fromEntries(Object.entries(DINASTIA_ALIASES).map(([alias,target])=>[slugPublico(alias),slugPublico(target)]));
export const canonicalDynastySlug = slug => aliasesBySlug[slug] || slug;
