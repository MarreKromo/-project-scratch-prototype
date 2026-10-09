import test from 'node:test';
import assert from 'node:assert/strict';

import {
  canAccessAccountData,
  getAccountSwitchDecision,
  getSignOutPrivacyDecision
} from './accountIsolation.js';

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

test('Samma konto kräver inte isolering', () => {
  assert.deepEqual(
    getAccountSwitchDecision('A', 'A'),
    {
      allowed: true,
      requiresDataIsolation: false
    }
  );
});

test('Kontobyte kräver dataisolering', () => {
  assert.deepEqual(
    getAccountSwitchDecision('A', 'B'),
    {
      allowed: false,
      reason: 'ACCOUNT_DATA_ISOLATION_REQUIRED'
    }
  );
});

test('Okänt nuvarande konto nekas', () => {
  assert.equal(
    getAccountSwitchDecision(null, 'B').allowed,
    false
  );
});

test('Okänt nästa konto nekas', () => {
  assert.equal(
    getAccountSwitchDecision('A', null).allowed,
    false
  );
});

