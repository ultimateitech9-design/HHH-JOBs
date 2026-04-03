import { useEffect, useMemo, useState } from 'react';
import { getCompanies } from '../services/companiesApi';

const useCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const load = async () => {
      const response = await getCompanies();
      setCompanies(response.data || []);
      setError(response.error || '');
      setIsDemo(Boolean(response.isDemo));
      setLoading(false);
    };

    load();
  }, []);

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const search = String(filters.search || '').toLowerCase();
      const matchesSearch = !search || [company.name, company.plan, company.owner, company.id].some((value) => String(value || '').toLowerCase().includes(search));
      const matchesStatus = !filters.status || company.status === filters.status;
      return matchesSearch && matchesStatus;
    });
  }, [companies, filters]);

  return { companies, filteredCompanies, filters, setFilters, loading, error, isDemo };
};

export default useCompanies;
