import { useEffect, useMemo, useState } from 'react';
import SectionHeader from '../../../shared/components/SectionHeader';
import RevenueCards from '../components/RevenueCards';
import InvoiceTable from '../components/InvoiceTable';
import { getInvoices } from '../services/invoiceApi';
import { formatCurrency } from '../utils/currencyFormat';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('all');

  useEffect(() => {
    const load = async () => {
      const response = await getInvoices();
      setInvoices(response.data || []);
      setError(response.error || '');
      setLoading(false);
    };

    load();
  }, []);

  const visibleInvoices = useMemo(() => {
    if (status === 'all') return invoices;
    return invoices.filter((item) => String(item.status || '').toLowerCase() === status);
  }, [invoices, status]);

  const cards = useMemo(() => {
    const paid = visibleInvoices.filter((item) => item.status === 'paid');
    const pending = visibleInvoices.filter((item) => item.status === 'pending');

    return [
      { label: 'Invoices', value: String(visibleInvoices.length), helper: 'Current invoice dataset', tone: 'info' },
      { label: 'Paid Value', value: formatCurrency(paid.reduce((sum, item) => sum + Number(item.amount || 0), 0)), helper: `${paid.length} paid invoices`, tone: 'success' },
      { label: 'Pending Value', value: formatCurrency(pending.reduce((sum, item) => sum + Number(item.amount || 0), 0)), helper: `${pending.length} awaiting collection`, tone: 'warning' },
      { label: 'Overdue Risk', value: String(visibleInvoices.filter((item) => item.status === 'failed').length), helper: 'Failed invoice runs', tone: 'danger' }
    ];
  }, [visibleInvoices]);

  return (
    <div className="module-page module-page--platform">
      <SectionHeader
        eyebrow="Accounts"
        title="Invoices"
        subtitle="Manage invoice lifecycle for employers, subscriptions, posting packs, and enterprise billing."
      />

      {error ? <p className="form-error">{error}</p> : null}
      <RevenueCards cards={cards} />

      <section className="panel-card">
        <div className="student-inline-controls">
          <label>
            Status
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="all">All</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </label>
        </div>

        {loading ? <p className="module-note">Loading invoices...</p> : null}
        <InvoiceTable rows={visibleInvoices} />
      </section>
    </div>
  );
};

export default Invoices;
