// The panorama and personal map use the same meaning for dots and stripes.
export function mosaicAuthorityKind(layers,disputed=false){
 if(disputed)return 'disputed';
 if(layers.some(l=>l.tributaryRelation&&l.tributaryRelation.type!=='feudo'))return 'tributary';
 if(layers.some(l=>l.crownRelation||l.tributaryRelation?.type==='feudo'))return 'apanage';
 return 'sovereign';
}
