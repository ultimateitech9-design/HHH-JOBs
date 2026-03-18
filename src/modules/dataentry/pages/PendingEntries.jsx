import { useEffect, useMemo, useState } from 'react';
import DataEntryQueuePanel from '../components/DataEntryQueuePanel';
import { getPendingEntries } from '../services/dataentryApi';

const PendingEntries = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const response = await getPendingEntries();
      setRows(response.data || []);
      setError(response.error || '');
      setLoading(false);
    };
    load();
  }, []);

  const stats = useMemo(() => ([
    { label: 'Pending Entries', value: String(rows.length), helper: 'Awaiting review', tone: 'warning' },
    { label: 'Errors Tagged', value: String(rows.reduce((sum, item) => sum + Number(item.errorCount || 0), 0)), helper: 'Validation issues', tone: 'danger' },
    { label: 'Assigned Operators', value: String(new Set(rows.map((item) => item.assignedTo)).size), helper: 'Current queue coverage', tone: 'info' }
  ]), [rows]);

  return (
    <div className="module-page module-page--dataentry">
      {error ? <p className="form-error">{error}</p> : null}
      <DataEntryQueuePanel eyebrow="Data Entry" title="Pending Entries" subtitle="Entries currently waiting for QA review or approval." stats={stats} rows={rows} loading={loading} />
    </div>
  );
};

export default PendingEntries;
