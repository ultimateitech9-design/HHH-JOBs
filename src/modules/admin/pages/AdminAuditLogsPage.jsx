import { useEffect, useState } from 'react';
import DataTable from '../../../shared/components/DataTable';
import SectionHeader from '../../../shared/components/SectionHeader';
import { formatDateTime, getAdminAuditLogs } from '../services/adminApi';

const initialFilters = {
  userId: '',
  action: '',
  entityType: '',
  limit: 20
};

const summarizeDetails = (details) => {
  if (!details) return '-';
  const text = typeof details === 'string' ? details : JSON.stringify(details);
  if (text.length <= 100) return text;
  return `${text.slice(0, 97)}...`;
};

const AdminAuditLogsPage = () => {
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

  const loadLogs = async ({ nextFilters = filters, page = 1 } = {}) => {
    setState((current) => ({ ...current, loading: true, error: '' }));

    const response = await getAdminAuditLogs({
      userId: nextFilters.userId,
      action: nextFilters.action,
      entityType: nextFilters.entityType,
      page,
      limit: Number(nextFilters.limit || 20)
    });

    setState({
      loading: false,
      isDemo: response.isDemo,
      error: response.error && !response.isDemo ? response.error : '',
      logs: response.data?.auditLogs || [],
      pagination: response.data?.pagination || {
        page,
        limit: Number(nextFilters.limit || 20),
        total: 0,
        totalPages: 1
      }
    });
  };

  useEffect(() => {
    loadLogs({ nextFilters: initialFilters, page: 1 });
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
      key: 'details',
      label: 'Details',
      render: (value) => summarizeDetails(value)
    },
    { key: 'ip_address', label: 'IP Address' }
  ];

  return (
    <div className="module-page module-page--admin">
      <SectionHeader
        eyebrow="Audit Logs"
        title="Traceability and Compliance Trail"
        subtitle="Filter admin actions by user, action, and entity for investigations and audits."
      />

      {state.isDemo ? <p className="module-note">Backend data is unavailable because backend is unavailable.</p> : null}
      {state.error ? <p className="form-error">{state.error}</p> : null}

      <section className="panel-card">
        <form
          className="student-inline-controls"
          onSubmit={(event) => {
            event.preventDefault();
            loadLogs({ nextFilters: filters, page: 1 });
          }}
        >
          <label>
            User ID
            <input
              value={filters.userId}
              onChange={(event) => setFilters((current) => ({ ...current, userId: event.target.value }))}
              placeholder="Filter by user id"
            />
          </label>

          <label>
            Action
            <input
              value={filters.action}
              onChange={(event) => setFilters((current) => ({ ...current, action: event.target.value }))}
              placeholder="job_approved"
            />
          </label>

          <label>
            Entity Type
            <input
              value={filters.entityType}
              onChange={(event) => setFilters((current) => ({ ...current, entityType: event.target.value }))}
              placeholder="job, user, report"
            />
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

          <div className="student-job-actions">
            <button type="submit" className="btn-primary">Apply</button>
            <button
              type="button"
              className="btn-link"
              onClick={() => {
                setFilters(initialFilters);
                loadLogs({ nextFilters: initialFilters, page: 1 });
              }}
            >
              Reset
            </button>
          </div>
        </form>

        {state.loading ? <p className="module-note">Loading audit logs...</p> : null}
        <DataTable columns={columns} rows={state.logs} />

        <div className="student-pagination">
          <p className="module-note">
            Page {state.pagination.page} of {state.pagination.totalPages} • {state.pagination.total} logs
          </p>

          <div className="student-job-actions">
            <button
              type="button"
              className="btn-link"
              disabled={state.pagination.page <= 1 || state.loading}
              onClick={() => loadLogs({ nextFilters: filters, page: state.pagination.page - 1 })}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn-link"
              disabled={state.pagination.page >= state.pagination.totalPages || state.loading}
              onClick={() => loadLogs({ nextFilters: filters, page: state.pagination.page + 1 })}
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminAuditLogsPage;

