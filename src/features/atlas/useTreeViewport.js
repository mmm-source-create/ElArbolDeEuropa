import { useLayoutEffect, useState } from "react";
import { treeViewport } from "./treeViewport.js";

export function useTreeViewport(ref, zoom, active) {
  const [viewport, setViewport] = useState(null);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!active || !element) return;
    let frame;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setViewport(treeViewport(element, zoom)));
    };
    setViewport(treeViewport(element, zoom));
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    element.addEventListener("scroll", measure, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      element.removeEventListener("scroll", measure);
    };
  }, [ref, zoom, active]);
  return viewport;
}
