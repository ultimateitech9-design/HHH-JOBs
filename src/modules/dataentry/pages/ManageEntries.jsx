import { useEffect, useMemo, useState } from 'react';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatCard from '../../../shared/components/StatCard';
import DataEntryEntryTable from '../components/DataEntryEntryTable';
import { defaultEntryFilters, getDataEntryEntries } from '../services/dataentryApi';

const ManageEntries = () => {
  const [entries, setEntries] = useState([]);
  const [filters, setFilters] = useState(defaultEntryFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadEntries = async (nextFilters = filters) => {
    setLoading(true);
    const response = await getDataEntryEntries(nextFilters);
    setEntries(response.data || []);
    setError(response.error || '');
    setLoading(false);
  };

  useEffect(() => {
    loadEntries(defaultEntryFilters);
  // loadEntries is intentionally invoked once on mount.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    return [
      { label: 'Visible Entries', value: String(entries.length), helper: 'Filtered results', tone: 'info' },
      { label: 'Job Records', value: String(entries.filter((item) => item.type === 'job').length), helper: 'Job operations', tone: 'success' },
      { label: 'Property Records', value: String(entries.filter((item) => item.type === 'property').length), helper: 'Asset operations', tone: 'default' },
      { label: 'Duplicates / Errors', value: String(entries.filter((item) => item.duplicateFlag || item.errorCount > 0).length), helper: 'Needs correction', tone: 'warning' }
    ];
  }, [entries]);

  return (
    <div className="module-page module-page--dataentry">
      <SectionHeader
        eyebrow="Data Entry"
        title="Manage Entries"
        subtitle="Search and review draft, pending, approved, and rejected records from one operations table."
      />

      {error ? <p className="form-error">{error}</p> : null}

      <div className="stats-grid">
        {stats.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <section className="panel-card">
        <div className="student-inline-controls">
          <label>
            Type
            <select value={filters.type} onChange={(event) => setFilters((current) => ({ ...current, type: event.target.value }))}>
              <option value="">All</option>
              <option value="job">Job</option>
              <option value="property">Property</option>
            </select>
          </label>
          <label>
            Status
            <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
              <option value="">All</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
          <label>
            Assigned To
            <input value={filters.assignedTo} onChange={(event) => setFilters((current) => ({ ...current, assignedTo: event.target.value }))} />
          </label>
          <label className="full-width-control">
            Search
            <input value={filters.search} placeholder="Entry ID, title, company, candidate" onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} />
          </label>
          <div className="student-job-actions">
            <button type="button" className="btn-primary" onClick={() => loadEntries(filters)}>Apply</button>
            <button type="button" className="btn-link" onClick={() => { setFilters(defaultEntryFilters); loadEntries(defaultEntryFilters); }}>Reset</button>
          </div>
        </div>

        {loading ? <p className="module-note">Loading entries...</p> : null}
        <DataEntryEntryTable rows={entries} />
      </section>
    </div>
  );
};

export default ManageEntries;
