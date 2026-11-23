// 6.1.3: writes scripts/assets/sources/portraits-613.json from the Wikidata and
// Commons data in resolved.json, for fetch-portraits-608.mjs 613. The image is
// the person's main image on Wikidata unless OVERRIDE gives a better one.
// Cabeza de Vaca and Orellana have no surviving portrait and Commons only has
// tiny modern images of them, so they stay without one; Erasmus already has his.
import fs from 'node:fs';
const resolved=JSON.parse(fs.readFileSync('scripts/research/people613/resolved.json','utf8'));
const SKIP=new Set(['CABEZADEVACA','ORELLANA','ERASMOROT']);
const OVERRIDE={
 ELCANO:{file:'Juan Sebastián Elcano (siglo XIX).jpg',autor:'Narciso Sentenach',fecha:'siglo XIX',fechaEn:'19th century'},
 LMOLINA:{file:'Luis de Molina.jpg',autor:'Autor desconocido',fecha:'siglo XVII',fechaEn:'17th century'},
 FVITORIA:{file:'Burgos - Monumento a Santo Domingo de Guzmán, estatua sedente de Francisco de Vitoria.jpg',kind:'sculpture',autor:'Fotografía de Zarateman',fecha:'monumento de Burgos',fechaEn:'monument in Burgos',licence:'CC0'},
 DOMINGOSOTO:{file:'DOMINGO DE SOTO016 (3x4 cropped).JPG',kind:'sculpture',autor:'Fotografía de Vicente Alcober Bosch',fecha:'escultura de Segovia',fechaEn:'sculpture in Segovia',licence:'CC BY-SA 4.0',licenceUrl:'https://creativecommons.org/licenses/by-sa/4.0/'},
};
// Kind of image when it is not a painted portrait.
const KIND={PASCAL:'engraving',AZPILCUETA:'engraving',MUNTZER:'engraving',GUTENBERG:'engraving',FIBONACCI:'engraving',CHAUCER:'engraving',WATTYLER:'drawing',MARCOPOLO:'mosaic',FVITORIA:'sculpture',DOMINGOSOTO:'sculpture'};
const KINDS={painting:['Retrato','Portrait'],engraving:['Grabado','Engraving'],drawing:['Dibujo','Drawing'],mosaic:['Mosaico','Mosaic'],sculpture:['Escultura','Sculpture']};
const unknown=a=>!a||/^(unknown|anonymous|anonymous|onbekend|unidentified)/i.test(a)||/unknown author|unknown artist/i.test(a);
const cleanArtist=a=>String(a||'').replace(/\[\d+\]/g,'').replace(/\b(Attributed to|After)\b/gi,m=>m).replace(/\s+/g,' ').trim();
const cleanDate=d=>String(d||'').replace(/\s*date QS:.*$/i,'').replace(/\d{4}-\d\d-\d\d \d\d:\d\d(:\d\d)?/,'').replace(/^circa /i,'c. ').replace(/^between /i,'').trim();
const esArtist=a=>unknown(a)?'Autor desconocido':a.replace(/^Attributed to /i,'Atribuido a ').replace(/^After /i,'Según ').replace(/Anonymous \( Spain \) Unknown author after/i,'Anónimo español');
const enArtist=a=>unknown(a)?'Unknown artist':a.replace(/Anonymous \( Spain \) Unknown author after/i,'Anonymous Spanish artist');
const esDate=d=>d.replace(/^c\. /,'hacia ').replace(/(\d+)\s*th century/i,(m,n)=>`siglo ${['','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX'][Number(n)]}`).replace(/third quarter of siglo/,'tercer cuarto del siglo').replace(/ and c\. /,' y hacia ').replace(/ and /,' y ').replace(/from (\d+) until (\d+)/,'$1–$2').replace(/Before (\d+)/,'antes de $1').replace(/based on a work of (\d+)/,'según una obra de $1');
const out={};
for(const [id,r] of Object.entries(resolved)){
 if(SKIP.has(id)||!r.image)continue;
 const o=OVERRIDE[id]||{},i=r.imageInfo||{};
 const file=o.file||r.image,kind=KINDS[o.kind||KIND[id]||'painting'];
 const artist=o.autor||cleanArtist(i.artist),date=o.fecha||cleanDate(i.date);
 const licence=o.licence||i.licence||'Public domain',pd=/public domain|cc0/i.test(licence);
 out[id]={commons:`File:${file}`,encuadre:'50% 20%',qid:r.qid,
  ...(pd&&!/cc0/i.test(licence)?{}:{derechos:/cc0/i.test(licence)?'CC0 1.0':licence,derechosUrl:/cc0/i.test(licence)?'https://creativecommons.org/publicdomain/zero/1.0/':(o.licenceUrl||i.licenceUrl)}),
  es:{tipo:kind[0],obra:i.title||file.replace(/\.[a-z]+$/i,''),autor:o.autor||esArtist(artist),fecha:o.fecha||esDate(date)},
  en:{tipo:kind[1],obra:i.title||file.replace(/\.[a-z]+$/i,''),autor:enArtist(artist).replace(/^Fotografía de /,'Photograph by '),fecha:o.fechaEn||date}};
}
fs.writeFileSync('scripts/assets/sources/portraits-613.json',JSON.stringify(out,null,2)+'\n');
console.log(Object.keys(out).length,'retratos');
for(const [id,v] of Object.entries(out))console.log(id.padEnd(14),v.es.tipo,'|',v.es.autor,'|',v.es.fecha,'|',v.derechos||'DP');
