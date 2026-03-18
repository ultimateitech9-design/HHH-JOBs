import { SALES_BASE, safeRequest } from './salesApi';
import { salesDummyData } from '../data/salesDummyData';

export const getCoupons = async () =>
  safeRequest({
    path: `${SALES_BASE}/coupons`,
    emptyData: [],
    fallbackData: salesDummyData.coupons,
    extract: (payload) => payload?.coupons || []
  });

export const getRefunds = async () =>
  safeRequest({
    path: `${SALES_BASE}/refunds`,
    emptyData: [],
    fallbackData: salesDummyData.refunds,
    extract: (payload) => payload?.refunds || []
  });
