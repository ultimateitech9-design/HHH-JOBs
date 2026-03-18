import { SALES_BASE, safeRequest } from './salesApi';
import { salesDummyData } from '../data/salesDummyData';

export const getSalesReports = async () =>
  safeRequest({
    path: `${SALES_BASE}/reports`,
    emptyData: salesDummyData.reports,
    fallbackData: salesDummyData.reports,
    extract: (payload) => payload?.reports || payload || {}
  });
