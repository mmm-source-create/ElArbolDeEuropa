import {useEffect, useRef, useState} from 'react';
import './motion.css';

// Hold to Confirm: an irreversible action needs a deliberate press. The ring
// fills while the pointer, Enter or Space is held; releasing early cancels.
// A timer decides the confirmation; animation frames only draw the ring, so a
// throttled background tab cannot change the outcome.
export default function HoldButton({onConfirm, children, label, duration = 800, disabled = false, className = ''}) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const frame = useRef(0);
  const timer = useRef(0);
  const started = useRef(0);
  const clear = () => { cancelAnimationFrame(frame.current); clearTimeout(timer.current); started.current = 0; };
  const stop = () => { if (!started.current) return; clear(); setProgress(0); };
  useEffect(() => clear, []);
  const start = () => {
    if (disabled || started.current) return;
    started.current = performance.now();
    const draw = now => {
      if (!started.current) return;
      setProgress(Math.min(1, (now - started.current) / duration));
      frame.current = requestAnimationFrame(draw);
    };
    frame.current = requestAnimationFrame(draw);
    timer.current = setTimeout(() => {
      clear();
      setProgress(1);
      setDone(true);
      setTimeout(() => { setDone(false); setProgress(0); }, 420);
      onConfirm();
    }, duration);
  };
  const onKey = event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    if (event.type === 'keydown' && !event.repeat) start();
    if (event.type === 'keyup') stop();
  };
  return <button type="button" className={`ui-hold${progress > 0 && progress < 1 ? ' is-holding' : ''}${done ? ' is-done' : ''} ${className}`}
    style={{'--hold': progress}} disabled={disabled} aria-label={label} title={label}
    onPointerDown={event => { try { event.currentTarget.setPointerCapture(event.pointerId); } catch { /* pointer already released */ } start(); }}
    onPointerUp={stop} onPointerCancel={stop}
    onKeyDown={onKey} onKeyUp={onKey} onContextMenu={event => event.preventDefault()}>
    <svg viewBox="0 0 20 20" aria-hidden="true"><circle className="ui-hold-track" cx="10" cy="10" r="8"/><circle className="ui-hold-fill" cx="10" cy="10" r="8"/></svg>
    {children}
  </button>;
}
