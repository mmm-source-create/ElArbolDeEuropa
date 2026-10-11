import {legacyFormats, validateContracts} from '../schema/data-contract.mjs';
import {readContractData, readJson} from '../schema/read-contract-data.mjs';
import {CLAIM_REVIEWS} from '../../src/evidence/reviewRecords.js';

const data = await readContractData();
const legacy = await readJson('tests/baselines/v5-legacy-formats.json');
if (legacy.schema !== 1) throw new Error('Versión de compatibilidad no admitida');
const issues = validateContracts({...data, legacy, claimReviews: CLAIM_REVIEWS});
for (const issue of issues) console.error(`${issue.code} · ${issue.path} · ${issue.message}`);
const formats = legacyFormats(data.people);
console.log(`Contrato V5: ${data.people.length} personas, ${data.people.reduce((count, p) => count + (p.gobiernos?.length || 0), 0)} gobiernos; ${issues.length} errores.`);
console.log(`Formatos heredados pendientes: ${Object.entries(formats).map(([key, entries]) => `${key}=${Object.keys(entries).length}`).join(', ')}.`);
if (issues.length) process.exitCode = 1;
