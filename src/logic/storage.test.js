import test from 'node:test';
import assert from 'node:assert/strict';
import { load, save } from './storage.js';

const KEY = 'project-scratch-v1';

function mockStorage(initialValue = null) {
  let value = initialValue;
  let writes = 0;

  globalThis.localStorage = {
    getItem(key) {
      assert.equal(key, KEY);
      return value;
    },
    setItem(key, nextValue) {
      assert.equal(key, KEY);
      writes++;
      value = nextValue;
    }
  };

  return {
    get value() { return value; },
    get writes() { return writes; }
  };
}

test('Normal golfhistorik kan läsas', () => {
  const original = {
    schemaVersion: 1,
    rounds: [{ id: 'test-round-1', score: 78 }]
  };

  mockStorage(JSON.stringify(original));

  assert.deepEqual(load(), original);
});

test('Skadad JSON upptäcks utan överskrivning', () => {
  const storage = mockStorage('{skadad-json');

  assert.throws(
    () => load(),
    { message: 'STORAGE_CORRUPTED' }
  );

  assert.equal(storage.value, '{skadad-json');
  assert.equal(storage.writes, 0);
});

test('Läsfel upptäcks utan överskrivning', () => {
  const storage = mockStorage('befintlig-data');

  globalThis.localStorage.getItem = () => {
    throw new Error('Simulerat läsfel');
  };

  assert.throws(
    () => load(),
    { message: 'STORAGE_READ_FAILED' }
  );

  assert.equal(storage.value, 'befintlig-data');
  assert.equal(storage.writes, 0);
});

test('Normal sparning fungerar', () => {
  const storage = mockStorage();

  save({ rounds: [{ id: 'test-round-2' }] });

  assert.deepEqual(
    JSON.parse(storage.value).rounds,
    [{ id: 'test-round-2' }]
  );
  assert.equal(storage.writes, 1);
});

test('Skrivfel bevarar befintlig golfhistorik', () => {
  const original = JSON.stringify({
    schemaVersion: 1,
    rounds: [{ id: 'important-round', score: 78 }]
  });

  const storage = mockStorage(original);

  globalThis.localStorage.setItem = () => {
    throw new Error('Simulerat skrivfel');
  };

  assert.throws(
    () => save({ rounds: [] }),
    { message: 'Simulerat skrivfel' }
  );

  assert.equal(storage.value, original);
  assert.equal(storage.writes, 0);
});
