import {createHash} from 'node:crypto';

export function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort()
    .filter(key => value[key] !== undefined).map(key => [key, canonical(value[key])]));
  return value;
}
export const canonicalJson = value => JSON.stringify(canonical(value));
export const digest = value => createHash('sha256').update(canonicalJson(value)).digest('hex');
