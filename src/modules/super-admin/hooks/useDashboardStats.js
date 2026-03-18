import { useEffect, useState } from 'react';
import { getSuperAdminDashboard } from '../services/reportsApi';

const useDashboardStats = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const load = async () => {
      const response = await getSuperAdminDashboard();
      setDashboard(response.data || null);
      setError(response.error || '');
      setIsDemo(Boolean(response.isDemo));
      setLoading(false);
    };

    load();
  }, []);

  return { dashboard, loading, error, isDemo };
};

export default useDashboardStats;
