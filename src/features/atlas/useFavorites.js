import { useEffect, useMemo, useState } from "react";
import { BY_ID } from "../../domain/genealogy/relations.js";
import { FAVORITOS_STORAGE_KEY } from "./atlasModel.js";

// Personas favoritas del Atlas, guardadas en localStorage.
export function useFavorites() {
  const [favoritos, setFavoritos] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const guardados = JSON.parse(window.localStorage.getItem(FAVORITOS_STORAGE_KEY) || "[]");
      return Array.isArray(guardados) ? guardados.filter((id) => BY_ID[id]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(FAVORITOS_STORAGE_KEY, JSON.stringify(favoritos));
    } catch {
      // El almacenamiento local puede estar bloqueado por el navegador.
    }
  }, [favoritos]);

  const favoritosSet = useMemo(() => new Set(favoritos), [favoritos]);
  const alternarFavorito = (id) => {
    if (!BY_ID[id]) return;
    setFavoritos((actuales) => actuales.includes(id) ? actuales.filter((valor) => valor !== id) : [...actuales, id]);
  };

  return { favoritos, setFavoritos, favoritosSet, alternarFavorito };
}
