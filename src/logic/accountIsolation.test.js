import test from 'node:test';
import assert from 'node:assert/strict';
import { canAccessAccountData } from './accountIsolation.js';

test('Rätt konto får åtkomst', () => {
  assert.equal(
    canAccessAccountData('player-A', 'player-A'),
    true
  );
});

test('Annat konto nekas åtkomst', () => {
  assert.equal(
    canAccessAccountData('player-B', 'player-A'),
    false
  );
});

test('Saknad session nekas åtkomst', () => {
  assert.equal(
    canAccessAccountData(null, 'player-A'),
    false
  );
});

test('Saknad dataägare nekas åtkomst', () => {
  assert.equal(
    canAccessAccountData('player-A', null),
    false
  );
});

test('Tomma konto-ID nekas åtkomst', () => {
  assert.equal(
    canAccessAccountData('  ', 'player-A'),
    false
  );
});
