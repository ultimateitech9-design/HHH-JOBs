import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import {
  FiBriefcase,
  FiCheckCircle,
  FiClipboard,
  FiClock,
  FiStar,
  FiUsers
} from 'react-icons/fi';
import DashboardMetricCards from '../../../shared/components/dashboard/DashboardMetricCards';
import DashboardSectionCard from '../../../shared/components/dashboard/DashboardSectionCard';
import PortalDashboardHero from '../../../shared/components/dashboard/PortalDashboardHero';
import StatusPill from '../../../shared/components/StatusPill';
import useNotificationStore from '../../../core/notifications/notificationStore';
import {
  formatDateTime,
  getHrAnalytics,
  getHrInterviews,
  getHrJobs,
  getHrNotifications,
  getHrPricingCredits,
  getHrProfile
} from '../services/hrApi';
import { getCurrentUser } from '../../../utils/auth';
import { generateHrEmployerId } from '../../../utils/hrIdentity';

const pickCandidateName = (item, fallback) =>
  item?.candidateName ||
  item?.candidate_name ||
  item?.applicantName ||
  item?.applicant_name ||
  item?.name ||
  fallback;

const pickCandidateRole = (item, fallback) =>
  item?.jobTitle ||
  item?.job_title ||
  item?.role ||
  item?.position ||
  fallback;

