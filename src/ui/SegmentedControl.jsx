import React, {useEffect, useRef, useState} from 'react';
import './motion.css';

export default function SegmentedControl({options, value, onChange, label, id, tabs = false, current, className = ''}) {
  const root = useRef(null);
  const buttons = useRef(new Map());
  const [position, setPosition] = useState(null);
  useEffect(() => {
    const update = () => {
      const active = buttons.current.get(value);
      if (active) setPosition({left: active.offsetLeft, width: active.offsetWidth});
    };
    update();
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(update) : null;
    observer?.observe(root.current);
    window.addEventListener('resize', update);
    return () => {observer?.disconnect(); window.removeEventListener('resize', update);};
  }, [value, options]);
  const onKeyDown = event => {
    const focused = options.findIndex(option => buttons.current.get(option.value) === event.target);
    const current = focused >= 0 ? focused : options.findIndex(option => option.value === value);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1
      : ['ArrowRight', 'ArrowDown'].includes(event.key) ? (current + 1) % options.length
      : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? (current - 1 + options.length) % options.length : null;
    if (next === null) return;
    event.preventDefault();
    onChange(options[next].value);
    buttons.current.get(options[next].value)?.focus();
  };
  return <div ref={root} className={`ui-segments ${className}`} role={tabs ? 'tablist' : 'group'} aria-label={label} onKeyDown={onKeyDown}>
    {position && <span className="ui-segments-indicator" aria-hidden="true" style={position}/>}
    {options.map(option => <button key={option.value} ref={node => {if (node) buttons.current.set(option.value, node); else buttons.current.delete(option.value);}}
      type="button" role={tabs ? 'tab' : undefined} id={tabs ? `${id}-tab-${option.value}` : undefined}
      aria-controls={tabs ? `${id}-panel-${option.value}` : option.controls}
      aria-selected={tabs ? value === option.value : undefined} aria-pressed={!tabs && !current ? value === option.value : undefined} aria-current={current && value === option.value ? current : undefined}
      tabIndex={tabs && value !== option.value ? -1 : 0} className={value === option.value ? 'is-active' : ''}
      onClick={() => onChange(option.value)}>{option.label}</button>)}
  </div>;
}
