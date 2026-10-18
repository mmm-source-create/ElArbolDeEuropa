import test from 'node:test';
import assert from 'node:assert/strict';
import {PERSONAS} from '../src/data/personas.js';
import {buildCorridorReviews} from '../src/evidence/corridorReviews.js';
import {CORRIDOR_REVIEWS} from '../src/evidence/corridorReviewData.js';

test('corridorReviewData.js coincide con las revisiones derivadas de PERSONAS', () => {
  assert.equal(JSON.stringify(CORRIDOR_REVIEWS), JSON.stringify(buildCorridorReviews(PERSONAS)),
    'Regenera con: node scripts/generate/generate-corridor-reviews.mjs');
});