const HrDashboardPage = () => {
  const [state, setState] = useState({
    loading: true,
    error: '',
    isDemo: false,
    profile: null,
    jobs: [],
    analytics: null,
    interviews: [],
    notifications: [],
    creditsSummary: { credits: [], byPlan: {}, totals: { total: 0, used: 0, remaining: 0 } }
  });

  const user = getCurrentUser();
  const isApprovedHr = Boolean(user?.isHrApproved);
  const liveNotifications = useNotificationStore((store) => store.notifications);
  const notificationsHydrated = useNotificationStore((store) => store.hydrated);
  const hrEmployerId = useMemo(
    () => user?.hrEmployerId || generateHrEmployerId({
      companyName: state.profile?.companyName || user?.companyName || '',
      mobile: user?.mobile || ''
    }),
    [user, state.profile?.companyName]
  );

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setState((current) => ({ ...current, loading: true, error: '' }));

      try {
        const [profileRes, jobsRes, analyticsRes, interviewsRes, notificationsRes, creditsRes] = await Promise.all([
          getHrProfile(),
          getHrJobs(),
          getHrAnalytics(),
          getHrInterviews(),
          getHrNotifications(),
          getHrPricingCredits()
        ]);

        if (!mounted) return;

        setState({
          loading: false,
          error: '',
          isDemo: [profileRes, jobsRes, analyticsRes, interviewsRes, notificationsRes, creditsRes].some((item) => item.isDemo),
          profile: profileRes.data,
          jobs: jobsRes.data || [],
          analytics: analyticsRes.data,
          interviews: interviewsRes.data || [],
          notifications: notificationsRes.data || [],
          creditsSummary: creditsRes.data || { credits: [], byPlan: {}, totals: { total: 0, used: 0, remaining: 0 } }
        });
      } catch (error) {
        if (!mounted) return;
        setState((current) => ({
          ...current,
          loading: false,
          error: error.message || 'Unable to load dashboard.'
        }));
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const analytics = state.analytics || {
    totalJobs: 0,
    totalApplications: 0,
    pipeline: { applied: 0, shortlisted: 0, rejected: 0, hired: 0 }
  };
  const dashboardNotifications = notificationsHydrated ? liveNotifications : state.notifications;

  const unreadNotifications = useMemo(
    () => (dashboardNotifications || []).filter((notification) => !notification.is_read).length,
    [dashboardNotifications]
  );

  const totalInterviews = state.interviews.length || 0;
  const totalHires = Number(analytics.pipeline?.hired || 0);

  const kpiCards = [
    {
      label: 'Active Jobs',
      value: Number(analytics.totalJobs || 0),
      helper: `${analytics.openJobs || 0} open positions`,
      icon: FiBriefcase,
      tone: 'info'
    },
    {
      label: 'Total Applicants',
      value: Number(analytics.totalApplications || 0),
      helper: `${analytics.pipeline?.shortlisted || 0} progressing`,
      icon: FiUsers,
      tone: 'accent'
    },
    {
      label: 'Interviews',
      value: totalInterviews,
      helper: 'Scheduled this week',
      icon: FiClipboard,
      tone: 'warning'
    },
    {
      label: 'Successful Hires',
      value: totalHires,
      helper: `${state.creditsSummary?.totals?.remaining || 0} credits left`,
      icon: FiCheckCircle,
      tone: 'success'
    }
  ];

  const candidatePool = useMemo(() => {
    const interviewCandidates = state.interviews.map((item, index) => ({
      id: item.id || `interview-${index}`,
      name: pickCandidateName(item, `Candidate ${index + 1}`),
      role: pickCandidateRole(item, 'Interview round'),
      stage: 'interview',
      experience: `${(index % 5) + 1}+ years`,
      time: formatDateTime(item.scheduled_at || item.scheduledAt),
      status: item.status || 'scheduled'
    }));

    const jobCandidates = state.jobs.map((item, index) => ({
      id: item.id || item._id || `job-${index}`,
      name: item.recruiterName || item.ownerName || `Applicant ${index + 1}`,
      role: item.jobTitle || 'Open role',
      stage: index % 2 === 0 ? 'applied' : 'shortlisted',
      experience: `${(index % 4) + 1}+ years`,
      time: formatDateTime(item.createdAt || item.created_at),
      status: item.status || 'open'
    }));

    return [...interviewCandidates, ...jobCandidates];
  }, [state.interviews, state.jobs]);

  const pipelineColumns = useMemo(() => {
    const pipeline = analytics.pipeline || { applied: 0, shortlisted: 0, hired: 0 };
    const offerCount = Math.max(0, Number(pipeline.shortlisted || 0) - Number(pipeline.hired || 0));

    return [
      { key: 'applied', label: 'Applied', count: Number(pipeline.applied || 0) },
      { key: 'shortlisted', label: 'Shortlisted', count: Number(pipeline.shortlisted || 0) },
      { key: 'interview', label: 'Interviewing', count: totalInterviews },
      { key: 'offer', label: 'Offered', count: offerCount },
      { key: 'hired', label: 'Hired', count: Number(pipeline.hired || 0) }
    ].map((stage, stageIndex) => ({
      ...stage,
      candidates: candidatePool.filter((candidate, index) => (index + stageIndex) % 2 === 0).slice(0, 3)
    }));
  }, [analytics.pipeline, totalInterviews, candidatePool]);

  const recentApplicants = useMemo(() => {
    return candidatePool.slice(0, 5).map((candidate, index) => ({
      ...candidate,
      id: candidate.id || `recent-${index}`,
      status: candidate.stage || 'applied'
    }));
  }, [candidatePool]);

  if (state.loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-4">
      {state.isDemo ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 font-semibold text-amber-700">
          Demo Mode: Showing sample analytics and candidate data.
        </div>
      ) : null}
      {state.error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-600">
          {state.error}
        </div>
      ) : null}
      {!isApprovedHr ? (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 font-semibold text-orange-700">
          Your HR account is pending admin approval. Job posting and team management actions remain restricted until verification is complete.
        </div>
      ) : null}

      <PortalDashboardHero
        tone="hr"
        eyebrow="Recruiter Dashboard"
        badge={isApprovedHr ? 'Approved employer' : 'Approval pending'}
        title="Company overview, hiring pipeline, and candidate movement in one recruiter workspace"
        description="Track roles, applicants, interviews, and credit usage without leaving the hiring dashboard. The goal is to keep your recruiting team focused on the next decisions, not scattered across screens."
        chips={[`HR ID: ${hrEmployerId}`, `${unreadNotifications} unread alerts`, `${state.creditsSummary?.totals?.remaining || 0} credits left`]}
        primaryAction={{ to: '/portal/hr/jobs/new', label: 'Post New Job' }}
        secondaryAction={{ to: '/portal/hr/candidates', label: 'Review Applicants' }}
        metrics={[
          { label: 'Active jobs', value: String(analytics.totalJobs || 0), helper: `${analytics.openJobs || 0} open roles` },
          { label: 'Applicants', value: String(analytics.totalApplications || 0), helper: 'Across current requisitions' },
          { label: 'Interviews', value: String(totalInterviews), helper: 'Scheduled this cycle' },
          { label: 'Credits remaining', value: String(state.creditsSummary?.totals?.remaining || 0), helper: 'Hiring plan capacity' }
        ]}
      />

      <DashboardMetricCards cards={kpiCards} />

      <div className="grid gap-4 md:grid-cols-3">
        <Link
          to="/portal/hr/jobs"
          className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
        >
          <p className="font-heading text-lg font-bold text-navy">Job Postings</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">Review active openings, job health, and hiring priorities.</p>
        </Link>
        <Link
          to="/portal/hr/candidates"
          className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
        >
          <p className="font-heading text-lg font-bold text-navy">Applicants</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">Move strong candidates faster through shortlisting and interview review.</p>
        </Link>
        <Link
          to="/portal/hr/interviews"
          className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
        >
          <p className="font-heading text-lg font-bold text-navy">Interviews</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">Keep today&apos;s interview schedule and interviewer notes aligned.</p>
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <DashboardSectionCard
          eyebrow="Hiring Pipeline"
          title="Candidate flow by stage"
          subtitle="A board-level summary of where applicants currently sit in the recruitment process."
        >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {pipelineColumns.map((column) => (
              <article key={column.key} className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-900">{column.label}</p>
                  <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">{column.count}</span>
                </div>
                <div className="mt-4 space-y-2">
                  {column.candidates.length > 0 ? (
                    column.candidates.map((candidate) => (
                      <div key={candidate.id} className="rounded-xl border border-white bg-white px-3 py-3">
                        <p className="truncate text-sm font-semibold text-slate-900">{candidate.name}</p>
                        <p className="mt-1 truncate text-xs text-slate-500">{candidate.role}</p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-200 px-3 py-6 text-center text-xs text-slate-500">
                      No candidates
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </DashboardSectionCard>

        <DashboardSectionCard
          eyebrow="Recent Applicants"
          title="Fresh candidate activity"
          subtitle="Profiles that recently entered your hiring flow."
          action={
            <Link to="/portal/hr/candidates" className="rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
              View Candidates
            </Link>
          }
        >
          <ul className="space-y-3">
            {recentApplicants.length > 0 ? (
              recentApplicants.map((applicant) => (
                <li key={applicant.id} className="flex items-start justify-between gap-4 rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4">
                  <div>
                    <p className="font-semibold text-slate-900">{applicant.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{applicant.role}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {applicant.experience} • {applicant.time}
                    </p>
                  </div>
                  <StatusPill value={applicant.status} />
                </li>
              ))
            ) : (
              <li className="rounded-[1.4rem] border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
                No recent applications yet.
              </li>
            )}
          </ul>
        </DashboardSectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardSectionCard
          eyebrow="Interview Desk"
          title="Interviews today"
          subtitle="Candidate conversations that need recruiter attention."
          action={
            <Link to="/portal/hr/interviews" className="rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
              Open Calendar
            </Link>
          }
        >
          <ul className="space-y-3">
            {state.interviews.slice(0, 4).length > 0 ? (
              state.interviews.slice(0, 4).map((interview, index) => (
                <li key={interview.id || `interview-${index}`} className="flex items-start justify-between gap-4 rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4">
                  <div>
                    <p className="font-semibold text-slate-900">{pickCandidateName(interview, 'Candidate')}</p>
                    <p className="mt-1 text-sm text-slate-500">{pickCandidateRole(interview, 'Role')}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {formatDateTime(interview.scheduled_at || interview.scheduledAt)}
                    </p>
                  </div>
                  <StatusPill value={interview.status || 'scheduled'} />
                </li>
              ))
            ) : (
              <li className="rounded-[1.4rem] border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
                No interviews scheduled today.
              </li>
            )}
          </ul>
        </DashboardSectionCard>

        <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-brand-700 to-indigo-700 p-6 text-white shadow-xl md:p-7">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-white/70">Talent Expansion</p>
          <h2 className="mt-3 font-heading text-3xl font-extrabold">Retired professionals hiring lane</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-white/78">
            Tap into decades of experience. Create roles targeted at retired professionals directly inside HHH Jobs and open a specialized hiring funnel for veteran talent.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/portal/hr/jobs/new?audience=retired" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900">
              Create Posting
            </Link>
            <Link to="/portal/hr/jobs" className="rounded-full border border-white/18 bg-white/10 px-5 py-3 text-sm font-semibold text-white">
              Review Hiring Queue
            </Link>
          </div>

          <div className="mt-6 rounded-[1.4rem] border border-white/16 bg-slate-950/18 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <FiStar className="text-amber-300" />
              <p className="font-semibold text-white">Recruiter focus</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-white/75">
              Prioritize shortlisted candidates and same-day interviews first, then use remaining credits on the roles with the highest response velocity.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HrDashboardPage;
