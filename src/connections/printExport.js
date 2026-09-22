import {documentaryLife} from '../utils/documentaryDates.js';
import {contenidoPersona} from '../content/personas/index.js';
import {sourcesForPerson} from '../content/sources.js';
import {DEFAULT_SITE_URL} from '../siteConfig.js';
export const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const exportFilename=title=>(String(title||'seleccion').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,90)||'seleccion');
export function printDocument(scene,{orientation='landscape',margin=12}={}) {
 const direction=orientation==='portrait'?'portrait':'landscape',m=[8,12,20].includes(Number(margin))?Number(margin):12;
 return `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>El Árbol de Europa — impresión</title><style>@page{size:A4 ${direction};margin:${m}mm}body{margin:0}svg{display:block;width:100%;height:auto;max-height:${direction==='portrait'?297-2*m:210-2*m}mm} @media print{svg{break-inside:avoid}}</style></head><body>${scene.svg}</body></html>`;
}
export function openPrint(scene,options) {
 const win=window.open('','_blank');if(!win)throw new Error('Permite abrir la ventana de impresión o descarga el SVG.');
 win.document.write(printDocument(scene,options));win.document.close();win.opener=null;
 let printed=false;const print=()=>{if(!printed){printed=true;win.focus();win.print();}};
 win.addEventListener('load',print,{once:true});
 // An about:blank document can finish before the listener is installed.
 if(win.document.readyState==='complete')print();
}
export function educationalDocuments(selection) {
 const {people,edges=[],title}=selection;
 if(!people.length||people.length>40)throw new Error('Elige entre 1 y 40 personas para preparar material educativo legible.');
 const by=Object.fromEntries(people.map(p=>[p.id,p]));
 const questions=edges.filter(e=>by[e.from]&&by[e.to]).slice(0,4).map(e=>({question:`¿Qué vínculo registra el Atlas entre ${by[e.from].nombre} y ${by[e.to].nombre}?`,answer:`${e.type==='sangre'?'Filiación':e.type==='matrimonio'?'Matrimonio':'Relación de amantes'}. Comprueba la dirección y el contexto en las fichas.`}));
 const first=people[0];questions.push({question:`¿Qué fechas y límites de precisión presenta la ficha de ${first.nombre}?`,answer:documentaryLife(first)});
 questions.push({question:'¿La ausencia de un vínculo en este material demuestra que no existió?',answer:'No. La base tiene una cobertura limitada; hay que consultar las fuentes y las notas documentales antes de concluir que un vínculo no existió.'});
 const sources=[...new Map(people.flatMap(p=>sourcesForPerson(p.id)).map(f=>[f.url,f])).values()];
 const shell=(heading,body)=>`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(title)} — ${heading}</title><style>body{font:16px/1.65 Georgia,serif;max-width:850px;margin:40px auto;padding:24px;color:#30291f}h1,h2{line-height:1.25}li{margin:12px 0}.answer-space{height:60px;border-bottom:1px solid #bbb}@page{size:A4;margin:18mm}@media print{body{margin:0;padding:0}li{break-inside:avoid}}</style></head><body><h1>${escapeHtml(title)}</h1><p>El Árbol de Europa · ${heading}</p>${body}</body></html>`;
 const context=`<h2>Contexto</h2><p>Selección de ${people.length} personas y sus vínculos registrados. Las fechas aproximadas e incompletas se conservan. La selección no representa una cobertura exhaustiva.</p>${people.slice(0,4).map(p=>`<p><strong>${escapeHtml(p.nombre)}.</strong> ${escapeHtml(contenidoPersona(p.id)?.resumen||'Consulta su ficha y las fuentes para situar su trayectoria.')}</p>`).join('')}`;
 const chronology=`<h2>Cronología de las personas</h2><ul>${[...people].sort((a,b)=>(a.nac??Infinity)-(b.nac??Infinity)).map(p=>`<li>${escapeHtml(p.nombre)}: ${escapeHtml(documentaryLife(p))}</li>`).join('')}</ul>`;
 const bibliography=`<h2>Fuentes y consulta</h2><p><a href="${DEFAULT_SITE_URL}/es/fuentes">Metodología y bibliografía compartida</a>. Las fuentes siguientes son referencias asociadas a las personas, no pruebas automáticas de cada vínculo.</p><ul>${sources.map(f=>`<li><a href="${escapeHtml(f.url)}">${escapeHtml(f.titulo||f.label||f.url)}</a></li>`).join('')}${people.map(p=>`<li><a href="${DEFAULT_SITE_URL}/es/persona/${escapeHtml(p.slug||p.id)}">Ficha de ${escapeHtml(p.nombre)}</a></li>`).join('')}</ul>`;
 return {activity:shell('Actividad',context+chronology+`<h2>Preguntas</h2><ol>${questions.map(q=>`<li>${escapeHtml(q.question)}<div class="answer-space"></div></li>`).join('')}</ol>`+bibliography),answers:shell('Respuestas para el docente',`<h2>Respuestas orientativas</h2><ol>${questions.map(q=>`<li><strong>${escapeHtml(q.question)}</strong><p>${escapeHtml(q.answer)}</p></li>`).join('')}</ol>`+bibliography)};
}
export function embedCode(ids,origin=DEFAULT_SITE_URL) {
 if(!ids.length||ids.length>12)throw new Error('Las vistas insertables admiten de 1 a 12 personas. Reduce la selección.');
 const url=new URL(ids.length===1?`/embed/persona/${encodeURIComponent(ids[0])}`:'/embed/arbol',origin);
 if(ids.length>1)ids.forEach(id=>url.searchParams.append('persona',id));
 return `<iframe src="${escapeHtml(url.href)}" title="El Árbol de Europa" width="100%" height="520" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
}
