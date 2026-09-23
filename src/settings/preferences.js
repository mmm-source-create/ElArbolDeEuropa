export const PREFERENCES_KEY = 'eade.preferences.v1';
export const FAVORITES_KEY = 'arbol-europa-favoritos-v1';
export const STORY_PROGRESS_KEY = 'eade.storyProgress.v1';
export const CHALLENGE_KEYS = ['arbol-europa-desafio-v2', 'arbol-europa-desafio-v1'];

export const DEFAULT_PREFERENCES = Object.freeze({theme:'system', textSize:'normal', motion:'system'});
const choices = {theme:['system','light','dark'], textSize:['normal','large','larger'], motion:['system','reduce']};

export function cleanPreferences(value) {
  return Object.fromEntries(Object.entries(choices).map(([key, valid]) => [key, valid.includes(value?.[key]) ? value[key] : DEFAULT_PREFERENCES[key]]));
}

export function readPreferences(storage) {
  try { return cleanPreferences(JSON.parse(storage.getItem(PREFERENCES_KEY))); }
  catch { return {...DEFAULT_PREFERENCES}; }
}

export function applyPreferences(preferences, doc = document, win = window) {
  const value=cleanPreferences(preferences);
  const dark=value.theme==='dark'||value.theme==='system'&&win.matchMedia?.('(prefers-color-scheme: dark)').matches;
  doc.documentElement.dataset.eadeTheme=dark?'dark':'light';
  doc.documentElement.dataset.eadeTextSize=value.textSize;
  doc.documentElement.dataset.eadeMotion=value.motion;
  return value;
}

export function savePreferences(storage, preferences) {
  const value=cleanPreferences(preferences);
  try { storage.setItem(PREFERENCES_KEY,JSON.stringify(value)); } catch { /* Preferences still work for this visit. */ }
  return value;
}

export function clearLocalData(storage, kind) {
  const keys=kind==='favorites'?[FAVORITES_KEY]:kind==='progress'?[STORY_PROGRESS_KEY,...CHALLENGE_KEYS]:[];
  for(const key of keys)storage.removeItem(key);
  return keys.length;
}
