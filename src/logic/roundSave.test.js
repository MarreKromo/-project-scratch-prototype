import test from 'node:test';
import assert from 'node:assert/strict';
import { persistCompletedRound } from './roundSave.js';

test('Lyckad rundsparning uppdaterar historiken', () => {
  const state = {
    rounds: [{ id: 'old-round' }],
    activeRound: { id: 'draft' }
  };
  const savedRound = { id: 'new-round' };
  let persisted;

  const next = persistCompletedRound(
    data => { persisted = data; },
    state,
    savedRound
  );

  assert.deepEqual(next, [
    { id: 'old-round' },
    { id: 'new-round' }
  ]);
  assert.deepEqual(persisted.rounds, next);
  assert.equal(persisted.activeRound, null);
  assert.deepEqual(persisted.lastRound, savedRound);
});

test('Skrivfel ger ingen sparad rundhistorik tillbaka', () => {
  const state = {
    rounds: [{ id: 'old-round' }],
    activeRound: { id: 'draft' }
  };

  assert.throws(
    () => persistCompletedRound(
      () => { throw new Error('Simulerat skrivfel'); },
      state,
      { id: 'new-round' }
    ),
    { message: 'Simulerat skrivfel' }
  );

  assert.deepEqual(state.rounds, [{ id: 'old-round' }]);
  assert.deepEqual(state.activeRound, { id: 'draft' });
});
