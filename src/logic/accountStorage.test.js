import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getAccountStorageKey,
  getGuestStorageKey
} from './accountStorage.js';

test('Konton får olika lagringsnycklar', () => {
  assert.notEqual(
    getAccountStorageKey('player-A'),
    getAccountStorageKey('player-B')
  );
});

test('Samma konto får samma nyckel', () => {
  assert.equal(
    getAccountStorageKey('player-A'),
    getAccountStorageKey('player-A')
  );
});

test('Gäst och konto hålls separerade', () => {
  assert.notEqual(
    getGuestStorageKey('player-A'),
    getAccountStorageKey('player-A')
  );
});

test('Gäster får olika lagringsnycklar', () => {
  assert.notEqual(
    getGuestStorageKey('guest-A'),
    getGuestStorageKey('guest-B')
  );
});

test('Ogiltigt konto-ID nekas', () => {
  assert.equal(getAccountStorageKey(null), null);
  assert.equal(getAccountStorageKey(''), null);
  assert.equal(getAccountStorageKey('  '), null);
});

test('Ogiltigt gäst-ID nekas', () => {
  assert.equal(getGuestStorageKey(null), null);
  assert.equal(getGuestStorageKey(''), null);
  assert.equal(getGuestStorageKey('  '), null);
});

