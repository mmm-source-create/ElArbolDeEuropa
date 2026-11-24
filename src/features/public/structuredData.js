// 6.0.10: schema.org data for the static HTML. People carry their dates,
// parents, spouses and children; every record carries its breadcrumb trail.
import {translatedEquivalent} from '../english/routes.js';
import {canonicalPath} from './publicMeta.js';
import {SITE_NAME, SITE_NAME_EN, SUPPORT_URL} from '../../app/siteConfig.js';

const absolute = (path, siteUrl) => new URL(canonicalPath(path), siteUrl).href;
const year = (value, approx) => value == null || approx ? undefined : String(value);

function relative(p, locale, siteUrl) {
  if (!p?.nombre) return null;
  const es = p.slug ? `/es/persona/${p.slug}` : null;
  const path = locale === 'en' ? (p.path?.startsWith('/en/') ? p.path : es && translatedEquivalent(es, 'en')) : (p.path?.startsWith('/es/') ? p.path : es);
  return {'@type': 'Person', name: p.nombre, ...(path ? {url: absolute(path, siteUrl)} : {})};
}

const relatives = (list, locale, siteUrl) => (list || []).map(p => relative(p, locale, siteUrl)).filter(Boolean);

// 6.1.0: the works a page cites, as schema.org CreativeWorks. Only sources with
// a web address; at most 12, in the page's own order.
export function citations(fuentes, limit = 12) {
  const seen = new Set(), out = [];
  for (const f of fuentes || []) {
    const url = typeof f === 'object' && f ? f.url : null, name = typeof f === 'object' && f ? (f.titulo || f.label || f.title) : null;
    if (!url || !/^https?:\/\//.test(url) || seen.has(url)) continue;
    seen.add(url);
    out.push({'@type': 'CreativeWork', ...(name ? {name} : {}), url});
    if (out.length === limit) break;
  }
  return out;
}

const siteRef = siteUrl => ({'@id': `${new URL('/', siteUrl).href}#website`});
const publisherRef = siteUrl => ({'@id': `${new URL('/', siteUrl).href}#organization`});
// Articles name their author in full: a bare @id is not enough on a page without the Organization node.
const publisher = siteUrl => ({...publisherRef(siteUrl), '@type': 'Organization', name: SITE_NAME, url: new URL('/', siteUrl).href, logo: {'@type': 'ImageObject', url: new URL('/brand/apple-touch-icon.png', siteUrl).href}});

// The page that carries the record: language, site and the works it cites.
function webPage(type, {url, name, description, locale, about, cited, siteUrl, extra = {}}) {
  return {'@type': type, '@id': `${url}#webpage`, url, name, ...(description ? {description} : {}), inLanguage: locale === 'en' ? 'en' : 'es', isPartOf: siteRef(siteUrl), ...(about ? {about} : {}), ...(cited?.length ? {citation: cited} : {}), ...extra};
}

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
    ...(p.imagen ? {image: absolute(p.imagen, siteUrl)} : {}),
  };
  for (const [field, list] of [['parent', p.padres], ['spouse', p.conyuges], ['children', p.hijos]]) {
    const items = relatives(list, locale, siteUrl);
    if (items.length) person[field] = items;
  }
  const offices = [...new Set((p.gobiernos || []).map(g => `${label(g.titulo)} · ${label(g.territorio)}`))];
  if (offices.length) person.hasOccupation = offices.slice(0, 10).map(name => ({'@type': 'Occupation', name}));
  const trail = en ? [['Home', '/en'], ['People', '/en/people'], [p.nombre, path]] : [['Inicio', '/es'], ['Personas', '/es/personas'], [p.nombre, path]];
  const page = webPage('WebPage', {url: absolute(path, siteUrl), name: p.nombre, locale, about: {'@id': person['@id']}, cited: citations(p.fuentes), siteUrl});
  return {'@context': 'https://schema.org', '@graph': [person, page, breadcrumbs(trail, siteUrl)]};
}

