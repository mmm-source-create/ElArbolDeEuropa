// 6.1.2: publishes the ten dynasty stories written in 6.0.15 and kept as drafts
// (docs/borradores-historias-dinastias-615.md). Reads the Markdown and writes
// src/data/stories612/dynasties.json in the format of the 6.0.7 stories.
import fs from 'node:fs';
const md=fs.readFileSync('docs/borradores-historias-dinastias-615.md','utf8');
const body=md.slice(0,md.indexOf('# Biografías de reserva'));
const sections=body.split(/\n## /).slice(1);
const quote=block=>block.split('\n').filter(l=>l.startsWith('> ')).map(l=>l.slice(2)).join(' ').trim();
const plain=block=>block.split('\n').filter(l=>l.trim()&&!l.startsWith('>')&&!l.startsWith('*')&&!l.startsWith('-')&&!l.startsWith('#')).join(' ').trim();
const stories=sections.map(section=>{
 const [head,...chapterParts]=section.split(/\n### /);
 const lines=head.split('\n');
 const esTitle=lines[0].trim(),enTitle=lines.find(l=>/^\*[^*]/.test(l)).replace(/^\*|\*$/g,'').trim();
 const id=head.match(/\*\*Identificador:\*\* `([^`]+)`; ruta inglesa `([^`]+)`/);
 const sub=head.match(/\*\*Subtítulo:\*\* (.+?) \/ (.+)/);
 const related=(head.match(/\*\*Relacionadas:\*\* (.+)/)?.[1]||'').split(',').map(s=>s.trim()).filter(Boolean);
 const intro=head.split(/\n- \*\*Relacionadas.*\n/)[1]||'';
 const last=chapterParts.at(-1),[lastText,sourcesBlock]=last.split('**Fuentes**');chapterParts[chapterParts.length-1]=lastText;
 const sources=[...sourcesBlock.matchAll(/^\d+\. \[([^\]]+)\]\(([^)]+)\)\.? ?(.*)$/gm)].map(m=>({titulo:m[1],url:m[2],localizador:m[3].trim()||m[1]}));
 const chapters=chapterParts.map(part=>{
  const [title,...rest]=part.split('\n');const text=rest.join('\n').replace(/\n---\s*$/,'');
  const m=title.match(/^\d+\. (\d{3,4}) · (.+)$/);
  const meta=text.split('\n').find(l=>/^\*.+\* — personas:/.test(l));
  return {anio:Number(m[1]),esTitle:m[2].trim(),enTitle:meta.match(/^\*(.+?)\*/)[1],personas:[...meta.matchAll(/`([^`]+)`/g)].map(x=>x[1]),es:plain(text.split('\n').filter(l=>l!==meta).join('\n')),en:quote(text),sourceRefs:sources.map((_,i)=>i)};
 });
 return {id:id[1],enSlug:id[2],esTitle,enTitle,esSubtitle:sub[1].trim(),enSubtitle:sub[2].trim(),esDescription:plain(intro),enDescription:quote(intro),related,sources,chapters,colecciones:['dinastias']};
});
fs.mkdirSync('src/data/stories612',{recursive:true});
fs.writeFileSync('src/data/stories612/dynasties.json',JSON.stringify(stories,null,1)+'\n');
console.log(stories.map(s=>`${s.id}: ${s.chapters.length} capítulos, ${s.sources.length} fuentes`).join('\n'));

// The ten reserve biographies at the end of the same document. They replace
// one-line summaries; src/content/v607People.js publishes them in both languages.
const bios=md.slice(md.indexOf('# Biografías de reserva')).split(/\n## /).slice(1).map(section=>{
 const [head,...parts]=section.split(/\n### /);
 const m=head.match(/^(.+?) \(`([^`]+)`\)/);
 const resumen=head.match(/\*\*Resumen\.\*\* (.+)/)[1].trim(),summary=quote(head);
 const last=parts.at(-1),[lastText,refsLine]=last.split('**Fuentes:**');parts[parts.length-1]=lastText;
 const refs=[...(refsLine||'').matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)].map(r=>({titulo:r[1],url:r[2]}));
 return [m[2],{name:m[1].trim(),resumen,summary,refs,parts:parts.map(p=>{const [title,...rest]=p.split('\n');const [es,en]=title.split(' / ');const text=rest.join('\n');return [es.trim(),en.trim(),plain(text),quote(text)];})}];
});
const ROLES={MICHAEL8PALA:'Byzantine Emperor',LUIS7FRA:'King of France',SALADIN:'Sultan of Egypt and Syria',HAAKON4NOR:'King of Norway',MAGNUS4SUE:'King of Sweden and Norway',ERICOPOMERANIA:'King of Denmark, Norway and Sweden',CRISTIAN1NORD:'King of Denmark, Norway and Sweden',CHRISTIAN3DEN:'King of Denmark and Norway',WILLIAM1SCOT:'King of Scots',EREKLE2GEO:'King of Kartli-Kakheti'};
for(const [id,b] of bios){b.role=ROLES[id];b.aliases=[];}
fs.writeFileSync('src/content/v612People.json',JSON.stringify(Object.fromEntries(bios),null,1)+'\n');
console.log(`${bios.length} biografías: ${bios.map(b=>b[0]).join(', ')}`);
