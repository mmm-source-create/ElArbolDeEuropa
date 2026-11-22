import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { PANELES_STORAGE_KEY } from "./atlasModel.js";
import { MOBILE_ATLAS_QUERY, readPanelLayout } from './panelLayout.js';

const MOBILE_PANELS_KEY = `${PANELES_STORAGE_KEY}.mobile`;
const isMobile = () => typeof window !== 'undefined' && Boolean(window.matchMedia?.(MOBILE_ATLAS_QUERY).matches);
const subscribeViewport = (notify) => {
  const media = window.matchMedia?.(MOBILE_ATLAS_QUERY);
  media?.addEventListener('change', notify);
  return () => media?.removeEventListener('change', notify);
};
const serverViewport = () => false;
export const useAtlasMobile = () => useSyncExternalStore(subscribeViewport, isMobile, serverViewport);

const ATLAS_LAYOUT_STORAGE_KEY = "eade.atlasLayout.v24";
const DEFAULT_FILTER_SECTIONS = Object.freeze({
  territorios: true,
  dinastias: true,
  titulos: true,
  siglos: true,
  relaciones: true,
  evidencia: false,
});
const DEFAULT_BIO_SECTIONS = Object.freeze({
  datos: true,
  relaciones: true,
  contexto: false,
});

function leerLayoutAtlas() {
  if (typeof window === "undefined") return null;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(ATLAS_LAYOUT_STORAGE_KEY) || "null");
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

const seccionesGuardadas = (guardado = {}, defectos) => Object.fromEntries(Object.entries(defectos).map(([key, value]) => [
  key,
  typeof guardado[key] === "boolean" ? guardado[key] : value,
]));

// Paneles visibles y secciones abiertas del Atlas, recordados entre visitas.
export function useAtlasLayout(savedSession, atlasIds) {
  const mobile = useAtlasMobile();
  const [panelLayouts, setPanelLayouts] = useState(() => {
    const base = savedSession?.panelesVisibles ?? { filtros: atlasIds === null, biografia: true, cronologia: true };
    let storage;
    try { storage = window.localStorage; } catch { /* Private browsing. */ }
    return {
      desktop: readPanelLayout(storage, PANELES_STORAGE_KEY, base),
      mobile: readPanelLayout(storage, MOBILE_PANELS_KEY, {filtros: false, biografia: true, cronologia: false}),
    };
  });
  const panelesVisibles = panelLayouts[mobile ? 'mobile' : 'desktop'];
  const [filterSectionsOpen, setFilterSectionsOpen] = useState(() => seccionesGuardadas(leerLayoutAtlas()?.filterSectionsOpen, DEFAULT_FILTER_SECTIONS));
  const [bioSectionsOpen, setBioSectionsOpen] = useState(() => seccionesGuardadas(leerLayoutAtlas()?.bioSectionsOpen, DEFAULT_BIO_SECTIONS));

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(ATLAS_LAYOUT_STORAGE_KEY, JSON.stringify({
        filterSectionsOpen,
        bioSectionsOpen,
      }));
    } catch {
      // El Atlas sigue funcionando aunque el navegador bloquee localStorage.
    }
  }, [filterSectionsOpen, bioSectionsOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(PANELES_STORAGE_KEY, JSON.stringify(panelLayouts.desktop));
      window.localStorage.setItem(MOBILE_PANELS_KEY, JSON.stringify(panelLayouts.mobile));
    } catch {
      // La disposición puede seguir funcionando aunque localStorage esté bloqueado.
    }
  }, [panelLayouts]);

  const alternarPanelAuxiliar = useCallback((panel) => {
    if (!['filtros', 'biografia', 'cronologia'].includes(panel)) return;
    const device = mobile ? 'mobile' : 'desktop';
    setPanelLayouts(layouts => ({...layouts, [device]: {...layouts[device], [panel]: !layouts[device][panel]}}));
  }, [mobile]);

  const alternarSeccionFiltro = useCallback((seccion) => {
    setFilterSectionsOpen((actuales) => ({ ...actuales, [seccion]: !actuales[seccion] }));
  }, []);

  const alternarSeccionBio = useCallback((seccion) => {
    setBioSectionsOpen((actuales) => ({ ...actuales, [seccion]: !actuales[seccion] }));
  }, []);

  return { panelesVisibles, filterSectionsOpen, bioSectionsOpen, alternarPanelAuxiliar, alternarSeccionFiltro, alternarSeccionBio };
}
