import { useEffect, useState } from 'react';
import { getSupportStats } from '../services/ticketApi';

const useSupportStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const load = async () => {
      const response = await getSupportStats();
      setStats(response.data || null);
      setError(response.error || '');
      setIsDemo(Boolean(response.isDemo));
      setLoading(false);
    };

    load();
  }, []);

  return { stats, loading, error, isDemo };
};

export default useSupportStats;
