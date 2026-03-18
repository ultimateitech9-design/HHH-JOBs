import { useEffect, useMemo, useState } from 'react';
import { getApplications } from '../services/applicationsApi';

const useApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filters, setFilters] = useState({ search: '', stage: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const load = async () => {
      const response = await getApplications();
      setApplications(response.data || []);
      setError(response.error || '');
      setIsDemo(Boolean(response.isDemo));
      setLoading(false);
    };

    load();
  }, []);

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const search = String(filters.search || '').toLowerCase();
      const matchesSearch = !search || [application.candidate, application.jobTitle, application.company, application.id].some((value) => String(value || '').toLowerCase().includes(search));
      const matchesStage = !filters.stage || application.stage === filters.stage;
      return matchesSearch && matchesStage;
    });
  }, [applications, filters]);

  return { applications, filteredApplications, filters, setFilters, loading, error, isDemo };
};

export default useApplications;
