import {resolveHostingRoute, securityHeaders} from './routing.js';

function secure(response, request, env) {
  const headers = new Headers(response.headers);
  for (const [key, value] of securityHeaders(new URL(request.url).pathname)) headers.set(key, value);
  if (/^\/embed\/(?:persona\/[^/]+\/?|arbol\/?)$/.test(new URL(request.url).pathname)) headers.delete('X-Frame-Options');
  if (env.DEPLOYMENT_ENV !== 'production') headers.set('X-Robots-Tag', 'noindex, nofollow');
  return new Response(request.method === 'HEAD' ? null : response.body, {status: response.status, statusText: response.statusText, headers});
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // Reserva las API para el futuro backend de cuentas y pagos. Nunca deben
    // convertirse en una página SPA ni devolver HTML como si fueran exitosas.
    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
      return secure(Response.json({error: 'not_found'}, {status: 404, headers: {'Cache-Control': 'no-store'}}), request, env);
    }
    if (!['GET', 'HEAD'].includes(request.method)) {
      return secure(new Response('Method Not Allowed', {status: 405, headers: {Allow: 'GET, HEAD'}}), request, env);
    }
    const route = resolveHostingRoute(url);
    if (route.redirect) {
      const destination = new URL(route.redirect, url);
      destination.search = url.search;
      return secure(new Response(null, {status: route.status, headers: {Location: destination.href}}), request, env);
    }
    const assetUrl = new URL(url);
    assetUrl.pathname = route.asset;
    const response = await env.ASSETS.fetch(new Request(assetUrl, request));
    if (response.status !== 404) return secure(response, request, env);
    const notFoundUrl = new URL('/404.html', url);
    const notFound = await env.ASSETS.fetch(new Request(notFoundUrl, request));
    const headers = new Headers(notFound.headers);
    headers.set('X-Robots-Tag', 'noindex, follow');
    return secure(new Response(notFound.body, {status: 404, headers}), request, env);
  }
};
