import { useEffect, useMemo, useState } from 'react';
import SectionHeader from '../../../shared/components/SectionHeader';
import SalesAgentTable from '../components/SalesAgentTable';
import SalesStatCards from '../components/SalesStatCards';
import { getSalesTeam } from '../services/salesApi';
import { formatCompactCurrency } from '../utils/currencyFormat';

const SalesTeam = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const response = await getSalesTeam();
      setAgents(response.data || []);
      setError(response.error || '');
      setLoading(false);
    };
    load();
  }, []);

  const cards = useMemo(() => [
    { label: 'Sales Agents', value: String(agents.length), helper: 'Active team members', tone: 'info' },
    { label: 'Deals Closed', value: String(agents.reduce((sum, item) => sum + Number(item.dealsClosed || 0), 0)), helper: 'Visible team output', tone: 'success' },
    { label: 'Revenue', value: formatCompactCurrency(agents.reduce((sum, item) => sum + Number(item.revenue || 0), 0)), helper: 'Visible team revenue', tone: 'default' },
    { label: 'Avg Response Rate', value: `${Math.round(agents.reduce((sum, item) => sum + Number(item.leadResponseRate || 0), 0) / Math.max(agents.length, 1))}%`, helper: 'Lead responsiveness', tone: 'warning' }
  ], [agents]);

  return (
    <div className="module-page module-page--platform">
      <SectionHeader eyebrow="Sales" title="Sales Team" subtitle="Monitor team output, territories, revenue contribution, and response quality." />
      {error ? <p className="form-error">{error}</p> : null}
      <SalesStatCards cards={cards} />
      <section className="panel-card">
        {loading ? <p className="module-note">Loading sales team...</p> : null}
        <SalesAgentTable rows={agents} />
      </section>
    </div>
  );
};

export default SalesTeam;
