import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import DataTable from '../../../shared/components/DataTable';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatCard from '../../../shared/components/StatCard';
import StatusPill from '../../../shared/components/StatusPill';
import {
  deleteAdminJob,
  formatDateTime,
  getAdminJobs,
  updateAdminJobApproval,
  updateAdminJobStatus
} from '../services/adminApi';

const initialFilters = {
  status: 'all',
  approvalStatus: 'all',
  search: ''
};

const statusFilterToApi = (status) => (status === 'all' ? '' : status);

const AdminJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busyAction, setBusyAction] = useState('');
  const [approvalDrafts, setApprovalDrafts] = useState({});

  const loadJobs = async (nextStatus = filters.status) => {
    setLoading(true);
    setError('');
    const response = await getAdminJobs({ status: statusFilterToApi(nextStatus) });
    setJobs(response.data || []);
    setError(response.error || '');
    setLoading(false);
  };

  useEffect(() => {
    loadJobs(initialFilters.status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredJobs = useMemo(() => {
    const approvalStatus = filters.approvalStatus === 'all' ? '' : filters.approvalStatus;
    const search = String(filters.search || '').toLowerCase().trim();

    return jobs.filter((job) => {
      const matchesApproval = !approvalStatus || String(job.approvalStatus || '').toLowerCase() === approvalStatus;
      const matchesSearch = !search || `${job.jobTitle || ''} ${job.companyName || ''}`.toLowerCase().includes(search);
      return matchesApproval && matchesSearch;
    });
  }, [jobs, filters]);

  const stats = useMemo(() => {
    const open = jobs.filter((job) => String(job.status || '').toLowerCase() === 'open').length;
    const closed = jobs.filter((job) => String(job.status || '').toLowerCase() === 'closed').length;
    const deleted = jobs.filter((job) => String(job.status || '').toLowerCase() === 'deleted').length;
    const pendingApproval = jobs.filter((job) => String(job.approvalStatus || '').toLowerCase() === 'pending').length;

    return [
      { label: 'Total Jobs', value: String(jobs.length), helper: 'Across all recruiters', tone: 'info' },
      { label: 'Open Jobs', value: String(open), helper: 'Visible to candidates', tone: 'success' },
      { label: 'Closed/Deleted', value: String(closed + deleted), helper: `${closed} closed, ${deleted} deleted`, tone: 'default' },
      { label: 'Pending Approval', value: String(pendingApproval), helper: 'Needs moderation action', tone: pendingApproval > 0 ? 'warning' : 'success' }
    ];
  }, [jobs]);

  const updateLocalJob = (jobId, patch) => {
    setJobs((current) => current.map((job) => ((job.id || job._id) === jobId ? { ...job, ...patch } : job)));
  };

  const removeLocalJob = (jobId) => {
    setJobs((current) => current.filter((job) => (job.id || job._id) !== jobId));
  };

  const handleUpdateJobStatus = async (job, status) => {
    const jobId = job.id || job._id;
    if (!jobId || String(job.status || '').toLowerCase() === status) return;

    setBusyAction(`status:${jobId}`);
    setError('');
    setMessage('');

    try {
      const updated = await updateAdminJobStatus(jobId, status);
      updateLocalJob(jobId, updated);
      setMessage(`Job "${job.jobTitle}" marked ${status}.`);
    } catch (actionError) {
      setError(String(actionError.message || 'Unable to update job status.'));
    } finally {
      setBusyAction('');
    }
  };

  const updateApprovalDraft = (jobId, key, value) => {
    setApprovalDrafts((current) => ({
      ...current,
      [jobId]: {
        approvalStatus: current[jobId]?.approvalStatus || '',
        approvalNote: current[jobId]?.approvalNote || '',
        [key]: value
      }
    }));
  };

  const getApprovalDraft = (job) => {
    const jobId = job.id || job._id;
    return (
      approvalDrafts[jobId] || {
        approvalStatus: job.approvalStatus || '',
        approvalNote: job.approvalNote || ''
      }
    );
  };

  const handleApplyApproval = async (job) => {
    const jobId = job.id || job._id;
    if (!jobId) return;

    const draft = getApprovalDraft(job);
    const approvalStatus = String(draft.approvalStatus || '').toLowerCase();
    if (!approvalStatus) {
      setError('Select approval status before applying.');
      return;
    }

    setBusyAction(`approval:${jobId}`);
    setError('');
    setMessage('');

    try {
      const updated = await updateAdminJobApproval(jobId, {
        approvalStatus,
        approvalNote: draft.approvalNote || ''
      });
      updateLocalJob(jobId, updated);
      setMessage(`Approval updated for "${job.jobTitle}".`);
    } catch (actionError) {
      setError(String(actionError.message || 'Unable to update approval.'));
    } finally {
      setBusyAction('');
    }
  };

  const handleDeleteJob = async (job) => {
    const jobId = job.id || job._id;
    if (!jobId) return;
    if (!window.confirm(`Delete job "${job.jobTitle}"?`)) return;

    setBusyAction(`delete:${jobId}`);
    setError('');
    setMessage('');

    try {
      await deleteAdminJob(jobId);
      removeLocalJob(jobId);
      setMessage(`Deleted "${job.jobTitle}".`);
    } catch (actionError) {
      setError(String(actionError.message || 'Unable to delete job.'));
    } finally {
      setBusyAction('');
    }
  };

  const columns = [
    { key: 'jobTitle', label: 'Job' },
    { key: 'companyName', label: 'Company' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusPill value={value || 'open'} />
    },
    {
      key: 'approvalStatus',
      label: 'Approval',
      render: (value) => <StatusPill value={value || 'pending'} />
    },
    {
      key: 'isPaid',
      label: 'Payment',
      render: (value) => <StatusPill value={value ? 'paid' : 'pending'} />
    },
    {
      key: 'applicationsCount',
      label: 'Applicants',
      render: (value, row) => `${value || 0} (${row.viewsCount || 0} views)`
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
        const jobId = row.id || row._id;
        const draft = getApprovalDraft(row);
        const isStatusBusy = busyAction === `status:${jobId}`;
        const isApprovalBusy = busyAction === `approval:${jobId}`;
        const isDeleteBusy = busyAction === `delete:${jobId}`;

        return (
          <div className="student-job-actions">
            <button type="button" className="btn-link" disabled={isStatusBusy} onClick={() => handleUpdateJobStatus(row, 'open')}>Open</button>
            <button type="button" className="btn-link" disabled={isStatusBusy} onClick={() => handleUpdateJobStatus(row, 'closed')}>Close</button>
            <button type="button" className="btn-link" disabled={isStatusBusy} onClick={() => handleUpdateJobStatus(row, 'deleted')}>Delete State</button>

            <select
              className="table-select"
              value={draft.approvalStatus}
              onChange={(event) => updateApprovalDraft(jobId, 'approvalStatus', event.target.value)}
            >
              <option value="">Approval</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <input
              className="table-select"
              placeholder="Approval note"
              value={draft.approvalNote}
              onChange={(event) => updateApprovalDraft(jobId, 'approvalNote', event.target.value)}
            />

            <button type="button" className="btn-link" disabled={isApprovalBusy} onClick={() => handleApplyApproval(row)}>Apply Approval</button>
            <button type="button" className="btn-link" disabled={isDeleteBusy} onClick={() => handleDeleteJob(row)}>Hard Delete</button>
            <Link to="/portal/admin/applications" className="inline-link">Applications</Link>
          </div>
        );
      }
    }
  ];

  return (
    <div className="module-page module-page--admin">
      <SectionHeader
        eyebrow="Jobs Oversight"
        title="Job Moderation and Lifecycle"
        subtitle="Control visibility, approval status, and retention of all posted jobs."
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
            Job Status
            <select
              value={filters.status}
              onChange={(event) => {
                const nextStatus = event.target.value;
                setFilters((current) => ({ ...current, status: nextStatus }));
                loadJobs(nextStatus);
              }}
            >
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="deleted">Deleted</option>
            </select>
          </label>

          <label>
            Approval
            <select
              value={filters.approvalStatus}
              onChange={(event) => setFilters((current) => ({ ...current, approvalStatus: event.target.value }))}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>

          <label className="full-width-control">
            Search
            <input
              value={filters.search}
              placeholder="Job title or company"
              onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            />
          </label>
        </div>

        {loading ? <p className="module-note">Loading jobs...</p> : null}
        <DataTable columns={columns} rows={filteredJobs} />
      </section>
    </div>
  );
};

export default AdminJobsPage;
