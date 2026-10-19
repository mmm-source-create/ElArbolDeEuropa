import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {atlasPoliticalMosaicAt,atlasMosaicPalette} from '../../src/cartography/atlasMosaic.js';
import {projectRoot,auditReportPath} from '../lib/project-paths.mjs';

const sorted = values => [...values].sort();
export function validateGermanyCompletion(review, geography, baseline) {
  if (geography.definition !== 'germany-completion-geography.json' || geography.schema !== 1
    || baseline.schema !== 1 || baseline.commit !== 'e696f9ba84d4a1837cc63e7c642a4a5dd14a66e4')
    throw Error('Invalid independent completion inventory or baseline');
  const ids = sorted(geography.cells.map(cell => cell.id));
  if (ids.length !== 1002 || new Set(ids).size !== ids.length
    || JSON.stringify(ids) !== JSON.stringify(sorted(review.scope.ids))
    || JSON.stringify(ids) !== JSON.stringify(sorted(baseline.cells.map(cell => cell.id))))
    throw Error('Completion scope omits or duplicates a geographic cell');
  if (review.scope.from !== 1200 || review.scope.through !== 1800
    || !review.precedenceByAssignment || review.precedenceIds.length)
    throw Error('Completion must cover 601 years with dated precedence only');
  const byId = new Map(baseline.cells.map(cell => [cell.id,cell]));
  const intervals = new Map();
  for (const phase of review.assignments) {
    if (!phase.ids.length || !phase.note || !phase.sourceKeys.length
      || phase.sourceKeys.some(key => !review.sources[key]?.url?.startsWith('https://') || !review.sources[key]?.locator))
      throw Error('Completion phase lacks local evidence');
    for (const id of phase.ids) {
      if (!byId.get(id)?.gaps.some(gap => gap.from <= phase.from && phase.through <= gap.through))
        throw Error('Completion would replace an existing attribution: '+id+'/'+phase.from);
      if (!intervals.has(id)) intervals.set(id,[]);
      intervals.get(id).push([phase.from,phase.through]);
    }
  }
  // Assert exact equality of the empty annual domain and the new phases. One
  // year gaps, duplicates and accidental expansion outside the window fail.
  for (const cell of baseline.cells) for (let year=1200;year<=1800;year++) {
    const wanted = cell.gaps.some(gap => gap.from<=year && year<=gap.through) ? 1 : 0;
    const actual = (intervals.get(cell.id)||[]).filter(([from,through])=>from<=year&&year<=through).length;
    if (actual !== wanted) throw Error('Completion phase gap or overlap: '+cell.id+'/'+year);
  }
  return byId;
}

export function preservationHash(byLocation) {
  return createHash('sha256').update(JSON.stringify([...byLocation]
    .map(([id,layers]) => [id,layers.map(layer=>layer.entityId).sort()])
    .sort(([a],[b])=>a.localeCompare(b,'en')))).digest('hex');
}

export function auditGermanyCompletion(data, review, geography, baseline) {
  const before = validateGermanyCompletion(review,geography,baseline);
  const palette = atlasMosaicPalette(data);
  const report = {scope:review.scope,baselineCommit:baseline.commit,
    summary:{cells:before.size,years:601,cellYears:before.size*601,filledCellYears:0,
      missingCellYears:0,missingLocalEvidence:0,changedRetainedCellYears:0,changedAnnualMaps:0},
    failures:[],limitations:review.limitations};
  const fail = (kind,id,year) => {if(report.failures.length<100)report.failures.push({kind,id,year});};
  for(let year=1200;year<=1800;year++) {
    const mosaic = atlasPoliticalMosaicAt(data,year,palette);
    const retained = new Map(mosaic.byLocation);
    for(const [id,cell] of before) {
      const layers = mosaic.byLocation.get(id)||[];
      const wasEmpty = cell.gaps.some(gap => gap.from<=year&&year<=gap.through);
      if(!layers.length){report.summary.missingCellYears++;fail('missing',id,year);}
      if(wasEmpty) {
        retained.delete(id);
        if(layers.length)report.summary.filledCellYears++;
        if(layers.length!==1 || !layers.every(layer => (layer.scopes||[]).some(scope => scope.ids.includes(id)
          && scope.note && scope.sources.length && scope.sources.every(source=>source.url?.startsWith('https://')&&source.locator)))) {
          report.summary.missingLocalEvidence++;fail('local evidence',id,year);
        }
      } else {
        const expected = cell.changes.findLast(change=>change.from<=year).identities;
        if(JSON.stringify(layers.map(layer=>layer.entityId).sort())!==JSON.stringify(expected)) {
          report.summary.changedRetainedCellYears++;fail('retained attribution changed',id,year);
        }
      }
    }
    if(preservationHash(retained)!==baseline.annualPreservation[year]) {
      report.summary.changedAnnualMaps++;fail('global preservation',null,year);
    }
  }
  return report;
}

if(process.argv[1] && path.resolve(process.argv[1])===import.meta.filename) {
  const read = name=>JSON.parse(fs.readFileSync(path.join(projectRoot,'data/cartography',name)));
  const report = auditGermanyCompletion(read('corridor-locations.json'),read('germany-completion-review.json'),
    read('germany-completion-geographic-cells.json'),read('germany-completion-baseline.json'));
  fs.writeFileSync(auditReportPath('audit-germany-completion-report.json'),JSON.stringify(report,null,2)+'\n');
  console.log('Alemania 1200–1800: '+JSON.stringify(report.summary));
  if(report.failures.length)throw Error('German completion coverage, evidence or preservation failed');
}
