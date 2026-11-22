import fs from 'node:fs/promises';import {page} from './fetch.mjs';
const urls=JSON.parse(await fs.readFile(process.argv[2],'utf8'));
for(const url of [...new Set(urls)]){try{const p=await page(url);console.log(p.title,p.text.length);}catch(e){console.log(e.message);}await new Promise(r=>setTimeout(r,650));}
