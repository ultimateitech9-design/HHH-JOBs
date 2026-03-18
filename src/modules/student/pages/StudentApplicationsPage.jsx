import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import DataTable from '../../../shared/components/DataTable';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatusPill from '../../../shared/components/StatusPill';
import { formatDateTime, getStudentApplications } from '../services/studentApi';

const StudentApplicationsPage = () => {
  const [state, setState] = useState({ loading: true, error: '', isDemo: false, applications: [] });
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    let mounted = true;

    const loadApplications = async () => {
      const response = await getStudentApplications();
      if (!mounted) return;

      setState({
        loading: false,
        error: response.error && !response.isDemo ? response.error : '',
        isDemo: response.isDemo,
        applications: response.data || []
      });
    };

    loadApplications();

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return state.applications;
    return state.applications.filter((item) => String(item.status || '').toLowerCase() === statusFilter);
  }, [state.applications, statusFilter]);

  const columns = [
    {
      key: 'jobTitle',
      label: 'Job',
      render: (_, row) => row.job?.jobTitle || '-'
    },
    {
      key: 'company',
      label: 'Company',
      render: (_, row) => row.job?.companyName || '-'
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusPill value={value || 'applied'} />
    },
    {
      key: 'statusUpdatedAt',
      label: 'Updated',
      render: (value) => formatDateTime(value)
    },
    {
      key: 'action',
      label: 'Action',
      render: (_, row) => {
        const targetId = row.jobId || row.job_id || row.job?.id;
        if (!targetId) return '-';
        return <Link to={`/portal/student/jobs/${targetId}`} className="inline-link">View Job</Link>;
      }
    }
  ];

  return (
    <div className="module-page module-page--student">
      <SectionHeader
        eyebrow="Applications"
        title="Track Your Application Status"
        subtitle="Follow each job application from applied to shortlist/interview/hired/rejected."
      />

      {state.isDemo ? <p className="module-note">Backend data is unavailable because backend is unavailable.</p> : null}
      {state.error ? <p className="form-error">{state.error}</p> : null}

      <section className="panel-card">
        <div className="student-inline-controls">
          <label>
            Filter by status
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">All</option>
              <option value="applied">Applied</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interviewed">Interviewed</option>
              <option value="offered">Offered</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
        </div>

        {state.loading ? <p className="module-note">Loading applications...</p> : null}

        <DataTable columns={columns} rows={filtered.map((item) => ({ ...item, id: item.id }))} />
      </section>
    </div>
  );
};

export default StudentApplicationsPage;

