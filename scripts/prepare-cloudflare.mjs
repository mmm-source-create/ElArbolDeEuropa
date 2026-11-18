import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {staticHeadersFile} from '../cloudflare/routing.js';
import {metadataFromHtml} from '../src/utils/staticMetadata.js';

export async function prepareCloudflare(source='dist', target='.cloudflare/assets') {
  const report=JSON.parse(await fs.readFile(path.join(source,'ssg-report.json'),'utf8'));
  if(report.mode!=='full')throw new Error('Cloudflare requires a full audited build');
  const audit=JSON.parse(await fs.readFile(path.join(source,'ssg-audit.json'),'utf8'));
  if(audit.errors.length||audit.expected!==report.pages.length)throw new Error('SSG audit is not complete');
  const index={};let reused=0;
  for(const item of report.pages.filter(p=>p.path.startsWith('/en'))){
    const html=await fs.readFile(path.join(source,item.path,'index.html'),'utf8');
    const data=metadataFromHtml(html,item.path);
    const key=`/english-meta/${data.slug}${data.chapter?`/capitulo/${data.chapter}`:''}.json`;
    if(index[key])throw new Error(`Duplicate metadata key: ${key}`);
    const original=JSON.parse(await fs.readFile(path.join(source,key),'utf8'));
    if(JSON.stringify(original)!==JSON.stringify(data))throw new Error(`Metadata differs: ${key}`);
    index[key]=item.path;reused++;
  }
  await fs.mkdir(target,{recursive:true});
  // Only the disposable Cloudflare output is cleared. Local source copies stay intact.
  await fs.rm(target,{recursive:true,force:true});await fs.mkdir(target,{recursive:true});
  const excluded=[];
  async function copy(dir=''){
    for(const entry of await fs.readdir(path.join(source,dir),{withFileTypes:true})){
      const relative=path.join(dir,entry.name);
      if(/ \d+(?:\.|$)/.test(entry.name)||['.vite','english-meta','ssg-report.json','ssg-audit.json','map-audit'].includes(relative)){excluded.push(relative);continue;}
      if(entry.isSymbolicLink())throw new Error(`Unexpected symbolic link: ${relative}`);
      if(entry.isDirectory()){await fs.mkdir(path.join(target,relative),{recursive:true});await copy(relative);}
      else if(entry.isFile())await fs.writeFile(path.join(target,relative),await fs.readFile(path.join(source,relative)));
    }
  }
  await copy();
  // These public sections use the existing client app. Profiles/chapters retain SSG.
  const shell=await fs.readFile(path.join(source,'index.html'),'utf8');
  const shells=['/es','/es/personas','/es/dinastias','/es/territorios','/es/historias','/es/desafio','/es/proyecto','/es/fuentes','/es/licencias','/es/agradecimientos','/es/privacidad','/en/privacy'];
  for(const route of shells){const dir=path.join(target,route);await fs.mkdir(dir,{recursive:true});await fs.writeFile(path.join(dir,'index.html'),shell);}
  await fs.writeFile(path.join(target,'cloudflare-meta-index.json'),JSON.stringify(index));
  await fs.writeFile(path.join(target,'_headers'),staticHeadersFile());
  const files=[];
  async function measure(dir=''){
    for(const entry of await fs.readdir(path.join(target,dir),{withFileTypes:true})){
      const relative=path.join(dir,entry.name);
      if(entry.isDirectory())await measure(relative);
      else{const stat=await fs.stat(path.join(target,relative));files.push({path:relative,bytes:stat.size});}
    }
  }
  await measure();
  const oversized=files.filter(f=>f.bytes>25*1024*1024);
  if(files.length>20000||oversized.length)throw new Error(`Free plan limits exceeded: ${files.length} files; oversized: ${JSON.stringify(oversized)}`);
  const result={files:files.length,freeFileLimit:20000,remainingFiles:20000-files.length,largest:files.sort((a,b)=>b.bytes-a.bytes)[0],bytes:files.reduce((n,f)=>n+f.bytes,0),reusedEnglishMetadata:reused,ssgPages:report.pages.length,excluded};
  await fs.writeFile('.cloudflare/report.json',JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result,null,2));return result;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await prepareCloudflare();
