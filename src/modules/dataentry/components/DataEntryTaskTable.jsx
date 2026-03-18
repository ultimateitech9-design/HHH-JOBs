import DataTable from '../../../shared/components/DataTable';
import StatusPill from '../../../shared/components/StatusPill';
import { formatDateTime } from '../services/dataentryApi';

const DataEntryTaskTable = ({ rows = [] }) => {
  const columns = [
    { key: 'id', label: 'Task ID' },
    { key: 'title', label: 'Task' },
    { key: 'queue', label: 'Queue' },
    {
      key: 'priority',
      label: 'Priority',
      render: (value) => <StatusPill value={value || 'medium'} />
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusPill value={value || 'pending'} />
    },
    { key: 'owner', label: 'Owner' },
    {
      key: 'dueAt',
      label: 'Due',
      render: (value) => formatDateTime(value)
    }
  ];

  return <DataTable columns={columns} rows={rows} />;
};

export default DataEntryTaskTable;
