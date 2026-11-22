import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {JSDOM} from 'jsdom';
import {fileURLToPath} from 'node:url';
export const directory=new URL('../../../.cache/research620/',import.meta.url);
export async function page(url){
 const file=new URL(crypto.createHash('sha256').update(url).digest('hex')+'.json',directory);
 try{return JSON.parse(await fs.readFile(file,'utf8'));}catch{}
 const response=await fetch(url,{headers:{'User-Agent':'TreeOfEurope-SourceReview/6.0.20 (+https://www.treeofeurope.eu)'},signal:AbortSignal.timeout(30000)});
 if(!response.ok)throw Error(`${response.status}: ${url}`);
 const html=await response.text(),dom=new JSDOM(html,{url});const doc=dom.window.document;
 for(const el of doc.querySelectorAll('script,style,nav,header,footer'))el.remove();
 const record={url:response.url,sha256:crypto.createHash('sha256').update(html).digest('hex'),title:doc.title,
 text:(doc.querySelector('main')||doc.body).textContent.replace(/\s+/g,' ').trim(),
 links:[...doc.querySelectorAll('a[href]')].map(a=>({text:a.textContent.trim(),url:a.href})).filter(a=>a.text),
 tables:[...doc.querySelectorAll('tr')].map(row=>[...row.querySelectorAll('td,th')].map(cell=>cell.textContent.replace(/\s+/g,' ').trim()))};
 dom.window.close();await fs.mkdir(directory,{recursive:true});await fs.writeFile(file,JSON.stringify(record));return record;
}
if(process.argv[1]===fileURLToPath(import.meta.url))for(const url of process.argv.slice(2)){try{const data=await page(url);console.log(JSON.stringify({url:data.url,title:data.title,characters:data.text.length,links:data.links.length}));}catch(e){console.log(e.message);}await new Promise(r=>setTimeout(r,750));}
