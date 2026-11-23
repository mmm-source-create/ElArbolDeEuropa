// 6.1.3: biographies and short summaries, in Spanish and English, of the people
// added for the cultural, scientific, Salamanca, revolutionary and exploration
// expansion, and of five who were already in the base without one. Same record
// format as v607People.js. References: the authority records (GND, BnF, Library
// of Congress) found through Wikidata in scripts/research/people613.
import AUTHORITY from './authority.json' with {type:'json'};
import {SCIENCE} from './science.js';
import {LETTERS} from './letters.js';
import {MUSIC} from './music.js';
import {SALAMANCA} from './salamanca.js';
import {REVOLUTION} from './revolution.js';
import {EXPLORATION} from './exploration.js';

const references=id=>{
  const a=AUTHORITY[id]||{},out=[];
  if(a.gnd)out.push({titulo:`Deutsche Nationalbibliothek · Ficha de autoridad GND · ${a.gnd[1]}`,url:`https://d-nb.info/gnd/${a.gnd[0]}`});
  if(a.bnf)out.push({titulo:'Bibliothèque nationale de France · Ficha de autoridad',url:`https://catalogue.bnf.fr/ark:/12148/cb${a.bnf}`});
  if(a.loc)out.push({titulo:'Library of Congress · Name Authority File',url:`https://id.loc.gov/authorities/names/${a.loc}.html`});
  return out;
};
export const V613_RECORDS=Object.fromEntries(Object.entries({...SCIENCE,...LETTERS,...MUSIC,...SALAMANCA,...REVOLUTION,...EXPLORATION}).map(([id,r])=>[id,{aliases:[],...r,refs:[...(r.refs||[]),...references(id)]}]));
