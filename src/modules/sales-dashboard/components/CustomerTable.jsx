import DataTable from '../../../shared/components/DataTable';
import StatusPill from '../../../shared/components/StatusPill';
import { formatCurrency } from '../utils/currencyFormat';
import { formatDateTime } from '../utils/dateFormat';

const CustomerTable = ({ rows = [] }) => {
  const columns = [
    { key: 'id', label: 'Customer ID' },
    { key: 'company', label: 'Company' },
    { key: 'industry', label: 'Industry' },
    { key: 'city', label: 'City' },
    { key: 'owner', label: 'Owner' },
    {
      key: 'lifetimeValue',
      label: 'Lifetime Value',
      render: (value) => formatCurrency(value)
    },
    { key: 'openOrders', label: 'Open Orders' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusPill value={value || 'active'} />
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value) => formatDateTime(value)
    }
  ];

  return <DataTable columns={columns} rows={rows} />;
};

export default CustomerTable;
