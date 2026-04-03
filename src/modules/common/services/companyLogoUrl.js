import { apiUrl } from '../../../utils/api.js';

const pickPreferredText = (...values) => {
  for (const value of values) {
    const normalized = String(value || '').trim();
    if (normalized) return normalized;
  }

  return '';
};

const isAlreadyProxiedLogoUrl = (value = '') => {
  try {
    const url = new URL(String(value || '').trim());
    return url.pathname === '/assets/logo' && url.searchParams.has('url');
  } catch {
    return false;
  }
};

const normalizeLogoCandidate = (value = '') => {
  const raw = String(value || '').trim();
  if (!raw) return '';

  if (/^(data:|blob:|\/)/i.test(raw)) return raw;
  if (isAlreadyProxiedLogoUrl(raw)) return raw;

  try {
    return new URL(raw).toString();
  } catch {
    try {
      return new URL(`https://${raw}`).toString();
    } catch {
      return raw;
    }
  }
};

export const buildCompanyLogoUrl = (...values) => {
  const candidate = normalizeLogoCandidate(pickPreferredText(...values));
  if (!candidate) return '';
  if (/^(data:|blob:|\/)/i.test(candidate)) return candidate;
  if (isAlreadyProxiedLogoUrl(candidate)) return candidate;

  return apiUrl(`/assets/logo?url=${encodeURIComponent(candidate)}`);
};
