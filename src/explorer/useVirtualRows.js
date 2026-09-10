import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { layoutRows, visibleRowRange } from './virtualRows.js';

export function useVirtualRows(rows, scrollRef, listRef, active) {
  const sizes = useRef(new Map()), nodes = useRef(new Map()), callbacks = useRef(new Map());
  const observer = useRef(null);
  const [version, setVersion] = useState(0);
  const [viewport, setViewport] = useState({ top: 0, height: 300 });
  const layout = useMemo(() => layoutRows(rows, sizes.current), [rows, version]);
  useLayoutEffect(() => {
    if (!active || !scrollRef.current || !listRef.current) return;
    const scroller = scrollRef.current, list = listRef.current;
    let frame;
    const measureViewport = () => {
      const top = scroller.scrollTop - list.offsetTop;
      setViewport(previous => previous.top === top && previous.height === scroller.clientHeight
        ? previous : { top, height: scroller.clientHeight });
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measureViewport); };
    observer.current = new ResizeObserver(entries => {
      let changed = false;
      for (const entry of entries) {
        const key = entry.target.dataset.timelineKey;
        if (!key) continue;
        const height = entry.target.getBoundingClientRect().height;
        if (height > 0 && Math.abs((sizes.current.get(key) || 0) - height) > 0.25) {
          sizes.current.set(key, height);
          changed = true;
        }
      }
      if (changed) setVersion(n => n + 1);
      schedule();
    });
    observer.current.observe(scroller);
    observer.current.observe(list);
    nodes.current.forEach(node => observer.current.observe(node));
    scroller.addEventListener('scroll', schedule, { passive: true });
    measureViewport();
    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener('scroll', schedule);
      observer.current?.disconnect();
      observer.current = null;
    };
  }, [active, scrollRef, listRef, rows]);

  const rowRef = key => {
    if (!callbacks.current.has(key)) callbacks.current.set(key, node => {
      const previous = nodes.current.get(key);
      if (previous) observer.current?.unobserve(previous);
      if (node) {
        nodes.current.set(key, node);
        observer.current?.observe(node);
      } else nodes.current.delete(key);
    });
    return callbacks.current.get(key);
  };
  const [start, end] = visibleRowRange(layout.items, viewport.top, viewport.height);
  return { ...layout, visible: layout.items.slice(start, end), rowRef };
}
