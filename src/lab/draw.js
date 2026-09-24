import { ACCENTS, getCategoriaDinastía } from '../explorer/model.js';

const pathCache = new Map();

export function scenePalette() {
  const css = getComputedStyle(document.documentElement);
  const dark = document.documentElement.dataset.eadeTheme === 'dark';
  return {
    background: css.getPropertyValue('--eade-paper-soft').trim() || '#fbf7ec',
    card: css.getPropertyValue('--eade-paper-bright').trim() || '#fffdf7',
    border: css.getPropertyValue('--eade-border').trim() || '#b9af98',
    ink: css.getPropertyValue('--eade-ink').trim() || '#2c2620',
    muted: css.getPropertyValue('--eade-muted').trim() || '#6b6350',
    line: dark ? '#9f9180' : '#b9af98',
    selected: dark ? '#48332e' : '#f4e7de',
    hover: dark ? '#424039' : '#f5efde',
    search: dark ? '#e5aaa2' : '#7a2e2e',
  };
}

export function boxAccent(box) {
  const color = ACCENTS[box.person?.dinastia] || ACCENTS[getCategoriaDinastía(box.person?.dinastia)];
  return typeof color === 'string' ? color : '#71717a';
}

export function drawScene(canvas, scene, camera, state) {
  if (!canvas || !scene) return { visible: 0, pixelRatio: 0 };
  const bounds = canvas.getBoundingClientRect();
  const width = Math.max(1, bounds.width), height = Math.max(1, bounds.height);
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const pixelWidth = Math.round(width * dpr), pixelHeight = Math.round(height * dpr);
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth; canvas.height = pixelHeight;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) return { visible: 0, pixelRatio: dpr };
  const color = scenePalette();
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = color.background;
  ctx.fillRect(0, 0, width, height);
  ctx.setTransform(dpr * camera.zoom, 0, 0, dpr * camera.zoom, -camera.x * dpr * camera.zoom, -camera.y * dpr * camera.zoom);
  ctx.strokeStyle = color.line;
  ctx.lineWidth = 1.15;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (const d of scene.paths) {
    let path = pathCache.get(d);
    if (!path) { path = new Path2D(d); pathCache.set(d, path); }
    ctx.stroke(path);
  }
  const right = camera.x + width / camera.zoom, bottom = camera.y + height / camera.zoom;
  let visible = 0;
  for (const box of scene.boxes) {
    if (box.x > right || box.x + box.w < camera.x || box.y > bottom || box.y + box.h < camera.y) continue;
    visible++;
    const { x, y, w, h, person } = box;
    ctx.fillStyle = state.selected === box.id ? color.selected : state.hovered === box.id ? color.hover : color.card;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = state.search === box.id ? color.search : color.border;
    ctx.lineWidth = state.search === box.id ? 2 : 1;
    ctx.strokeRect(x + .5, y + .5, w - 1, h - 1);
    ctx.fillStyle = boxAccent(box);
    ctx.fillRect(x, y, 6, h);
    ctx.save();
    ctx.beginPath(); ctx.rect(x + 11, y + 2, w - 17, h - 4); ctx.clip();
    ctx.fillStyle = color.ink;
    ctx.font = '600 12px system-ui, sans-serif';
    ctx.fillText(person.nombre, x + 14, y + 24, w - 22);
    ctx.fillStyle = color.muted;
    ctx.font = '10px system-ui, sans-serif';
    ctx.fillText(`${person.titulo || ''} · ${(person.reinos || []).slice(0, 2).join(' · ')}`, x + 14, y + 43, w - 22);
    ctx.restore();
    ctx.setTransform(dpr * camera.zoom, 0, 0, dpr * camera.zoom, -camera.x * dpr * camera.zoom, -camera.y * dpr * camera.zoom);
  }
  return { visible, pixelRatio: dpr };
}

function escapeXml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&apos;' })[character]);
}

export function viewportSvg(scene, camera, width, height, state) {
  const color = scenePalette();
  const visible = scene.boxes.filter(box => box.x < camera.x + width / camera.zoom && box.x + box.w > camera.x && box.y < camera.y + height / camera.zoom && box.y + box.h > camera.y);
  const lines = scene.paths.map(d => `<path d="${escapeXml(d)}" fill="none" stroke="${color.line}" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
  const cards = visible.map(box => `<g><rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" fill="${state.selected === box.id ? color.selected : color.card}" stroke="${color.border}"/><rect x="${box.x}" y="${box.y}" width="6" height="${box.h}" fill="${boxAccent(box)}"/><text x="${box.x+14}" y="${box.y+24}" font-family="system-ui,sans-serif" font-size="12" font-weight="600" fill="${color.ink}">${escapeXml(box.person.nombre)}</text><text x="${box.x+14}" y="${box.y+43}" font-family="system-ui,sans-serif" font-size="10" fill="${color.muted}">${escapeXml(box.person.titulo || '')}</text></g>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${camera.x} ${camera.y} ${width/camera.zoom} ${height/camera.zoom}"><rect x="${camera.x}" y="${camera.y}" width="${width/camera.zoom}" height="${height/camera.zoom}" fill="${color.background}"/>${lines}${cards}</svg>`;
}