export function entityJsonLd(kind, data, {locale = 'es', path, description, siteUrl}) {
  const en = locale === 'en';
  const catalogue = kind === 'dinastia' ? (en ? ['Dynasties', '/en/dynasties'] : ['Dinastías', '/es/dinastias']) : (en ? ['Territories', '/en/territories'] : ['Territorios', '/es/territorios']);
  const name = kind === 'dinastia' && !en ? `Casa de ${data.nombre}` : data.nombre;
  const url = absolute(path, siteUrl), cited = citations(data.fuentes);
  const trail = breadcrumbs([[en ? 'Home' : 'Inicio', en ? '/en' : '/es'], catalogue, [name, path]], siteUrl);
  if (kind === 'territorio') {
    // A historical polity: schema.org has no type for a kingdom that no longer
    // exists, and AdministrativeArea is the closest one search engines read.
    const place = {'@type': 'AdministrativeArea', '@id': `${url}#place`, name: data.nombre, url, ...(description ? {description} : {}), ...(data.aliases?.length ? {alternateName: data.aliases.filter(a => a && a !== data.nombre).slice(0, 8)} : {})};
    return {'@context': 'https://schema.org', '@graph': [place, webPage('WebPage', {url, name, description, locale, about: {'@id': place['@id']}, cited, siteUrl}), trail]};
  }
  // A house is a family, not an organisation: the page is a collection of its members.
  const members = (data.miembros || []).filter(m => m?.nombre).slice(0, 50).map((m, index) => {
    const ref = relative(m, locale, siteUrl);
    return {'@type': 'ListItem', position: index + 1, item: ref};
  });
  const list = {'@type': 'ItemList', name: en ? `Members of the ${data.nombre} house` : `Miembros de la casa de ${data.nombre}`, numberOfItems: data.total || members.length, itemListElement: members};
  return {'@context': 'https://schema.org', '@graph': [webPage('CollectionPage', {url, name, description, locale, cited, siteUrl, extra: {mainEntity: list}}), trail]};
}

// The site and its publisher, on both homes. The same @id lets every page refer to them.
export function siteJsonLd({locale = 'es', path, description, siteUrl}) {
  const en = locale === 'en', root = new URL('/', siteUrl).href;
  const site = {'@type': 'WebSite', '@id': `${root}#website`, url: absolute(en ? '/en' : '/es', siteUrl), name: en ? SITE_NAME_EN : SITE_NAME, alternateName: en ? SITE_NAME : SITE_NAME_EN, inLanguage: ['es', 'en'], description, publisher: publisherRef(siteUrl)};
  const organization = {'@type': 'Organization', '@id': `${root}#organization`, name: SITE_NAME, alternateName: SITE_NAME_EN, url: root, logo: {'@type': 'ImageObject', url: new URL('/brand/apple-touch-icon.png', siteUrl).href, width: 180, height: 180}, sameAs: [SUPPORT_URL]};
  return {'@context': 'https://schema.org', '@graph': [site, organization, webPage('WebPage', {url: absolute(path, siteUrl), name: en ? SITE_NAME_EN : SITE_NAME, description, locale, siteUrl})]};
}

// A story, or one of its chapters: an Article about its protagonists, with its sources.
export function storyJsonLd(data, {locale = 'es', path, description, siteUrl}) {
  const en = locale === 'en', url = absolute(path, siteUrl);
  const story = data.title || data.storyTitle || data.titulo || data.nombre;
  const step = data.chapter ? data.pasos?.[data.chapter - 1] : null;
  const storyPath = data.chapter ? path.replace(/\/(?:capitulo|chapter)\/\d+$/, '') : path;
  const about = relatives(data.protagonists, locale, siteUrl).slice(0, 20);
  const article = {
    '@type': 'Article', '@id': `${url}#article`, headline: (step?.titulo || story || '').slice(0, 110), url, ...(description ? {description} : {}),
    inLanguage: en ? 'en' : 'es', isPartOf: data.chapter ? {'@type': 'Article', '@id': `${absolute(storyPath, siteUrl)}#article`, headline: story, url: absolute(storyPath, siteUrl)} : siteRef(siteUrl),
    author: publisher(siteUrl), publisher: publisher(siteUrl), ...(about.length ? {about} : {}),
    ...(data.period ? {temporalCoverage: String(data.period).replace(/[–—]/g, '/')} : {}),
    ...(citations(data.fuentes).length ? {citation: citations(data.fuentes)} : {}),
  };
  const trail = en ? [['Home', '/en'], ['Stories', '/en/stories'], [story, storyPath]] : [['Inicio', '/es'], ['Historias', '/es/historias'], [story, storyPath]];
  if (data.chapter) trail.push([step?.titulo || `${en ? 'Chapter' : 'Capítulo'} ${data.chapter}`, path]);
  return {'@context': 'https://schema.org', '@graph': [article, breadcrumbs(trail, siteUrl)]};
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
  if (kind === 'historia') return storyJsonLd(data, {...options, locale: 'es'});
  if (kind === 'english' && data.type === 'story') return storyJsonLd(data, {...options, locale: 'en'});
  if (kind === 'catalogo' && page.slug === 'inicio') return siteJsonLd({...options, locale: 'es'});
  if (kind === 'english' && data.type === 'home') return siteJsonLd({...options, locale: 'en'});
  return null;
}
