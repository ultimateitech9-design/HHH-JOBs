import { adminDummyData } from '../data/adminDummyData';
import { SUPER_ADMIN_BASE, safeRequest, strictRequest } from './usersApi';

const filterJobs = (jobs, filters = {}) => {
  return jobs.filter((job) => {
    const search = String(filters.search || '').toLowerCase();
    const matchesSearch = !search || [job.title, job.company, job.location, job.id].some((value) => String(value || '').toLowerCase().includes(search));
    const matchesStatus = !filters.status || job.status === filters.status || job.approvalStatus === filters.status;
    return matchesSearch && matchesStatus;
  });
};

export const getJobs = async (filters = {}) =>
  safeRequest({
    path: `${SUPER_ADMIN_BASE}/jobs`,
    emptyData: [],
    fallbackData: () => filterJobs(adminDummyData.jobs, filters),
    extract: (payload) => payload?.jobs || []
  });

export const updateJobStatus = async (jobId, status) => {
  try {
    return await strictRequest({
      path: `${SUPER_ADMIN_BASE}/jobs/${jobId}/status`,
      options: { method: 'PATCH', body: JSON.stringify({ status }) },
      extract: (payload) => payload?.job || payload
    });
  } catch (error) {
    return { ...(adminDummyData.jobs.find((job) => job.id === jobId) || {}), status };
  }
};
