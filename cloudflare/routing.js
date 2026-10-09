import config from '../vercel.json' with {type: 'json'};

// Compila el subconjunto de rutas usado por el proyecto. Las reglas siguen
// teniendo una sola fuente, incluido su orden y las condiciones de atlas=1.
function compile(source) {
  const keys = [];
  const pattern = source.split(/(:[A-Za-z]\w*(?:\([^()]+\))?)/g).map(part => {
    if (!part.startsWith(':')) return part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const [, key, expression] = part.match(/^:([A-Za-z]\w*)(?:\(([^()]+)\))?$/);
    keys.push(key);
    return `(${expression || '[^/]+'})`;
  }).join('');
  return {keys, expression: new RegExp(`^${pattern}$`)};
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
const substitute = (destination, params) => destination.replace(/:([A-Za-z]\w*)/g, (_, key) => params[key]);

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

// Mantiene el hash exacto del aviso de pantalla. Retira exclusivamente las
// excepciones de los servicios de Vercel que no se usan en Cloudflare.
export function cloudflareCsp(value) {
  return value.split('; ').map(directive => {
    if (directive.startsWith('frame-src ')) return "frame-src 'none'";
    return directive.replace(/ (?:https:\/\/vercel\.live|https:\/\/vitals\.vercel-insights\.com|wss:\/\/\*\.pusher\.com|https:\/\/\*\.pusher\.com)/g, '');
  }).join('; ');
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
