
import test from 'node:test';
import assert from 'node:assert/strict';

import { metrics, historyMetrics } from '../src/logic/roundMetrics.js';

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

test('eagle ska inte räknas som birdie', () => {
  const round = [{
    hole: 1,
    par: 5,
    score: 3,
    putts: 1,
    gir: true,
    tee: 'Fairway',
    penalty: 0,
    touched: true
  }];

  const result = metrics(round);

  assert.equal(result.toPar, -2);
  assert.equal(result.birdies, 0);
});

test('ofullständiga hål räknas inte in', () => {
  const round = [{
    hole: 1,
    par: 4,
    score: 4,
    putts: 2,
    gir: null,
    tee: 'Fairway',
    penalty: 0,
    touched: true
  }];

  const result = metrics(round);

  assert.equal(result.n, 0);
  assert.equal(result.girPct, null);
});

test('par 3 räknas inte som möjlig fairway', () => {
  const round = [
    {
      hole: 1,
      par: 3,
      score: 3,
      putts: 2,
      gir: true,
      tee: null,
      penalty: 0,
      touched: true
    },
    {
      hole: 2,
      par: 4,
      score: 4,
      putts: 2,
      gir: true,
      tee: 'Fairway',
      penalty: 0,
      touched: true
    }
  ];

  const result = metrics(round);

  assert.equal(result.teeN, 1);
  assert.equal(result.fairways, 1);
});

test('tom runda ger ingen statistik', () => {
  const result = metrics([]);

  assert.equal(result.n, 0);
  assert.equal(result.score, 0);
  assert.equal(result.girPct, null);
  assert.equal(result.teeN, 0);
});

test('9 och 18 hål ska ha separata snitt', () => {
  const rounds = [
    {
      roundType: 9,
      metrics: { n: 9, score: 39 }
    },
    {
      roundType: 18,
      metrics: { n: 18, score: 78 }
    }
  ];

  const result = historyMetrics(rounds);

  assert.equal(result.scoreAvg9, 39);
  assert.equal(result.scoreAvg18, 78);
  assert.equal(result.bestScore9, 39);
  assert.equal(result.bestScore18, 78);
});
