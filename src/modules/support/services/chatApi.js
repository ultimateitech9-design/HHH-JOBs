import { supportDummyData } from '../data/supportDummyData';
import { SUPPORT_BASE, safeRequest } from './ticketApi';

export const getChats = async () =>
  safeRequest({
    path: `${SUPPORT_BASE}/chats`,
    emptyData: [],
    fallbackData: supportDummyData.chats,
    extract: (payload) => payload?.chats || []
  });
