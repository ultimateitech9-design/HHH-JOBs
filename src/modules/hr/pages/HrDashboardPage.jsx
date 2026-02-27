import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { FiBriefcase, FiCheckCircle, FiClipboard, FiUsers } from 'react-icons/fi';
import StatusPill from '../../../shared/components/StatusPill';
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

const toneMap = {
  applied: 'applied',
  shortlisted: 'shortlisted',
  interview: 'interview',
  offer: 'offer',
  hired: 'hired'
};

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

  const unreadNotifications = useMemo(
    () => (state.notifications || []).filter((notification) => !notification.is_read).length,
    [state.notifications]
  );

  const totalInterviews = state.interviews.length || 0;
  const totalHires = Number(analytics.pipeline?.hired || 0);

  const kpiCards = [
    {
      label: 'Total Jobs',
      value: Number(analytics.totalJobs || 0),
      helper: `${analytics.openJobs || 0} active jobs`,
      icon: FiBriefcase,
      tone: 'jobs'
    },
    {
      label: 'Total Applicants',
      value: Number(analytics.totalApplications || 0),
      helper: `${analytics.pipeline?.shortlisted || 0} shortlisted`,
      icon: FiUsers,
      tone: 'applicants'
    },
    {
      label: 'Interviews',
      value: totalInterviews,
      helper: 'Scheduled rounds',
      icon: FiClipboard,
      tone: 'interviews'
    },
    {
      label: 'Hires',
      value: totalHires,
      helper: `${state.creditsSummary?.totals?.remaining || 0} credits left`,
      icon: FiCheckCircle,
      tone: 'hires'
    }
  ];

  const candidatePool = useMemo(() => {
    const interviewCandidates = state.interviews.map((item, index) => ({
      id: item.id || `interview-${index}`,
      name: pickCandidateName(item, `Candidate ${index + 1}`),
      role: pickCandidateRole(item, 'Interview round'),
      stage: 'interview',
      experience: `${(index % 5) + 1}+ Years`,
      time: formatDateTime(item.scheduled_at || item.scheduledAt),
      status: item.status || 'scheduled'
    }));

    const jobCandidates = state.jobs.map((item, index) => ({
      id: item.id || item._id || `job-${index}`,
      name: item.recruiterName || item.ownerName || `Applicant ${index + 1}`,
      role: item.jobTitle || 'Open role',
      stage: index % 2 === 0 ? 'applied' : 'shortlisted',
      experience: `${(index % 4) + 1}+ Years`,
      time: formatDateTime(item.createdAt || item.created_at),
      status: item.status || 'open'
    }));

    return [...interviewCandidates, ...jobCandidates];
  }, [state.interviews, state.jobs]);

  const pipelineColumns = useMemo(() => {
    const pipeline = analytics.pipeline || { applied: 0, shortlisted: 0, hired: 0 };
    const offerCount = Math.max(0, Number(pipeline.shortlisted || 0) - Number(pipeline.hired || 0));
    const stages = [
      { key: 'applied', label: 'Applied', count: Number(pipeline.applied || 0) },
      { key: 'shortlisted', label: 'Shortlisted', count: Number(pipeline.shortlisted || 0) },
      { key: 'interview', label: 'Interview', count: totalInterviews },
      { key: 'offer', label: 'Offer', count: offerCount },
      { key: 'hired', label: 'Hired', count: Number(pipeline.hired || 0) }
    ];

    return stages.map((stage, stageIndex) => {
      const stageCandidates = candidatePool
        .filter((candidate, index) => (index + stageIndex) % 2 === 0)
        .slice(0, 3);

      return {
        ...stage,
        candidates: stageCandidates
      };
    });
  }, [analytics.pipeline, totalInterviews, candidatePool]);

  const recentApplicants = useMemo(() => {
    return candidatePool.slice(0, 5).map((candidate, index) => ({
      id: candidate.id || `recent-${index}`,
      name: candidate.name || `Applicant ${index + 1}`,
      role: candidate.role || 'Hiring role',
      experience: candidate.experience || `${(index % 5) + 1}+ Years`,
      status: candidate.stage || 'applied'
    }));
  }, [candidatePool]);

  return (
    <div className="dashboard-page dashboard-page--hr dashboard-page--hr-modern">
      {state.isDemo ? <p className="module-note">Backend data is unavailable because backend is unavailable.</p> : null}
      {state.error ? <p className="form-error">{state.error}</p> : null}
      {!isApprovedHr ? (
        <section className="dash-card">
          <p className="form-error">
            HR account is pending admin approval. You can update profile, but job posting and applicant actions remain restricted.
          </p>
        </section>
      ) : null}
      {state.loading ? <p className="module-note">Loading dashboard...</p> : null}

      {!state.loading ? (
        <>
          <section className="hr-kpi-grid">
            {kpiCards.map((card) => {
              const Icon = card.icon;
              return (
                <article key={card.label} className={`hr-kpi-card hr-kpi-card--${card.tone}`}>
                  <div className="hr-kpi-icon">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p>{card.label}</p>
                    <h3>{card.value.toLocaleString('en-US')}</h3>
                    <span>{card.helper}</span>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="hr-main-grid">
            <div className="hr-left-column">
              <article className="dash-card hr-panel">
                <div className="dash-card-head">
                  <h3>Hiring Pipeline</h3>
                  <Link to="/portal/hr/analytics" className="inline-link">View All</Link>
                </div>
                <div className="hr-pipeline-board">
                  {pipelineColumns.map((column) => (
                    <section key={column.key} className="hr-pipeline-column">
                      <header>
                        <strong>{column.label}</strong>
                        <span>{column.count}</span>
                      </header>
                      <div className={`hr-pipeline-count hr-pipeline-count--${toneMap[column.key] || 'applied'}`} />
                      <ul>
                        {column.candidates.length ? (
                          column.candidates.map((candidate) => (
                            <li key={`${column.key}-${candidate.id}`}>
                              <strong>{candidate.name}</strong>
                              <span>{candidate.role}</span>
                            </li>
                          ))
                        ) : (
                          <li className="dash-list-empty">No records</li>
                        )}
                      </ul>
                    </section>
                  ))}
                </div>
              </article>

              <article className="dash-card hr-panel">
                <div className="dash-card-head">
                  <h3>Recent Applicants</h3>
                  <Link to="/portal/hr/candidates" className="inline-link">View All</Link>
                </div>
                <div className="dash-table-wrap">
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        <th>Job Role</th>
                        <th>Experience</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentApplicants.length ? (
                        recentApplicants.map((candidate) => (
                          <tr key={candidate.id}>
                            <td>{candidate.name}</td>
                            <td>{candidate.role}</td>
                            <td>{candidate.experience}</td>
                            <td>
                              <StatusPill value={candidate.status || 'applied'} />
                            </td>
                            <td>
                              <Link to="/portal/hr/candidates" className="inline-link">View</Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="dash-table-empty">No recent applicants.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </article>
            </div>

            <aside className="hr-right-column">
              <article className="dash-card hr-panel">
                <div className="dash-card-head">
                  <h3>Notifications</h3>
                  <span className="hr-dot-counter">{unreadNotifications} unread</span>
                </div>
                <ul className="dash-feed">
                  {state.notifications.slice(0, 3).map((notification) => (
                    <li key={notification.id}>
                      <div>
                        <strong>{notification.title || 'Recruiter update'}</strong>
                        <span>{notification.message || 'Platform event available in your inbox.'}</span>
                      </div>
                    </li>
                  ))}
                  {state.notifications.length === 0 ? <li className="dash-list-empty">No notifications available.</li> : null}
                </ul>
              </article>

              <article className="dash-card hr-panel">
                <div className="dash-card-head">
                  <h3>Upcoming Interviews</h3>
                  <Link to="/portal/hr/interviews" className="inline-link">View Calendar</Link>
                </div>
                <ul className="hr-interview-list">
                  {state.interviews.slice(0, 4).map((interview, index) => (
                    <li key={interview.id || `interview-row-${index}`}>
                      <time>{formatDateTime(interview.scheduled_at || interview.scheduledAt)}</time>
                      <div>
                        <strong>{pickCandidateName(interview, `Candidate ${index + 1}`)}</strong>
                        <span>{pickCandidateRole(interview, interview.mode || 'Interview round')}</span>
                      </div>
                      <Link to="/portal/hr/interviews" className="btn-link btn-link--mini">Join</Link>
                    </li>
                  ))}
                  {state.interviews.length === 0 ? <li className="dash-list-empty">No interviews scheduled.</li> : null}
                </ul>
              </article>

              <article className="dash-card hr-panel">
                <div className="dash-card-head">
                  <h3>Activity Feed</h3>
                </div>
                <ul className="dash-check-list">
                  {state.notifications.slice(0, 3).map((notification) => (
                    <li key={`activity-${notification.id}`}>
                      <h4>{notification.title || 'Candidate activity'}</h4>
                      <p>{formatDateTime(notification.created_at || notification.createdAt)}</p>
                    </li>
                  ))}
                  {state.notifications.length === 0 ? (
                    <li>
                      <h4>Dashboard synced</h4>
                      <p>Latest hiring activity will show here.</p>
                    </li>
                  ) : null}
                </ul>
              </article>
            </aside>
          </section>
        </>
      ) : null}
    </div>
  );
};

export default HrDashboardPage;
