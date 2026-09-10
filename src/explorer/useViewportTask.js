import { useCallback, useLayoutEffect, useRef, useState } from 'react';

// Queue intent, then resolve it against the latest committed layout. Different
// panels requested in the same interaction share one task. A later click wins.
export function useViewportTask(resolve, signature, scrollRefs) {
  const pending = useRef(null), latest = useRef({ resolve, signature });
  const [revision, setRevision] = useState(0);
  useLayoutEffect(() => { latest.current = { resolve, signature }; });
  const queue = useCallback(task => {
    pending.current = { ...pending.current, ...task };
    setRevision(n => n + 1);
  }, []);
  useLayoutEffect(() => {
    if (!pending.current) return;
    let frame, previous, stable = 0, samples = 0, passes = 0, applied = false;
    const cancel = () => { pending.current = null; cancelAnimationFrame(frame); };
    const elements = scrollRefs.map(ref => ref.current).filter(Boolean);
    elements.forEach(node => {
      node.addEventListener('wheel', cancel, { passive: true });
      node.addEventListener('pointerdown', cancel, { passive: true });
    });
    const settle = () => {
      if (!pending.current) return;
      const current = latest.current.signature(pending.current);
      stable = current === previous ? stable + 1 : 0;
      previous = current;
      if (stable >= 2 || ++samples >= 30) {
        // A jump reveals new rows whose heights arrive through ResizeObserver.
        // Continue until a settled pass no longer needs to adjust the scroll.
        const changed = latest.current.resolve(pending.current, applied);
        passes++;
        if ((applied && !changed) || passes >= 8) { pending.current = null; return; }
        applied = true;
        stable = 0;
        previous = undefined;
        samples = 0;
      }
      frame = requestAnimationFrame(settle);
    };
    frame = requestAnimationFrame(settle);
    return () => {
      cancelAnimationFrame(frame);
      elements.forEach(node => {
        node.removeEventListener('wheel', cancel);
        node.removeEventListener('pointerdown', cancel);
      });
    };
  }, [revision]);
  return queue;
}
