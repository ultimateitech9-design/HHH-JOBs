import DataTable from '../../../shared/components/DataTable';
import StatusPill from '../../../shared/components/StatusPill';
import { formatCurrency } from '../utils/currencyFormat';
import { formatDateTime } from '../utils/dateFormat';

const LeadTable = ({ rows = [] }) => {
  const columns = [
    { key: 'id', label: 'Lead ID' },
    { key: 'company', label: 'Company' },
    { key: 'contactName', label: 'Contact' },
    { key: 'source', label: 'Source' },
    { key: 'assignedTo', label: 'Owner' },
    {
      key: 'expectedValue',
      label: 'Expected Value',
      render: (value) => formatCurrency(value)
    },
    {
      key: 'stage',
      label: 'Stage',
      render: (value) => <StatusPill value={value || 'new'} />
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value) => formatDateTime(value)
    }
  ];

  return <DataTable columns={columns} rows={rows} />;
};

export default LeadTable;
