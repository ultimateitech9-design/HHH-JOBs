import { useEffect, useMemo, useState } from 'react';
import DataTable from '../../../shared/components/DataTable';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatCard from '../../../shared/components/StatCard';
import StatusPill from '../../../shared/components/StatusPill';
import { formatDateTime, getAdminReports, updateAdminReport } from '../services/adminApi';

const initialFilters = {
  status: 'all',
  search: ''
};

const statusToApi = (status) => (status === 'all' ? '' : status);

const AdminReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busyAction, setBusyAction] = useState('');
  const [reportDrafts, setReportDrafts] = useState({});

  const loadReports = async (nextStatus = filters.status) => {
    setLoading(true);
    setError('');
    const response = await getAdminReports({ status: statusToApi(nextStatus) });
    setReports(response.data || []);
    setError(response.error || '');
    setLoading(false);
  };

  useEffect(() => {
    loadReports(initialFilters.status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredReports = useMemo(() => {
    const search = String(filters.search || '').toLowerCase().trim();
    if (!search) return reports;

    return reports.filter((report) =>
      `${report.targetType || ''} ${report.targetId || ''} ${report.reason || ''} ${report.details || ''}`
        .toLowerCase()
        .includes(search)
    );
  }, [reports, filters.search]);

  const stats = useMemo(() => {
    const open = reports.filter((item) => item.status === 'open').length;
    const inReview = reports.filter((item) => item.status === 'in_review').length;
    const resolved = reports.filter((item) => item.status === 'resolved').length;
    const rejected = reports.filter((item) => item.status === 'rejected').length;

    return [
      { label: 'Total Reports', value: String(reports.length), helper: 'All submitted flags', tone: 'info' },
      { label: 'Open', value: String(open), helper: 'Pending triage', tone: open > 0 ? 'warning' : 'default' },
      { label: 'In Review', value: String(inReview), helper: 'Active moderation', tone: inReview > 0 ? 'warning' : 'default' },
      { label: 'Resolved/Rejected', value: String(resolved + rejected), helper: `${resolved} resolved, ${rejected} rejected`, tone: 'success' }
    ];
  }, [reports]);

  const updateLocalReport = (reportId, patch) => {
    setReports((current) => current.map((report) => (report.id === reportId ? { ...report, ...patch } : report)));
  };

  const updateDraft = (reportId, key, value) => {
    setReportDrafts((current) => ({
      ...current,
      [reportId]: {
        status: current[reportId]?.status || '',
        adminNote: current[reportId]?.adminNote || '',
        [key]: value
      }
    }));
  };

  const getDraft = (report) => (
    reportDrafts[report.id] || {
      status: report.status || '',
      adminNote: report.adminNote || ''
    }
  );

  const handleUpdateReport = async (report) => {
    const draft = getDraft(report);
    const nextStatus = String(draft.status || '').toLowerCase();
    if (!nextStatus) {
      setError('Select report status before update.');
      return;
    }

    setBusyAction(report.id);
    setError('');
    setMessage('');

    try {
      const updated = await updateAdminReport(report.id, {
        status: nextStatus,
        adminNote: draft.adminNote || ''
      });
      updateLocalReport(report.id, updated);
      setMessage(`Report ${report.id} updated.`);
    } catch (actionError) {
      setError(String(actionError.message || 'Unable to update report.'));
    } finally {
      setBusyAction('');
    }
  };

  const columns = [
    { key: 'id', label: 'Report ID' },
    { key: 'targetType', label: 'Target Type' },
    { key: 'targetId', label: 'Target ID' },
    { key: 'reason', label: 'Reason' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusPill value={value || 'open'} />
    },
    {
      key: 'adminNote',
      label: 'Admin Note',
      render: (value) => value || '-'
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value) => formatDateTime(value)
    },
    {
      key: 'id',
      label: 'Actions',
      render: (_, row) => {
        const draft = getDraft(row);
        const isBusy = busyAction === row.id;

        return (
          <div className="student-job-actions">
            <select
              className="table-select"
              value={draft.status}
              onChange={(event) => updateDraft(row.id, 'status', event.target.value)}
            >
              <option value="">Status</option>
              <option value="open">Open</option>
              <option value="in_review">In Review</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>

            <input
              className="table-select"
              placeholder="Admin note"
              value={draft.adminNote}
              onChange={(event) => updateDraft(row.id, 'adminNote', event.target.value)}
            />

            <button type="button" className="btn-link" disabled={isBusy} onClick={() => handleUpdateReport(row)}>Save</button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="module-page module-page--admin">
      <SectionHeader
        eyebrow="Reports"
        title="Moderation Queue"
        subtitle="Review user/job reports and close the loop with clear admin actions."
      />

      {error ? <p className="form-error">{error}</p> : null}
      {message ? <p className="form-success">{message}</p> : null}

      <div className="stats-grid">
        {stats.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <section className="panel-card">
        <div className="student-inline-controls">
          <label>
            Status
            <select
              value={filters.status}
              onChange={(event) => {
                const nextStatus = event.target.value;
                setFilters((current) => ({ ...current, status: nextStatus }));
                loadReports(nextStatus);
              }}
            >
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="in_review">In Review</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>

          <label className="full-width-control">
            Search
            <input
              placeholder="Reason, target, details"
              value={filters.search}
              onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            />
          </label>
        </div>

        {loading ? <p className="module-note">Loading reports...</p> : null}
        <DataTable columns={columns} rows={filteredReports} />
      </section>
    </div>
  );
};

export default AdminReportsPage;
