// Shared by the review steps: polite User-Agent, retries and Wikidata claim readers.
export const UA={'User-Agent':'ElArbolDeEuropa-review/1.0 (https://treeofeurope.eu; genealogical atlas bibliographic review)'};
export const sleep=ms=>new Promise(r=>setTimeout(r,ms));
// GET JSON with retries (longer pause after HTTP 429). Without a valid answer it returns {} or, with orThrow, fails.
export const getJSON=async(url,{tries=5,orThrow=false}={})=>{for(let a=0;a<tries;a++){try{const r=await fetch(url,{headers:UA,signal:AbortSignal.timeout(20000)});if(r.status===429){await sleep(15000*(a+1));continue}return await r.json()}catch{await sleep(3000*(a+1))}}if(orThrow)throw Error(url);return {}};
export const year=v=>{const t=v?.mainsnak?.datavalue?.value?.time;if(!t)return null;const m=t.match(/^([+-])(\d+)-/);return m?(m[1]==='-'?-1:1)*+m[2]:null};
export const ids=(c,p)=>(c[p]||[]).map(s=>s.mainsnak?.datavalue?.value?.id).filter(Boolean);
const first=(c,p)=>c[p]?.[0]?.mainsnak?.datavalue?.value||null;
const values=(c,p)=>(c[p]||[]).map(s=>s.mainsnak?.datavalue?.value).filter(Boolean);
// Cached summary of a Wikidata entity: dates, relatives and authority identifiers.
export const entityRecord=e=>{const c=e.claims||{};return {label:e.labels?.es?.value||e.labels?.en?.value,desc:e.descriptions?.es?.value||e.descriptions?.en?.value,human:ids(c,'P31').includes('Q5'),
 birth:(c.P569||[]).map(year).filter(v=>v!==null),death:(c.P570||[]).map(year).filter(v=>v!==null),father:ids(c,'P22'),mother:ids(c,'P25'),spouse:ids(c,'P26'),
 gnd:values(c,'P227'),bnf:values(c,'P268'),dbe:first(c,'P4459'),dbi:first(c,'P1986'),odnb:first(c,'P1415'),britannica:first(c,'P1417')}};
