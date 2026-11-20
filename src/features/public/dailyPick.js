// 6.0.10: the person of the day. The same date gives the same person in every
// browser; the date follows Madrid time, where the project is published.
export function todayKey(date = new Date()) {
  try { return date.toLocaleDateString('sv-SE', {timeZone: 'Europe/Madrid'}); }
  catch { return date.toISOString().slice(0, 10); }
}

// FNV-1a: a stable, evenly spread index for a date string.
export function dailyIndex(key, count) {
  if (!count) return -1;
  let hash = 2166136261;
  for (const char of String(key)) { hash ^= char.codePointAt(0); hash = Math.imul(hash, 16777619) >>> 0; }
  return hash % count;
}

export const pickOfTheDay = (items, key = todayKey()) => items?.length ? items[dailyIndex(key, items.length)] : null;
