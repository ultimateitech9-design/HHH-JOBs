const createAlphaToken = (value = '', length = 4) =>
  String(value || '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, length)
    .padEnd(length, 'X');

const createMobileToken = (mobile = '', length = 3) =>
  String(mobile || '')
    .replace(/\D/g, '')
    .slice(-length)
    .padStart(length, '0');

const sequenceState = {
  hr: { counter: 0, map: {} },
  student: { counter: 0, map: {} },
  retired: { counter: 0, map: {} }
};

const readStorage = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const writeStorage = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage failures (private mode/quota) and fallback to in-memory state.
  }
};

const getOrCreateSequence = (bucket, identityKey) => {
  const counterKey = `hhhjobs:id:${bucket}:counter`;
  const mapKey = `hhhjobs:id:${bucket}:map`;

  const persistedCounter = readStorage(counterKey, 0);
  const persistedMap = readStorage(mapKey, {});

  sequenceState[bucket].counter = Math.max(sequenceState[bucket].counter, Number(persistedCounter) || 0);
  sequenceState[bucket].map = { ...persistedMap, ...sequenceState[bucket].map };

  if (sequenceState[bucket].map[identityKey]) {
    return String(sequenceState[bucket].map[identityKey]).padStart(4, '0');
  }

  sequenceState[bucket].counter += 1;
  const nextValue = sequenceState[bucket].counter;
  sequenceState[bucket].map[identityKey] = nextValue;

  writeStorage(counterKey, sequenceState[bucket].counter);
  writeStorage(mapKey, sequenceState[bucket].map);

  return String(nextValue).padStart(4, '0');
};

const createNameToken = (name = '') => createAlphaToken(name, 3);

const buildIdentityKey = ({ token = '', mobile = '' }) =>
  `${String(token || '').toUpperCase()}|${createMobileToken(mobile, 3)}`;

export const generateHrEmployerId = ({ companyName = '', mobile = '' }) => {
  const token = createNameToken(companyName);
  return `HHHJ-${token}-${createMobileToken(mobile, 3)}-${getOrCreateSequence('hr', buildIdentityKey({ token, mobile }))}`;
};

export const generateStudentCandidateId = ({ name = '', mobile = '' }) =>
  `HHHJ-${createNameToken(name)}-${createMobileToken(mobile, 3)}-${getOrCreateSequence('student', buildIdentityKey({ token: createNameToken(name), mobile }))}`;

export const generateRetiredEmployeeId = ({ name = '', mobile = '' }) =>
  `HHHJ-${createNameToken(name)}-${createMobileToken(mobile, 3)}-${getOrCreateSequence('retired', buildIdentityKey({ token: createNameToken(name), mobile }))}`;
