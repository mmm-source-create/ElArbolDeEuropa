// Cloudflare reuses the data already embedded in the published HTML (English
// since 6.0.20, Spanish records since 6.2.0). This keeps the free deployment
// below its file limit without dropping content.
import {parsePage} from '../features/public/pageTransport.js';

export function pageFromHtml(html) {
  const match = html.match(/<script id="eade-initial-page" type="application\/json">([\s\S]*?)<\/script>/);
  return match ? parsePage(match[1]) : null;
}

export function metadataFromHtml(html, expectedPath) {
  const page = pageFromHtml(html);
  if (!page) throw new Error('Missing static page data');
  if (page.schema !== 2 || page.kind !== 'english' || page.path !== expectedPath || page.data?.path !== expectedPath) throw new Error('Mismatched static page data');
  return page.data;
}

// 6.2.0: the Spanish record files map one-to-one onto their static pages.
const RECORD_FOLDERS = {personas:'persona', dinastias:'dinastia', territorios:'territorio', historias:'historia'};
export const RECORD_KINDS = Object.freeze(Object.values(RECORD_FOLDERS));
const FOLDER_FOR_KIND = Object.fromEntries(Object.entries(RECORD_FOLDERS).map(([folder, kind]) => [kind, `${folder}-meta`]));
// The record file that a static page reproduces (inverse of spanishRecordRoute).
export const recordFileForPage = page => `/${FOLDER_FOR_KIND[page.kind]}/${page.slug}${page.chapter ? `/capitulo/${page.chapter}` : ''}.json`;
export function spanishRecordRoute(pathname) {
  const match = String(pathname).match(/^\/(personas|dinastias|territorios|historias)-meta\/([a-z0-9]+(?:-[a-z0-9]+)*)(?:\/capitulo\/([1-9][0-9]*))?\.json$/);
  if (!match) return null;
  const kind = RECORD_FOLDERS[match[1]];
  // personas-meta/index.json is the id → slug index, not a record.
  if ((match[3] && kind !== 'historia') || (kind === 'persona' && match[2] === 'index')) return null;
  return `/es/${kind}/${match[2]}${match[3] ? `/capitulo/${match[3]}` : ''}`;
}

export function recordFromHtml(html, expectedPath) {
  const page = pageFromHtml(html);
  if (!page) throw new Error('Missing static page data');
  if (page.schema !== 2 || !RECORD_KINDS.includes(page.kind) || page.path !== expectedPath || !page.data) throw new Error('Mismatched static page data');
  return page.data;
}
