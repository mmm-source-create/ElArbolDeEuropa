import {createHash} from 'node:crypto';
import {SCREEN_NOTICE_SCRIPT} from '../src/public/screenNotice.js';

export const NOTICE_HASH = `sha256-${createHash('sha256').update(SCREEN_NOTICE_SCRIPT).digest('base64')}`;
export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  // Vercel Live permite la barra de revisión en las vistas previas.
  `script-src 'self' '${NOTICE_HASH}' https://vercel.live`,
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' https: data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://vercel.live https://vitals.vercel-insights.com wss://*.pusher.com https://*.pusher.com",
  "frame-src https://vercel.live",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join('; ');

export const SECURITY_HEADERS = [
  {key: 'Content-Security-Policy', value: CONTENT_SECURITY_POLICY},
  {key: 'X-Content-Type-Options', value: 'nosniff'},
  {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
  {key: 'X-Frame-Options', value: 'SAMEORIGIN'},
  {key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()'},
];

// Comprueba los scripts realmente publicados, incluido el shell dinámico.
export function auditScriptPolicy(html, siteUrl) {
  const errors = [];
  for (const [, attributes, text] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    if (/\btype=["']application\/(?:ld\+)?json["']/i.test(attributes)) continue;
    const src = attributes.match(/\bsrc=["']([^"']+)["']/i)?.[1];
    if (src) {
      try {
        const url = new URL(src, siteUrl);
        if (![new URL(siteUrl).origin, 'https://vercel.live'].includes(url.origin)) errors.push('Script de un origen no autorizado por la CSP');
      } catch { errors.push('URL de script inválida'); }
    } else if (`sha256-${createHash('sha256').update(text).digest('base64')}` !== NOTICE_HASH) {
      errors.push('Script en línea sin un hash autorizado en la CSP');
    }
  }
  return errors;
}


// Only purpose-built embeds can be framed cross-origin; normal pages retain SAMEORIGIN.
export const MAIN_FRAME_SOURCE = '/((?!embed/(?:persona/[^/]+/?|arbol/?)$).*)';
export const EMBED_SOURCES = ['/embed/persona/:id', '/embed/persona/:id/', '/embed/arbol', '/embed/arbol/'];
export const EMBED_CSP = CONTENT_SECURITY_POLICY.replace("frame-ancestors 'self'", 'frame-ancestors *');
