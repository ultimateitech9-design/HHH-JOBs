import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatusPill from '../../../shared/components/StatusPill';
import { getCustomerDetails } from '../services/customerApi';
import { formatCurrency } from '../utils/currencyFormat';
import { formatDateTime } from '../utils/dateFormat';

const CustomerDetails = () => {
  const [searchParams] = useSearchParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const response = await getCustomerDetails(searchParams.get('customerId') || '');
      setCustomer(response.data || null);
      setError(response.error || '');
      setLoading(false);
    };
    load();
  }, [searchParams]);

  return (
    <div className="module-page module-page--platform">
      <SectionHeader eyebrow="Sales" title="Customer Details" subtitle="View ownership, account value, status, and open order context for a selected customer." />
      {error ? <p className="form-error">{error}</p> : null}
      {loading ? <p className="module-note">Loading customer details...</p> : null}
      {!loading && customer ? (
        <section className="panel-card">
          <div className="dash-list">
            <li><strong>Customer ID</strong><span>{customer.id}</span></li>
            <li><strong>Company</strong><span>{customer.company}</span></li>
            <li><strong>Industry</strong><span>{customer.industry}</span></li>
            <li><strong>City</strong><span>{customer.city}</span></li>
            <li><strong>Owner</strong><span>{customer.owner}</span></li>
            <li><strong>Lifetime Value</strong><span>{formatCurrency(customer.lifetimeValue)}</span></li>
            <li><strong>Open Orders</strong><span>{customer.openOrders}</span></li>
            <li><strong>Status</strong><span><StatusPill value={customer.status} /></span></li>
            <li><strong>Created</strong><span>{formatDateTime(customer.createdAt)}</span></li>
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default CustomerDetails;
