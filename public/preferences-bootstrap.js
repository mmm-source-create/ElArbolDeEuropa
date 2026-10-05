(() => {
  const root = document.documentElement;
  const defaults = { theme: 'system', textSize: 'normal', motion: 'system', treeView: 'visual' };
  let preferences = defaults;
  try {
    const stored = JSON.parse(localStorage.getItem('eade.preferences.v1'));
    if (stored && typeof stored === 'object') preferences = { ...defaults, ...stored };
  } catch { /* Private browsing or malformed local settings use system defaults. */ }
  if (!['system', 'light', 'dark'].includes(preferences.theme)) preferences.theme = 'system';
  if (!['system', 'reduce'].includes(preferences.motion)) preferences.motion = 'system';
  const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const systemReduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  root.dataset.eadeTheme = preferences.theme === 'dark' || preferences.theme === 'system' && systemDark ? 'dark' : 'light';
  root.dataset.eadeTextSize = ['normal', 'large', 'larger'].includes(preferences.textSize) ? preferences.textSize : 'normal';
  root.dataset.eadeMotion = preferences.motion === 'reduce' || preferences.motion === 'system' && systemReduce ? 'reduce' : 'normal';
  root.dataset.eadeTreeView = preferences.treeView === 'list' ? 'list' : 'visual';
})();
