import { useEffect, useMemo, useState } from 'react';
import DataEntryQueuePanel from '../components/DataEntryQueuePanel';
import { getDraftEntries } from '../services/dataentryApi';

const DraftEntries = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const response = await getDraftEntries();
      setRows(response.data || []);
      setError(response.error || '');
      setLoading(false);
    };
    load();
  }, []);

  const stats = useMemo(() => ([
    { label: 'Draft Entries', value: String(rows.length), helper: 'Work in progress', tone: 'warning' },
    { label: 'Job Drafts', value: String(rows.filter((item) => item.type === 'job').length), helper: 'Job queue', tone: 'info' },
    { label: 'Property Drafts', value: String(rows.filter((item) => item.type === 'property').length), helper: 'Property queue', tone: 'default' }
  ]), [rows]);

  return (
    <div className="module-page module-page--dataentry">
      {error ? <p className="form-error">{error}</p> : null}
      <DataEntryQueuePanel eyebrow="Data Entry" title="Draft Entries" subtitle="Entries saved by operators before they are submitted to review." stats={stats} rows={rows} loading={loading} />
    </div>
  );
};

export default DraftEntries;
