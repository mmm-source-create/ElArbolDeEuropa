// 6.0.10: schema.org data for the static HTML. People carry their dates,
// parents, spouses and children; every record carries its breadcrumb trail.
import {translatedEquivalent} from '../english/routes.js';
import {canonicalPath} from './publicMeta.js';

const absolute = (path, siteUrl) => new URL(canonicalPath(path), siteUrl).href;
const year = (value, approx) => value == null || approx ? undefined : String(value);

function relative(p, locale, siteUrl) {
  if (!p?.nombre) return null;
  const es = p.slug ? `/es/persona/${p.slug}` : null;
  const path = locale === 'en' ? (p.path?.startsWith('/en/') ? p.path : es && translatedEquivalent(es, 'en')) : (p.path?.startsWith('/es/') ? p.path : es);
  return {'@type': 'Person', name: p.nombre, ...(path ? {url: absolute(path, siteUrl)} : {})};
}

const relatives = (list, locale, siteUrl) => (list || []).map(p => relative(p, locale, siteUrl)).filter(Boolean);

function breadcrumbs(items, siteUrl) {
  return {'@type': 'BreadcrumbList', itemListElement: items.map(([name, path], index) => ({'@type': 'ListItem', position: index + 1, name, item: absolute(path, siteUrl)}))};
}

export function personJsonLd(p, {locale = 'es', path, description, siteUrl}) {
  const en = locale === 'en';
  const label = value => (en && p.englishLabels?.[value]) || value;
  const person = {
    '@type': 'Person',
    '@id': `${absolute(path, siteUrl)}#person`,
    name: p.nombre,
    url: absolute(path, siteUrl),
    description,
    ...(p.aliases?.length || p.searchAliases?.length ? {alternateName: [...new Set([...(p.aliases || []), ...(p.searchAliases || [])])].filter(name => name !== p.nombre).slice(0, 8)} : {}),
    ...(year(p.nac, p.nacAprox) ? {birthDate: year(p.nac, p.nacAprox)} : {}),
    ...(year(p.muer, p.muerAprox) ? {deathDate: year(p.muer, p.muerAprox)} : {}),
    ...((en ? p.role : p.titulo) ? {jobTitle: en ? p.role : p.titulo} : {}),
    ...(p.ogImage ? {image: absolute(p.ogImage, siteUrl)} : {}),
  };
  for (const [field, list] of [['parent', p.padres], ['spouse', p.conyuges], ['children', p.hijos]]) {
    const items = relatives(list, locale, siteUrl);
    if (items.length) person[field] = items;
  }
  const offices = [...new Set((p.gobiernos || []).map(g => `${label(g.titulo)} · ${label(g.territorio)}`))];
  if (offices.length) person.hasOccupation = offices.slice(0, 10).map(name => ({'@type': 'Occupation', name}));
  const trail = en ? [['Home', '/en'], ['People', '/en/people'], [p.nombre, path]] : [['Inicio', '/es'], ['Personas', '/es/personas'], [p.nombre, path]];
  return {'@context': 'https://schema.org', '@graph': [person, breadcrumbs(trail, siteUrl)]};
}

export function entityJsonLd(kind, data, {locale = 'es', path, siteUrl}) {
  const en = locale === 'en';
  const catalogue = kind === 'dinastia' ? (en ? ['Dynasties', '/en/dynasties'] : ['Dinastías', '/es/dinastias']) : (en ? ['Territories', '/en/territories'] : ['Territorios', '/es/territorios']);
  const name = kind === 'dinastia' && !en ? `Casa de ${data.nombre}` : data.nombre;
  return {'@context': 'https://schema.org', '@graph': [breadcrumbs([[en ? 'Home' : 'Inicio', en ? '/en' : '/es'], catalogue, [name, path]], siteUrl)]};
}

// The JSON-LD for a static page, or null when the page type has none.
export function pageJsonLd(page, meta, site) {
  const {kind, data} = page;
  const siteUrl = site || new URL(meta.canonical).origin;
  const options = {path: meta.path, description: meta.meta.find(([, key]) => key === 'description')?.[2], siteUrl};
  if (kind === 'persona') return personJsonLd(data, {...options, locale: 'es'});
  if (kind === 'dinastia' || kind === 'territorio') return entityJsonLd(kind, data, {...options, locale: 'es'});
  if (kind === 'english' && data.type === 'person') return personJsonLd(data, {...options, locale: 'en'});
  if (kind === 'english' && ['dynasty', 'territory'].includes(data.type)) return entityJsonLd(data.type === 'dynasty' ? 'dinastia' : 'territorio', data, {...options, locale: 'en'});
  return null;
}
