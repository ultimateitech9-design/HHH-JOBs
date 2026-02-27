import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import StatusPill from '../../../shared/components/StatusPill';
import {
  formatDateTime,
  getAdminAnalytics,
  getAdminJobs,
  getAdminReports,
  getAdminUsers
} from '../services/adminApi';

const AdminDashboardPage = () => {
  const [state, setState] = useState({
    loading: true,
    error: '',
    isDemo: false,
    analytics: null,
    pendingHr: [],
    pendingJobs: [],
    openReports: []
  });

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setState((current) => ({ ...current, loading: true, error: '' }));

      try {
        const [analyticsRes, hrRes, jobsRes, reportsRes] = await Promise.all([
          getAdminAnalytics(),
          getAdminUsers({ role: 'hr' }),
          getAdminJobs(),
          getAdminReports({ status: 'open' })
        ]);

        if (!mounted) return;

        const pendingHr = (hrRes.data || []).filter((user) => !user.is_hr_approved);
        const pendingJobs = (jobsRes.data || []).filter((job) => String(job.approvalStatus || '').toLowerCase() === 'pending');

        setState({
          loading: false,
          error: '',
          isDemo: [analyticsRes, hrRes, jobsRes, reportsRes].some((item) => item.isDemo),
          analytics: analyticsRes.data,
          pendingHr,
          pendingJobs,
          openReports: reportsRes.data || []
        });
      } catch (error) {
        if (!mounted) return;
        setState((current) => ({
          ...current,
          loading: false,
          error: error.message || 'Unable to load admin dashboard.'
        }));
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const cards = useMemo(() => {
    const analytics = state.analytics || {
      totalUsers: 0,
      totalHr: 0,
      approvedHr: 0,
      totalStudents: 0,
      activeUsers: 0,
      blockedUsers: 0,
      bannedUsers: 0,
      totalJobs: 0,
      openJobs: 0,
      closedJobs: 0,
      deletedJobs: 0,
      pendingJobs: 0,
      totalApplications: 0,
      reportsOpen: 0,
      reportsTotal: 0
    };

    return [
      {
        label: 'Total Users',
        value: String(analytics.totalUsers || 0),
        helper: `${analytics.activeUsers || 0} active • ${analytics.blockedUsers || 0} blocked`,
        tone: 'info'
      },
      {
        label: 'HR Accounts',
        value: String(analytics.totalHr || 0),
        helper: `${analytics.approvedHr || 0} approved • ${(analytics.totalHr || 0) - (analytics.approvedHr || 0)} pending`,
        tone: 'warning'
      },
      {
        label: 'Jobs',
        value: String(analytics.totalJobs || 0),
        helper: `${analytics.openJobs || 0} open • ${analytics.pendingJobs || 0} pending approval`,
        tone: 'success'
      },
      {
        label: 'Reports',
        value: String(analytics.reportsTotal || 0),
        helper: `${analytics.reportsOpen || 0} open moderation queue`,
        tone: analytics.reportsOpen > 0 ? 'danger' : 'default'
      }
    ];
  }, [state.analytics]);

  const commandSignals = useMemo(() => {
    const analytics = state.analytics || {};
    return [
      { label: 'HR approvals pending', value: state.pendingHr.length },
      { label: 'Jobs waiting approval', value: state.pendingJobs.length },
      { label: 'Open reports', value: state.openReports.length },
      { label: 'Blocked users', value: analytics.blockedUsers || 0 }
    ];
  }, [state.analytics, state.pendingHr, state.pendingJobs, state.openReports]);

  const shiftChecklist = useMemo(() => {
    return [
      {
        title: state.pendingHr.length > 0 ? 'Clear HR verification backlog' : 'HR approvals are clear',
        description:
          state.pendingHr.length > 0
            ? `${state.pendingHr.length} HR accounts need verification for production access.`
            : 'No pending HR onboarding approvals at this moment.'
      },
      {
        title: state.pendingJobs.length > 0 ? 'Review job publishing queue' : 'Job moderation is stable',
        description:
          state.pendingJobs.length > 0
            ? `${state.pendingJobs.length} job postings are waiting for compliance approval.`
            : 'No pending jobs in moderation queue.'
      },
      {
        title: state.openReports.length > 0 ? 'Close open reports' : 'No unresolved reports',
        description:
          state.openReports.length > 0
            ? `${state.openReports.length} report items still require admin resolution.`
            : 'Moderation inbox is currently clean.'
      }
    ];
  }, [state.pendingHr, state.pendingJobs, state.openReports]);

  return (
    <div className="dashboard-page dashboard-page--admin">
      {state.isDemo ? <p className="module-note">Backend data is unavailable because backend is unavailable.</p> : null}
      {state.error ? <p className="form-error">{state.error}</p> : null}

      <section className="dash-banner dash-banner--admin">
        <div>
          <p className="dash-banner-kicker">Admin Dashboard</p>
          <h2>Platform command center for moderation and approvals</h2>
          <p>Track queue pressure, investigate reports, and keep user governance healthy every cycle.</p>
          <div className="dash-banner-actions">
            <Link to="/portal/admin/users" className="btn-primary">Review HR Queue</Link>
            <Link to="/portal/admin/reports" className="btn-secondary">Moderate Reports</Link>
          </div>
        </div>

        <ul className="dash-banner-metrics">
          {commandSignals.map((signal) => (
            <li key={signal.label}>
              <strong>{signal.value}</strong>
              <span>{signal.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {state.loading ? <p className="module-note">Loading dashboard...</p> : null}

      {!state.loading ? (
        <>
          <section className="dash-stat-grid">
            {cards.map((card) => (
              <article key={card.label} className={`dash-stat dash-stat--${card.tone || 'default'}`}>
                <p>{card.label}</p>
                <h3>{card.value}</h3>
                <span>{card.helper}</span>
              </article>
            ))}
          </section>

          <div className="dash-grid-2">
            <section className="dash-card">
              <div className="dash-card-head">
                <div>
                  <h3>HR Approval Queue</h3>
                  <p>Recruiter identities pending admin verification.</p>
                </div>
                <Link to="/portal/admin/users" className="inline-link">Manage</Link>
              </div>
              <ul className="dash-list">
                {state.pendingHr.slice(0, 6).map((user) => (
                  <li key={user.id}>
                    <div>
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                    </div>
                    <StatusPill value={user.is_hr_approved ? 'approved' : 'pending'} />
                  </li>
                ))}
                {state.pendingHr.length === 0 ? <li className="dash-list-empty">No pending HR approvals.</li> : null}
              </ul>
            </section>

            <section className="dash-card">
              <div className="dash-card-head">
                <div>
                  <h3>Open Reports</h3>
                  <p>Moderation items requiring investigation and closure.</p>
                </div>
                <Link to="/portal/admin/reports" className="inline-link">Open reports</Link>
              </div>
              <ul className="dash-feed">
                {state.openReports.slice(0, 5).map((report) => (
                  <li key={report.id}>
                    <div>
                      <strong>{report.targetType || 'target'} - {report.reason || '-'}</strong>
                      <p>{report.details || 'No additional details provided.'}</p>
                      <span>{formatDateTime(report.updated_at || report.created_at)}</span>
                    </div>
                    <StatusPill value={report.status || 'open'} />
                  </li>
                ))}
                {state.openReports.length === 0 ? <li className="dash-list-empty">No open reports.</li> : null}
              </ul>
            </section>
          </div>

          <section className="dash-card">
            <div className="dash-card-head">
              <div>
                <h3>Job Moderation Queue</h3>
                <p>Publishing requests currently waiting for approval.</p>
              </div>
              <Link to="/portal/admin/jobs" className="inline-link">Open jobs panel</Link>
            </div>
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Job Role</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {state.pendingJobs.slice(0, 8).map((job) => (
                    <tr key={job.id || job._id}>
                      <td>{job.jobTitle}</td>
                      <td>{job.companyName}</td>
                      <td>{job.jobLocation || '-'}</td>
                      <td><StatusPill value={job.approvalStatus || 'pending'} /></td>
                    </tr>
                  ))}
                  {state.pendingJobs.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="dash-table-empty">No jobs in moderation queue.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>

          <section className="dash-card">
            <div className="dash-card-head">
              <div>
                <h3>Shift Checklist</h3>
                <p>Recommended order to keep daily operations stable.</p>
              </div>
            </div>
            <ul className="dash-check-list">
              {shiftChecklist.map((item) => (
                <li key={item.title}>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : null}
    </div>
  );
};

export default AdminDashboardPage;

