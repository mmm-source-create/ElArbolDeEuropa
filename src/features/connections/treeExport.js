import {PAPAL_SUCCESSION,papalSuccessionPaths} from '../../domain/genealogy/papalSuccession.js';
import {layoutSelection} from '../../domain/genealogy/selectionTree.js';
import {TREE_BOX_H,TREE_BOX_W} from '../../domain/genealogy/treeMetrics.js';
import {ACCENTS} from '../../domain/genealogy/dynastyColors.js';
import {getCategoriaDinastía} from '../../domain/genealogy/dynasties.js';
import {governmentSummary} from '../../domain/government/governmentPresentation.js';
import {territoriosDe} from '../../domain/genealogy/personAccessors.js';
import {SITE_NAME, DEFAULT_SITE_URL} from '../../app/siteConfig.js';
import {documentaryLife} from '../../domain/time/documentaryDates.js';
import {selectionLayout,edgePath} from './selectionLayout.js';
import {englishLabel} from '../english/v6/atlasPresentation.js';
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
export function wrapName(name,limit=25){
 const lines=[];let line='';
 for(const word of String(name).split(/\s+/)){if(line&&[...line+' '+word].length>limit){lines.push(line);line='';}for(let rest=word;rest;){const chunk=[...rest].slice(0,limit).join('');rest=[...rest].slice(limit).join('');if(rest){if(line){lines.push(line);line='';}lines.push(chunk);}else line+=(line?' ':'')+chunk;}}
 if(line)lines.push(line);return lines;
}
// Export cards show every name, title and date in full. Stretch the original
// axis monotonically so every card's interval reserves the required size.
// Disjoint intervals stay disjoint, and children remain below their parents.
function expandedCardAxis(positions, axis, size, required, offset) {
 const values=[...new Set(Object.values(positions).flatMap(p=>[p[axis],p[axis]+p[size]]))].sort((a,b)=>a-b);
 const index=new Map(values.map((value,i)=>[value,i])),constraints=values.map(()=>[]);
 for(const p of Object.values(positions))constraints[index.get(p[axis]+p[size])].push([index.get(p[axis]),required]);
 const expanded=[];
 values.forEach((value,i)=>{
  expanded[i]=i?expanded[i-1]+Math.min(value-values[i-1],80):offset;
  for(const [from,distance] of constraints[i])expanded[i]=Math.max(expanded[i],expanded[from]+distance);
 });
 return new Map(values.map((value,i)=>[value,expanded[i]]));
}
function papalExportLayout(people,byId,height) {
 const children={};
 for(const p of people)for(const id of [p.padre,p.madre])if(byId[id])(children[id]??=[]).push(p.id);
 const original=layoutSelection(people,byId,children,{swapLimit:0}).layout;
 const x=expandedCardAxis(original.positions,'x','w',TREE_BOX_W,60);
 const y=expandedCardAxis(original.positions,'y','h',height,100);
 const positions=Object.fromEntries(Object.entries(original.positions).map(([id,p])=>[id,{...p,x:x.get(p.x),y:y.get(p.y),w:TREE_BOX_W,h:height}]));
 return {positions,width:Math.max(900,...Object.values(positions).map(p=>p.x+p.w+60)),height:Math.max(400,...Object.values(positions).map(p=>p.y+p.h+120))};
}
function exportEdgePath(edge,positions,index) {
 const a=positions[edge.from],b=positions[edge.to];
 if(edge.type!=='sangre'&&a&&b&&a.y!==b.y){
  const outside=Math.max(a.x+a.w,b.x+b.w)+20+(index%5)*7;
  return `M ${a.x+a.w} ${a.y+a.h/2} H ${outside} V ${b.y+b.h/2} H ${b.x+b.w}`;
 }
 return edgePath(edge,positions,index);
}
export function treeSvg({people,edges,gen={},terminals=[],title='Selección del árbol',url,margin=12,locale='es',papalColumn=true}){
 const en=locale==='en',tr=(es,english)=>en?english:es,term=value=>en?englishLabel(value):value;
 url ||= `${DEFAULT_SITE_URL}/${en?'en':'es'}/`;
 if(!people.length)throw new Error(tr('Selecciona una persona, una comparación o una rama antes de exportar.','Select a person, comparison or branch before exporting.'));
 const byId=Object.fromEntries(people.map(p=>[p.id,p])),ids=people.map(p=>p.id);
 const popes=papalColumn?PAPAL_SUCCESSION.filter(id=>byId[id]):[];
 // Todas las filas reservan el alto del nombre más largo, también con fechas documentales.
 const text=Object.fromEntries(people.map(p=>[p.id,{name:wrapName(p.nombre,27),role:wrapName([p.titulo,...(governmentSummary(p).length?governmentSummary(p):territoriosDe(p))].filter(Boolean).map(term).join(' · '),30),dates:wrapName(documentaryLife(p),30)}]));
 const height=Math.max(TREE_BOX_H,...people.map(p=>20+text[p.id].name.length*14+text[p.id].role.length*13+text[p.id].dates.length*13));
 const layout=popes.length?papalExportLayout(people,byId,height):selectionLayout(ids,gen,byId,edges);
 if(!popes.length){
  for(const pos of Object.values(layout.positions)){pos.y=100+pos.row*(height+80);pos.h=height;}
  const rows=Math.max(...Object.values(layout.positions).map(p=>p.row))+1;
  layout.height=rows*(height+80)+150;
 }
 const w=layout.width,h=layout.height;
 const papalMarkup=papalColumn?papalSuccessionPaths(layout.positions).map(({d})=>`<path d="${d}" fill="none" stroke="#9B8246" stroke-width="2" stroke-dasharray="7 5"/>`).join(''):'';
 const selected=new Set(terminals);
 const edgeMarkup=edges.map((edge,i)=>`<path d="${popes.length?exportEdgePath(edge,layout.positions,i):edgePath(edge,layout.positions,i)}" fill="none" stroke="${edge.type==='sangre'?'#7a2e2e':'#a77b43'}" stroke-width="2"${edge.type==='sangre'?'':edge.type==='amante'?' stroke-dasharray="2 5"':' stroke-dasharray="7 5"'}/>`).join('');
 const cards=people.map(p=>{
  const pos=layout.positions[p.id],t=text[p.id],accent=ACCENTS[p.dinastia]||ACCENTS[getCategoriaDinastía(p.dinastia)]||'#71717A';
  return `<g font-family="-apple-system, Segoe UI, sans-serif"><title>${escape(p.nombre)} · ${escape(documentaryLife(p))}</title><rect x="${pos.x}" y="${pos.y}" width="${pos.w}" height="${height}" rx="6" fill="${selected.has(p.id)?'#fff9f2':'#ffffff'}" stroke="${selected.has(p.id)?'#7a2e2e':'#b9af98'}" stroke-width="${selected.has(p.id)?3:1}"/><path d="M ${pos.x+3} ${pos.y+3} V ${pos.y+height-3}" stroke="${escape(accent)}" stroke-width="6"/>${t.name.map((line,i)=>`<text x="${pos.x+16}" y="${pos.y+18+i*14}" font-size="11" font-weight="600">${escape(line)}</text>`).join('')}${t.role.map((line,i)=>`<text x="${pos.x+16}" y="${pos.y+20+t.name.length*14+i*13}" fill="#706653" font-size="10">${escape(line)}</text>`).join('')}${t.dates.map((line,i)=>`<text x="${pos.x+16}" y="${pos.y+20+t.name.length*14+t.role.length*13+i*13}" fill="#706653" font-size="10">${escape(line)}</text>`).join('')}</g>`;
 }).join('');
 const padding=[8,12,20].includes(Number(margin))?Number(margin):12;
 const successionLegend=popes.length?tr(' · Sucesión pontificia: discontinua dorada',' · Papal succession: gold dashes'):'';
 const description=(en?`${people.length} people. Solid line: parentage; dashed line: marriage; dotted line: lovers. Burgundy border: selected people. Positions by generation, without a time scale.`:`${people.length} personas. Línea continua: filiación; discontinua: matrimonio; puntos: amantes. Borde granate: personas elegidas. Posiciones por generaciones, sin escala temporal.`)+successionLegend;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${w+padding*2}" height="${h+padding*2}" viewBox="0 0 ${w+padding*2} ${h+padding*2}" role="img" aria-labelledby="title desc"><title id="title">${escape(title)}</title><desc id="desc">${escape(description)}</desc><rect width="100%" height="100%" fill="#f6f1e5"/><g transform="translate(${padding} ${padding})" font-family="Georgia, serif" fill="#30291f"><text x="40" y="40" font-size="24">${escape(en?'The Tree of Europe':SITE_NAME)}</text><text x="40" y="65" font-size="15">${escape(title)} · ${people.length} ${tr('personas','people')}</text>${edgeMarkup}${papalMarkup}${cards}<text x="40" y="${h-64}" font-size="13">${tr('Filiación: continua · Matrimonio: discontinua · Amantes: puntos · Elegidos: borde granate','Parentage: solid · Marriage: dashed · Lovers: dotted · Selected: burgundy border')}</text>${popes.length?`<text x="40" y="${h-84}" font-size="12">${escape(successionLegend.slice(3))}</text>`:''}<text x="40" y="${h-44}" font-size="12">${tr('Generaciones sin escala temporal · Datos registrados en el Atlas','Generations without a time scale · Data recorded in the Atlas')}</text><a href="${escape(url)}"><text x="40" y="${h-22}" font-size="12">${escape(new URL(DEFAULT_SITE_URL).hostname)} · ${tr('Consultar el Atlas y sus fuentes','View the Atlas and its sources')}</text></a></g></svg>`;
 return {svg,width:w+padding*2,height:h+padding*2};
}
export function pngDimensions(width,height){
 const scale=2;
 if(width*scale>8192||height*scale>8192||width*height*scale*scale>24000000)throw new Error('Esta rama es demasiado grande para un PNG legible. Descarga el SVG o reduce la selección.');
 return {width:width*scale,height:height*scale};
}
export async function svgToPng(scene){
 const size=pngDimensions(scene.width,scene.height),url=URL.createObjectURL(new Blob([scene.svg],{type:'image/svg+xml;charset=utf-8'}));
 try{
  const image=new Image();await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(new Error('No se pudo preparar la imagen. Puedes descargar el SVG.'));image.src=url;});
  const canvas=document.createElement('canvas');canvas.width=size.width;canvas.height=size.height;
  const ctx=canvas.getContext('2d');if(!ctx)throw new Error('El navegador no permite crear el PNG.');ctx.drawImage(image,0,0,size.width,size.height);
  return await new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('No se pudo guardar el PNG.')),'image/png'));
 }finally{URL.revokeObjectURL(url);}
}
export function downloadBlob(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
