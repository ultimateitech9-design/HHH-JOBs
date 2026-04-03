import { SALES_BASE, safeRequest } from './salesApi';
import { salesDummyData } from '../data/salesDummyData';

export const getSalesReports = async () =>
  safeRequest({
    path: `${SALES_BASE}/reports`,
    emptyData: salesDummyData.reports,
    fallbackData: salesDummyData.reports,
    extract: (payload) => {
      const reports = payload?.reports || payload || {};
      return {
        summary: {
          totalLeads: Number(reports.totalLeads || 0),
          convertedLeads: Number(reports.convertedLeads || 0),
          conversionRate: Number(reports.conversionRate || 0),
          totalOrders: Number(reports.totalOrders || 0),
          paidOrders: Number(reports.paidOrders || 0),
          totalCustomers: Number(reports.totalCustomers || 0),
          totalRevenue: Number(reports.totalRevenue || 0)
        },
        topSources: reports.topSources || [],
        conversion: reports.conversion || [],
        monthlyRevenue: reports.monthlyRevenue || []
      };
    }
  });
