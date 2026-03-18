import { ACCOUNTS_BASE, getAccountsDemoData, safeRequest, strictRequest } from './accountsApi';

export const getInvoices = async () =>
  safeRequest({
    path: `${ACCOUNTS_BASE}/invoices`,
    emptyData: [],
    fallbackData: () => getAccountsDemoData().invoices,
    extract: (payload) => payload?.invoices || []
  });

export const updateInvoiceStatus = async (invoiceId, status) =>
  strictRequest({
    path: `${ACCOUNTS_BASE}/invoices/${invoiceId}/status`,
    options: { method: 'PATCH', body: JSON.stringify({ status }) },
    extract: (payload) => payload?.invoice || payload
  });
