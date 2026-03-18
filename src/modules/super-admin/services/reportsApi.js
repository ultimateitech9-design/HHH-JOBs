import { adminDummyData } from '../data/adminDummyData';
import { SUPER_ADMIN_BASE, safeRequest } from './usersApi';

export const getSuperAdminDashboard = async () =>
  safeRequest({
    path: `${SUPER_ADMIN_BASE}/dashboard`,
    emptyData: {},
    fallbackData: {
      stats: adminDummyData.dashboardStats,
      users: adminDummyData.users,
      companies: adminDummyData.companies,
      jobs: adminDummyData.jobs,
      applications: adminDummyData.applications,
      payments: adminDummyData.payments,
      subscriptions: adminDummyData.subscriptions,
      supportTickets: adminDummyData.supportTickets,
      systemLogs: adminDummyData.systemLogs,
      reports: adminDummyData.reports
    },
    extract: (payload) => payload?.dashboard || payload || {}
  });

export const getReportsAnalytics = async () =>
  safeRequest({
    path: `${SUPER_ADMIN_BASE}/reports`,
    emptyData: adminDummyData.reports,
    fallbackData: adminDummyData.reports,
    extract: (payload) => payload?.reports || payload || {}
  });

export const getSupportTickets = async () =>
  safeRequest({
    path: `${SUPER_ADMIN_BASE}/support-tickets`,
    emptyData: [],
    fallbackData: adminDummyData.supportTickets,
    extract: (payload) => payload?.tickets || []
  });

export const getSystemLogs = async () =>
  safeRequest({
    path: `${SUPER_ADMIN_BASE}/system-logs`,
    emptyData: [],
    fallbackData: adminDummyData.systemLogs,
    extract: (payload) => payload?.logs || []
  });
