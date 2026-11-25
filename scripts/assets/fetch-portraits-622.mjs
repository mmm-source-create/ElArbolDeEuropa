import {portraitDates622} from './portrait-dates-622.mjs';
// 6.2.2: identified portraits and bilingual credits. Originals stay in .cache.
// Two missing/misidentified portraits are deliberately excluded; see release notes.
import fs from 'node:fs';
import sharp from 'sharp';
import {PERSONAS} from '../../src/data/personas.js';
const root='scripts/research/release622/', resolved=JSON.parse(fs.readFileSync(root+'resolved.json'));
const records=Object.assign({},...['farnese','bonaparte','irish'].map(n=>JSON.parse(fs.readFileSync(`src/content/v622/${n}.json`))));
const names=new Map(PERSONAS.map(p=>[p.id,p.nombre]));
const overrides={FRANCISCOFARNESIO:'Francesco Farnese.jpg',LETIZIARAMOLINO:'Letizia Bonaparte by Robert Lefèvre.jpg',HUGHALBERTODONNELL:"Hugh Albert O'Donnell 1615 portrait.webp"};
const exceptions=new Set(['TERESAFARNESIO','MARGMARIAFARNESIO']);
const cache='.cache/portraits-622';fs.mkdirSync(cache+'/raw',{recursive:true});fs.mkdirSync(cache+'/stage',{recursive:true});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function get(url,json=false){for(let i=0;i<6;i++){try{const r=await fetch(url,{headers:{'User-Agent':'TreeOfEurope/6.2.2 (https://www.treeofeurope.eu/)'},signal:AbortSignal.timeout(60000)});if(r.ok)return json?await r.json():Buffer.from(await r.arrayBuffer());console.warn(r.status,url.slice(0,90));}catch(e){console.warn(e.message);}await wait(2000*(i+1));}throw Error('Cannot fetch '+url);}
const clean=x=>String(x||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const es={},en={},source={};
for(const [id,r] of Object.entries(records)){
 if(exceptions.has(id))continue;
 const infoFile=cache+'/raw/'+id+'.json';let info;
 if(fs.existsSync(infoFile))info=JSON.parse(fs.readFileSync(infoFile));
 else if(id==='ISABELLAFARNESIO1668')info={url:'https://complessopilotta.it/wp-content/uploads/2018/12/390-inv-1482-gennari-isabella-farnese.jpg',descriptionUrl:'https://complessopilotta.it/opera/ritratto-di-isabella-farnese/',artist:'Circle of Benedetto Gennari',date:'Late 1670s',licence:'Public domain',licenceUrl:'https://creativecommons.org/publicdomain/mark/1.0/',museum:true};
 else if(overrides[id]){
 const title=overrides[id],data=await get('https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=900&titles='+encodeURIComponent('File:'+title),true),p=Object.values(data.query.pages)[0].imageinfo[0],m=p.extmetadata||{};
 info={url:p.thumburl||p.url,descriptionUrl:p.descriptionurl,artist:clean(m.Artist?.value),date:clean(m.DateTimeOriginal?.value),licence:clean(m.LicenseShortName?.value),licenceUrl:clean(m.LicenseUrl?.value),title};
 }else{info={...resolved[id]?.imageInfo,title:resolved[id]?.image};}
 if(!info.url||!info.licence)throw Error('Missing image or licence '+id);
 fs.writeFileSync(infoFile,JSON.stringify(info,null,2));
 const raw=cache+'/raw/'+id+'.image';if(!fs.existsSync(raw))fs.writeFileSync(raw,await get(info.url));
 const meta=await sharp(raw).metadata(),filename=id+'_622.webp',target='public/personas-img/'+filename;
 await sharp(raw).rotate().resize({width:Math.min(meta.width,900),withoutEnlargement:true}).webp({quality:82}).toFile(target);fs.copyFileSync(target,cache+'/stage/'+filename);
 let authorEn=clean(info.artist).replace(/Unknown author Unknown author|Unknown artist Unknown artist|Unidentified painter|Unknown Person/g,'Unknown artist').replace(/Baron François Gérard.*$/,'François Gérard');
 let authorEs=authorEn.replace(/Attributed to /g,'Atribuido a ').replace(/Formerly attributed to /g,'Anteriormente atribuido a ').replace(/Workshop of /g,'Taller de ').replace(/Circle of /g,'Círculo de ').replace(/Unknown artist/g,'Autor desconocido');
 if(id==='HUGHALBERTODONNELL'){authorEs='Probablemente taller de Peter Paul Rubens';authorEn='Probably the workshop of Peter Paul Rubens';}
 if(id==='FRANCISCOFARNESIO'){authorEs='Pintor de corte no identificado';authorEn='Unidentified court painter';}
 const dates=portraitDates622(id,info);
 const rights=info.licence==='Public domain'?'Dominio público':info.licence;
 es[id]={archivo:'/personas-img/'+filename,encuadre:'50% 20%',tipo:id==='ODOARDO2PRINCEFARN'?'Grabado':id==='FRANCOISCLARY'?'Retrato posterior':id==='MARIANANEOBURG'?'Copia de un retrato':'Retrato',obra:'Retrato de '+names.get(id),autor:authorEs,...(dates[0]?{fecha:dates[0]}:{}),alt:'Retrato de '+names.get(id),fuente:info.museum?'Galleria Nazionale di Parma · Complesso della Pilotta':'Wikimedia Commons',fuenteUrl:info.descriptionUrl,derechos:rights,derechosUrl:info.licenceUrl||'https://creativecommons.org/publicdomain/mark/1.0/'};
 en[id]={tipo:id==='ODOARDO2PRINCEFARN'?'Engraving':id==='FRANCOISCLARY'?'Later portrait':id==='MARIANANEOBURG'?'Copy of a portrait':'Portrait',obra:'Portrait of '+r.name,autor:authorEn,...(dates[1]?{fecha:dates[1]}:{}),alt:'Portrait of '+r.name};
 source[id]={...info,width:meta.width,height:meta.height};console.log(id,meta.width,meta.height,authorEn,rights);await wait(700);
}
fs.mkdirSync('scripts/assets/sources',{recursive:true});fs.writeFileSync('scripts/assets/sources/portraits-622.json',JSON.stringify(source,null,2)+'\n');
fs.writeFileSync('src/data/imagenesPersonas622.js','// 6.2.2: identified portraits; disputed attributions are explicit.\nexport const PORTRAITS_622='+JSON.stringify(es,null,2)+';\n');
fs.writeFileSync('src/features/english/portraits622.js','export const PORTRAITS_622_EN='+JSON.stringify(en,null,2)+';\n');
