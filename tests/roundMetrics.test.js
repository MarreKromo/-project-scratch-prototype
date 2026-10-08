
import test from 'node:test';
import assert from 'node:assert/strict';

import { metrics } from '../src/logic/roundMetrics.js';

test('birdie på par 4 räknas korrekt', () => {
  const round = [{
    hole: 1,
    par: 4,
    score: 3,
    putts: 1,
    gir: true,
    tee: 'Fairway',
    penalty: 0,
    touched: true
  }];

  const result = metrics(round);

  assert.equal(result.n, 1);
  assert.equal(result.score, 3);
  assert.equal(result.toPar, -1);
  assert.equal(result.birdies, 1);
  assert.equal(result.gir, 1);
  assert.equal(result.fairways, 1);
});
