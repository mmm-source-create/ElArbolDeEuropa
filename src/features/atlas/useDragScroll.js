import { useRef } from "react";

// Arrastrar con el puntero desplaza el contenedor desplazable (lienzo del árbol).
export function useDragScroll(scrollRef) {
  const dragState = useRef(null);
  const onPointerDown = (e) => { dragState.current = { startX: e.clientX, startY: e.clientY, scrollLeft: scrollRef.current.scrollLeft, scrollTop: scrollRef.current.scrollTop }; };
  const onPointerMove = (e) => {
    if (!dragState.current) return;
    scrollRef.current.scrollLeft = dragState.current.scrollLeft - (e.clientX - dragState.current.startX);
    scrollRef.current.scrollTop = dragState.current.scrollTop - (e.clientY - dragState.current.startY);
  };
  const endDrag = () => (dragState.current = null);
  return { onPointerDown, onPointerMove, endDrag };
}
