import { SALES_BASE, safeRequest } from './salesApi';
import { salesDummyData } from '../data/salesDummyData';
import { mapSalesOrder } from './mappers';

export const getOrders = async () =>
  safeRequest({
    path: `${SALES_BASE}/orders`,
    emptyData: [],
    fallbackData: salesDummyData.orders,
    extract: (payload) => (payload?.orders || []).map(mapSalesOrder)
  });

export const getOrderDetails = async (orderId) =>
  safeRequest({
    path: `${SALES_BASE}/orders/${orderId}`,
    emptyData: {},
    fallbackData: salesDummyData.orders.find((item) => item.id === orderId) || salesDummyData.orders[0] || {},
    extract: (payload) => mapSalesOrder(payload?.order || payload || {})
  });
