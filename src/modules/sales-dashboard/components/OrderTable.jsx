import DataTable from '../../../shared/components/DataTable';
import StatusPill from '../../../shared/components/StatusPill';
import { formatCurrency } from '../utils/currencyFormat';
import { formatDateTime } from '../utils/dateFormat';

const OrderTable = ({ rows = [] }) => {
  const columns = [
    { key: 'id', label: 'Order ID' },
    { key: 'customer', label: 'Customer' },
    { key: 'product', label: 'Product' },
    {
      key: 'amount',
      label: 'Amount',
      render: (value) => formatCurrency(value)
    },
    { key: 'quantity', label: 'Qty' },
    { key: 'salesAgent', label: 'Sales Agent' },
    {
      key: 'status',
      label: 'Order Status',
      render: (value) => <StatusPill value={value || 'processing'} />
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      render: (value) => <StatusPill value={value || 'pending'} />
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value) => formatDateTime(value)
    }
  ];

  return <DataTable columns={columns} rows={rows} />;
};

export default OrderTable;
