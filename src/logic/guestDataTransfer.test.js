import test from 'node:test';
import assert from 'node:assert/strict';
import { getGuestTransferDecision } from './guestDataTransfer.js';

const valid = {
  guestId: 'guest-A',
  accountId: 'account-A',
  confirmed: true,
  accountHasData: false
};

test('Godkänd import kan förberedas', () => {
  assert.deepEqual(getGuestTransferDecision(valid), {
    allowed: true,
    action: 'PREPARE_GUEST_IMPORT',
    preserveGuestBackup: true
  });
});

test('Import utan bekräftelse nekas', () => {
  assert.equal(
    getGuestTransferDecision({
      ...valid,
      confirmed: false
    }).reason,
    'CONFIRMATION_REQUIRED'
  );
});

test('Befintlig kontodata kräver granskning', () => {
  assert.equal(
    getGuestTransferDecision({
      ...valid,
      accountHasData: true
    }).reason,
    'ACCOUNT_DATA_REVIEW_REQUIRED'
  );
});

test('Saknat gäst-ID nekas', () => {
  assert.equal(
    getGuestTransferDecision({
      ...valid,
      guestId: null
    }).reason,
    'INVALID_IDENTITY'
  );
});

test('Saknat konto-ID nekas', () => {
  assert.equal(
    getGuestTransferDecision({
      ...valid,
      accountId: ''
    }).reason,
    'INVALID_IDENTITY'
  );
});

test('Okänd kontodatastatus nekas', () => {
  assert.equal(
    getGuestTransferDecision({
      ...valid,
      accountHasData: undefined
    }).allowed,
    false
  );
});

