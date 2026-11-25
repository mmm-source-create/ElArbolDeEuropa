// 6.2.2: Spanish and English are published together. Authority records support
// vital data only; narrative and family claims retain their specific references.
import FARNESI from './farnese.json' with {type:'json'};
import BONAPARTE from './bonaparte.json' with {type:'json'};
import IRISH from './irish.json' with {type:'json'};
import AUTHORITY from './authority.json' with {type:'json'};
const authorityReferences=id=>{
 const a=AUTHORITY[id]||{},refs=[];
 if(a.gnd)refs.push({titulo:`Deutsche Nationalbibliothek · GND · ${a.gndRecord?.name||id}`,url:`https://d-nb.info/gnd/${a.gnd}`});
 if(a.bnf)refs.push({titulo:'Bibliothèque nationale de France · Ficha de autoridad',url:`https://catalogue.bnf.fr/ark:/12148/cb${a.bnf}`});
 return refs;
};
export const V622_RECORDS=Object.fromEntries(Object.entries({...FARNESI,...BONAPARTE,...IRISH}).map(([id,r])=>[id,{...r,refs:[...r.refs,...authorityReferences(id)]}]));
