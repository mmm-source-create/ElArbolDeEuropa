import {CF_ANALYTICS_TOKEN} from './analytics-config.js';

const BEACON_SRC = 'https://static.cloudflareinsights.com/beacon.min.js';

// Cloudflare Web Analytics: sin cookies ni identificadores de visitante.
// `spa` registra también las navegaciones internas de la aplicación.
export function startAnalytics(doc = document, token = CF_ANALYTICS_TOKEN) {
  if (!token || !doc?.head) return null;
  const existing = doc.head.querySelector(`script[src="${BEACON_SRC}"]`);
  if (existing) return existing;
  const script = doc.createElement('script');
  script.defer = true;
  script.src = BEACON_SRC;
  script.setAttribute('data-cf-beacon', JSON.stringify({token, spa: true}));
  doc.head.appendChild(script);
  return script;
}
