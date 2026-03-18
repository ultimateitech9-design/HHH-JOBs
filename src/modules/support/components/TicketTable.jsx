import DataTable from '../../../shared/components/DataTable';
import { formatDateTime } from '../utils/formatDate';
import TicketStatusBadge from './TicketStatusBadge';

const TicketTable = ({ rows = [] }) => {
  const columns = [
    { key: 'id', label: 'Ticket ID' },
    { key: 'title', label: 'Title' },
    { key: 'customer', label: 'Customer' },
    { key: 'category', label: 'Category' },
    { key: 'assignedTo', label: 'Assigned To' },
    {
      key: 'priority',
      label: 'Priority',
      render: (value) => <TicketStatusBadge value={value} />
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <TicketStatusBadge value={value} />
    },
    {
      key: 'updatedAt',
      label: 'Updated',
      render: (value) => formatDateTime(value)
    }
  ];

  return <DataTable columns={columns} rows={rows} />;
};

export default TicketTable;
