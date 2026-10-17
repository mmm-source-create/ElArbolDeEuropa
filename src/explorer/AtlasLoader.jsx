import AtlasSkeleton from './AtlasSkeleton.jsx';
import {useEffect, useState} from 'react';
import treeBaseUrl from '../generated/treeBase.json?url';
import {loadJsonAsset} from '../utils/loadAsset.js';
export const EMPTY_TREE_BASE = {gen:{}, rows:[], layout:{positions:{}, pairContacts:{},
  units:[], rowUnits:[], rowBands:[], rowHeights:[], width:1200, height:600}};
let explorerRequest;
function loadExplorer() {
  return explorerRequest ||= import('../Explorer.jsx').catch(error => {
    explorerRequest = null; throw error;
  });
}
export default function AtlasLoader(props) {
  const [Explorer, setExplorer] = useState(null);
  const [treeBase, setTreeBase] = useState(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setError(false);
    // Start independent downloads together. Keep the real Explorer mounted
    // while the tree arrives; .sk overlays its actual boxes.
    loadExplorer().then(module => { if (!cancelled) setExplorer(() => module.default); })
      .catch(() => { if (!cancelled) setError(true); });
    loadJsonAsset(treeBaseUrl).then(data => { if (!cancelled) setTreeBase(data); })
      .catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [attempt]);
  const retry = () => setAttempt(n => n + 1);
  if (!Explorer) return <AtlasSkeleton error={error} onRetry={retry}/>;
  return <Explorer {...props} treeBase={treeBase || EMPTY_TREE_BASE}
    loading={!treeBase && !error} loadError={error} onRetry={retry} ready={Boolean(treeBase) && !error}/>;
}
