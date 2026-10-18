import { useCallback, useEffect, useRef, useState } from "react";

// Mensaje breve tras compartir o copiar un enlace; desaparece solo.
export function useShareStatus(duracion = 2600) {
  const [shareStatus, setShareStatus] = useState("");
  const timerRef = useRef(null);
  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);
  const mostrarEstadoCompartir = useCallback((mensaje) => {
    setShareStatus(mensaje);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setShareStatus(""), duracion);
  }, [duracion]);
  return [shareStatus, mostrarEstadoCompartir];
}
