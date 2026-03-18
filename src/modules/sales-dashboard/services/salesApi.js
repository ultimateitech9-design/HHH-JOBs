import { apiFetch } from '../../../utils/api';
import { salesDummyData } from '../data/salesDummyData';

export const SALES_BASE = '/sales';

const parseJson = async (response) => {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
};

const clone = (value) => {
  if (value === null || value === undefined) return value;
  return JSON.parse(JSON.stringify(value));
};

export const strictRequest = async ({ path, options, extract = (payload) => payload }) => {
  const response = await apiFetch(path, options);
  const payload = await parseJson(response);

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed with status ${response.status}`);
  }

  return extract(payload || {});
};

export const safeRequest = async ({ path, options, emptyData, fallbackData, extract = (payload) => payload }) => {
  try {
    const data = await strictRequest({ path, options, extract });
    return { data, isDemo: false, error: '' };
  } catch (error) {
    const fallback = typeof fallbackData === 'function' ? fallbackData() : fallbackData;
    return {
      data: clone(fallback !== undefined ? fallback : emptyData),
      isDemo: true,
      error: error.message || 'Request failed.'
    };
  }
};

export const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      query.set(key, String(value));
    }
  });
  return query.toString();
};

export const getSalesOverview = async () =>
  safeRequest({
    path: `${SALES_BASE}/overview`,
    emptyData: salesDummyData.overview,
    fallbackData: salesDummyData.overview,
    extract: (payload) => payload?.overview || payload || {}
  });

export const getSalesTeam = async () =>
  safeRequest({
    path: `${SALES_BASE}/team`,
    emptyData: [],
    fallbackData: salesDummyData.agents,
    extract: (payload) => payload?.agents || []
  });

export const getProducts = async () =>
  safeRequest({
    path: `${SALES_BASE}/products`,
    emptyData: [],
    fallbackData: salesDummyData.products,
    extract: (payload) => payload?.products || []
  });
