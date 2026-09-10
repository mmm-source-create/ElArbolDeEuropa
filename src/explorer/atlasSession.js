export const ATLAS_SESSION_KEY = 'eade.atlasSession.v29';
const arrayFields = ['territorios', 'dinastias', 'titulos', 'siglos', 'relaciones', 'collapsedIds', 'dinastiasExpandidas', 'territoriosExpandidos'];
const stringFields = ['query', 'selectedId', 'origen', 'destino', 'focoId', 'eventoSeleccionadoId', 'historiaActivaId'];
const strings = values => Array.isArray(values) ? [...new Set(values.filter(v => typeof v === 'string' && v.length < 500))].slice(0, 3000) : [];
const finite = (v, fallback, min, max) => typeof v === 'number' && Number.isFinite(v) ? Math.max(min, Math.min(max, v)) : fallback;

export function sanitizeSession(value, nested = false) {
  if (!value || value.version !== 1 || typeof value !== 'object') return null;
  const out = { version: 1 };
  for (const field of arrayFields) out[field] = strings(value[field]);
  for (const field of stringFields) out[field] = typeof value[field] === 'string' ? value[field].slice(0, 500) : null;
  out.query ||= '';
  out.zoom = finite(value.zoom, 0.8, 0.4, 1.4);
  out.anioGlobal = finite(value.anioGlobal, null, 0, 3000);
  out.timelineScaleIndex = Math.floor(finite(value.timelineScaleIndex, 1, 0, 10));
  out.historiaPasoIndex = Math.floor(finite(value.historiaPasoIndex, 0, 0, 1000));
  out.currentSearchIndex = Math.floor(finite(value.currentSearchIndex, 0, -1, 3000));
  for (const [key, options, fallback] of [
    ['mode', ['view','compare','foco'], 'view'], ['timelineMode', ['personas','eventos','ambos'], 'personas'],
    ['modoComparacion', ['corto','sangre','matrimonio','rutas'], 'corto'], ['focoAlcance', ['cercana','ascendencia','descendencia'], 'cercana'],
  ]) out[key] = options.includes(value[key]) ? value[key] : fallback;
  out.soloFavoritos = value.soloFavoritos === true;
  out.vistasActivas = { arbol: value.vistasActivas?.arbol !== false, mapa: value.vistasActivas?.mapa !== false };
  if (!out.vistasActivas.arbol && !out.vistasActivas.mapa) out.vistasActivas.arbol = true;
  out.panelesVisibles = Object.fromEntries(['filtros','biografia','cronologia'].map(k => [k, value.panelesVisibles?.[k] !== false]));
  for (const [field, keys] of [['treeCenter',['x','y']],['timelineScroll',['left','top']]]) {
    if (keys.every(k => Number.isFinite(value[field]?.[k]) && value[field][k] >= 0)) out[field] = Object.fromEntries(keys.map(k => [k, Math.min(1e7, value[field][k])]));
  }
  if (typeof value.timelineAnchor?.key === 'string' && Number.isFinite(value.timelineAnchor.offset)) out.timelineAnchor = { key: value.timelineAnchor.key.slice(0, 500), offset: value.timelineAnchor.offset };
  if (['x','y','width','height'].every(k => Number.isFinite(value.mapViewport?.[k])) && value.mapViewport.width > 0 && value.mapViewport.height > 0) out.mapViewport = value.mapViewport;
  if (Array.isArray(value.personHistory?.ids)) {
    const ids = value.personHistory.ids.filter(v => typeof v === 'string').slice(-60);
    out.personHistory = { ids, index: Math.floor(finite(value.personHistory.index, ids.length - 1, -1, ids.length - 1)) };
  }
  if (!nested && value.historiaSnapshot) {
    const snapshot = value.historiaSnapshot;
    const clean = sanitizeSession({ ...snapshot, selectedId: snapshot.seleccionId, version: 1 }, true);
    out.historiaSnapshot = { ...clean, seleccionId: clean.selectedId,
      compareRouteIndex: Math.floor(finite(snapshot.compareRouteIndex, 0, 0, 100)),
      rutaAnterior: typeof snapshot.rutaAnterior === 'string' && /^\/es(?:\/|\?|$)/.test(snapshot.rutaAnterior) ? snapshot.rutaAnterior : '/es/?atlas=1',
      historiaAbiertaDesdeEnlace: snapshot.historiaAbiertaDesdeEnlace === true,
    };
  }
  return out;
}

export function shouldResumeAtlas(href) {
  const url = new URL(href, 'https://treeofeurope.eu');
  return /^\/es\/?$/.test(url.pathname) && url.searchParams.get('continuar') === '1'
    && !['persona','territorio','territorios','dinastia','dinastias','titulo','titulos','siglo','siglos','relaciones','vista','q','anio','historia'].some(k => url.searchParams.has(k));
}

export function readAtlasSession(storage) {
  try { return sanitizeSession(JSON.parse(storage.getItem(ATLAS_SESSION_KEY))); }
  catch { return null; }
}

export function writeAtlasSession(storage, session) {
  try { storage.setItem(ATLAS_SESSION_KEY, JSON.stringify(sanitizeSession({ ...session, version: 1 }))); }
  catch { /* Browsing remains available when storage is blocked or full. */ }
}
