import { supportDummyData } from '../data/supportDummyData';
import { SUPPORT_BASE, safeRequest } from './ticketApi';

export const getComplaints = async () =>
  safeRequest({
    path: `${SUPPORT_BASE}/complaints`,
    emptyData: [],
    fallbackData: supportDummyData.complaints,
    extract: (payload) => payload?.complaints || []
  });
