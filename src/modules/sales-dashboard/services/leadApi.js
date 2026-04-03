import { SALES_BASE, safeRequest } from './salesApi';
import { salesDummyData } from '../data/salesDummyData';
import { mapSalesLead } from './mappers';

export const getLeads = async () =>
  safeRequest({
    path: `${SALES_BASE}/leads`,
    emptyData: [],
    fallbackData: salesDummyData.leads,
    extract: (payload) => (payload?.leads || []).map(mapSalesLead)
  });

export const getLeadDetails = async (leadId) =>
  safeRequest({
    path: `${SALES_BASE}/leads/${leadId}`,
    emptyData: {},
    fallbackData: salesDummyData.leads.find((item) => item.id === leadId) || salesDummyData.leads[0] || {},
    extract: (payload) => mapSalesLead(payload?.lead || payload || {})
  });
