export const MOBILE_ATLAS_QUERY = '(max-width: 700px)';

// A desktop preference must not open a column above the tree on a phone.
export function readPanelLayout(storage, key, defaults) {
  try {
    const saved = JSON.parse(storage?.getItem(key) || 'null');
    return Object.fromEntries(Object.entries(defaults).map(([panel, value]) => [
      panel, typeof saved?.[panel] === 'boolean' ? saved[panel] : value,
    ]));
  } catch { return {...defaults}; }
}
