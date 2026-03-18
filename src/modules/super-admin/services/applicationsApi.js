import { adminDummyData } from '../data/adminDummyData';
import { SUPER_ADMIN_BASE, safeRequest } from './usersApi';

export const getApplications = async (filters = {}) =>
  safeRequest({
    path: `${SUPER_ADMIN_BASE}/applications`,
    emptyData: [],
    fallbackData: () => adminDummyData.applications.filter((application) => {
      const search = String(filters.search || '').toLowerCase();
      const matchesSearch = !search || [application.candidate, application.jobTitle, application.company, application.id].some((value) => String(value || '').toLowerCase().includes(search));
      const matchesStage = !filters.stage || application.stage === filters.stage;
      return matchesSearch && matchesStage;
    }),
    extract: (payload) => payload?.applications || []
  });
