// 6.0.10: titles and descriptions built from each record's own data, so that
// every profile has a distinct search snippet with concrete facts.
import {isNamedDynasty} from '../../data/dynastyNames.js';

export const DESCRIPTION_LIMIT = 160;

// Cuts at a word boundary and closes with an ellipsis.
export function clip(text, limit = DESCRIPTION_LIMIT) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= limit) return clean;
  const cut = clean.slice(0, limit - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), limit * .6)).replace(/[\s,;:.·–-]+$/, '')}…`;
}

// "1194–1250", "c. 1339–1362", "† 1362", "n. 1339" / "b. 1339".
export function lifeDates(p, locale = 'es') {
  const year = (value, approx) => value == null ? null : `${approx ? 'c. ' : ''}${value}`;
  const born = year(p?.nac, p?.nacAprox), died = year(p?.muer, p?.muerAprox);
  if (born && died) return `${born}–${died}`;
  if (died) return `† ${died}`;
  if (born) return `${locale === 'en' ? 'b.' : 'n.'} ${born}`;
  return '';
}

const listJoin = (names, locale) => {
  const and = locale === 'en' ? 'and' : 'y';
  return names.length < 2 ? names.join('') : `${names.slice(0, -1).join(', ')} ${and} ${names.at(-1)}`;
};
const names = (people, max = 3) => (people || []).map(p => p?.nombre).filter(Boolean).slice(0, max);
const unique = values => [...new Set(values.filter(Boolean))];
const firstSentence = text => String(text || '').replace(/\s+/g, ' ').trim().split(/(?<=[.!?])\s/)[0] || '';

export function personTitle(p, locale = 'es') {
  const dates = lifeDates(p, locale);
  const name = `${p.nombre}${dates ? ` (${dates})` : ''}`;
  return locale === 'en' ? `${name}: family and lineage | The Tree of Europe` : `${name}: familia y linaje | El Árbol de Europa`;
}

export function personDescription(p, locale = 'es') {
  const en = locale === 'en';
  const label = value => (en && p.englishLabels?.[value]) || value;
  const nickname = en ? (p.nickname || label(p.sobrenombre)) : p.sobrenombre;
  const dates = lifeDates(p, locale);
  const role = en ? p.role : p.titulo;
  const house = isNamedDynasty(p.dinastia) ? label(p.dinastia) : '';
  const roleText = role && house ? (en ? `${role}, house of ${house}` : `${role} de la casa ${house}`) : role || (house ? (en ? `House of ${house}` : `Casa ${house}`) : '');
  const head = `${p.nombre}${nickname ? `, ${nickname}` : ''}${dates ? ` (${dates})` : ''}${roleText ? `: ${roleText}` : ''}.`;
  const territories = unique((p.gobiernos || []).map(g => label(g.territorio))).slice(0, 4);
  const parents = names(p.padres, 2), spouses = names(p.conyuges, 2), children = names(p.hijos, 3);
  const facts = [
    territories.length && `${en ? 'Ruled' : 'Gobernó'} ${listJoin(territories, locale)}.`,
    parents.length && `${en ? 'Parents' : 'Padres'}: ${listJoin(parents, locale)}.`,
    spouses.length && `${en ? (spouses.length > 1 ? 'Spouses' : 'Spouse') : (spouses.length > 1 ? 'Cónyuges' : 'Cónyuge')}: ${listJoin(spouses, locale)}.`,
    children.length && `${en ? 'Children' : 'Hijos'}: ${listJoin(children, locale)}${(p.hijos || []).length > children.length ? (en ? ' and others' : ' y otros') : ''}.`,
  ].filter(Boolean);
  const summary = firstSentence(en ? (p.summary || p.description || p.resumen) : (p.resumen || p.biografia));
  // Whole facts first, then the summary, while they fit: no fact is cut.
  let text = head;
  for (const part of [...facts, ...(summary && !facts.join(' ').includes(summary) ? [summary] : [])]) {
    if (`${text} ${part}`.length <= DESCRIPTION_LIMIT) text = `${text} ${part}`;
  }
  return clip(text);
}

export function dynastyTitle(d, locale = 'es') {
  return locale === 'en' ? `${d.nombre}: members, branches and territories | The Tree of Europe` : `Casa de ${d.nombre}: miembros, ramas y territorios | El Árbol de Europa`;
}

export function territoryTitle(t, locale = 'es') {
  return locale === 'en' ? `${t.nombre}: rulers and succession | The Tree of Europe` : `${t.nombre}: gobernantes y sucesión | El Árbol de Europa`;
}

export function entityDescription(e, kind, locale = 'es') {
  const en = locale === 'en';
  const summary = e.resumen || e.description || e.summary;
  const members = (e.miembros || []).length, rulers = unique((e.gobiernos || []).map(g => g.persona?.nombre)).length;
  const years = (e.gobiernos || []).flatMap(g => [g.desde, g.hasta]).filter(Number.isFinite);
  const span = years.length ? ` (${Math.min(...years)}–${Math.max(...years)})` : '';
  const counts = kind === 'dinastia'
    ? (members ? (en ? `${members} recorded members${span}.` : `${members} miembros registrados${span}.`) : '')
    : (rulers ? (en ? `${rulers} recorded rulers${span}.` : `${rulers} gobernantes registrados${span}.`) : '');
  return clip([summary, counts].filter(Boolean).join(' ')) || (kind === 'dinastia'
    ? (en ? 'Members, branches and territories of a house in the Atlas.' : 'Personas, ramas y territorios de una casa en el Atlas.')
    : (en ? 'Recorded governments, dynasties and historical connections.' : 'Gobiernos, dinastías y conexiones históricas registradas.'));
}
