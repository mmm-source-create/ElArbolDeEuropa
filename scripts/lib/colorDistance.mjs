// CIE76 colour distance for hex and hsl() colours (map palette review, 6.0.12).
export const toRgb = color => {
  if (color.startsWith('#')) { const h = color.length === 4 ? [...color.slice(1)].map(c => c + c).join('') : color.slice(1); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); }
  const [h, s, l] = color.match(/[\d.]+/g).map(Number), S = s / 100, L = l / 100, a = S * Math.min(L, 1 - L);
  const f = n => { const k = (n + h / 30) % 12; return Math.round(255 * (L - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))); };
  return [f(0), f(8), f(4)];
};
export const toLab = ([r, g, b]) => {
  const f = c => { c /= 255; return c > .04045 ? ((c + .055) / 1.055) ** 2.4 : c / 12.92; };
  const [R, G, B] = [f(r), f(g), f(b)], t = v => v > .008856 ? Math.cbrt(v) : 7.787 * v + 16 / 116;
  const x = (R * .4124 + G * .3576 + B * .1805) / .95047, y = R * .2126 + G * .7152 + B * .0722, z = (R * .0193 + G * .1192 + B * .9505) / 1.08883;
  return [116 * t(y) - 16, 500 * (t(x) - t(y)), 200 * (t(y) - t(z))];
};
export const deltaE = (a, b) => Math.hypot(...toLab(toRgb(a)).map((v, i) => v - toLab(toRgb(b))[i]));
