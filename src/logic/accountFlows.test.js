import test from 'node:test';
import assert from 'node:assert/strict';
import { hasLocalGuestData } from './accountFlows.js';

test('Tom gästprofil saknar golfdata', () => {
  const state = {
    identity: { type: 'guest' },
    rounds: [],
    training: { activities: [] },
    equipment: { clubs: [] },
    courses: [],
    activeRound: null
  };

  assert.equal(hasLocalGuestData(state), false);
});

test('Sparade rundor upptäcks', () => {
  const state = {
    identity: { type: 'guest' },
    rounds: [{ id: 'round-1' }]
  };

  assert.equal(hasLocalGuestData(state), true);
});

test('Träningshistorik upptäcks', () => {
  const state = {
    identity: { type: 'guest' },
    training: {
      activities: [{ id: 'training-1' }]
    }
  };

  assert.equal(hasLocalGuestData(state), true);
});

test('Pågående runda upptäcks', () => {
  const state = {
    identity: { type: 'guest' },
    activeRound: { id: 'draft-1' }
  };

  assert.equal(hasLocalGuestData(state), true);
});

test('Inloggad användare räknas inte som gäst', () => {
  const state = {
    identity: { type: 'account' },
    rounds: [{ id: 'round-1' }]
  };

  assert.equal(hasLocalGuestData(state), false);
});
