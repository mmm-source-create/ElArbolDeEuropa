// Display dates retain broad/uncertain catalogue datings. Commons has an
// impossible sixteenth-century tag for Margherita (born 1612); do not publish it.
export function portraitDates622(id,info){
 if(['MARGARITAMEDICIFARN','ALEJANDROOREILLY'].includes(id))return ['Fecha no confirmada','Date unconfirmed'];
 const special={ISABELLAFARNESIO1668:['Finales de la década de 1670','Late 1670s'],HUGHALBERTODONNELL:['1615','1615']};
 if(special[id])return special[id];
 let raw=String(info.date||'').split(' date QS:')[0].trim();
 const century=raw.match(/(\d+)\s*th century/);
 const roman={16:'XVI',17:'XVII',18:'XVIII',19:'XIX'};
 if(century){const n=Number(century[1]);return raw.startsWith('after a work')?[`Copia de una obra del siglo ${roman[n]}`,`After a ${n}th-century work`]:[`Siglo ${roman[n]}`,`${n}th century`];}
 const between=raw.match(/^between (\d{4}) and (\d{4})/);if(between)return [`Entre ${between[1]} y ${between[2]}`,`Between ${between[1]} and ${between[2]}`];
 const after=raw.match(/^after (\d{4})/);if(after)return [`Después de ${after[1]}`,`After ${after[1]}`];
 raw=raw.replace(/^circa\s*/,'c. ').replace(/^c\.\s*/,'c. ').replace(/^\(|\)$/g,'').replace(/\s*-\s*/g,'–');
 return /^c\. \d{4}(?:–\d{4})?$|^\d{4}(?:–\d{4})?$/.test(raw)?[raw,raw]:['Fecha no confirmada','Date unconfirmed'];
}
