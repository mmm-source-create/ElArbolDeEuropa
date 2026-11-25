import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {prepareCloudflare} from './prepare-cloudflare.mjs';
const environment={...process.env,VITE_HOSTING_PROVIDER:'cloudflare'};
const run=(command,args)=>{
  const result=spawnSync(command,args,{stdio:'inherit',env:environment});
  if(result.error)throw result.error;
  if(result.status!==0)process.exit(result.status||1);
};
const npm=process.platform==='win32'?'npm.cmd':'npm';
// 6.2.3: Workers Builds stops a build after 20 minutes, and the data audits of
// prebuild alone take about 15 there. GitHub CI runs those audits (npm run build
// runs prebuild) before every merge, so Workers Builds only regenerates the data.
const SKIP_AUDITS=process.env.WORKERS_CI==='1';
if(!process.argv.includes('--reuse-generated')){
  if(SKIP_AUDITS){run(process.execPath,['scripts/generate/generate-english-v6-runtime.mjs']);run(npm,['run','generate']);}
  else run(npm,['run','prebuild']);
}
run(process.execPath,['node_modules/vite/bin/vite.js','build','--manifest']);
// Read/write instead of native copyfile: local macOS duplicate resources can
// leave native copyfile waiting indefinitely. Original public files stay intact.
function copyPublic(dir=''){
  for(const entry of fs.readdirSync(path.join('public',dir),{withFileTypes:true})){
    if(/ \d+(?:\.|$)/.test(entry.name))continue;
    const relative=path.join(dir,entry.name),target=path.join('dist',relative);
    if(entry.isDirectory()){fs.mkdirSync(target,{recursive:true});copyPublic(relative);}
    else if(entry.isFile())fs.writeFileSync(target,fs.readFileSync(path.join('public',relative)));
    else throw new Error(`Unexpected public resource: ${relative}`);
  }
}
copyPublic();
run(process.execPath,['--max-old-space-size=6144','scripts/generate/prerender-ssg.mjs']);
run(process.execPath,['scripts/audits/audit-ssg.mjs']);
run(process.execPath,['scripts/audits/audit-story-editorial.mjs','--built']);
run(process.execPath,['scripts/audits/audit-url-history.mjs']);
await prepareCloudflare();
