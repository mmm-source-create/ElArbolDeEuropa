import fs from 'node:fs';
import sharp from 'sharp';
const files={
 LUCRECIABORJA:['Dosso DOSSI , Battista DOSSI (attributed to) - Lucrezia Borgia, Duchess of Ferrara - Google Art Project.jpg','Dosso Dossi; atribuido también a Battista Dossi','Dosso Dossi; also attributed to Battista Dossi','1519–1530','Retrato identificado por el museo','Portrait identified by the museum','National Gallery of Victoria, Melbourne'],
 ALFONSO1ESTE:["Portrait of Alfonso I d'Este, Duke of Ferrara (1476–1534), by Battista Dossi.jpg",'Battista Dossi','Battista Dossi','c. 1534–1536','Retrato','Portrait','Galleria Estense, Modena'],
 MARTINCORTESALBACAR:['Retrato de Martín Cortes. De Bujaraloz.jpg','Grabador anónimo','Anonymous printmaker','1556','Ilustración de su tratado','Illustration from his treatise','Biblioteca Nacional de España'],
 MAXIMILIANOSFORZA:['Massimiliano Sforza by G.A. de Predis (Donatus Grammatica).jpg','Giovanni Ambrogio de Predis','Giovanni Ambrogio de Predis','c. 1496–1499','Miniatura contemporánea','Contemporary miniature','Biblioteca Trivulziana, Milano'],
 ALFONSO2NAP:['Alphonso II Re di Napoli.png','Grabador no identificado','Unidentified printmaker','Siglo XVII','Grabado posterior','Later print','Bibliothèque Sainte-Geneviève, Paris'],
 LAURADIANTI:['Tizian 058.jpg','Tiziano','Titian','c. 1520–1525','Retrato contemporáneo','Contemporary portrait',''],
 LAURAMARTINOZZI:['Laura Martinozzi duchessa Modena.jpg','Autor desconocido','Unknown artist','Siglo XVII','Retrato','Portrait',''],
 DAREJANDADIANI:['Darejan, Queen of Georgia (18th century).jpg','Autor desconocido','Unknown artist','Finales del siglo XVIII','Retrato','Portrait',''],
 HELENADRAGAS:['Empress Helena Dragash.JPG','Miniaturista bizantino no identificado','Unidentified Byzantine illuminator','Época bizantina','Miniatura contemporánea','Contemporary miniature','Musée du Louvre · Ivoires 100'],
};
const cache='.cache/portraits-636';fs.mkdirSync(cache,{recursive:true});
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function get(url,json=false){for(let n=0;n<6;n++){try{const r=await fetch(url,{headers:{'User-Agent':'TreeOfEurope/6.3.6 (https://www.treeofeurope.eu/)'},signal:AbortSignal.timeout(45000)});if(r.ok)return json?await r.json():Buffer.from(await r.arrayBuffer());console.warn(r.status,url.slice(0,90));}catch(e){console.warn(e.message);}await pause(6000*(n+1));}throw Error(url);}
const clean=x=>String(x||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const es={},en={},credits={};const {PERSONAS}=await import('../../src/data/personas.js');const names=new Map(PERSONAS.map(p=>[p.id,p.nombre]));const records=JSON.parse(fs.readFileSync('src/content/v636/people.json'));
for(const [id,[title,author,authorEn,date,type,typeEn,institution]] of Object.entries(files)){
 const metaPath=cache+'/'+id+'.json';let info;
 if(fs.existsSync(metaPath))info=JSON.parse(fs.readFileSync(metaPath));else{const data=await get('https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=900&titles='+encodeURIComponent('File:'+title),true);info=Object.values(data.query.pages)[0]?.imageinfo?.[0];if(!info)throw Error('Missing file '+id);fs.writeFileSync(metaPath,JSON.stringify(info,null,2));}
 const m=info.extmetadata||{},licence=clean(m.LicenseShortName?.value);if(!licence)throw Error('No licence '+id);
 const raw=cache+'/'+id+'.raw';if(!fs.existsSync(raw))fs.writeFileSync(raw,await get(info.thumburl||info.url));
 const file=id+'_636.webp';await sharp(raw).rotate().resize({width:900,withoutEnlargement:true}).webp({quality:84}).toFile('public/personas-img/'+file);
 const dateEn=date.replace('Siglo XVII','17th century').replace('Finales del siglo XVIII','Late 18th century').replace('Época bizantina','Byzantine period');
 es[id]={archivo:'/personas-img/'+file,encuadre:id==='HELENADRAGAS'?'50% 12%':'50% 20%',tipo:type,obra:'Retrato de '+names.get(id),autor:author,fecha:date,...(institution?{institucion:institution}:{}),alt:'Retrato de '+names.get(id),fuente:'Wikimedia Commons',fuenteUrl:info.descriptionurl,derechos:licence==='Public domain'?'Dominio público':licence,derechosUrl:clean(m.LicenseUrl?.value)||'https://creativecommons.org/publicdomain/mark/1.0/'};
 en[id]={tipo:typeEn,obra:'Portrait of '+records[id].name,autor:authorEn,fecha:dateEn,alt:'Portrait of '+records[id].name,...(institution?{institucion:institution}:{})};
 if(id==='MARTINCORTESALBACAR'){es[id].obra=es[id].alt='Ilustración del Breve compendio de Martín Cortés (1556)';en[id].obra=en[id].alt='Illustration from Martín Cortés’s Breve compendio (1556)';es[id].encuadre='50% 50%';}
 credits[id]={title,descriptionUrl:info.descriptionurl,width:info.width,height:info.height,licence,licenceUrl:es[id].derechosUrl,sourceUrl:info.url};console.log(id,licence,info.width,info.height);await pause(1600);
}
fs.writeFileSync('src/data/imagenesPersonas636.js','export const PORTRAITS_636='+JSON.stringify(es,null,2)+';\n');
fs.writeFileSync('src/features/english/portraits636.js','export const PORTRAITS_636_EN='+JSON.stringify(en,null,2)+';\n');
fs.mkdirSync('scripts/assets/sources',{recursive:true});fs.writeFileSync('scripts/assets/sources/portraits-636.json',JSON.stringify(credits,null,2)+'\n');
