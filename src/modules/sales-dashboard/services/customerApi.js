import { SALES_BASE, safeRequest } from './salesApi';
import { salesDummyData } from '../data/salesDummyData';

export const getCustomers = async () =>
  safeRequest({
    path: `${SALES_BASE}/customers`,
    emptyData: [],
    fallbackData: salesDummyData.customers,
    extract: (payload) => payload?.customers || []
  });

export const getCustomerDetails = async (customerId) =>
  safeRequest({
    path: `${SALES_BASE}/customers/${customerId}`,
    emptyData: {},
    fallbackData: salesDummyData.customers.find((item) => item.id === customerId) || salesDummyData.customers[0] || {},
    extract: (payload) => payload?.customer || payload || {}
  });
