import { ACCOUNTS_BASE, cloneValue, getAccountsDemoData, safeRequest, strictRequest } from './accountsApi';

export const getTransactions = async () =>
  safeRequest({
    path: `${ACCOUNTS_BASE}/transactions`,
    emptyData: [],
    fallbackData: () => getAccountsDemoData().transactions,
    extract: (payload) => payload?.transactions || []
  });

export const getPayouts = async () =>
  safeRequest({
    path: `${ACCOUNTS_BASE}/payouts`,
    emptyData: [],
    fallbackData: () => getAccountsDemoData().payouts,
    extract: (payload) => payload?.payouts || []
  });

export const getRefunds = async () =>
  safeRequest({
    path: `${ACCOUNTS_BASE}/refunds`,
    emptyData: [],
    fallbackData: () => getAccountsDemoData().refunds,
    extract: (payload) => payload?.refunds || []
  });

export const getPaymentSettings = async () =>
  safeRequest({
    path: `${ACCOUNTS_BASE}/payment-settings`,
    emptyData: {
      methods: [],
      settlementProfile: {}
    },
    fallbackData: () => ({
      methods: cloneValue(getAccountsDemoData().paymentMethods),
      settlementProfile: cloneValue(getAccountsDemoData().settlementProfile)
    }),
    extract: (payload) => ({
      methods: payload?.methods || [],
      settlementProfile: payload?.settlementProfile || {}
    })
  });

export const savePaymentSettings = async (settingsPayload) =>
  strictRequest({
    path: `${ACCOUNTS_BASE}/payment-settings`,
    options: { method: 'PUT', body: JSON.stringify(settingsPayload) },
    extract: (payload) => payload?.settings || payload
  });
