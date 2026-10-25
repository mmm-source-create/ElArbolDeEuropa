import { useCallback, useEffect, useState } from "react";
import { PANELES_STORAGE_KEY } from "./atlasModel.js";

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
  const [panelesVisibles, setPanelesVisibles] = useState(() => {
    const base = savedSession?.panelesVisibles ?? { filtros: atlasIds === null, biografia: true, cronologia: true };
    if (typeof window === "undefined") return base;
    try {
      const guardado = JSON.parse(window.localStorage.getItem(PANELES_STORAGE_KEY) || "null");
      return {
        filtros: typeof guardado?.filtros === "boolean" ? guardado.filtros : base.filtros,
        biografia: typeof guardado?.biografia === "boolean" ? guardado.biografia : base.biografia,
        cronologia: typeof guardado?.cronologia === "boolean" ? guardado.cronologia : base.cronologia,
      };
    } catch {
      return base;
    }
  });
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
      window.localStorage.setItem(PANELES_STORAGE_KEY, JSON.stringify(panelesVisibles));
    } catch {
      // La disposición puede seguir funcionando aunque localStorage esté bloqueado.
    }
  }, [panelesVisibles]);

  const alternarPanelAuxiliar = useCallback((panel) => {
    setPanelesVisibles((actuales) => ({ ...actuales, [panel]: !actuales[panel] }));
  }, []);

  const alternarSeccionFiltro = useCallback((seccion) => {
    setFilterSectionsOpen((actuales) => ({ ...actuales, [seccion]: !actuales[seccion] }));
  }, []);

  const alternarSeccionBio = useCallback((seccion) => {
    setBioSectionsOpen((actuales) => ({ ...actuales, [seccion]: !actuales[seccion] }));
  }, []);

  return { panelesVisibles, filterSectionsOpen, bioSectionsOpen, alternarPanelAuxiliar, alternarSeccionFiltro, alternarSeccionBio };
}
