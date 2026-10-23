import fs from 'node:fs';
import {PERSONAS} from '../../src/data/personas.js';
import {PERSON_NAME_REVIEWS} from '../../src/data/personNameReviews.js';
import {nameReviewIssues,HISTORICAL_NAME_EXCEPTIONS} from '../../src/domain/people/personNaming.js';
import {COMPLETE_ENGLISH_PROFILES} from '../../src/features/english/fullProfiles.js';
import {TRANSLATED_PEOPLE} from '../../src/features/english/routes.js';

const issues=PERSONAS.flatMap(p=>nameReviewIssues(p).map(issue=>`${p.id}: ${issue}`));
for(const review of PERSON_NAME_REVIEWS){const p=PERSONAS.find(p=>p.id===review.id);
 if(p?.nombre!==review.after.nombre||(p?.sobrenombre||'')!==review.after.sobrenombre)issues.push(`${review.id}: reviewed decision changed`);
 if(review.before.nombre!==review.after.nombre&&(!p.aliases?.includes(review.before.nombre)||p.slug!==review.slug))issues.push(`${review.id}: former name or URL lost`);
}
for(const [id,p]of Object.entries(COMPLETE_ENGLISH_PROFILES)){
 if(!TRANSLATED_PEOPLE.some(r=>r.id===id))issues.push(`${id}: missing English route`);
 if(p.nickname&&p.name.toLowerCase().includes(p.nickname.toLowerCase()))issues.push(`${id}: duplicated English nickname`);
 if(/\bthe [A-Z]/.test(p.name)&&!HISTORICAL_NAME_EXCEPTIONS[id])issues.push(`${id}: epithet in English heading`);
 if(/^(?:King|Queen|Saint) /.test(p.name))issues.push(`${id}: title in English heading`);
}
const report={policy:'V5.36',reviewedSpanish:PERSONAS.length,reviewedEnglish:Object.keys(COMPLETE_ENGLISH_PROFILES).length,
 decisions:PERSON_NAME_REVIEWS,exceptions:HISTORICAL_NAME_EXCEPTIONS,issues};
if(process.argv.includes('--write')){fs.mkdirSync('docs/audits',{recursive:true});fs.writeFileSync('docs/audits/V5.36-nombres.json',JSON.stringify(report,null,2)+'\n');}
console.log(`Nombres: ${report.reviewedSpanish} registros españoles, ${report.reviewedEnglish} ingleses, ${report.decisions.length} ajustes revisados; ${issues.length} incidencias.`);
for(const issue of issues)console.error(issue);
if(issues.length)process.exitCode=1;
