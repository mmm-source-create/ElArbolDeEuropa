import {resolveHostingRoute, securityHeaders} from './routing.js';
import {metadataFromHtml, recordFromHtml, spanishRecordRoute} from '../src/utils/staticMetadata.js';

function secure(response, request, env) {
  const headers = new Headers(response.headers);
  headers.set('X-EADE-Routing', 'compatibility-worker');
  for (const [key, value] of securityHeaders(new URL(request.url).pathname)) headers.set(key, value);
  if (/^\/embed\/(?:persona\/[^/]+\/?|arbol\/?)$/.test(new URL(request.url).pathname)) headers.delete('X-Frame-Options');
  if (env.DEPLOYMENT_ENV !== 'production' || new URL(request.url).hostname.endsWith('.workers.dev')) headers.set('X-Robots-Tag', 'noindex, nofollow');
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
    // Compatibility for previously open tabs and links to the JSON endpoints.
    // Current Cloudflare clients read the same data directly from static HTML.
    if(url.pathname.startsWith('/english-meta/')) {
      const indexResponse=await env.ASSETS.fetch(new URL('/cloudflare-meta-index.json',url));
      const index=await indexResponse.json(),route=Object.hasOwn(index,url.pathname)&&index[url.pathname];
      if(typeof route!=='string'||!route.startsWith('/en'))return secure(Response.json({error:'not_found'},{status:404}),request,env);
      const html=await env.ASSETS.fetch(new URL(route,url));
      const data=metadataFromHtml(await html.text(),route);
      return secure(Response.json(data),request,env);
    }
    // 6.2.0: the same for Spanish records. Files that are still uploaded (the
    // index, aliases) are served as assets and never reach the Worker.
    const recordRoute=spanishRecordRoute(url.pathname);
    if(recordRoute) {
      const html=await env.ASSETS.fetch(new URL(recordRoute,url));
      if(!html.ok)return secure(Response.json({error:'not_found'},{status:404}),request,env);
      return secure(Response.json(recordFromHtml(await html.text(),recordRoute)),request,env);
    }
    const route = resolveHostingRoute(url);
    if (route.redirect) {
      const destination = new URL(route.redirect, url);
      destination.search = url.search;
      return secure(new Response(null, {status: route.status, headers: {Location: destination.href}}), request, env);
    }
    const assetUrl = new URL(url);
    assetUrl.pathname = route.asset.replace(/\/index\.html$/, '').replace(/\.html$/, '') || '/';
    const response = await env.ASSETS.fetch(new Request(assetUrl, request));
    if (response.status !== 404) return secure(response, request, env);
    // 6.1.2: English addresses get the English 404 page.
    const notFoundUrl = new URL(/^\/en(?:\/|$)/.test(url.pathname) ? '/404-en' : '/404', url);
    const notFound = await env.ASSETS.fetch(new Request(notFoundUrl, request));
    const headers = new Headers(notFound.headers);
    headers.set('X-Robots-Tag', 'noindex, follow');
    return secure(new Response(notFound.body, {status: 404, headers}), request, env);
  }
};
