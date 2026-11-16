import {IS_CLOUDFLARE} from '../app/hosting.js';
import {metadataFromHtml} from './staticMetadata.js';
// Compartir la descarga entre montajes; un fallo permite volver a intentarlo.
const textRequests = new Map();
export function forgetTextAsset(url) {
  textRequests.delete(url);
}
export function loadTextAsset(url) {
  if (!textRequests.has(url)) {
    const request = fetch(url).then(response => {
      if (!response.ok) throw new Error(`No se ha podido cargar ${url}: ${response.status}`);
      return response.text();
    }).catch(error => {
      textRequests.delete(url);
      throw error;
    });
    textRequests.set(url, request);
  }
  return textRequests.get(url);
}

export async function loadJsonAsset(url) {
  try {
    if (IS_CLOUDFLARE && url.startsWith('/english-meta/')) {
      const index = JSON.parse(await loadTextAsset('/cloudflare-meta-index.json'));
      const key = url.split('?')[0];
      const route = index[key];
      if (!route) throw new Error(`Missing English metadata route: ${key}`);
      const query = url.includes('?') ? url.slice(url.indexOf('?')) : '';
      return metadataFromHtml(await loadTextAsset(route + query), route);
    }
    return JSON.parse(await loadTextAsset(url));
  } catch (error) {
    forgetTextAsset(url);
    throw error;
  }
}
