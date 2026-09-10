import { useEffect, useLayoutEffect, useRef } from 'react';
import { writeAtlasSession } from './atlasSession.js';

export function useAtlasSession(state, scrollRef, timelineRef, captureExtra) {
  const latest = useRef({ state, captureExtra });
  const lastPositions = useRef({ treeCenter: state.treeCenter, timelineScroll: state.timelineScroll, timelineAnchor: state.timelineAnchor });
  useLayoutEffect(() => { latest.current = { state, captureExtra }; });
  const save = () => {
    const { state: current, captureExtra: extra } = latest.current;
    const tree = scrollRef.current, timeline = timelineRef.current;
    try {
      lastPositions.current = {
        ...lastPositions.current,
        ...(tree ? { treeCenter: { x: (tree.scrollLeft + tree.clientWidth / 2) / current.zoom, y: (tree.scrollTop + tree.clientHeight / 2) / current.zoom } } : {}),
        ...(timeline ? { timelineScroll: { left: timeline.scrollLeft, top: timeline.scrollTop } } : {}),
        ...extra(),
      };
      writeAtlasSession(window.sessionStorage, { ...current, ...lastPositions.current });
    } catch { /* sessionStorage may be unavailable. */ }
  };
  useEffect(() => {
    const timer = setTimeout(save, 180);
    return () => clearTimeout(timer);
  }, [state]);
  useEffect(() => {
    let timer;
    const schedule = () => { clearTimeout(timer); timer = setTimeout(save, 180); };
    const scrollers = [scrollRef.current, timelineRef.current].filter(Boolean);
    scrollers.forEach(node => node.addEventListener('scroll', schedule, { passive: true }));
    window.addEventListener('pagehide', save);
    // Save before normal links navigate, including a fast click after selection.
    document.addEventListener('click', save, true);
    return () => {
      clearTimeout(timer);
      scrollers.forEach(node => node.removeEventListener('scroll', schedule));
      window.removeEventListener('pagehide', save);
      document.removeEventListener('click', save, true);
    };
  }, [state.vistasActivas.arbol, state.panelesVisibles.cronologia]);
}
