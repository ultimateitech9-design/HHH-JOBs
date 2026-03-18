import { useEffect, useMemo, useState } from 'react';
import SectionHeader from '../../../shared/components/SectionHeader';
import RevenueChart from '../components/RevenueChart';
import SalesChart from '../components/SalesChart';
import SalesStatCards from '../components/SalesStatCards';
import { getSalesOverview } from '../services/salesApi';
import { formatCompactCurrency } from '../utils/currencyFormat';

const SalesOverview = () => {
  const [state, setState] = useState({ loading: true, error: '', isDemo: false, overview: null });

  useEffect(() => {
    const load = async () => {
      const response = await getSalesOverview();
      setState({
        loading: false,
        error: response.error || '',
        isDemo: Boolean(response.isDemo),
        overview: response.data
      });
    };

    load();
  }, []);

  const cards = useMemo(() => {
    const stats = state.overview?.stats || {};
    return [
      { label: 'Total Revenue', value: formatCompactCurrency(stats.totalRevenue || 0), helper: 'Overall booked sales', tone: 'success' },
      { label: 'Monthly Revenue', value: formatCompactCurrency(stats.monthlyRevenue || 0), helper: 'Current month performance', tone: 'info' },
      { label: 'Open Leads', value: String(stats.openLeads || 0), helper: `${stats.convertedLeads || 0} converted`, tone: 'warning' },
      { label: 'Orders', value: String(stats.totalOrders || 0), helper: `${stats.activeCustomers || 0} active customers`, tone: 'default' }
    ];
  }, [state.overview]);

  return (
    <div className="module-page module-page--platform">
      <SectionHeader eyebrow="Sales" title="Sales Overview" subtitle="Track revenue, target performance, lead flow, and commercial execution across the HHH Jobs portal." />
      {state.isDemo ? <p className="module-note">Demo data is displayed because sales endpoints are not connected.</p> : null}
      {state.error ? <p className="form-error">{state.error}</p> : null}
      {state.loading ? <p className="module-note">Loading sales overview...</p> : null}
      {!state.loading && state.overview ? (
        <>
          <SalesStatCards cards={cards} />
          <div className="split-grid">
            <SalesChart points={state.overview.monthlySales || []} />
            <RevenueChart points={state.overview.revenueTrend || []} />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default SalesOverview;
