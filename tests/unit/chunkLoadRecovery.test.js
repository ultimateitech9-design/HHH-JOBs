import test from 'node:test';
import assert from 'node:assert/strict';

import {
  attemptChunkRecovery,
  clearChunkRecoveryAttempt,
  installChunkLoadRecovery,
  isRecoverableChunkError,
  shouldAttemptChunkRecovery
} from '../../src/shared/utils/chunkLoadRecovery.js';

function createStorage() {
  const store = new Map();

  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    }
  };
}

test('detects stale chunk loading errors', () => {
  assert.equal(
    isRecoverableChunkError(
      new TypeError('Failed to fetch dynamically imported module: /assets/TrustAndSafetyPage.js')
    ),
    true
  );
  assert.equal(isRecoverableChunkError(new Error('Plain application failure')), false);
});

test('attemptChunkRecovery reloads once per path until cleared', () => {
  const storage = createStorage();
  let reloadCount = 0;

  const firstAttempt = attemptChunkRecovery({
    error: new TypeError('Failed to fetch dynamically imported module: /assets/app.js'),
    pathname: '/trust-and-safety',
    storage,
    reload: () => {
      reloadCount += 1;
    }
  });

  const secondAttempt = attemptChunkRecovery({
    error: new TypeError('Failed to fetch dynamically imported module: /assets/app.js'),
    pathname: '/trust-and-safety',
    storage,
    reload: () => {
      reloadCount += 1;
    }
  });

  assert.equal(firstAttempt, true);
  assert.equal(secondAttempt, false);
  assert.equal(reloadCount, 1);

  clearChunkRecoveryAttempt('/trust-and-safety', storage);
  assert.equal(shouldAttemptChunkRecovery('/trust-and-safety', storage), true);
});

test('installChunkLoadRecovery listens for Vite preload failures', () => {
  const storage = createStorage();
  let reloadCount = 0;
  const listeners = new Map();

  const target = {
    location: {
      pathname: '/trust-and-safety',
      reload() {
        reloadCount += 1;
      }
    },
    addEventListener(name, handler) {
      listeners.set(name, handler);
    },
    removeEventListener(name) {
      listeners.delete(name);
    }
  };

  const cleanup = installChunkLoadRecovery({ target, storage });
  const event = {
    payload: new TypeError('Failed to fetch dynamically imported module: /assets/app.js'),
    preventDefaultCalled: false,
    preventDefault() {
      this.preventDefaultCalled = true;
    }
  };

  listeners.get('vite:preloadError')(event);

  assert.equal(reloadCount, 1);
  assert.equal(event.preventDefaultCalled, true);

  cleanup();
  assert.equal(listeners.has('vite:preloadError'), false);
});
