import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getGuestTransferDecision,
  getGuestImportCompletion
} from './guestDataTransfer.js';


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

test('Säker gästimport godkänns', () => {
  assert.deepEqual(
    getGuestImportCompletion({
      importVerified: true,
      guestBackupPreserved: true,
      accountOwnershipVerified: true
    }),
    {
      allowed: true,
      reason: null
    }
  );
});

test('Gästbackup måste bevaras', () => {
  assert.equal(
    getGuestImportCompletion({
      importVerified: true,
      guestBackupPreserved: false,
      accountOwnershipVerified: true
    }).reason,
    'GUEST_BACKUP_NOT_PRESERVED'
  );
});

test('Kontoägarskap måste verifieras', () => {
  assert.equal(
    getGuestImportCompletion({
      importVerified: true,
      guestBackupPreserved: true,
      accountOwnershipVerified: false
    }).reason,
    'ACCOUNT_OWNERSHIP_NOT_VERIFIED'
  );
});

test('Importen måste verifieras', () => {
  assert.equal(
    getGuestImportCompletion({
      importVerified: false,
      guestBackupPreserved: true,
      accountOwnershipVerified: true
    }).reason,
    'IMPORT_NOT_VERIFIED'
  );
});

