import { useEffect, useState } from 'react';
import DataTable from '../../../shared/components/DataTable';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatusPill from '../../../shared/components/StatusPill';
import { formatDateTime, getAuditEvents } from '../services/auditApi';

const initialFilters = {
  userId: '',
  action: '',
  entityType: '',
  severity: '',
  search: '',
  limit: 20
};

const summarizeDetails = (details) => {
  if (!details) return '-';
  const text = typeof details === 'string' ? details : JSON.stringify(details);
  if (text.length <= 100) return text;
  return `${text.slice(0, 97)}...`;
};

const AuditEventsPage = () => {
  const [filters, setFilters] = useState(initialFilters);
  const [state, setState] = useState({
    loading: true,
    isDemo: false,
    error: '',
    logs: [],
    pagination: {
      page: 1,
      limit: initialFilters.limit,
      total: 0,
      totalPages: 1
    }
  });

  const loadEvents = async ({ nextFilters = filters, page = 1 } = {}) => {
    setState((current) => ({ ...current, loading: true, error: '' }));

    const response = await getAuditEvents({
      userId: nextFilters.userId,
      action: nextFilters.action,
      entityType: nextFilters.entityType,
      severity: nextFilters.severity,
      search: nextFilters.search,
      page,
      limit: nextFilters.limit
    });

    setState({
      loading: false,
      isDemo: response.isDemo,
      error: response.error && !response.isDemo ? response.error : '',
      logs: response.data?.auditLogs || [],
      pagination: response.data?.pagination || {
        page: 1,
        limit: Number(nextFilters.limit || 20),
        total: 0,
        totalPages: 1
      }
    });
  };

  useEffect(() => {
    loadEvents({ nextFilters: initialFilters, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      key: 'created_at',
      label: 'Timestamp',
      render: (value) => formatDateTime(value)
    },
    { key: 'user_id', label: 'User ID' },
    { key: 'action', label: 'Action' },
    { key: 'entity_type', label: 'Entity Type' },
    { key: 'entity_id', label: 'Entity ID' },
    {
      key: 'severity',
      label: 'Severity',
      render: (value) => <StatusPill value={value} />
    },
    {
      key: 'details',
      label: 'Details',
      render: (value) => summarizeDetails(value)
    },
    { key: 'ip_address', label: 'IP' }
  ];

  return (
    <div className="module-page module-page--audit">
      <SectionHeader
        eyebrow="Event Explorer"
        title="Filter and Investigate Audit Stream"
        subtitle="Slice by actor, action, entity, severity, and search terms to inspect audit traces."
      />

      {state.isDemo ? <p className="module-note">Backend data is unavailable because backend is unavailable or restricted.</p> : null}
      {state.error ? <p className="form-error">{state.error}</p> : null}

      <section className="panel-card">
        <form
          className="student-inline-controls"
          onSubmit={(event) => {
            event.preventDefault();
            loadEvents({ nextFilters: filters, page: 1 });
          }}
        >
          <label>
            User ID
            <input
              value={filters.userId}
              onChange={(event) => setFilters((current) => ({ ...current, userId: event.target.value }))}
            />
          </label>

          <label>
            Action
            <input
              value={filters.action}
              onChange={(event) => setFilters((current) => ({ ...current, action: event.target.value }))}
            />
          </label>

          <label>
            Entity Type
            <input
              value={filters.entityType}
              onChange={(event) => setFilters((current) => ({ ...current, entityType: event.target.value }))}
            />
          </label>

          <label>
            Severity
            <select
              value={filters.severity}
              onChange={(event) => setFilters((current) => ({ ...current, severity: event.target.value }))}
            >
              <option value="">All</option>
              <option value="danger">Danger</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </label>

          <label>
            Limit
            <select
              value={String(filters.limit)}
              onChange={(event) => setFilters((current) => ({ ...current, limit: Number(event.target.value) }))}
            >
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>

          <label className="full-width-control">
            Search
            <input
              value={filters.search}
              placeholder="Search user, action, entity, details"
              onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            />
          </label>

          <div className="student-job-actions">
            <button type="submit" className="btn-primary">Apply</button>
            <button
              type="button"
              className="btn-link"
              onClick={() => {
                setFilters(initialFilters);
                loadEvents({ nextFilters: initialFilters, page: 1 });
              }}
            >
              Reset
            </button>
          </div>
        </form>

        {state.loading ? <p className="module-note">Loading events...</p> : null}
        <DataTable columns={columns} rows={state.logs} />

        <div className="student-pagination">
          <p className="module-note">
            Page {state.pagination.page} of {state.pagination.totalPages} • {state.pagination.total} records
          </p>
          <div className="student-job-actions">
            <button
              type="button"
              className="btn-link"
              disabled={state.loading || state.pagination.page <= 1}
              onClick={() => loadEvents({ nextFilters: filters, page: state.pagination.page - 1 })}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn-link"
              disabled={state.loading || state.pagination.page >= state.pagination.totalPages}
              onClick={() => loadEvents({ nextFilters: filters, page: state.pagination.page + 1 })}
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AuditEventsPage;

