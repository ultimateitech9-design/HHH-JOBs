import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatusPill from '../../../shared/components/StatusPill';
import { getOrderDetails } from '../services/orderApi';
import { formatCurrency } from '../utils/currencyFormat';
import { formatDateTime } from '../utils/dateFormat';

const OrderDetails = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const response = await getOrderDetails(searchParams.get('orderId') || '');
      setOrder(response.data || null);
      setError(response.error || '');
      setLoading(false);
    };
    load();
  }, [searchParams]);

  return (
    <div className="module-page module-page--platform">
      <SectionHeader eyebrow="Sales" title="Order Details" subtitle="Review customer, product, payment, and ownership details for a selected order." />
      {error ? <p className="form-error">{error}</p> : null}
      {loading ? <p className="module-note">Loading order details...</p> : null}
      {!loading && order ? (
        <section className="panel-card">
          <div className="dash-list">
            <li><strong>Order ID</strong><span>{order.id}</span></li>
            <li><strong>Customer</strong><span>{order.customer}</span></li>
            <li><strong>Product</strong><span>{order.product}</span></li>
            <li><strong>Amount</strong><span>{formatCurrency(order.amount)}</span></li>
            <li><strong>Quantity</strong><span>{order.quantity}</span></li>
            <li><strong>Sales Agent</strong><span>{order.salesAgent}</span></li>
            <li><strong>Order Status</strong><span><StatusPill value={order.status} /></span></li>
            <li><strong>Payment Status</strong><span><StatusPill value={order.paymentStatus} /></span></li>
            <li><strong>Created At</strong><span>{formatDateTime(order.createdAt)}</span></li>
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default OrderDetails;
