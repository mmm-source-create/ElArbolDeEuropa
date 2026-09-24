import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import treeBaseUrl from '../generated/treeBase.json?url';
import { loadJsonAsset } from '../utils/loadAsset.js';
import { PERSONAS } from '../personas.jsx';
import { HISTORIAS } from '../historiaData.jsx';
import { HIJOS_POR_ID } from '../explorer/model.js';
import { LAB_SIZES, buildScene, hitTest, relatedIds, screenToWorld, visibleBoxes } from './scene.js';
import { boxAccent, drawScene, viewportSvg } from './draw.js';
import './lab.css';

const frame = () => new Promise(resolve => requestAnimationFrame(resolve));
async function painted() { await frame(); await frame(); }
const percentile = (items, fraction) => [...items].sort((a,b) => a-b)[Math.floor((items.length-1)*fraction)] || 0;

function saveFile(blob, name) {
  const url = URL.createObjectURL(blob), anchor = document.createElement('a');
  anchor.href = url; anchor.download = name; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function RendererLab() {
  const [base, setBase] = useState(null);
  const [error, setError] = useState('');
  const [size, setSize] = useState(14);
  const [renderer, setRenderer] = useState('html');
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 });
  const [dimensions, setDimensions] = useState({ width: 900, height: 460 });
  const [selected, setSelected] = useState('CARLOS5');
  const [hovered, setHovered] = useState(null);
  const [query, setQuery] = useState('');
  const [year, setYear] = useState(1500);
  const [chapter, setChapter] = useState(0);
  const [firstPaint, setFirstPaint] = useState(null);
  const [mountedNodes, setMountedNodes] = useState(0);
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const stage = useRef(null), canvas = useRef(null), drag = useRef(null), lastDraw = useRef(0);
  const chapterSteps = HISTORIAS.find(story => story.id === 'borgona')?.pasos || [];

  useEffect(() => {
    let cancelled = false;
    loadJsonAsset(treeBaseUrl).then(data => { if (!cancelled) setBase(data); })
      .catch(() => { if (!cancelled) setError('No se pudo cargar la disposición del árbol.'); });
    return () => { cancelled = true; };
  }, []);
  useEffect(() => {
    if (!stage.current) return undefined;
    const observer = new ResizeObserver(([entry]) => setDimensions({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, [base]);

  const ids = useMemo(() => relatedIds(PERSONAS, size), [size]);
  const scene = useMemo(() => base ? buildScene(base, PERSONAS, ids, HIJOS_POR_ID) : null, [base, ids]);
  const visible = useMemo(() => scene ? visibleBoxes(scene.boxes, camera, dimensions.width, dimensions.height) : [], [scene, camera, dimensions]);
  const searchBox = useMemo(() => query.trim() ? scene?.boxes.find(box => box.person.nombre.toLocaleLowerCase('es').includes(query.trim().toLocaleLowerCase('es'))) : null, [scene, query]);

  useEffect(() => {
    document.title = 'Laboratorio de renderizado · El Árbol de Europa';
    const robots = document.querySelector('meta[name="robots"]');
    const previous = robots?.content;
    if (robots) robots.content = 'noindex, nofollow';
    return () => { if (robots && previous !== undefined) robots.content = previous; };
  }, []);

  useEffect(() => {
    if (!scene) return;
    const target = scene.boxes.find(box => box.id === 'CARLOS5') || scene.boxes[0];
    if (target) setCamera({ x: Math.max(0, target.x - dimensions.width / 2 + target.w / 2), y: Math.max(0, target.y - dimensions.height / 2 + target.h / 2), zoom: 1 });
  }, [scene]);

  useLayoutEffect(() => {
    if (renderer !== 'canvas' || !scene || !canvas.current) return;
    const start = performance.now();
    drawScene(canvas.current, scene, camera, { selected, hovered, search: searchBox?.id });
    lastDraw.current = performance.now() - start;
  }, [renderer, scene, camera, selected, hovered, searchBox, dimensions]);

  useLayoutEffect(() => {
    if (stage.current) setMountedNodes(stage.current.querySelectorAll('*').length);
  }, [renderer, scene, visible.length]);

  useEffect(() => {
    if (!scene) return;
    const start = performance.now();
    let active = true;
    painted().then(() => { if (active) setFirstPaint(performance.now() - start); });
    return () => { active = false; };
  }, [scene, renderer]);

  const focus = box => {
    if (!box) return;
    setSelected(box.id);
    setCamera(current => ({ ...current, x: Math.max(0, box.x + box.w/2 - dimensions.width/(2*current.zoom)), y: Math.max(0, box.y + box.h/2 - dimensions.height/(2*current.zoom)) }));
  };
  const zoomBy = factor => setCamera(current => {
    const next = Math.max(.45, Math.min(1.6, Number((current.zoom * factor).toFixed(2))));
    const centerX = current.x + dimensions.width/(2*current.zoom), centerY = current.y + dimensions.height/(2*current.zoom);
    return { x: centerX - dimensions.width/(2*next), y: centerY - dimensions.height/(2*next), zoom: next };
  });
  const atPointer = event => screenToWorld(event.clientX, event.clientY, stage.current.getBoundingClientRect(), camera);
  const onPointerDown = event => { if (event.button !== 0) return; drag.current = { x:event.clientX, y:event.clientY, camera, moved:false }; stage.current.setPointerCapture(event.pointerId); };
  const onPointerMove = event => {
    if (drag.current) {
      const dx = event.clientX - drag.current.x, dy = event.clientY - drag.current.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) drag.current.moved = true;
      if (drag.current.moved) setCamera({ ...drag.current.camera, x:drag.current.camera.x - dx/drag.current.camera.zoom, y:drag.current.camera.y - dy/drag.current.camera.zoom });
    } else setHovered(hitTest(visible, atPointer(event).x, atPointer(event).y)?.id || null);
  };
  const onPointerUp = event => {
    if (drag.current && !drag.current.moved) focus(hitTest(visible, atPointer(event).x, atPointer(event).y));
    drag.current = null;
  };
  const downloadSvg = () => saveFile(new Blob([viewportSvg(scene,camera,dimensions.width,dimensions.height,{selected})],{type:'image/svg+xml'}),'laboratorio-arbol.svg');
  const downloadPng = () => {
    const output = document.createElement('canvas');
    output.style.width = `${dimensions.width}px`; output.style.height = `${dimensions.height}px`;
    output.style.position = 'fixed'; output.style.left = '-9999px';
    document.body.append(output);
    drawScene(output,scene,camera,{selected,hovered,search:searchBox?.id});
    output.toBlob(blob => { if (blob) saveFile(blob,'laboratorio-arbol.png'); output.remove(); });
  };
  const benchmark = async () => {
    if (!scene || running) return;
    setRunning(true);
    const samples = [];
    const starting = camera;
    const idle = [];
    let idlePrevious = performance.now();
    for (let i=0;i<34;i++) {
      await frame();
      const now = performance.now();
      if (i>3) idle.push(now-idlePrevious);
      idlePrevious = now;
    }
    let previous = performance.now();
    for (let i=0;i<90;i++) {
      await frame();
      const now = performance.now();
      if (i>4) samples.push(now-previous);
      previous = now;
      setCamera({ x:starting.x + i*3, y:starting.y + Math.sin(i/12)*15, zoom:1 + .15*Math.sin(i/22) });
    }
    await painted();
    const yearStart = performance.now();
    setYear(value => value === 1500 ? 1501 : 1500);
    await painted();
    const yearMs = performance.now()-yearStart;
    const chapterStart = performance.now();
    setChapter(value => (value+1)%chapterSteps.length);
    await painted();
    const chapterMs = performance.now()-chapterStart;
    const memory = performance.memory?.usedJSHeapSize ?? null;
    const idleMedian = percentile(idle,.5);
    const slowThreshold = Math.max(20, idleMedian * 1.5);
    setResult({ idleMedian, median:percentile(samples,.5), p95:percentile(samples,.95), slow:samples.filter(ms=>ms>slowThreshold).length, slowThreshold, frames:samples.length, yearMs, chapterMs, memory, drawMs:renderer==='canvas'?lastDraw.current:null });
    setCamera(starting);
    setRunning(false);
  };

  return <main className="renderer-lab">
    <header className="lab-header"><div><span>V3.6 · Laboratorio</span><h1>Árbol: HTML + SVG frente a Canvas 2D</h1><p>Misma disposición y conexiones del Atlas. Prototipo aislado: el árbol público sigue usando HTML + SVG.</p></div><a href="/es/?atlas=1">Volver al Atlas →</a></header>
    <section className="lab-controls" aria-label="Configuración del experimento">
      <label>Personas<select value={size} onChange={event=>{setSize(Number(event.target.value));setResult(null);}}>{LAB_SIZES.map(count=><option key={count} value={count}>{count}</option>)}</select></label>
      <label>Renderizador<select value={renderer} onChange={event=>{setRenderer(event.target.value);setResult(null);}}><option value="html">HTML + SVG actual</option><option value="canvas">Canvas 2D</option></select></label>
      <label>Buscar<input value={query} onChange={event=>setQuery(event.target.value)} onKeyDown={event=>{if(event.key==='Enter')focus(searchBox);}} placeholder="Nombre…"/></label>
      <button type="button" onClick={()=>focus(searchBox)} disabled={!searchBox}>Ir al resultado</button>
      <button type="button" onClick={()=>zoomBy(1/1.2)}>−</button><output aria-label="Zoom">{Math.round(camera.zoom*100)} %</output><button type="button" onClick={()=>zoomBy(1.2)}>+</button>
      <button type="button" onClick={benchmark} disabled={!scene||running}>{running?'Midiendo…':'Medir interacción'}</button>
      <button type="button" onClick={downloadSvg} disabled={!scene}>SVG</button><button type="button" onClick={downloadPng} disabled={!scene}>PNG</button>
    </section>
    {error && <p role="alert">{error}</p>}
    {!scene && !error && <p role="status">Preparando la disposición del árbol…</p>}
    {scene && <>
      <div className="lab-stage" ref={stage} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={()=>{drag.current=null;}} onPointerLeave={()=>setHovered(null)} onWheel={event=>{event.preventDefault();zoomBy(event.deltaY>0?1/1.1:1.1);}}>
        {renderer === 'html' ? <div className="lab-world" style={{width:scene.width,height:scene.height,transform:`translate(${-camera.x*camera.zoom}px,${-camera.y*camera.zoom}px) scale(${camera.zoom})`}}>
          <svg aria-hidden="true" width={scene.width} height={scene.height} className="lab-lines">{scene.paths.map((d,index)=><path key={index} d={d} fill="none" stroke="var(--lab-line)" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round"/>)}</svg>
          {visible.map(box=><div key={box.id} className={`lab-card${selected===box.id?' is-selected':''}${hovered===box.id?' is-hovered':''}${searchBox?.id===box.id?' is-search':''}`} role="button" tabIndex={0} onClick={event=>{event.stopPropagation();focus(box);}} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();focus(box);}}} style={{left:box.x,top:box.y,width:box.w,height:box.h,borderLeftColor:boxAccent(box)}}><strong>{box.person.nombre}</strong><small>{box.person.titulo} · {(box.person.reinos||[]).slice(0,2).join(' · ')}</small></div>)}
        </div> : <><canvas ref={canvas} className="lab-canvas" aria-hidden="true"/><div className="lab-a11y-list" aria-label="Personas visibles en Canvas">{visible.map(box=><button key={box.id} onClick={()=>focus(box)}>{box.person.nombre} · {box.person.titulo}</button>)}</div></>}
      </div>
      <div className="lab-status" role="status"><span>{scene.boxes.length} personas · {scene.paths.length} trazos · {visible.length} tarjetas visibles</span><span>Seleccionada: {scene.boxes.find(box=>box.id===selected)?.person.nombre||'ninguna'} · Año {year} · Capítulo {chapter+1}: {chapterSteps[chapter]?.titulo}</span></div>
      <div className="lab-metrics"><div><strong>{scene.positionMs.toFixed(1)} ms</strong><span>Posiciones {size===PERSONAS.length?'precargadas':'calculadas'}</span></div><div><strong>{scene.connectionMs.toFixed(1)} ms</strong><span>Construcción de conexiones</span></div><div><strong>{mountedNodes}</strong><span>Nodos HTML/SVG montados en escena</span></div><div><strong>{firstPaint===null?'—':`${firstPaint.toFixed(1)} ms`}</strong><span>Primer dibujo tras el cambio</span></div></div>
      {result&&<div className="lab-results" aria-live="polite"><h2>Medición de interacción</h2><p>Cadencia en reposo: {result.idleMedian.toFixed(1)} ms/fotograma. Al mover y ampliar: mediana {result.median.toFixed(1)} ms · p95 {result.p95.toFixed(1)} ms · {result.slow}/{result.frames} fotogramas por encima de {result.slowThreshold.toFixed(1)} ms (1,5× reposo). Año hasta pintura: {result.yearMs.toFixed(1)} ms. Capítulo hasta pintura: {result.chapterMs.toFixed(1)} ms. {result.drawMs!==null?`Canvas: ${result.drawMs.toFixed(1)} ms/dibujo. `:''}Memoria JS: {result.memory?`${(result.memory/1048576).toFixed(1)} MiB`:'no disponible en este navegador'}. {result.idleMedian>25?'Este navegador limita la cadencia en reposo; aquí no se puede concluir si alcanza 60 fps.':''}</p></div>}
      <p className="lab-note">Las cifras dependen del dispositivo y la ventana. Año y capítulo miden el tiempo hasta una pintura; este prototipo solo actualiza sus indicadores, no carga un nuevo grafo. Para memoria móvil, repetir con un móvil real; <code>performance.memory</code> es aproximado o puede no estar disponible. WebGL se evaluará solo si Canvas 2D no alcanza los objetivos de fluidez y claridad.</p>
    </>}
  </main>;
}
