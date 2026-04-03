import { supportDummyData } from '../data/supportDummyData';
import { SUPPORT_BASE, safeRequest } from './ticketApi';

export const getSupportReports = async () =>
  safeRequest({
    path: `${SUPPORT_BASE}/reports`,
    emptyData: supportDummyData.reports,
    fallbackData: supportDummyData.reports,
    extract: (payload) => payload?.reports || payload || {}
  });
