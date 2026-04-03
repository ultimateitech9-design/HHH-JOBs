import { adminDummyData } from '../data/adminDummyData';
import { SUPER_ADMIN_BASE, safeRequest } from './usersApi';
import { mapApiCompanyToUi } from './mappers';

export const getCompanies = async (filters = {}) =>
  safeRequest({
    path: `${SUPER_ADMIN_BASE}/companies`,
    emptyData: [],
    fallbackData: () => adminDummyData.companies.filter((company) => {
      const search = String(filters.search || '').toLowerCase();
      const matchesSearch = !search || [company.name, company.plan, company.owner, company.id].some((value) => String(value || '').toLowerCase().includes(search));
      const matchesStatus = !filters.status || company.status === filters.status;
      return matchesSearch && matchesStatus;
    }),
    extract: (payload) => (payload?.companies || []).map(mapApiCompanyToUi)
  });
