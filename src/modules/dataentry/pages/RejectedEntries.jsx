import { useEffect, useMemo, useState } from 'react';
import DataEntryQueuePanel from '../components/DataEntryQueuePanel';
import { getRejectedEntries } from '../services/dataentryApi';

const RejectedEntries = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const response = await getRejectedEntries();
      setRows(response.data || []);
      setError(response.error || '');
      setLoading(false);
    };
    load();
  }, []);

  const stats = useMemo(() => ([
    { label: 'Rejected Entries', value: String(rows.length), helper: 'Needs correction', tone: 'danger' },
    { label: 'Duplicate Flags', value: String(rows.filter((item) => item.duplicateFlag).length), helper: 'Potential overlap', tone: 'warning' },
    { label: 'Error Count', value: String(rows.reduce((sum, item) => sum + Number(item.errorCount || 0), 0)), helper: 'Validation backlog', tone: 'warning' }
  ]), [rows]);

  return (
    <div className="module-page module-page--dataentry">
      {error ? <p className="form-error">{error}</p> : null}
      <DataEntryQueuePanel eyebrow="Data Entry" title="Rejected Entries" subtitle="Entries rejected because of validation gaps, duplicates, or incomplete employer details." stats={stats} rows={rows} loading={loading} />
    </div>
  );
};

export default RejectedEntries;
