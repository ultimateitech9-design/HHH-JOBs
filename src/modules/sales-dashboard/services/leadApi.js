import { SALES_BASE, safeRequest } from './salesApi';
import { salesDummyData } from '../data/salesDummyData';

export const getLeads = async () =>
  safeRequest({
    path: `${SALES_BASE}/leads`,
    emptyData: [],
    fallbackData: salesDummyData.leads,
    extract: (payload) => payload?.leads || []
  });

export const getLeadDetails = async (leadId) =>
  safeRequest({
    path: `${SALES_BASE}/leads/${leadId}`,
    emptyData: {},
    fallbackData: salesDummyData.leads.find((item) => item.id === leadId) || salesDummyData.leads[0] || {},
    extract: (payload) => payload?.lead || payload || {}
  });
