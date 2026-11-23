// 6.1.0: the static catalogue pages carried every item twice (as HTML and as
// hydration data): about 1 MB each. They now carry the first CATALOG_PREVIEW
// items in display order, the total and the facet counts; the page loads the
// complete list after it starts. The A–Z index still links every person.
import {normalizarBusquedaPublica} from '../../domain/people/personLabels.js';

export const CATALOG_PREVIEW = 120;

// The people order used by the catalogue: most relevant first.
export const featuredOrder = (items, locale = 'es') => items.slice().sort((a, b) => (b.relevancia || 0) - (a.relevancia || 0) || a.nombre.localeCompare(b.nombre, locale));

export function personFacets(items) {
  const count = key => { const m = new Map(); for (const item of items) if (item[key] != null) m.set(item[key], (m.get(item[key]) || 0) + 1); return m; };
  const letras = [...new Set(items.map(item => normalizarBusquedaPublica(item.nombre).charAt(0).toUpperCase()).filter(l => /[A-Z]/.test(l)))].sort();
  return {siglos: [...count('siglo')].sort((a, b) => a[0] - b[0]), papeles: [...count('papel')].sort((a, b) => b[1] - a[1]), regiones: [...count('region')].sort((a, b) => (a[0] === 'Otros') - (b[0] === 'Otros') || b[1] - a[1]), letras};
}

// key: the array that holds the items ('items' in Spanish, 'people', 'dynasties'
// or 'territories' in the English page data). full: the complete list's URL.
export function catalogPreview(data, {tipo, key = 'items', full, locale = 'es'}) {
  const items = Array.isArray(data?.[key]) ? data[key] : [];
  if (items.length <= CATALOG_PREVIEW) return data;
  const ordered = tipo === 'personas' ? featuredOrder(items, locale) : items;
  return {...data, [key]: ordered.slice(0, CATALOG_PREVIEW), partial: {total: items.length, full, ...(tipo === 'personas' ? {facetas: personFacets(items)} : {})}};
}

// The data a static page embeds: the source JSON, or its preview for the three
// large catalogues. Shared by the generator and by the SSG audit.
export function staticPageData(route, data) {
  if (route.kind === 'catalogo' && ['personas', 'dinastias', 'territorios'].includes(route.slug)) return catalogPreview(data, {tipo: route.slug, full: `/catalogos/${route.slug}.json`});
  return data;
}
