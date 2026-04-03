import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatusPill from '../../../shared/components/StatusPill';
import { getOrderDetails } from '../services/orderApi';
import { formatCurrency } from '../utils/currencyFormat';
import { formatDateTime } from '../utils/dateFormat';

const OrderDetails = () => {
  const { orderId: orderIdParam } = useParams();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const orderId = orderIdParam || searchParams.get('orderId') || searchParams.get('id') || '';

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const response = await getOrderDetails(orderId);
      setOrder(response.data || null);
      setError(response.error || '');
      setLoading(false);
    };
    load();
  }, [orderId]);

  return (
    <div className="module-page module-page--platform">
      <SectionHeader eyebrow="Sales" title="Order Details" subtitle="Review customer, product, payment, and ownership details for a selected order." />
      {error ? <p className="form-error">{error}</p> : null}
      {!loading && !orderId ? (
        <p className="module-note">No order ID was provided. Showing the first available order from the queue.</p>
      ) : null}
      {loading ? <p className="module-note">Loading order details...</p> : null}
      {!loading && order ? (
        <section className="panel-card">
          <div className="dash-list">
            <li><strong>Order ID</strong><span>{order.id}</span></li>
            <li><strong>Order Number</strong><span>{order.orderNumber || '-'}</span></li>
            <li><strong>Customer</strong><span>{order.customer}</span></li>
            <li><strong>Product</strong><span>{order.product}</span></li>
            <li><strong>Amount</strong><span>{formatCurrency(order.amount)}</span></li>
            <li><strong>Quantity</strong><span>{order.quantity}</span></li>
            <li><strong>Payment Method</strong><span>{order.paymentMethod}</span></li>
            <li><strong>Order Status</strong><span><StatusPill value={order.status} /></span></li>
            <li><strong>Payment Status</strong><span><StatusPill value={order.paymentStatus} /></span></li>
            <li><strong>Created At</strong><span>{formatDateTime(order.createdAt)}</span></li>
          </div>
        </section>
      ) : !loading ? (
        <section className="panel-card">
          <p className="text-sm text-slate-500">No order details are available for the selected order.</p>
        </section>
      ) : null}
    </div>
  );
};

export default OrderDetails;
