import { adminDummyData } from '../data/adminDummyData';
import { SUPER_ADMIN_BASE, safeRequest, strictRequest } from './usersApi';

export const getPayments = async (filters = {}) =>
  safeRequest({
    path: `${SUPER_ADMIN_BASE}/payments`,
    emptyData: [],
    fallbackData: () => adminDummyData.payments.filter((payment) => {
      const search = String(filters.search || '').toLowerCase();
      const matchesSearch = !search || [payment.company, payment.item, payment.invoiceId, payment.id].some((value) => String(value || '').toLowerCase().includes(search));
      const matchesStatus = !filters.status || payment.status === filters.status;
      return matchesSearch && matchesStatus;
    }),
    extract: (payload) => payload?.payments || []
  });

export const getSubscriptions = async () =>
  safeRequest({
    path: `${SUPER_ADMIN_BASE}/subscriptions`,
    emptyData: [],
    fallbackData: adminDummyData.subscriptions,
    extract: (payload) => payload?.subscriptions || []
  });

export const updatePaymentStatus = async (paymentId, status) => {
  try {
    return await strictRequest({
      path: `${SUPER_ADMIN_BASE}/payments/${paymentId}/status`,
      options: { method: 'PATCH', body: JSON.stringify({ status }) },
      extract: (payload) => payload?.payment || payload
    });
  } catch (error) {
    return { ...(adminDummyData.payments.find((payment) => payment.id === paymentId) || {}), status };
  }
};
