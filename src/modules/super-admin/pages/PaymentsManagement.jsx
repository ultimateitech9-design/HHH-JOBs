import { useEffect, useMemo, useState } from 'react';
import AdminHeader from '../components/AdminHeader';
import ConfirmModal from '../components/ConfirmModal';
import DashboardStatsCards from '../components/DashboardStatsCards';
import FilterBar from '../components/FilterBar';
import PaymentsTable from '../components/PaymentsTable';
import { getPayments, updatePaymentStatus } from '../services/paymentsApi';
import { formatCurrency } from '../utils/currencyFormat';

const PaymentsManagement = () => {
  const [payments, setPayments] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDemo, setIsDemo] = useState(false);
  const [targetPayment, setTargetPayment] = useState(null);

  useEffect(() => {
    const load = async () => {
      const response = await getPayments();
      setPayments(response.data || []);
      setError(response.error || '');
      setIsDemo(Boolean(response.isDemo));
      setLoading(false);
    };

    load();
  }, []);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const search = String(filters.search || '').toLowerCase();
      const matchesSearch = !search || [payment.company, payment.item, payment.invoiceId, payment.id].some((value) => String(value || '').toLowerCase().includes(search));
      const matchesStatus = !filters.status || payment.status === filters.status;
      return matchesSearch && matchesStatus;
    });
  }, [payments, filters]);

  const cards = useMemo(() => [
    { label: 'Collected Revenue', value: formatCurrency(payments.filter((item) => item.status === 'paid').reduce((sum, item) => sum + item.amount, 0)), helper: 'Successful settled items', tone: 'success' },
    { label: 'Pending Payments', value: String(payments.filter((item) => item.status === 'pending').length), helper: 'Requires follow-up', tone: 'warning' },
    { label: 'Refunded', value: String(payments.filter((item) => item.status === 'refunded').length), helper: 'Watch refund pressure', tone: 'default' },
    { label: 'Failed Collections', value: String(payments.filter((item) => item.status === 'failed').length), helper: 'Retry and risk review', tone: 'danger' }
  ], [payments]);

  const handleApprove = async () => {
    if (!targetPayment) return;
    const updated = await updatePaymentStatus(targetPayment.id, 'paid');
    setPayments((current) => current.map((payment) => (payment.id === targetPayment.id ? { ...payment, ...updated, status: 'paid' } : payment)));
    setTargetPayment(null);
  };

  return (
    <div className="module-page module-page--admin">
      <AdminHeader title="Payments Management" subtitle="Monitor collections, payment failures, refund risk, and invoice-linked commercial activity." />
      {isDemo ? <p className="module-note">Demo payment data is shown because super admin payment endpoints are not connected yet.</p> : null}
      {error ? <p className="form-error">{error}</p> : null}
      <DashboardStatsCards cards={cards} />
      <section className="panel-card">
        <FilterBar
          filters={filters}
          onChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
          fields={[{ key: 'status', label: 'Status', options: ['paid', 'pending', 'failed', 'refunded', 'past_due'].map((status) => ({ value: status, label: status })) }]}
          actions={filteredPayments[0] ? <button type="button" className="btn-secondary" onClick={() => setTargetPayment(filteredPayments[0])}>Mark first visible payment paid</button> : null}
        />
        {loading ? <p className="module-note">Loading payments...</p> : null}
        <PaymentsTable rows={filteredPayments} />
      </section>
      <ConfirmModal
        open={Boolean(targetPayment)}
        title="Confirm payment settlement"
        message={targetPayment ? `Mark ${targetPayment.id} as paid?` : ''}
        confirmLabel="Mark paid"
        onConfirm={handleApprove}
        onClose={() => setTargetPayment(null)}
      />
    </div>
  );
};

export default PaymentsManagement;
