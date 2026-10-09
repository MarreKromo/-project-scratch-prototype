import test from 'node:test';
import assert from 'node:assert/strict';
import { getAuthFlowDecision } from './authFlow.js';

test('Registrering med giltig e-post', () => {
  assert.deepEqual(
    getAuthFlowDecision({
      action: 'REGISTER',
      email: 'player@example.com'
    }),
    {
      allowed: true,
      nextStep: 'REQUEST_EMAIL_VERIFICATION'
    }
  );
});

test('Registrering med ogiltig e-post nekas', () => {
  assert.equal(
    getAuthFlowDecision({
      action: 'REGISTER',
      email: 'invalid-email'
    }).reason,
    'INVALID_EMAIL'
  );
});

test('Inloggning kräver giltig session', () => {
  assert.equal(
    getAuthFlowDecision({
      action: 'SIGN_IN',
      emailVerified: true,
      sessionValid: false
    }).allowed,
    false
  );
});

test('Inloggning kräver verifierad e-post', () => {
  assert.equal(
    getAuthFlowDecision({
      action: 'SIGN_IN',
      emailVerified: false,
      sessionValid: true
    }).reason,
    'EMAIL_VERIFICATION_REQUIRED'
  );
});

test('Godkänd inloggning går vidare', () => {
  assert.deepEqual(
    getAuthFlowDecision({
      action: 'SIGN_IN',
      emailVerified: true,
      sessionValid: true
    }),
    {
      allowed: true,
      nextStep: 'CHECK_ACCOUNT_DATA'
    }
  );
});

test('Lösenordsåterställning kan begäras', () => {
  assert.equal(
    getAuthFlowDecision({
      action: 'RECOVER_PASSWORD'
    }).nextStep,
    'REQUEST_RECOVERY_EMAIL'
  );
});

test('Okänd åtgärd nekas', () => {
  assert.equal(
    getAuthFlowDecision({
      action: 'UNKNOWN'
    }).reason,
    'UNKNOWN_ACTION'
  );
});

