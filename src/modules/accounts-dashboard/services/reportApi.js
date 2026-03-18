import { ACCOUNTS_BASE, getAccountsDemoData, safeRequest } from './accountsApi';

export const getRevenueReports = async () =>
  safeRequest({
    path: `${ACCOUNTS_BASE}/reports/revenue`,
    emptyData: {
      revenue: [],
      categoryPerformance: []
    },
    fallbackData: () => getAccountsDemoData().reports,
    extract: (payload) => ({
      revenue: payload?.revenue || [],
      categoryPerformance: payload?.categoryPerformance || []
    })
  });
