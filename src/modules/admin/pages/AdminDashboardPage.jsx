import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import {
  FiActivity,
  FiAlertCircle,
  FiArrowRight,
  FiBriefcase,
  FiFlag,
  FiShield,
  FiUsers
} from 'react-icons/fi';
import DashboardMetricCards from '../../../shared/components/dashboard/DashboardMetricCards';
import DashboardSectionCard from '../../../shared/components/dashboard/DashboardSectionCard';
import PortalDashboardHero from '../../../shared/components/dashboard/PortalDashboardHero';
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
          analytics: analyticsRes.data || null,
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
      activeUsers: 0,
      blockedUsers: 0,
      totalJobs: 0,
      openJobs: 0,
      pendingJobs: 0,
      reportsOpen: 0,
      reportsTotal: 0
    };

    return [
      {
        label: 'Total Platform Users',
        value: String(analytics.totalUsers || 0),
        helper: `${analytics.activeUsers || 0} active • ${analytics.blockedUsers || 0} blocked`,
        icon: <FiUsers className="text-sky-700" />,
        tone: 'info'
      },
      {
        label: 'HR Accounts',
        value: String(analytics.totalHr || 0),
        helper: `${analytics.approvedHr || 0} approved • ${(analytics.totalHr || 0) - (analytics.approvedHr || 0)} pending`,
        icon: <FiShield className="text-brand-700" />,
        tone: 'accent'
      },
      {
        label: 'Job Listings',
        value: String(analytics.totalJobs || 0),
        helper: `${analytics.openJobs || 0} open • ${analytics.pendingJobs || 0} pending`,
        icon: <FiBriefcase className="text-emerald-700" />,
        tone: 'success'
      },
      {
        label: 'Moderation Reports',
        value: String(analytics.reportsTotal || 0),
        helper: `${analytics.reportsOpen || 0} open tickets in queue`,
        icon: <FiFlag className="text-amber-700" />,
        tone: 'warning'
      }
    ];
  }, [state.analytics]);

  const commandSignals = useMemo(() => {
    const analytics = state.analytics || {};
    return [
      { label: 'HR pending', value: state.pendingHr.length, helper: 'Recruiter approvals waiting' },
      { label: 'Jobs pending', value: state.pendingJobs.length, helper: 'Posts awaiting moderation' },
      { label: 'Open reports', value: state.openReports.length, helper: 'User reports requiring action' },
      { label: 'Blocked auth', value: analytics.blockedUsers || 0, helper: 'Accounts with access restrictions' }
    ];
  }, [state.analytics, state.pendingHr, state.pendingJobs, state.openReports]);

  const shiftChecklist = useMemo(() => {
    return [
      {
        title: state.pendingHr.length > 0 ? 'Clear recruiter verification backlog' : 'Recruiter approvals are clear',
        description: state.pendingHr.length > 0
          ? `${state.pendingHr.length} recruiters are waiting for approval.`
          : 'No pending HR onboardings right now.'
      },
      {
        title: state.pendingJobs.length > 0 ? 'Review publishing queue' : 'Job moderation is stable',
        description: state.pendingJobs.length > 0
          ? `${state.pendingJobs.length} job posts need compliance review.`
          : 'No pending jobs in moderation.'
      },
      {
        title: state.openReports.length > 0 ? 'Close open reports' : 'Report queue is at zero',
        description: state.openReports.length > 0
          ? `${state.openReports.length} reports still need admin action.`
          : 'Moderation inbox is currently clean.'
      }
    ];
  }, [state.pendingHr, state.pendingJobs, state.openReports]);

  return (
    <div className="space-y-6 pb-4">
      {state.isDemo ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 font-semibold text-amber-700">
          Demo Mode: Showing placeholder admin data.
        </div>
      ) : null}
      {state.error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-600">
          {state.error}
        </div>
      ) : null}

      <PortalDashboardHero
        tone="admin"
        eyebrow="Admin Dashboard"
        badge="Platform command center"
        title="Operations overview for moderation, recruiter approvals, and platform governance"
        description="Monitor platform health, clear moderation checkpoints, and investigate user reports so the hiring ecosystem stays safe, trusted, and operationally stable."
        chips={['Moderation queue', 'Recruiter approvals', 'Marketplace governance']}
        primaryAction={{ to: '/portal/admin/users', label: 'Review HR Queue' }}
        secondaryAction={{ to: '/portal/admin/reports', label: 'Moderate Reports' }}
        metrics={commandSignals}
      />

      {state.loading ? <p className="module-note">Loading admin dashboard...</p> : null}

      {!state.loading ? (
        <>
          <DashboardMetricCards cards={cards} />

          <div className="grid gap-4 md:grid-cols-3">
            <Link
              to="/portal/admin/users"
              className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <p className="font-heading text-lg font-bold text-navy">Users</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">Approve HR accounts, audit access, and manage restricted users.</p>
            </Link>
            <Link
              to="/portal/admin/jobs"
              className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <p className="font-heading text-lg font-bold text-navy">Jobs</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">Clear pending job listings and keep quality high before publishing.</p>
            </Link>
            <Link
              to="/portal/admin/reports"
              className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <p className="font-heading text-lg font-bold text-navy">Reports</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">Respond to abuse, fraud, and other trust or moderation issues.</p>
            </Link>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.95fr_0.95fr_1.1fr]">
            <DashboardSectionCard
              eyebrow="Verification Queue"
              title="Recruiters awaiting approval"
              action={
                <Link to="/portal/admin/users" className="rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
                  Open Users
                </Link>
              }
            >
              <ul className="space-y-3">
                {state.pendingHr.length === 0 ? (
                  <li className="rounded-[1.4rem] border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
                    Queue is clear.
                  </li>
                ) : (
                  state.pendingHr.slice(0, 6).map((user) => (
                    <li key={user.id} className="flex items-start justify-between gap-4 rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4">
                      <div>
                        <p className="font-semibold text-slate-900">{user.name || 'HR Recruiter'}</p>
                        <p className="mt-1 text-sm text-slate-500">{user.email || 'No email provided'}</p>
                      </div>
                      <StatusPill value={user.is_hr_approved ? 'approved' : 'pending'} />
                    </li>
                  ))
                )}
              </ul>
            </DashboardSectionCard>

            <DashboardSectionCard
              eyebrow="Daily Protocol"
              title="Recommended admin sequence"
              subtitle="Suggested order of operations to keep moderation and approval work under control."
            >
              <ul className="space-y-3">
                {shiftChecklist.map((item, index) => (
                  <li key={item.title} className="flex gap-4 rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-black text-brand-700">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </DashboardSectionCard>

            <DashboardSectionCard
              eyebrow="Moderation Alerts"
              title="Open reports requiring action"
              action={
                <Link to="/portal/admin/reports" className="rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
                  Open Reports
                </Link>
              }
            >
              <ul className="space-y-3">
                {state.openReports.length === 0 ? (
                  <li className="rounded-[1.4rem] border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
                    No active reports.
                  </li>
                ) : (
                  state.openReports.slice(0, 5).map((report) => (
                    <li key={report.id} className="rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold capitalize text-slate-900">{report.targetType || 'Item'} • {report.reason || 'Flagged'}</p>
                          <p className="mt-1 text-sm text-slate-500">{report.details || 'No expanded details provided for this report event.'}</p>
                          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                            {formatDateTime(report.updated_at || report.created_at)}
                          </p>
                        </div>
                        <StatusPill value={report.status || 'open'} />
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </DashboardSectionCard>
          </div>

          <DashboardSectionCard
            eyebrow="Job Clearance Queue"
            title="Pending jobs awaiting moderation"
            subtitle="Roles that need compliance review before they can be published to the marketplace."
            action={
              <Link to="/portal/admin/jobs" className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
                Open Jobs <FiArrowRight />
              </Link>
            }
          >
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.2em] text-slate-400">
                    <th className="px-4 py-4">Role</th>
                    <th className="px-4 py-4">Organization</th>
                    <th className="px-4 py-4">Location</th>
                    <th className="px-4 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {state.pendingJobs.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-4 py-10 text-center text-sm text-slate-500">
                        No jobs are currently awaiting moderation.
                      </td>
                    </tr>
                  ) : (
                    state.pendingJobs.slice(0, 8).map((job) => (
                      <tr key={job.id || job._id} className="border-b border-slate-100 last:border-0">
                        <td className="px-4 py-4 font-semibold text-slate-900">{job.jobTitle}</td>
                        <td className="px-4 py-4 text-sm text-slate-600">{job.companyName}</td>
                        <td className="px-4 py-4 text-sm text-slate-500">{job.jobLocation || '-'}</td>
                        <td className="px-4 py-4 text-right">
                          <StatusPill value={job.approvalStatus || 'pending'} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </DashboardSectionCard>
        </>
      ) : null}
    </div>
  );
};

export default AdminDashboardPage;
