import { useEffect, useMemo, useState } from 'react';
import DataEntryQueuePanel from '../components/DataEntryQueuePanel';
import { getApprovedEntries } from '../services/dataentryApi';

const ApprovedEntries = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const response = await getApprovedEntries();
      setRows(response.data || []);
      setError(response.error || '');
      setLoading(false);
    };
    load();
  }, []);

  const stats = useMemo(() => ([
    { label: 'Approved Entries', value: String(rows.length), helper: 'Cleared by QA', tone: 'success' },
    { label: 'Job Approvals', value: String(rows.filter((item) => item.type === 'job').length), helper: 'Employer-ready jobs', tone: 'info' },
    { label: 'Property Approvals', value: String(rows.filter((item) => item.type === 'property').length), helper: 'Verified assets', tone: 'default' }
  ]), [rows]);

  return (
    <div className="module-page module-page--dataentry">
      {error ? <p className="form-error">{error}</p> : null}
      <DataEntryQueuePanel eyebrow="Data Entry" title="Approved Entries" subtitle="Records that are complete, validated, and cleared for live usage." stats={stats} rows={rows} loading={loading} />
    </div>
  );
};

export default ApprovedEntries;
