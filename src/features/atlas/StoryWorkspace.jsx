import {useEffect,useRef,useState} from 'react';

// The guide takes its own row: zooming and panning never place a card behind it.
export default function StoryWorkspace({active,children}) {
 const ref=useRef(null),[top,setTop]=useState(240);
 useEffect(()=>{
  if(!active)return;
  const measure=()=>setTop(Math.max(0,Math.round(ref.current.getBoundingClientRect().top+window.scrollY)));
  measure();
  const observer=typeof ResizeObserver==='function'?new ResizeObserver(measure):null;
  observer?.observe(ref.current.parentElement);
  window.addEventListener('resize',measure);
  return ()=>{observer?.disconnect();window.removeEventListener('resize',measure);};
 },[active]);
 return <div ref={ref} className={active?'story-workspace':undefined} style={active?{'--story-workspace-top':`${top}px`}:undefined}>{children}</div>;
}
