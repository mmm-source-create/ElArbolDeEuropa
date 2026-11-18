// Cloudflare reuses the data already embedded in the published English HTML.
// This keeps the free deployment below its file limit without dropping content.
export function metadataFromHtml(html, expectedPath) {
  const match = html.match(/<script id="eade-initial-page" type="application\/json">([\s\S]*?)<\/script>/);
  if (!match) throw new Error('Missing static page data');
  const page = JSON.parse(match[1]);
  if (page.schema !== 2 || page.kind !== 'english' || page.path !== expectedPath || page.data?.path !== expectedPath) throw new Error('Mismatched static page data');
  return page.data;
}
