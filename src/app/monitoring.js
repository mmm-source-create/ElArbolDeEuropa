import {injectSpeedInsights} from '@vercel/speed-insights';

// Los filtros, las búsquedas y las semillas de los desafíos no son métricas.
export function metricWithoutParameters(event) {
  try {
    const url = new URL(event.url);
    if (!['https:', 'http:'].includes(url.protocol)) return null;
    return {...event, url: `${url.origin}${url.pathname}`};
  } catch { return null; }
}

export function startSpeedInsights() {
  // El SDK evita insertar el script una segunda vez. Fuera del árbol React,
  // cubre tanto la hidratación SSG como el arranque dinámico y StrictMode.
  return injectSpeedInsights({framework: 'react', beforeSend: metricWithoutParameters});
}
