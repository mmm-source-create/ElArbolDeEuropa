import {documentaryLife} from '../utils/documentaryDates.js';
import {selectionLayout,edgePath} from './selectionLayout.js';
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
export function wrapName(name,limit=25){
 const lines=[];let line='';
 for(const word of String(name).split(/\s+/)){if(line&&[...line+' '+word].length>limit){lines.push(line);line='';}for(let rest=word;rest;){const chunk=[...rest].slice(0,limit).join('');rest=[...rest].slice(limit).join('');if(rest){if(line){lines.push(line);line='';}lines.push(chunk);}else line+=(line?' ':'')+chunk;}}
 if(line)lines.push(line);return lines;
}
export function treeSvg({people,edges,gen={},terminals=[],title='Selección del árbol',url='https://www.treeofeurope.eu/es/'}){
 if(!people.length)throw new Error('Selecciona una persona, una comparación o una rama antes de exportar.');
 const byId=Object.fromEntries(people.map(p=>[p.id,p])),ids=people.map(p=>p.id),layout=selectionLayout(ids,gen,byId);
 // Todas las filas reservan el alto del nombre más largo, también con fechas documentales.
 const text=Object.fromEntries(people.map(p=>[p.id,{name:wrapName(p.nombre),dates:wrapName(documentaryLife(p),29)}]));
 const height=Math.max(100,...people.map(p=>38+text[p.id].name.length*19+text[p.id].dates.length*16));
 for(const pos of Object.values(layout.positions)){pos.y=100+pos.row*(height+80);pos.h=height;}
 const rows=Math.max(...Object.values(layout.positions).map(p=>p.row))+1;
 const w=layout.width,h=rows*(height+80)+150,selected=new Set(terminals);
 const edgeMarkup=edges.map((edge,i)=>`<path d="${edgePath(edge,layout.positions,i)}" fill="none" stroke="${edge.type==='sangre'?'#7a2e2e':'#a77b43'}" stroke-width="2"${edge.type==='sangre'?'':edge.type==='amante'?' stroke-dasharray="2 5"':' stroke-dasharray="7 5"'}/>`).join('');
 const cards=people.map(p=>{
  const pos=layout.positions[p.id],t=text[p.id];
  return `<g><title>${escape(p.nombre)} · ${escape(documentaryLife(p))}</title><rect x="${pos.x}" y="${pos.y}" width="${pos.w}" height="${height}" rx="8" fill="#fffdf7" stroke="${selected.has(p.id)?'#7a2e2e':'#d5c7aa'}" stroke-width="${selected.has(p.id)?3:1.5}"/>${t.name.map((line,i)=>`<text x="${pos.x+12}" y="${pos.y+25+i*19}" font-size="16" font-weight="600">${escape(line)}</text>`).join('')}${t.dates.map((line,i)=>`<text x="${pos.x+12}" y="${pos.y+37+t.name.length*19+i*16}" fill="#706653" font-size="13">${escape(line)}</text>`).join('')}</g>`;
 }).join('');
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title desc"><title id="title">${escape(title)}</title><desc id="desc">${people.length} personas. Línea continua: filiación; discontinua: matrimonio; puntos: amantes. Borde granate: personas elegidas. Posiciones por generaciones, sin escala temporal.</desc><rect width="100%" height="100%" fill="#f6f1e5"/><g font-family="Georgia, serif" fill="#30291f"><text x="40" y="40" font-size="24">El Árbol de Europa</text><text x="40" y="65" font-size="15">${escape(title)} · ${people.length} personas</text>${edgeMarkup}${cards}<text x="40" y="${h-64}" font-size="13">Filiación: continua · Matrimonio: discontinua · Amantes: puntos · Elegidos: borde granate</text><text x="40" y="${h-44}" font-size="12">Generaciones sin escala temporal · Datos registrados en el Atlas</text><a href="${escape(url)}"><text x="40" y="${h-22}" font-size="12">www.treeofeurope.eu · Consultar el Atlas y sus fuentes</text></a></g></svg>`;
 return {svg,width:w,height:h};
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
