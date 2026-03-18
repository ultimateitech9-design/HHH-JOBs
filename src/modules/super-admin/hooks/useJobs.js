import { useEffect, useMemo, useState } from 'react';
import { getJobs } from '../services/jobsApi';

const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const load = async () => {
      const response = await getJobs();
      setJobs(response.data || []);
      setError(response.error || '');
      setIsDemo(Boolean(response.isDemo));
      setLoading(false);
    };

    load();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const search = String(filters.search || '').toLowerCase();
      const matchesSearch = !search || [job.title, job.company, job.location, job.id].some((value) => String(value || '').toLowerCase().includes(search));
      const matchesStatus = !filters.status || job.status === filters.status || job.approvalStatus === filters.status;
      return matchesSearch && matchesStatus;
    });
  }, [jobs, filters]);

  return { jobs, setJobs, filteredJobs, filters, setFilters, loading, error, isDemo };
};

export default useJobs;
