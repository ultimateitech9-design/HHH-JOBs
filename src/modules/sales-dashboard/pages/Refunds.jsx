import { useEffect, useMemo, useState } from 'react';
import SectionHeader from '../../../shared/components/SectionHeader';
import RefundTable from '../components/RefundTable';
import SalesStatCards from '../components/SalesStatCards';
import { getRefunds } from '../services/couponApi';
import { formatCompactCurrency } from '../utils/currencyFormat';

const Refunds = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const response = await getRefunds();
      setRefunds(response.data || []);
      setError(response.error || '');
      setLoading(false);
    };
    load();
  }, []);

  const cards = useMemo(() => [
    { label: 'Refund Cases', value: String(refunds.length), helper: 'Current refund queue', tone: 'info' },
    { label: 'Refunded', value: String(refunds.filter((item) => item.status === 'refunded').length), helper: 'Processed reversals', tone: 'success' },
    { label: 'Pending', value: String(refunds.filter((item) => item.status === 'pending').length), helper: 'Awaiting action', tone: 'warning' },
    { label: 'Refund Value', value: formatCompactCurrency(refunds.reduce((sum, item) => sum + Number(item.amount || 0), 0)), helper: 'Visible refund exposure', tone: 'danger' }
  ], [refunds]);

  return (
    <div className="module-page module-page--platform">
      <SectionHeader eyebrow="Sales" title="Refunds" subtitle="Monitor refund reasons, order links, customer impact, and current reversal exposure." />
      {error ? <p className="form-error">{error}</p> : null}
      <SalesStatCards cards={cards} />
      <section className="panel-card">
        {loading ? <p className="module-note">Loading refunds...</p> : null}
        <RefundTable rows={refunds} />
      </section>
    </div>
  );
};

export default Refunds;
