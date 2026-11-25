// One pattern per combination of colours and authority kind. 6.2.4: a cell with
// several attributions keeps its dispute, fief or tributary sign on top of the
// colour bands (the bands alone used to replace it), and a tributary keeps its
// overlord's tint instead of fading to white.
export function authorityFill(svg, colorOrColors, kind) {
  const colors = [...new Set([colorOrColors].flat().filter(Boolean))];
  const marked = AUTHORITY_MARK_KINDS.has(kind);
  if (colors.length < 2 && !marked) return colors[0];
  const id = `atlas-${marked ? kind : 'mosaic'}-${colors.join('-').replace(/[^a-z0-9-]/gi, '')}`;
  if (!svg.getElementById(id)) {
    const defs = svg.querySelector('#map defs') || svg.querySelector('defs');
    defs?.append(authorityPattern(id, colors, marked ? kind : null));
  }
  return `url(#${id})`;
}
const AUTHORITY_MARK_KINDS = new Set(['delegated', 'disputed', 'mixed', 'tributary', 'apanage', 'feudal', 'vassal', 'fief']);
const SVG_NS = 'http://www.w3.org/2000/svg';
const CELL = 0.9;
function svgElement(name, attributes) {
  const element = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, String(value));
  return element;
}
// The geometry is shared with the legend keys and the tests (authorityPatternSpec).
export function authorityPatternSpec(colors, kind) {
  const tile = colors.length > 1 ? CELL * 2 : CELL;
  const shapes = [];
  if (colors.length > 1) {
    // Diagonal bands that tile seamlessly: band i covers (x + y) mod tile in
    // [i, i + 1) · tile / n. Drawn unrotated so the marks stay upright.
    const width = tile / colors.length;
    colors.forEach((fill, i) => {
      for (let k = -1; k <= 2; k++) {
        const a = i * width + k * tile, b = a + width;
        shapes.push({name: 'polygon', points: `${a},0 ${b},0 ${b - 2 * tile},${2 * tile} ${a - 2 * tile},${2 * tile}`, fill});
      }
    });
  } else shapes.push({name: 'rect', width: tile, height: tile, fill: colors[0]});
  if (kind === 'tributary') shapes.push({name: 'rect', width: tile, height: tile, fill: '#fff', 'fill-opacity': '.26'});
  const line = kind === 'mixed' ? 'M0 .45 L.9 .45' : ['apanage', 'feudal', 'vassal', 'fief'].includes(kind) ? 'M.45 0 L.45 .9'
    : kind === 'delegated' ? 'M0 0 L.9 .9' : kind === 'disputed' ? 'M0 0 L.9 .9 M0 .9 L.9 0' : null;
  // 6.0.14: dark marks read on light and dark themes alike.
  for (let x = 0; x < tile - 1e-9; x += CELL) for (let y = 0; y < tile - 1e-9; y += CELL) {
    if (line) shapes.push({name: 'path', d: line, transform: `translate(${x} ${y})`, stroke: '#1b1712', 'stroke-opacity': '.34', 'stroke-width': '.16', fill: 'none'});
    if (kind === 'tributary') shapes.push({name: 'circle', cx: x + .45, cy: y + .45, r: '.15', fill: '#1b1712', 'fill-opacity': '.42'});
  }
  return {tile, shapes};
}
function authorityPattern(id, colors, kind) {
  const {tile, shapes} = authorityPatternSpec(colors, kind);
  const pattern = svgElement('pattern', {id, width: tile, height: tile, patternUnits: 'userSpaceOnUse'});
  for (const {name, ...attributes} of shapes) pattern.append(svgElement(name, attributes));
  return pattern;
}
