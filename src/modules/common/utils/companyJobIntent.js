const COMPANY_JOB_INTENT_KEY = 'hhh_jobs_company_job_intent';
const COMPANY_JOB_INTENT_TTL_MS = 15 * 60 * 1000;

const canUseSessionStorage = () => typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';

export const saveCompanyJobIntent = (intent = {}) => {
  if (!canUseSessionStorage()) return;

  const nextIntent = {
    redirectPath: String(intent.redirectPath || '').trim(),
    companyName: String(intent.companyName || '').trim(),
    jobTitle: String(intent.jobTitle || '').trim(),
    jobType: String(intent.jobType || '').trim(),
    applyUrl: String(intent.applyUrl || '').trim(),
    portalJobId: String(intent.portalJobId || '').trim(),
    createdAt: new Date().toISOString()
  };

  if (!nextIntent.redirectPath || !nextIntent.jobType) return;

  window.sessionStorage.setItem(COMPANY_JOB_INTENT_KEY, JSON.stringify(nextIntent));
};

export const readCompanyJobIntent = () => {
  if (!canUseSessionStorage()) return null;

  const rawIntent = window.sessionStorage.getItem(COMPANY_JOB_INTENT_KEY);
  if (!rawIntent) return null;

  try {
    const parsed = JSON.parse(rawIntent);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
};

export const clearCompanyJobIntent = () => {
  if (!canUseSessionStorage()) return;
  window.sessionStorage.removeItem(COMPANY_JOB_INTENT_KEY);
};

export const isCompanyJobIntentFresh = (intent) => {
  if (!intent?.createdAt) return false;
  const createdAt = new Date(intent.createdAt).getTime();
  if (Number.isNaN(createdAt)) return false;
  return Date.now() - createdAt <= COMPANY_JOB_INTENT_TTL_MS;
};

export const matchesCompanyJobRedirect = (intent, currentPath = '') =>
  Boolean(intent?.redirectPath) && String(intent.redirectPath).trim() === String(currentPath || '').trim();
