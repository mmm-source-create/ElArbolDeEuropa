import React, { useEffect, useState } from "react";
import treeBaseUrl from "../generated/treeBase.json?url";
import { loadJsonAsset } from "../utils/loadAsset.js";

let atlasRequest;
function loadAtlas() {
  if (!atlasRequest) {
    atlasRequest = Promise.all([
      import("../Explorer.jsx"),
      loadJsonAsset(treeBaseUrl),
    ]).then(([module, treeBase]) => ({ Explorer: module.default, treeBase }))
      .catch(error => { atlasRequest = null; throw error; });
  }
  return atlasRequest;
}

export default function AtlasLoader(props) {
  const [atlas, setAtlas] = useState(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setError(false);
    loadAtlas().then(result => { if (!cancelled) setAtlas(result); })
      .catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [attempt]);
  if (atlas) return <atlas.Explorer {...props} treeBase={atlas.treeBase} />;
  return <div style={{ padding: 24 }} role={error ? "alert" : "status"}>
    {error ? <>No se ha podido cargar el Atlas. <button className="nav-btn" onClick={() => setAttempt(n => n + 1)}>Reintentar</button></> : "Cargando Atlas…"}
  </div>;
}
