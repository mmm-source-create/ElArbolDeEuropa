import fs from 'node:fs';import sharp from 'sharp';
const title='File:Arms of the French Empire.svg',base=process.cwd()+'/';
const r=await fetch('https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata&titles='+encodeURIComponent(title));const p=Object.values((await r.json()).query.pages)[0].imageinfo[0];
fs.writeFileSync(base+'scripts/research/release622/bonaparte-arms.json',JSON.stringify(p,null,2));
const image=await fetch(p.url);const svg=await image.text();if(!image.ok||!svg.includes('<svg')||/<script|<foreignObject|\son\w+=/i.test(svg))throw Error('Invalid SVG');
// Re-encoding as a transparent bitmap removes external links and editor metadata;
// the complex historical drawing remains unchanged.
await sharp(Buffer.from(svg)).resize({width:800}).png().toFile(base+'public/escudos/bonaparte-imperio.png');
for(const k of ['Artist','LicenseShortName','LicenseUrl','Credit'])console.log(k,p.extmetadata[k]?.value);
