import test from 'node:test';
import assert from 'node:assert/strict';
import {blockingVulnerabilities, ACCEPTED_ADVISORIES} from '../scripts/audits/audit-dependencies.mjs';

const accepted = [...ACCEPTED_ADVISORIES.keys()][0];
test('los avisos aceptados no bloquean, pero cualquier otro high sí', () => {
  const report = {vulnerabilities: {
    picomatch: {severity: 'high', via: [{url: `https://github.com/advisories/${accepted}`}]},
    vite: {severity: 'high', via: ['picomatch']},
  }};
  assert.deepEqual(blockingVulnerabilities(report), []);
  report.vulnerabilities.other = {severity: 'high', via: [{url: 'https://github.com/advisories/GHSA-0000-0000-0000'}]};
  assert.deepEqual(blockingVulnerabilities(report), ['other (high)']);
  assert.deepEqual(blockingVulnerabilities({vulnerabilities: {low: {severity: 'low', via: [{url: 'x'}]}}}), []);
});
