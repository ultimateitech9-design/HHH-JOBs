import { supportDummyData } from '../data/supportDummyData';
import { SUPPORT_BASE, safeRequest } from './ticketApi';

export const getFaqs = async () =>
  safeRequest({
    path: `${SUPPORT_BASE}/faqs`,
    emptyData: [],
    fallbackData: supportDummyData.faqs,
    extract: (payload) => payload?.faqs || []
  });

export const getKnowledgeBase = async () =>
  safeRequest({
    path: `${SUPPORT_BASE}/knowledge-base`,
    emptyData: [],
    fallbackData: supportDummyData.knowledgeBase,
    extract: (payload) => payload?.articles || payload?.knowledgeBase || []
  });
