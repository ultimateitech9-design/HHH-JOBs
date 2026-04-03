const EXTERNAL_APPLY_INTENT_KEY = 'hhh_jobs_external_apply_intent';
const EXTERNAL_APPLY_INTENT_TTL_MS = 15 * 60 * 1000;

const canUseSessionStorage = () => typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';

export const saveExternalApplyIntent = (intent = {}) => {
  if (!canUseSessionStorage()) return;

  const nextIntent = {
    applyUrl: String(intent.applyUrl || '').trim(),
    companyName: String(intent.companyName || '').trim(),
    jobTitle: String(intent.jobTitle || '').trim(),
    sourceName: String(intent.sourceName || '').trim(),
    redirectPath: String(intent.redirectPath || '').trim(),
    createdAt: new Date().toISOString()
  };

  if (!nextIntent.applyUrl || !nextIntent.redirectPath) return;

  window.sessionStorage.setItem(EXTERNAL_APPLY_INTENT_KEY, JSON.stringify(nextIntent));
};

export const readExternalApplyIntent = () => {
  if (!canUseSessionStorage()) return null;

  const rawIntent = window.sessionStorage.getItem(EXTERNAL_APPLY_INTENT_KEY);
  if (!rawIntent) return null;

  try {
    const parsed = JSON.parse(rawIntent);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
};

export const clearExternalApplyIntent = () => {
  if (!canUseSessionStorage()) return;
  window.sessionStorage.removeItem(EXTERNAL_APPLY_INTENT_KEY);
};

export const isExternalApplyIntentFresh = (intent) => {
  if (!intent?.createdAt) return false;
  const createdAt = new Date(intent.createdAt).getTime();
  if (Number.isNaN(createdAt)) return false;
  return Date.now() - createdAt <= EXTERNAL_APPLY_INTENT_TTL_MS;
};

export const matchesExternalApplyRedirect = (intent, currentPath = '') =>
  Boolean(intent?.redirectPath) && String(intent.redirectPath).trim() === String(currentPath || '').trim();
