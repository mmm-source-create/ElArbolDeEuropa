// Lossless transport for embedded page data. Keys and long repeated strings
// are shared within one page; the application still receives the full record.
const FORMAT = 'eade-page-1';
// A colon cannot occur in a dictionary reference (~ plus base-36 digits),
// and literal strings beginning with ~ are escaped before reaching the wire.
const OBJECT = '~:';
export function packPage(page) {
  const plain = JSON.stringify(page);
  page = JSON.parse(plain);
  const counts = new Map(), keys = new Set();
  const count = value => {
    if (typeof value === 'string') counts.set(value, (counts.get(value) || 0) + 1);
    else if (Array.isArray(value)) value.forEach(count);
    else if (value && typeof value === 'object') for (const [key, entry] of Object.entries(value)) { keys.add(key); count(entry); }
  };
  count(page);
  const strings = [...new Set([...keys, ...[...counts].filter(([value, n]) => n > 1 && value.length >= 24).map(([value]) => value)])];
  const ids = new Map(strings.map((value, i) => [value, i]));
  const encode = value => {
    if (typeof value === 'string') return ids.has(value) ? `~${ids.get(value).toString(36)}` : value.startsWith('~') ? `~${value}` : value;
    if (Array.isArray(value)) return value.map(encode);
    if (value && typeof value === 'object') return [OBJECT, ...Object.entries(value).flatMap(([key, entry]) => [ids.get(key), encode(entry)])];
    return value;
  };
  const packed = {format: FORMAT, strings, value: encode(page)};
  return JSON.stringify(packed).length < plain.length ? packed : page;
}

export function unpackPage(payload) {
  if (payload?.format !== FORMAT) return payload;
  const {strings} = payload;
  if (!Array.isArray(strings) || !strings.every(value => typeof value === 'string')) throw new Error('Invalid page dictionary');
  const stringAt = id => {
    if (!Number.isSafeInteger(id) || id < 0 || id >= strings.length) throw new Error('Invalid page reference');
    return strings[id];
  };
  const decode = (value, depth = 0) => {
    if (depth > 100) throw new Error('Page nesting limit');
    if (typeof value === 'string') {
      if (value.startsWith('~~')) return value.slice(1);
      if (/^~[0-9a-z]+$/.test(value)) return stringAt(parseInt(value.slice(1), 36));
      return value;
    }
    if (!Array.isArray(value)) return value;
    if (value[0] !== OBJECT) return value.map(entry => decode(entry, depth + 1));
    if (value.length % 2 !== 1) throw new Error('Invalid page object');
    const entries = [];
    for (let i = 1; i < value.length; i += 2) entries.push([stringAt(value[i]), decode(value[i + 1], depth + 1)]);
    if (new Set(entries.map(([key]) => key)).size !== entries.length) throw new Error('Duplicate page key');
    return Object.fromEntries(entries);
  };
  return decode(payload.value);
}

export const parsePage = text => unpackPage(JSON.parse(text));
