import {useEffect, useState} from 'react';

export default function useReducedMotion() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(document.documentElement.dataset.eadeMotion === 'reduce' || Boolean(media?.matches));
    update();
    media?.addEventListener('change', update);
    const observer = typeof MutationObserver === 'function' ? new MutationObserver(update) : null;
    observer?.observe(document.documentElement, {attributes: true, attributeFilter: ['data-eade-motion']});
    return () => { media?.removeEventListener('change', update); observer?.disconnect(); };
  }, []);
  return reduced;
}
