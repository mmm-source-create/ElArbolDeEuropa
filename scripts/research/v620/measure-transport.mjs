import fs from 'node:fs/promises';import {gzipSync} from 'node:zlib';import assert from 'node:assert/strict';
import {packPage,unpackPage} from '../../../src/features/public/pageTransport.js';
import {serializePage} from '../../../src/features/public/staticData.js';
import {pageFromHtml} from '../../../src/utils/staticMetadata.js';
const root=process.argv[2]||'public';
const measure=value=>{const json=JSON.stringify(value);return {jsonBytes:Buffer.byteLength(json),gzipBytes:gzipSync(json).length};};
const files=['catalogos/personas.json','english-meta/person-charles-v.json'];
const english=(await fs.readdir(root+'/english-meta')).filter(name=>name.startsWith('person-')&&name.endsWith('.json')).sort();
const sample=[...new Set([...files,...english.filter((_,i)=>i%100===0).map(name=>'english-meta/'+name)])];
const records=[];for(const file of sample){const value=JSON.parse(await fs.readFile(root+'/'+file,'utf8'));const packed=packPage(value);assert.deepEqual(unpackPage(packed),value,file);const before=measure(value),after=measure(packed);const record={file,metadataCandidate:{before,after,gzipReductionPercent:+((1-after.gzipBytes/before.gzipBytes)*100).toFixed(2)}};
 const path=value.path||(file==='catalogos/personas.json'?'/es/personas':null);
 if(path){const html=await fs.readFile('dist'+path+'/index.html','utf8');const page=pageFromHtml(html);assert.deepEqual(page.data,value,file);const ordinary=html.replace(/(<script id="eade-initial-page" type="application\/json">)[\s\S]*?(<\/script>)/,(_,a,b)=>a+serializePage(page,false)+b);const bytes=text=>({htmlBytes:Buffer.byteLength(text),gzipBytes:gzipSync(text).length});const original=bytes(ordinary),published=bytes(html);assert(published.gzipBytes<=original.gzipBytes,file);record.document={before:original,after:published,gzipReductionPercent:+((1-published.gzipBytes/original.gzipBytes)*100).toFixed(2),format:JSON.parse(html.match(/<script id="eade-initial-page" type="application\/json">([\s\S]*?)<\/script>/)[1]).format||'ordinary-json'};}
 records.push(record);}
const totals=records.filter(r=>r.file.startsWith('english-meta/')).reduce((r,x)=>({before:r.before+x.document.before.gzipBytes,after:r.after+x.document.after.gzipBytes}),{before:0,after:0});
const report={version:'6.0.20',method:'Same complete records and complete built HTML documents, with and without the dictionary; gzip default level. The publisher chooses the smaller complete gzip document. Metadata candidates are reported separately and may be larger. Sample: Charles V plus every 100th alphabetically sorted English person file; this is a reproducible sample, not a traffic-weighted site average.',lossless:true,records,englishSample:{...totals,count:records.length-1,gzipReductionPercent:+((1-totals.after/totals.before)*100).toFixed(2)}};
if(process.argv[3]){
 const before=JSON.parse(await fs.readFile(process.argv[3]+'/catalogos/personas.json','utf8')),after=JSON.parse(await fs.readFile(root+'/catalogos/personas.json','utf8'));
 assert.deepEqual(before.items.map(({resumen,...card})=>card),after.items);
 const old=measure(before),current=measure(after);
 report.catalogueFrom619={before:{bytes:old.jsonBytes,gzipBytes:old.gzipBytes},after:{bytes:current.jsonBytes,gzipBytes:current.gzipBytes},preservedPeople:after.items.length,projectionDifferences:0,gzipReductionPercent:+((1-current.gzipBytes/old.gzipBytes)*100).toFixed(2)};
}
await fs.mkdir('outputs/6.0.20',{recursive:true});await fs.writeFile('outputs/6.0.20/transport.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({catalogue:records[0],charlesV:records[1],englishSample:report.englishSample}));
