// Cloudflare reuses the data already embedded in the published English HTML.
// This keeps the free deployment below its file limit without dropping content.
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
