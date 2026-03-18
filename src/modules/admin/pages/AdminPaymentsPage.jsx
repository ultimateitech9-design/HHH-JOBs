import { useEffect, useMemo, useState } from 'react';
import DataTable from '../../../shared/components/DataTable';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatCard from '../../../shared/components/StatCard';
import StatusPill from '../../../shared/components/StatusPill';
import {
  formatDateTime,
  getAdminPayments,
  getAdminPlanPurchases,
  updateAdminPayment,
  updateAdminPlanPurchaseStatus
} from '../services/adminApi';

const initialFilters = {
  status: 'all',
  search: ''
};

const emptyDraft = {
  status: 'pending',
  provider: '',
  referenceId: '',
  note: ''
};

const statusToApi = (status) => (status === 'all' ? '' : status);

const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [planPurchases, setPlanPurchases] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [loadingPurchases, setLoadingPurchases] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [editPaymentId, setEditPaymentId] = useState('');
  const [draft, setDraft] = useState(emptyDraft);

  const loadPayments = async (nextStatus = filters.status) => {
    setLoading(true);
    setError('');
    const response = await getAdminPayments(statusToApi(nextStatus));
    setPayments(response.data || []);
    setError(response.error || '');
    setLoading(false);
  };

  const loadPlanPurchases = async (nextStatus = filters.status) => {
    setLoadingPurchases(true);
    const response = await getAdminPlanPurchases({ status: statusToApi(nextStatus) });
    setPlanPurchases(response.data || []);
    if (response.error) setError((current) => current || response.error);
    setLoadingPurchases(false);
  };

  useEffect(() => {
    loadPayments(initialFilters.status);
    loadPlanPurchases(initialFilters.status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredPayments = useMemo(() => {
    const search = String(filters.search || '').toLowerCase().trim();
    if (!search) return payments;

    return payments.filter((payment) =>
      `${payment.job_id || ''} ${payment.hr_id || ''} ${payment.reference_id || ''}`.toLowerCase().includes(search)
    );
  }, [payments, filters.search]);

  const stats = useMemo(() => {
    const paid = payments.filter((payment) => payment.status === 'paid');
    const pending = payments.filter((payment) => payment.status === 'pending');
    const failed = payments.filter((payment) => payment.status === 'failed');
    const refunded = payments.filter((payment) => payment.status === 'refunded');
    const paidTotal = paid.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    const pendingPurchases = planPurchases.filter((purchase) => purchase.status === 'pending').length;
    const paidPurchases = planPurchases.filter((purchase) => purchase.status === 'paid');
    const paidPurchaseAmount = paidPurchases.reduce((sum, purchase) => sum + Number(purchase.total_amount || 0), 0);

    return [
      {
        label: 'Total Payments',
        value: String(payments.length),
        helper: 'All job payment entries',
        tone: 'info'
      },
      {
        label: 'Paid',
        value: String(paid.length),
        helper: `Amount ${paidTotal}`,
        tone: 'success'
      },
      {
        label: 'Pending',
        value: String(pending.length),
        helper: 'Awaiting reconciliation',
        tone: pending.length > 0 ? 'warning' : 'default'
      },
      {
        label: 'Failed/Refunded',
        value: String(failed.length + refunded.length),
        helper: `${failed.length} failed, ${refunded.length} refunded`,
        tone: failed.length + refunded.length > 0 ? 'danger' : 'default'
      },
      {
        label: 'Plan Purchases',
        value: String(planPurchases.length),
        helper: `${pendingPurchases} pending • ${paidPurchases.length} paid`,
        tone: pendingPurchases > 0 ? 'warning' : 'info'
      },
      {
        label: 'Purchase Revenue',
        value: String(Number(paidPurchaseAmount.toFixed(2))),
        helper: 'From paid plan purchases',
        tone: 'success'
      }
    ];
  }, [payments, planPurchases]);

  const openEdit = (payment) => {
    setEditPaymentId(payment.id);
    setDraft({
      status: payment.status || 'pending',
      provider: payment.provider || '',
      referenceId: payment.reference_id || '',
      note: payment.note || ''
    });
  };

  const closeEdit = () => {
    setEditPaymentId('');
    setDraft(emptyDraft);
  };

  const patchLocalPayment = (paymentId, patch) => {
    setPayments((current) => current.map((payment) => (payment.id === paymentId ? { ...payment, ...patch } : payment)));
  };

  const handleSavePayment = async (event) => {
    event.preventDefault();
    if (!editPaymentId) return;

    setSaving(true);
    setError('');
    setMessage('');

    const payload = {
      status: draft.status,
      provider: draft.provider,
      referenceId: draft.referenceId,
      note: draft.note
    };

    try {
      const updated = await updateAdminPayment(editPaymentId, payload);
      patchLocalPayment(editPaymentId, updated);
      setMessage(`Payment ${editPaymentId} updated.`);
      closeEdit();
    } catch (actionError) {
      setError(String(actionError.message || 'Unable to update payment.'));
    } finally {
      setSaving(false);
    }
  };

  const patchLocalPlanPurchase = (purchaseId, patch) => {
    setPlanPurchases((current) => current.map((purchase) => (purchase.id === purchaseId ? { ...purchase, ...patch } : purchase)));
  };

  const handleUpdatePurchaseStatus = async (purchaseId, status) => {
    setError('');
    setMessage('');

    try {
      const updated = await updateAdminPlanPurchaseStatus(purchaseId, { status });
      patchLocalPlanPurchase(purchaseId, updated);
      setMessage(`Purchase ${purchaseId} updated to ${status}.`);
    } catch (actionError) {
      setError(String(actionError.message || 'Unable to update plan purchase.'));
    }
  };

  const columns = [
    { key: 'id', label: 'Payment ID' },
    { key: 'job_id', label: 'Job ID' },
    { key: 'hr_id', label: 'HR ID' },
    { key: 'amount', label: 'Amount' },
    { key: 'currency', label: 'Currency' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusPill value={value || 'pending'} />
    },
    { key: 'provider', label: 'Provider' },
    { key: 'reference_id', label: 'Reference' },
    {
      key: 'paid_at',
      label: 'Paid At',
      render: (value) => formatDateTime(value)
    },
    {
      key: 'id',
      label: 'Actions',
      render: (_, row) => (
        <button type="button" className="btn-link" onClick={() => openEdit(row)}>Edit</button>
      )
    }
  ];

  const purchaseColumns = [
    { key: 'id', label: 'Purchase ID' },
    { key: 'hr_id', label: 'HR ID' },
    { key: 'plan_slug', label: 'Plan' },
    { key: 'quantity', label: 'Qty' },
    { key: 'credits', label: 'Credits' },
    {
      key: 'total_amount',
      label: 'Total',
      render: (value, row) => `${row.currency || 'INR'} ${value}`
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusPill value={value || 'pending'} />
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (value) => formatDateTime(value)
    },
    {
      key: 'id',
      label: 'Actions',
      render: (_, row) => (
        <div className="student-job-actions">
          {row.status === 'pending' ? (
            <button type="button" className="btn-link" onClick={() => handleUpdatePurchaseStatus(row.id, 'paid')}>
              Approve
            </button>
          ) : null}
          {row.status === 'paid' ? (
            <button type="button" className="btn-link" onClick={() => handleUpdatePurchaseStatus(row.id, 'refunded')}>
              Refund
            </button>
          ) : null}
        </div>
      )
    }
  ];

  return (
    <div className="module-page module-page--admin">
      <SectionHeader
        eyebrow="Payments"
        title="Payment Verification and Reconciliation"
        subtitle="Track HR posting payments and update reconciliation outcomes."
      />

      {error ? <p className="form-error">{error}</p> : null}
      {message ? <p className="form-success">{message}</p> : null}

      <div className="stats-grid">
        {stats.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <section className="panel-card">
        <div className="student-inline-controls">
          <label>
            Status
            <select
              value={filters.status}
              onChange={(event) => {
                const nextStatus = event.target.value;
                setFilters((current) => ({ ...current, status: nextStatus }));
                loadPayments(nextStatus);
                loadPlanPurchases(nextStatus);
              }}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </label>

          <label className="full-width-control">
            Search
            <input
              placeholder="Job ID, HR ID, reference"
              value={filters.search}
              onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            />
          </label>
        </div>

        {loading ? <p className="module-note">Loading payments...</p> : null}
        <DataTable columns={columns} rows={filteredPayments} />
      </section>

      <section className="panel-card">
        <SectionHeader
          eyebrow="Plan Purchases"
          title="Pricing Checkout Reconciliation"
          subtitle="Approve pending HR purchases to grant posting credits."
        />

        {loadingPurchases ? <p className="module-note">Loading plan purchases...</p> : null}
        <DataTable columns={purchaseColumns} rows={planPurchases} />
      </section>

      {editPaymentId ? (
        <section className="panel-card">
          <SectionHeader eyebrow="Update Payment" title={`Payment ${editPaymentId}`} />

          <form className="form-grid" onSubmit={handleSavePayment}>
            <label>
              Status
              <select value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value }))}>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </label>

            <label>
              Provider
              <input value={draft.provider} onChange={(event) => setDraft((current) => ({ ...current, provider: event.target.value }))} />
            </label>

            <label>
              Reference ID
              <input value={draft.referenceId} onChange={(event) => setDraft((current) => ({ ...current, referenceId: event.target.value }))} />
            </label>

            <label className="full-row">
              Note
              <textarea rows={3} value={draft.note} onChange={(event) => setDraft((current) => ({ ...current, note: event.target.value }))} />
            </label>

            <div className="student-job-actions full-row">
              <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Payment'}</button>
              <button type="button" className="btn-link" onClick={closeEdit}>Cancel</button>
            </div>
          </form>
        </section>
      ) : null}
    </div>
  );
};

export default AdminPaymentsPage;
