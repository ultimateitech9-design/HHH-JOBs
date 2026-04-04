const CHUNK_RECOVERY_STORAGE_KEY = 'hhh-jobs:chunk-recovery';
const CHUNK_RECOVERY_COOLDOWN_MS = 5 * 60 * 1000;

const chunkErrorPatterns = [
  /Failed to fetch dynamically imported module/i,
  /Importing a module script failed/i,
  /Loading chunk [\w-]+ failed/i,
  /ChunkLoadError/i
];

function readErrorMessage(error) {
  if (!error) return '';
  if (typeof error === 'string') return error;
  if (typeof error?.message === 'string') return error.message;
  if (typeof error?.reason?.message === 'string') return error.reason.message;
  if (typeof error?.reason === 'string') return error.reason;
  if (typeof error?.payload?.message === 'string') return error.payload.message;
  return '';
}

export function isRecoverableChunkError(error) {
  const message = readErrorMessage(error);
  return chunkErrorPatterns.some((pattern) => pattern.test(message));
}

function getRecoveryKey(pathname = '/') {
  return `${CHUNK_RECOVERY_STORAGE_KEY}:${pathname || '/'}`;
}

function readAttempt(pathname, storage) {
  if (!storage) return null;

  try {
    const value = storage.getItem(getRecoveryKey(pathname));
    if (!value) return null;

    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearChunkRecoveryAttempt(pathname, storage = globalThis?.sessionStorage) {
  if (!storage) return;

  try {
    storage.removeItem(getRecoveryKey(pathname));
  } catch {
    // Ignore session storage failures.
  }
}

export function shouldAttemptChunkRecovery(
  pathname,
  storage = globalThis?.sessionStorage,
  now = Date.now()
) {
  const lastAttempt = readAttempt(pathname, storage);
  if (!lastAttempt) return true;

  return now - lastAttempt > CHUNK_RECOVERY_COOLDOWN_MS;
}

function markChunkRecoveryAttempt(pathname, storage, now = Date.now()) {
  if (!storage) return;

  try {
    storage.setItem(getRecoveryKey(pathname), String(now));
  } catch {
    // Ignore session storage failures.
  }
}

export function attemptChunkRecovery({
  error,
  pathname = globalThis?.location?.pathname || '/',
  storage = globalThis?.sessionStorage,
  reload = () => globalThis?.location?.reload()
}) {
  if (!isRecoverableChunkError(error)) return false;
  if (!shouldAttemptChunkRecovery(pathname, storage)) return false;

  markChunkRecoveryAttempt(pathname, storage);
  reload();
  return true;
}

export function installChunkLoadRecovery({
  target = globalThis?.window,
  storage = globalThis?.sessionStorage
} = {}) {
  if (!target || target.__hhhJobsChunkRecoveryInstalled) return () => {};

  const handlePreloadError = (event) => {
    const recovered = attemptChunkRecovery({
      error: event?.payload ?? event,
      pathname: target.location?.pathname || '/',
      storage,
      reload: () => target.location?.reload()
    });

    if (recovered && typeof event?.preventDefault === 'function') {
      event.preventDefault();
    }
  };

  target.addEventListener('vite:preloadError', handlePreloadError);
  target.__hhhJobsChunkRecoveryInstalled = true;

  return () => {
    target.removeEventListener('vite:preloadError', handlePreloadError);
    target.__hhhJobsChunkRecoveryInstalled = false;
  };
}
