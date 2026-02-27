import { useEffect, useMemo, useState } from 'react';
import DataTable from '../../../shared/components/DataTable';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatCard from '../../../shared/components/StatCard';
import StatusPill from '../../../shared/components/StatusPill';
import { formatDateTime, getAdminApplications } from '../services/adminApi';

const initialFilters = {
  status: 'all',
  search: ''
};

const statusToApi = (status) => (status === 'all' ? '' : status);

const AdminApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadApplications = async (nextStatus = filters.status) => {
    setLoading(true);
    setError('');
    const response = await getAdminApplications({ status: statusToApi(nextStatus) });
    setApplications(response.data || []);
    setError(response.error || '');
    setLoading(false);
  };

  useEffect(() => {
    loadApplications(initialFilters.status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredApplications = useMemo(() => {
    const search = String(filters.search || '').toLowerCase().trim();
    if (!search) return applications;

    return applications.filter((application) =>
      `${application.applicantEmail || ''} ${application.applicantId || ''} ${application.jobId || ''}`
        .toLowerCase()
        .includes(search)
    );
  }, [applications, filters.search]);

  const stats = useMemo(() => {
    const stageCount = (stage) => applications.filter((item) => item.status === stage).length;

    return [
      {
        label: 'Total Applications',
        value: String(applications.length),
        helper: 'Across all jobs',
        tone: 'info'
      },
      {
        label: 'Applied',
        value: String(stageCount('applied')),
        helper: 'New submissions',
        tone: 'default'
      },
      {
        label: 'Shortlisted + Interviewed',
        value: String(stageCount('shortlisted') + stageCount('interviewed')),
        helper: `${stageCount('shortlisted')} shortlisted, ${stageCount('interviewed')} interviewed`,
        tone: 'warning'
      },
      {
        label: 'Offered + Hired',
        value: String(stageCount('offered') + stageCount('hired')),
        helper: `${stageCount('offered')} offered, ${stageCount('hired')} hired`,
        tone: 'success'
      }
    ];
  }, [applications]);

  const columns = [
    { key: 'id', label: 'Application ID' },
    { key: 'jobId', label: 'Job ID' },
    { key: 'applicantEmail', label: 'Applicant' },
    { key: 'hrId', label: 'HR ID' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusPill value={value || 'applied'} />
    },
    {
      key: 'statusUpdatedAt',
      label: 'Status Updated',
      render: (value) => formatDateTime(value)
    },
    {
      key: 'resumeUrl',
      label: 'Resume',
      render: (value) => (
        value
          ? <a href={value} target="_blank" rel="noopener noreferrer" className="inline-link">Open</a>
          : '-'
      )
    },
    {
      key: 'createdAt',
      label: 'Applied At',
      render: (value) => formatDateTime(value)
    }
  ];

  return (
    <div className="module-page module-page--admin">
      <SectionHeader
        eyebrow="Applications"
        title="Cross-Portal Application Monitoring"
        subtitle="Observe candidate movement across all statuses and hiring stages."
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
            Status
            <select
              value={filters.status}
              onChange={(event) => {
                const nextStatus = event.target.value;
                setFilters((current) => ({ ...current, status: nextStatus }));
                loadApplications(nextStatus);
              }}
            >
              <option value="all">All</option>
              <option value="applied">Applied</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interviewed">Interviewed</option>
              <option value="offered">Offered</option>
              <option value="rejected">Rejected</option>
              <option value="hired">Hired</option>
            </select>
          </label>

          <label className="full-width-control">
            Search
            <input
              placeholder="Applicant email, applicant id, or job id"
              value={filters.search}
              onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            />
          </label>
        </div>

        {loading ? <p className="module-note">Loading applications...</p> : null}
        <DataTable columns={columns} rows={filteredApplications} />
      </section>
    </div>
  );
};

export default AdminApplicationsPage;
