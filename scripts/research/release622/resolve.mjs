// 6.2.2: matches each new person to Wikidata (human, birth or death year within
// two years of ours), reads the GND authority record from lobid.org to check the
// years, and finds the main image on Commons with its licence.
// Usage: node scripts/research/people613/resolve.mjs   (needs network)
import fs from 'node:fs';
const UA={'User-Agent':'ElArbolDeEuropa-research/1.0 (https://www.treeofeurope.eu/)'};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const get=async(url,json=true)=>{for(let i=0;i<5;i++){try{const r=await fetch(url,{headers:UA,signal:AbortSignal.timeout(25000)});if(r.status===429){await sleep(10000*(i+1));continue;}if(!r.ok)return null;return json?await r.json():await r.text();}catch{await sleep(3000*(i+1));}}return null;};
const dir=new URL('./',import.meta.url);
const people=JSON.parse(fs.readFileSync(new URL('people.json',dir)));
const year=c=>{const t=c?.mainsnak?.datavalue?.value?.time;const m=t?.match(/^([+-])(\d+)-(\d\d)-(\d\d)/);return m?{y:(m[1]==='-'?-1:1)*Number(m[2]),date:`${m[2]}-${m[3]}-${m[4]}`,precision:c.mainsnak.datavalue.value.precision}:null;};
const out={};
const cacheFile=new URL('resolved.json',dir);const cache=fs.existsSync(cacheFile)?JSON.parse(fs.readFileSync(cacheFile)):{};
for(const p of people){
 if(cache[p.id]?.qid){out[p.id]=cache[p.id];continue;}
 const s=p.qid?{search:[{id:p.qid}]}:await get(`https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=en&type=item&limit=7&search=${encodeURIComponent(p.q)}`);await sleep(100);
 const ids=(s?.search||[]).map(h=>h.id);if(!ids.length){out[p.id]={error:'no search'};continue;}
 const ents=(await get(`https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=claims|labels|sitelinks&languages=en|es&ids=${ids.join('|')}`))?.entities||{};await sleep(100);
 const ok=Object.entries(ents).filter(([,e])=>(e.claims?.P31||[]).some(c=>c.mainsnak?.datavalue?.value?.id==='Q5')).map(([qid,e])=>({qid,e,b:year(e.claims.P569?.[0]),d:year(e.claims.P570?.[0])}))
  .filter(x=>p.qid||(p.nac==null||!x.b||Math.abs(x.b.y-p.nac)<=3)&&(p.muer==null||!x.d||Math.abs(x.d.y-p.muer)<=3)&&(x.b||x.d));
 const m=ok[0];if(!m){out[p.id]={error:'no match',candidates:ids};continue;}
 const c=m.e.claims,val=k=>c[k]?.[0]?.mainsnak?.datavalue?.value;
 const r={qid:m.qid,label:m.e.labels?.en?.value,birth:m.b,death:m.d,gnd:val('P227'),bnf:val('P268'),loc:val('P244'),image:val('P18'),eswiki:m.e.sitelinks?.eswiki?.title,enwiki:m.e.sitelinks?.enwiki?.title};
 if(r.gnd){const g=await get(`https://lobid.org/gnd/${r.gnd}.json`);await sleep(100);if(g)r.gndRecord={name:g.preferredName,birth:g.dateOfBirth?.[0],death:g.dateOfDeath?.[0],birthPlace:g.placeOfBirth?.[0]?.label,deathPlace:g.placeOfDeath?.[0]?.label,bio:(g.biographicalOrHistoricalInformation||[]).join(' ').slice(0,300)};}
 if(r.image){const info=await get(`https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=900&titles=${encodeURIComponent('File:'+r.image)}`);await sleep(100);const page=Object.values(info?.query?.pages||{})[0]?.imageinfo?.[0];if(page){const md=page.extmetadata||{},t=k=>String(md[k]?.value||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();r.imageInfo={url:page.thumburl||page.url,descriptionUrl:page.descriptionurl,width:page.width,height:page.height,licence:t('LicenseShortName'),licenceUrl:t('LicenseUrl'),artist:t('Artist').slice(0,160),date:t('DateTimeOriginal').slice(0,80),title:t('ObjectName').slice(0,160),description:t('ImageDescription').slice(0,200)};}}
 out[p.id]=r;fs.writeFileSync(cacheFile,JSON.stringify({...cache,...out},null,1));
 console.log(p.id,r.qid,r.birth?.date,r.death?.date,'gnd',r.gndRecord?.birth,r.gndRecord?.death,'img',r.imageInfo?.licence);
}
fs.writeFileSync(cacheFile,JSON.stringify({...cache,...out},null,1));
