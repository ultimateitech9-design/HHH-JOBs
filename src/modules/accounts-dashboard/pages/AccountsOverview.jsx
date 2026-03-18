import { useEffect, useMemo, useState } from 'react';
import SectionHeader from '../../../shared/components/SectionHeader';
import InvoiceTable from '../components/InvoiceTable';
import PaymentMethodCard from '../components/PaymentMethodCard';
import RevenueCards from '../components/RevenueCards';
import RevenueChart from '../components/RevenueChart';
import TransactionTable from '../components/TransactionTable';
import { getAccountsOverview } from '../services/accountsApi';
import { formatCurrency } from '../utils/currencyFormat';

const AccountsOverview = () => {
  const [state, setState] = useState({
    loading: true,
    error: '',
    isDemo: false,
    overview: null
  });

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const response = await getAccountsOverview();
      if (!mounted) return;

      setState({
        loading: false,
        error: response.error || '',
        isDemo: Boolean(response.isDemo),
        overview: response.data
      });
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const cards = useMemo(() => {
    const overview = state.overview || {};
    const revenueSummary = overview.revenueSummary || {};
    const invoiceSummary = overview.invoiceSummary || {};
    const subscriptionSummary = overview.subscriptionSummary || {};

    return [
      {
        label: 'Gross Revenue',
        value: formatCurrency(revenueSummary.grossRevenue || 0),
        helper: 'Total collections across portal billing',
        tone: 'success'
      },
      {
        label: 'Outstanding Revenue',
        value: formatCurrency(revenueSummary.outstandingRevenue || 0),
        helper: `${invoiceSummary.pendingInvoices || 0} invoices pending`,
        tone: 'warning'
      },
      {
        label: 'MRR',
        value: formatCurrency(subscriptionSummary.monthlyRecurringRevenue || 0),
        helper: `${subscriptionSummary.activeSubscriptions || 0} active subscriptions`,
        tone: 'info'
      },
      {
        label: 'Net Revenue',
        value: formatCurrency(revenueSummary.netRevenue || 0),
        helper: 'After expenses and refunds',
        tone: 'default'
      }
    ];
  }, [state.overview]);

  const summarySignals = useMemo(() => {
    const overview = state.overview || {};
    const transactions = overview.transactionSummary || {};
    const payouts = overview.payoutSummary || {};
    const expenses = overview.expenseSummary || {};

    return [
      { label: 'Transactions', value: transactions.totalTransactions || 0 },
      { label: 'Pending Payouts', value: payouts.pendingPayouts || 0 },
      { label: 'Approved Expenses', value: expenses.approvedExpenses || 0 },
      { label: 'Refund Risk', value: formatCurrency(overview.revenueSummary?.refundAmount || 0) }
    ];
  }, [state.overview]);

  return (
    <div className="module-page module-page--platform">
      <SectionHeader
        eyebrow="Accounts"
        title="Accounts Overview"
        subtitle="Track HHH Jobs revenue, billing health, payment rails, and settlement pressure in one console."
      />

      {state.isDemo ? <p className="module-note">Demo finance data is shown because accounts backend endpoints are not connected yet.</p> : null}
      {state.error ? <p className="form-error">{state.error}</p> : null}
      {state.loading ? <p className="module-note">Loading accounts overview...</p> : null}

      {!state.loading && state.overview ? (
        <>
          <section className="dash-banner dash-banner--admin">
            <div>
              <p className="dash-banner-kicker">Finance Command View</p>
              <h2>Revenue, invoices, collections, and payouts for the portal</h2>
              <p>Use this screen to review cash flow trends, collection backlog, active billing streams, and payment infrastructure usage.</p>
            </div>

            <ul className="dash-banner-metrics">
              {summarySignals.map((signal) => (
                <li key={signal.label}>
                  <strong>{signal.value}</strong>
                  <span>{signal.label}</span>
                </li>
              ))}
            </ul>
          </section>

          <RevenueCards cards={cards} />

          <div className="split-grid">
            <RevenueChart points={state.overview.monthlyRevenue || []} />

            <section className="panel-card">
              <SectionHeader eyebrow="Payment Rails" title="Settlement Channels" subtitle="Gateways and collection rails active on the portal." />
              <div className="split-grid">
                {(state.overview.paymentMethods || []).map((method) => (
                  <PaymentMethodCard key={method.id} method={method} />
                ))}
              </div>
            </section>
          </div>

          <div className="split-grid">
            <section className="panel-card">
              <SectionHeader eyebrow="Transactions" title="Recent Collections" />
              <TransactionTable rows={state.overview.recentTransactions || []} />
            </section>

            <section className="panel-card">
              <SectionHeader eyebrow="Invoices" title="Recent Invoice Activity" />
              <InvoiceTable rows={state.overview.recentInvoices || []} />
            </section>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default AccountsOverview;
