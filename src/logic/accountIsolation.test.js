import test from 'node:test';
import assert from 'node:assert/strict';

import {
  canAccessAccountData,
  getAccountSwitchDecision,
  getSignOutPrivacyDecision,
  getAccountSwitchCompletion
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

test('Säker utloggning godkänns', () => {
  assert.deepEqual(
    getSignOutPrivacyDecision({
      sessionEnded: true,
      privateDataHidden: true,
      unsyncedDataProtected: true
    }),
    {
      allowed: true,
      reason: null
    }
  );
});

test('Privat data får inte vara synlig', () => {
  assert.equal(
    getSignOutPrivacyDecision({
      sessionEnded: true,
      privateDataHidden: false,
      unsyncedDataProtected: true
    }).reason,
    'PRIVATE_DATA_STILL_VISIBLE'
  );
});

test('Osynkroniserad data måste skyddas', () => {
  assert.equal(
    getSignOutPrivacyDecision({
      sessionEnded: true,
      privateDataHidden: true,
      unsyncedDataProtected: false
    }).reason,
    'UNSYNCED_DATA_NOT_PROTECTED'
  );
});

test('Sessionen måste vara avslutad', () => {
  assert.equal(
    getSignOutPrivacyDecision({
      sessionEnded: false,
      privateDataHidden: true,
      unsyncedDataProtected: true
    }).reason,
    'SESSION_STILL_ACTIVE'
  );
});

test('Säkert kontobyte godkänns', () => {
  assert.deepEqual(
    getAccountSwitchCompletion({
      previousDataHidden: true,
      nextAccountVerified: true,
      unsyncedDataProtected: true
    }),
    {
      allowed: true,
      reason: null
    }
  );
});

test('Tidigare kontots data måste döljas', () => {
  assert.equal(
    getAccountSwitchCompletion({
      previousDataHidden: false,
      nextAccountVerified: true,
      unsyncedDataProtected: true
    }).reason,
    'PREVIOUS_DATA_STILL_VISIBLE'
  );
});

test('Nästa konto måste verifieras', () => {
  assert.equal(
    getAccountSwitchCompletion({
      previousDataHidden: true,
      nextAccountVerified: false,
      unsyncedDataProtected: true
    }).reason,
    'NEXT_ACCOUNT_NOT_VERIFIED'
  );
});

test('Osynkroniserad data skyddas vid kontobyte', () => {
  assert.equal(
    getAccountSwitchCompletion({
      previousDataHidden: true,
      nextAccountVerified: true,
      unsyncedDataProtected: false
    }).reason,
    'UNSYNCED_DATA_NOT_PROTECTED'
  );
});

