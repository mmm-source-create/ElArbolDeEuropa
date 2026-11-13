import fs from 'node:fs/promises';
import path from 'node:path';
const report=JSON.parse(await fs.readFile('dist/ssg-report.json','utf8'));
const pages=report.pages.filter(p=>/^\/es\/persona\//.test(p.path)||/^\/en\/person\//.test(p.path));
const errors=[];
for(const page of pages){
 const html=await fs.readFile(path.join('dist',page.path,'index.html'),'utf8');
 const biography=html.match(/<section class="public-long-bio"[\s\S]*?<\/section><\/section>/)?.[0];
 const hero=html.match(/<div class="public-person-hero-copy">[\s\S]*?<\/header>/)?.[0];
 if(!hero?.match(/<p>([\s\S]*?)<\/p>/)?.[1]?.replace(/<[^>]*>/g,'').trim())errors.push(`${page.path}: missing summary`);
 if(!biography||!biography.includes('id="public-long-bio-title"')||!biography.includes('<h3>'))errors.push(`${page.path}: missing chapter structure`);
 if(biography&&(/<h3>\s*<\/h3>/.test(biography)||/<p>\s*<\/p>/.test(biography)))errors.push(`${page.path}: empty biography content`);
}
console.log(`Biography layout: ${pages.length} profiles; ${errors.length} errors.`);
if(errors.length){console.error(errors.slice(0,20).join('\n'));process.exitCode=1;}
