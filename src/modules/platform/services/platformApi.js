import { apiFetch } from '../../../utils/api';

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

const strictRequest = async ({ path, options, extract = (payload) => payload }) => {
  const response = await apiFetch(path, options);
  const payload = await parseJson(response);

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed with status ${response.status}`);
  }

  return extract(payload || {});
};

const readRequest = async ({ path, empty, extract = (payload) => payload }) => {
  try {
    const data = await strictRequest({ path, extract });
    return { data, isDemo: false, error: '' };
  } catch (error) {
    return { data: clone(empty), isDemo: false, error: error.message || 'Request failed.' };
  }
};

export const getPlatformOverview = async () => {
  return readRequest({
    path: '/platform/overview',
    empty: {
      totalTenants: 0,
      activeTenants: 0,
      suspendedTenants: 0,
      pendingTenants: 0,
      openTickets: 0,
      healthyIntegrations: 0,
      degradedIntegrations: 0,
      monthlyRevenue: 0,
      complianceHealthy: 0,
      complianceTotal: 0
    },
    extract: (payload) => payload?.overview || {}
  });
};

export const getPlatformTenants = async () => {
  return readRequest({
    path: '/platform/tenants',
    empty: [],
    extract: (payload) => payload?.tenants || []
  });
};

export const createPlatformTenant = async (payload) => {
  return strictRequest({
    path: '/platform/tenants',
    options: { method: 'POST', body: JSON.stringify(payload) },
    extract: (responsePayload) => responsePayload?.tenant || responsePayload
  });
};

export const updatePlatformTenant = async (tenantId, payload) => {
  return strictRequest({
    path: `/platform/tenants/${tenantId}`,
    options: { method: 'PATCH', body: JSON.stringify(payload) },
    extract: (responsePayload) => responsePayload?.tenant || responsePayload
  });
};

export const deletePlatformTenant = async (tenantId) => {
  return strictRequest({
    path: `/platform/tenants/${tenantId}`,
    options: { method: 'DELETE' },
    extract: (responsePayload) => ({ removed: responsePayload?.removed || 0 })
  });
};

export const getPlatformPlans = async () => {
  return readRequest({
    path: '/platform/plans',
    empty: [],
    extract: (payload) => payload?.plans || []
  });
};

export const savePlatformPlan = async (planPayload) => {
  return strictRequest({
    path: '/platform/plans',
    options: { method: 'POST', body: JSON.stringify(planPayload) },
    extract: (payload) => payload?.plan || payload
  });
};

export const getPlatformInvoices = async () => {
  return readRequest({
    path: '/platform/invoices',
    empty: [],
    extract: (payload) => payload?.invoices || []
  });
};

export const updatePlatformInvoiceStatus = async (invoiceId, status) => {
  return strictRequest({
    path: `/platform/invoices/${invoiceId}/status`,
    options: { method: 'PATCH', body: JSON.stringify({ status }) },
    extract: (payload) => payload?.invoice || payload
  });
};

export const getPlatformIntegrations = async () => {
  return readRequest({
    path: '/platform/integrations',
    empty: [],
    extract: (payload) => payload?.integrations || []
  });
};

export const updatePlatformIntegration = async (integrationId, payload) => {
  return strictRequest({
    path: `/platform/integrations/${integrationId}`,
    options: { method: 'PATCH', body: JSON.stringify(payload) },
    extract: (responsePayload) => responsePayload?.integration || responsePayload
  });
};

export const runPlatformIntegrationSync = async (integrationId) => {
  return strictRequest({
    path: `/platform/integrations/${integrationId}/sync`,
    options: { method: 'POST', body: JSON.stringify({}) },
    extract: (responsePayload) => responsePayload?.integration || responsePayload
  });
};

export const getPlatformSupportTickets = async () => {
  return readRequest({
    path: '/platform/support-tickets',
    empty: [],
    extract: (payload) => payload?.tickets || []
  });
};

export const updatePlatformSupportTicket = async (ticketId, payload) => {
  return strictRequest({
    path: `/platform/support-tickets/${ticketId}`,
    options: { method: 'PATCH', body: JSON.stringify(payload) },
    extract: (responsePayload) => responsePayload?.ticket || responsePayload
  });
};

export const getPlatformSecurityChecks = async () => {
  return readRequest({
    path: '/platform/security-checks',
    empty: [],
    extract: (payload) => payload?.checks || []
  });
};

export const updatePlatformSecurityCheck = async (checkId, payload) => {
  return strictRequest({
    path: `/platform/security-checks/${checkId}`,
    options: { method: 'PATCH', body: JSON.stringify(payload) },
    extract: (responsePayload) => responsePayload?.check || responsePayload
  });
};

export const getPlatformCustomization = async (tenantId) => {
  return readRequest({
    path: `/platform/customization/${tenantId}`,
    empty: {
      logoUrl: '',
      primaryColor: '#215479',
      accentColor: '#1f7a61',
      customDomain: '',
      enableWidgets: true,
      enableRolePermissions: true,
      enableCareerSite: true,
      dashboardWidgets: ['applications', 'jobs'],
      footerText: ''
    },
    extract: (payload) => payload?.customization || {}
  });
};

export const savePlatformCustomization = async (tenantId, payload) => {
  return strictRequest({
    path: `/platform/customization/${tenantId}`,
    options: { method: 'PUT', body: JSON.stringify(payload) },
    extract: (responsePayload) => responsePayload?.customization || responsePayload
  });
};

export const formatDateTime = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
};
