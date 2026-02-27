import { apiFetch } from '../../../utils/api';

const parseJson = async (response) => {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
};

const strictRequest = async ({ path, options, extract = (payload) => payload }) => {
  const response = await apiFetch(path, options);
  const payload = await parseJson(response);

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed with status ${response.status}`);
  }

  return extract(payload || {});
};

const safeRequest = async ({ path, options, emptyData, extract = (payload) => payload }) => {
  try {
    const data = await strictRequest({ path, options, extract });
    return { data, isDemo: false, error: '' };
  } catch (error) {
    return { data: emptyData, isDemo: false, error: error.message || 'Request failed.' };
  }
};

const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      query.set(key, value);
    }
  });
  return query.toString();
};

export const getAuditEvents = async (filters = {}) => {
  const query = buildQueryString({
    userId: filters.userId,
    action: filters.action,
    entityType: filters.entityType,
    severity: filters.severity,
    search: filters.search,
    page: filters.page || 1,
    limit: filters.limit || 20
  });

  return safeRequest({
    path: `/audit/events${query ? `?${query}` : ''}`,
    emptyData: {
      auditLogs: [],
      pagination: {
        page: Number(filters.page || 1),
        limit: Number(filters.limit || 20),
        total: 0,
        totalPages: 1
      }
    },
    extract: (payload) => ({
      auditLogs: payload?.auditLogs || [],
      pagination: payload?.pagination || {
        page: Number(filters.page || 1),
        limit: Number(filters.limit || 20),
        total: 0,
        totalPages: 1
      }
    })
  });
};

export const getAuditSummary = async () => {
  return safeRequest({
    path: '/audit/summary',
    emptyData: {
      events24h: 0,
      criticalAlerts: 0,
      warnings: 0,
      informational: 0
    },
    extract: (payload) => payload?.summary || {
      events24h: 0,
      criticalAlerts: 0,
      warnings: 0,
      informational: 0
    }
  });
};

export const getAuditAlerts = async (filters = {}) => {
  const query = buildQueryString({
    status: filters.status,
    severity: filters.severity,
    search: filters.search
  });

  return safeRequest({
    path: `/audit/alerts${query ? `?${query}` : ''}`,
    emptyData: [],
    extract: (payload) => payload?.alerts || []
  });
};

export const updateAuditAlert = async (alertId, payload) => {
  return strictRequest({
    path: `/audit/alerts/${alertId}`,
    options: { method: 'PATCH', body: JSON.stringify(payload) },
    extract: (responsePayload) => responsePayload?.alert || responsePayload
  });
};

export const getAuditComplianceChecks = async () => {
  return safeRequest({
    path: '/audit/compliance-checks',
    emptyData: [],
    extract: (payload) => payload?.checks || []
  });
};

export const updateAuditComplianceCheck = async (checkId, payload) => {
  return strictRequest({
    path: `/audit/compliance-checks/${checkId}`,
    options: { method: 'PATCH', body: JSON.stringify(payload) },
    extract: (responsePayload) => responsePayload?.check || responsePayload
  });
};

export const formatDateTime = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
};
