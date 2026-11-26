import fs from 'node:fs';
const titles=['Jerónimo de Ayanz y Beaumont','Martín Cortés de Albacar','Maximilian Sforza','Alfonso II of Naples','Alfonso of Aragon (1481–1500)','Sancha of Aragon, Princess of Squillace','Burdukhan of Alania','Gvantsa Kakhaberidze','Rusudan of Circassia','Darejan Dadiani','Helena Dragaš','Laura Martinozzi','Laura Dianti'];
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const get=async url=>{for(let i=0;i<6;i++){try{const r=await fetch(url,{headers:{'User-Agent':'TreeOfEurope/6.3.6'},signal:AbortSignal.timeout(45000)});if(r.ok)return await r.json();console.warn(r.status,url.slice(0,100));}catch(e){console.warn(e.message);}await pause(6000*(i+1));}throw Error(url);};
const pages=Object.values((await get('https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageprops|pageimages&piprop=name&titles='+encodeURIComponent(titles.join('|')))).query.pages);
const out=fs.existsSync('scripts/research/release636/image-research.json')?JSON.parse(fs.readFileSync('scripts/research/release636/image-research.json')):{};
for(const p of pages){if(out[p.title]?.imageInfo||out[p.title]?.image===null)continue;const q=p.pageprops?.wikibase_item;let entity;if(q)entity=(await get('https://www.wikidata.org/wiki/Special:EntityData/'+q+'.json')).entities[q];const claims=entity?.claims||{};
const img=claims.P18?.[0]?.mainsnak.datavalue?.value||p.pageimage;
out[p.title]={qid:q,image:img,gnd:claims.P227?.[0]?.mainsnak.datavalue?.value,bnf:claims.P268?.[0]?.mainsnak.datavalue?.value,bios:claims.P7298?.[0]?.mainsnak.datavalue?.value};
if(img){const v=Object.values((await get('https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=900&titles='+encodeURIComponent('File:'+img))).query.pages)[0];out[p.title].imageInfo=v.imageinfo?.[0];}
out[p.title].image=img||null;fs.writeFileSync('scripts/research/release636/image-research.json',JSON.stringify(out,null,2)+'\n');console.log(p.title,q,img);await pause(1400);
}
fs.writeFileSync('scripts/research/release636/image-research.json',JSON.stringify(out,null,2)+'\n');
