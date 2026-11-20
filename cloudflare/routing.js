import config from '../routes.json' with {type: 'json'};

// Compila el subconjunto de rutas usado por el proyecto. Las reglas siguen
// teniendo una sola fuente, incluido su orden y las condiciones de atlas=1.
function compile(source) {
  const keys=[];let pattern='',cursor=0;
  for(const match of source.matchAll(/:([A-Za-z]\w*)(?:\(([^()]+)\))?(\*)?/g)) {
    pattern+=source.slice(cursor,match.index).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    keys.push(match[1]);pattern+=`(${match[3]?'.*':match[2]||'[^/]+'})`;
    cursor=match.index+match[0].length;
  }
  pattern+=source.slice(cursor).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  return {keys,expression:new RegExp(`^${pattern}$`)};
}

function match(rule, url) {
  const values = rule.expression.exec(url.pathname);
  if (!values) return null;
  if (!rule.has.every(condition => url.searchParams.get(condition.key) === condition.value)) return null;
  return Object.fromEntries(rule.keys.map((key, index) => [key, values[index + 1]]));
}

function rules(list) {
  return list.map(rule => {
    if (rule.has?.some(condition => condition.type !== 'query')) throw new Error('Condición de alojamiento no admitida');
    return {...rule, ...compile(rule.source), has: rule.has || []};
  });
}

const redirects = rules(config.redirects || []);
const rewrites = rules(config.rewrites || []);
const substitute = (destination, params) => destination.replace(/:([A-Za-z]\w*)\*?/g, (_, key) => params[key]);

export function resolveHostingRoute(url) {
  for (const rule of redirects) {
    const params = match(rule, url);
    if (params) return {redirect: substitute(rule.destination, params), status: rule.permanent ? 308 : 307};
  }
  for (const rule of rewrites) {
    const params = match(rule, url);
    if (params) return {asset: substitute(rule.destination, params)};
  }
  return {asset: url.pathname};
}

// La CSP de routes.json ya es la de Cloudflare; se conserva el punto de extensión.
export function cloudflareCsp(value) {
  return value;
}

const generalHeaders = config.headers.find(rule => rule.source === '/(.*)').headers;
const mainHeaders = config.headers.find(rule => rule.headers.some(header => header.key === 'X-Frame-Options')).headers;
const embedHeaders = config.headers.find(rule => rule.source === '/embed/arbol').headers;

export function securityHeaders(pathname) {
  const embedded = /^\/embed\/(?:persona\/[^/]+\/?|arbol\/?)$/.test(pathname);
  return [...generalHeaders, ...(embedded ? embedHeaders : mainHeaders)].map(({key, value}) =>
    [key, key === 'Content-Security-Policy' ? cloudflareCsp(value) : value]
  );
}

export function staticHeadersFile() {
  return `/*\n${securityHeaders('/').map(([key, value]) => `  ${key}: ${value}`).join('\n')}\n\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n\nhttps://:worker.:subdomain.workers.dev/*\n  X-Robots-Tag: noindex, nofollow\n`;
}

// Asset routing must precede the Worker, except for canonical URL redirects.
function redirectPatterns(source) {
  const group=source.match(/:[A-Za-z]\w*\(([^()]+)\)/);
  if(group)return group[1].split('|').flatMap(value=>redirectPatterns(source.replace(group[0],value)));
  const story=source.match(/^(?:\/es)?\/historia\/[^/]+|^\/en\/story\/[^/]+/);
  return [story ? `${story[0]}*` : source.replace(/:[A-Za-z]\w*\*/g,'*')];
}
// Rules marked "workerFirst": false point from URLs that no longer have a
// generated page (renamed people). Cloudflare already sends a request with no
// matching asset to the Worker, and run_worker_first allows at most 100 rules.
export const redirectWorkerPatterns=[...new Set((config.redirects||[]).filter(rule=>rule.workerFirst!==false).flatMap(rule=>redirectPatterns(rule.source)))];
