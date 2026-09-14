// Compartido por los generadores de Node y la aplicación del navegador.
export const SITE_NAME = 'El Árbol de Europa';
export const SITE_NAME_EN = 'The Tree of Europe';
export const DEFAULT_SITE_URL = 'https://www.treeofeurope.eu';

export function resolveSiteUrl(value) {
  if (!value?.trim()) return DEFAULT_SITE_URL;
  const url = new URL(value);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('VITE_SITE_URL debe ser el origen HTTP(S) del sitio, sin credenciales, rutas ni parámetros.');
  }
  return url.origin;
}
