import {documentaryLife} from '../../domain/time/documentaryDates.js';
import {contenidoPersona} from '../../content/personas/index.js';
import {sourcesForPerson} from '../../content/sources.js';
import {DEFAULT_SITE_URL} from '../../app/siteConfig.js';
import {englishProfileFor} from '../english/v6/atlasPresentation.js';
export const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const exportFilename=title=>(String(title||'seleccion').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,90)||'seleccion');
export function printDocument(scene,{orientation='landscape',margin=12,locale='es'}={}) {
 const direction=orientation==='portrait'?'portrait':'landscape',m=[8,12,20].includes(Number(margin))?Number(margin):12;
 return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><title>${locale==='en'?'The Tree of Europe — print':'El Árbol de Europa — impresión'}</title><style>@page{size:A4 ${direction};margin:${m}mm}body{margin:0}svg{display:block;width:100%;height:auto;max-height:${direction==='portrait'?297-2*m:210-2*m}mm} @media print{svg{break-inside:avoid}}</style></head><body>${scene.svg}</body></html>`;
}
export function openPrint(scene,options) {
 const win=window.open('','_blank');if(!win)throw new Error('Permite abrir la ventana de impresión o descarga el SVG.');
 win.document.write(printDocument(scene,options));win.document.close();win.opener=null;
 let printed=false;const print=()=>{if(!printed){printed=true;win.focus();win.print();}};
 win.addEventListener('load',print,{once:true});
 // An about:blank document can finish before the listener is installed.
 if(win.document.readyState==='complete')print();
}
export function educationalDocuments(selection,locale='es') {
 const en=locale==='en',tr=(es,english)=>en?english:es;
 const {people,edges=[],title}=selection;
 if(!people.length||people.length>40)throw new Error(tr('Elige entre 1 y 40 personas para preparar material educativo legible.','Choose between 1 and 40 people to prepare readable educational material.'));
 const by=Object.fromEntries(people.map(p=>[p.id,p]));
 const questions=edges.filter(e=>by[e.from]&&by[e.to]).slice(0,4).map(e=>({question:en?`What relationship does the Atlas record between ${by[e.from].nombre} and ${by[e.to].nombre}?`:`¿Qué vínculo registra el Atlas entre ${by[e.from].nombre} y ${by[e.to].nombre}?`,answer:en?`${e.type==='sangre'?'Parentage':e.type==='matrimonio'?'Marriage':'Lover relationship'}. Check its direction and context in the profiles.`:`${e.type==='sangre'?'Filiación':e.type==='matrimonio'?'Matrimonio':'Relación de amantes'}. Comprueba la dirección y el contexto en las fichas.`}));
 const first=people[0];questions.push({question:en?`Which dates and limits of precision appear in ${first.nombre}’s profile?`:`¿Qué fechas y límites de precisión presenta la ficha de ${first.nombre}?`,answer:documentaryLife(first)});
 questions.push({question:tr('¿La ausencia de un vínculo en este material demuestra que no existió?','Does the absence of a relationship from this material prove that it did not exist?'),answer:tr('No. La base tiene una cobertura limitada; hay que consultar las fuentes y las notas documentales antes de concluir que un vínculo no existió.','No. The database has limited coverage; consult the sources and documentary notes before concluding that a relationship did not exist.')});
 const sources=[...new Map(people.flatMap(p=>sourcesForPerson(p.id)).map(f=>[f.url,f])).values()];
 const shell=(heading,body)=>`<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(title)} — ${heading}</title><style>body{font:16px/1.65 Georgia,serif;max-width:850px;margin:40px auto;padding:24px;color:#30291f}h1,h2{line-height:1.25}li{margin:12px 0}.answer-space{height:60px;border-bottom:1px solid #bbb}@page{size:A4;margin:18mm}@media print{body{margin:0;padding:0}li{break-inside:avoid}}</style></head><body><h1>${escapeHtml(title)}</h1><p>${en?'The Tree of Europe':'El Árbol de Europa'} · ${heading}</p>${body}</body></html>`;
 const context=`<h2>${tr('Contexto','Context')}</h2><p>${en?`A selection of ${people.length} people and their recorded relationships. Approximate and incomplete dates are preserved. The selection does not represent exhaustive coverage.`:`Selección de ${people.length} personas y sus vínculos registrados. Las fechas aproximadas e incompletas se conservan. La selección no representa una cobertura exhaustiva.`}</p>${people.slice(0,4).map(p=>`<p><strong>${escapeHtml(p.nombre)}.</strong> ${escapeHtml(en?(englishProfileFor(p.id)?.summary||'Open the profile and sources to place this person in context.'):(contenidoPersona(p.id)?.resumen||'Consulta su ficha y las fuentes para situar su trayectoria.'))}</p>`).join('')}`;
 const chronology=`<h2>${tr('Cronología de las personas','People’s chronology')}</h2><ul>${[...people].sort((a,b)=>(a.nac??Infinity)-(b.nac??Infinity)).map(p=>`<li>${escapeHtml(p.nombre)}: ${escapeHtml(documentaryLife(p))}</li>`).join('')}</ul>`;
 const bibliography=`<h2>${tr('Fuentes y consulta','Sources and further reading')}</h2><p><a href="${DEFAULT_SITE_URL}/${en?'en/methodology':'es/fuentes'}">${tr('Metodología y bibliografía compartida','Shared methodology and bibliography')}</a>. ${tr('Las fuentes siguientes son referencias asociadas a las personas, no pruebas automáticas de cada vínculo.','The following sources are references associated with these people, not automatic evidence for every relationship.')}</p><ul>${sources.map(f=>`<li><a href="${escapeHtml(f.url)}">${escapeHtml(f.titulo||f.label||f.url)}</a></li>`).join('')}${people.map(p=>`<li><a href="${DEFAULT_SITE_URL}/${en?'en/person':'es/persona'}/${escapeHtml(p.slug||p.id)}">${tr('Ficha de','Profile of')} ${escapeHtml(p.nombre)}</a></li>`).join('')}</ul>`;
 return {activity:shell(tr('Actividad','Activity'),context+chronology+`<h2>${tr('Preguntas','Questions')}</h2><ol>${questions.map(q=>`<li>${escapeHtml(q.question)}<div class="answer-space"></div></li>`).join('')}</ol>`+bibliography),answers:shell(tr('Respuestas para el docente','Teacher answer key'),`<h2>${tr('Respuestas orientativas','Suggested answers')}</h2><ol>${questions.map(q=>`<li><strong>${escapeHtml(q.question)}</strong><p>${escapeHtml(q.answer)}</p></li>`).join('')}</ol>`+bibliography)};
}
export function embedCode(ids,origin=DEFAULT_SITE_URL) {
 if(!ids.length||ids.length>12)throw new Error('Las vistas insertables admiten de 1 a 12 personas. Reduce la selección.');
 const url=new URL(ids.length===1?`/embed/persona/${encodeURIComponent(ids[0])}`:'/embed/arbol',origin);
 if(ids.length>1)ids.forEach(id=>url.searchParams.append('persona',id));
 return `<iframe src="${escapeHtml(url.href)}" title="El Árbol de Europa" width="100%" height="520" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
}
