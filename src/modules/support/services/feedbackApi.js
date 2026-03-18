import { supportDummyData } from '../data/supportDummyData';
import { SUPPORT_BASE, safeRequest } from './ticketApi';

export const getFeedback = async () =>
  safeRequest({
    path: `${SUPPORT_BASE}/feedback`,
    emptyData: [],
    fallbackData: supportDummyData.feedback,
    extract: (payload) => payload?.feedback || []
  });
