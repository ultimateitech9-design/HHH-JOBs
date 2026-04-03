import { useEffect, useMemo, useState } from 'react';
import AdminHeader from '../components/AdminHeader';
import DashboardStatsCards from '../components/DashboardStatsCards';
import PaymentsTable from '../components/PaymentsTable';
import { getSubscriptions } from '../services/paymentsApi';
import { formatCurrency } from '../utils/currencyFormat';

const SubscriptionsManagement = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const load = async () => {
      const response = await getSubscriptions();
      setSubscriptions(response.data || []);
      setError(response.error || '');
      setIsDemo(Boolean(response.isDemo));
      setLoading(false);
    };

    load();
  }, []);

  const cards = useMemo(() => [
    { label: 'Active Subscriptions', value: String(subscriptions.filter((item) => item.status === 'active').length), helper: 'Healthy recurring revenue accounts', tone: 'success' },
    { label: 'Past Due', value: String(subscriptions.filter((item) => item.status === 'past_due').length), helper: 'Needs collections follow-up', tone: 'warning' },
    { label: 'Monthly Recurring Revenue', value: formatCurrency(subscriptions.reduce((sum, item) => sum + item.mrr, 0)), helper: 'Current committed run-rate', tone: 'info' },
    { label: 'Total Seats', value: String(subscriptions.reduce((sum, item) => sum + item.seats, 0)), helper: 'Licensed user capacity', tone: 'default' }
  ], [subscriptions]);

  const rows = subscriptions.map((subscription) => ({
    id: subscription.id,
    company: subscription.company,
    item: subscription.plan,
    amount: subscription.mrr,
    method: `${subscription.seats} seats`,
    status: subscription.status,
    createdAt: subscription.renewalDate
  }));

  return (
    <div className="module-page module-page--admin">
      <AdminHeader title="Subscriptions Management" subtitle="Track recurring plans, renewal pressure, seat utilization, and monthly committed revenue." />
      {isDemo ? <p className="module-note">Demo subscription data is shown because super admin subscription endpoints are not connected yet.</p> : null}
      {error ? <p className="form-error">{error}</p> : null}
      <DashboardStatsCards cards={cards} />
      <section className="panel-card">
        {loading ? <p className="module-note">Loading subscriptions...</p> : null}
        <PaymentsTable rows={rows} />
      </section>
    </div>
  );
};

export default SubscriptionsManagement;
