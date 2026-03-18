import { apiFetch } from '../../../utils/api';
import { normalizeTicket } from '../utils/ticketHelpers';
import { supportDummyData } from '../data/supportDummyData';

export const SUPPORT_BASE = '/support';

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

export const getSupportStats = async () =>
  safeRequest({
    path: `${SUPPORT_BASE}/stats`,
    emptyData: supportDummyData.stats,
    fallbackData: supportDummyData.stats,
    extract: (payload) => payload?.stats || payload || {}
  });

export const getTickets = async () =>
  safeRequest({
    path: `${SUPPORT_BASE}/tickets`,
    emptyData: [],
    fallbackData: supportDummyData.tickets,
    extract: (payload) => (payload?.tickets || []).map(normalizeTicket)
  });

export const getTicketDetails = async (ticketId) =>
  safeRequest({
    path: `${SUPPORT_BASE}/tickets/${ticketId}`,
    emptyData: {},
    fallbackData: supportDummyData.tickets.find((ticket) => ticket.id === ticketId) || supportDummyData.tickets[0] || {},
    extract: (payload) => payload?.ticket || payload || {}
  });

export const createTicket = async (ticketPayload) => {
  try {
    return await strictRequest({
      path: `${SUPPORT_BASE}/tickets`,
      options: { method: 'POST', body: JSON.stringify(ticketPayload) },
      extract: (payload) => payload?.ticket || payload
    });
  } catch (error) {
    return {
      id: `SUP-${Date.now()}`,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      replies: [],
      ...ticketPayload
    };
  }
};

export const replyToTicket = async (ticketId, message) => {
  try {
    return await strictRequest({
      path: `${SUPPORT_BASE}/tickets/${ticketId}/reply`,
      options: { method: 'POST', body: JSON.stringify({ message }) },
      extract: (payload) => payload?.reply || payload
    });
  } catch (error) {
    return {
      id: `REP-${Date.now()}`,
      author: 'Support Agent',
      role: 'agent',
      message,
      createdAt: new Date().toISOString()
    };
  }
};
