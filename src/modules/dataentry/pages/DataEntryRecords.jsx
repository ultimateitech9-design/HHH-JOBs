import { useEffect, useMemo, useState } from 'react';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatCard from '../../../shared/components/StatCard';
import { getDataEntryPortalRecords } from '../services/dataentryApi';

const emptyState = {
  summary: {
    totalJobs: 0,
    totalCandidates: 0,
    totalCompanies: 0,
    totalNotifications: 0
  },
  jobs: [],
  candidates: [],
  companies: [],
  notifications: [],
  queue: {
    drafts: [],
    pending: [],
    approved: [],
    rejected: []
  }
};

const DataEntryRecords = () => {
  const [state, setState] = useState({
    loading: true,
    error: '',
    records: emptyState,
    isDemo: false
  });

  useEffect(() => {
    let mounted = true;

    const loadRecords = async () => {
      const response = await getDataEntryPortalRecords();
      if (!mounted) return;

      setState({
        loading: false,
        error: response.error || '',
        records: { ...emptyState, ...(response.data || {}) },
        isDemo: Boolean(response.isDemo)
      });
    };

    loadRecords();

    return () => {
      mounted = false;
    };
  }, []);

  const cards = useMemo(() => ([
    { label: 'Portal Jobs', value: String(state.records.summary?.totalJobs || 0), helper: 'Jobs visible in data entry records', tone: 'info' },
    { label: 'Candidate Records', value: String(state.records.summary?.totalCandidates || 0), helper: 'Candidate profiles linked to entries', tone: 'success' },
    { label: 'Company Records', value: String(state.records.summary?.totalCompanies || 0), helper: 'Companies visible in portal data', tone: 'default' },
    { label: 'Notifications', value: String(state.records.summary?.totalNotifications || 0), helper: 'Alerts and record updates', tone: 'warning' }
  ]), [state.records]);

  return (
    <div className="module-page module-page--dataentry">
      <SectionHeader
        eyebrow="Portal Records"
        title="HHH Jobs Portal Data Records"
        subtitle="View the jobs, candidates, companies, queue status, and notifications that are available to the data entry team."
      />

      {state.isDemo ? <p className="module-note">Demo portal data is being shown because the records endpoint is not connected yet.</p> : null}
      {state.error ? <p className="form-error">{state.error}</p> : null}

      <div className="stats-grid">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {state.loading ? <p className="module-note">Loading portal records...</p> : null}

      {!state.loading ? (
        <>
          <div className="dash-grid-2">
            <section className="panel-card">
              <SectionHeader
                eyebrow="Job Records"
                title="Portal Jobs"
                subtitle="Jobs currently visible inside the data entry workflow."
              />
              <ul className="dash-feed">
                {state.records.jobs.map((job) => (
                  <li key={job.id}>
                    <div>
                      <strong>{job.title}</strong>
                      <p>{job.companyName} · {job.location}</p>
                      <span>{job.status}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="panel-card">
              <SectionHeader
                eyebrow="Candidate Records"
                title="Portal Candidates"
                subtitle="Candidate profiles attached to posted jobs."
              />
              <ul className="dash-feed">
                {state.records.candidates.map((candidate) => (
                  <li key={candidate.id}>
                    <div>
                      <strong>{candidate.name}</strong>
                      <p>{candidate.jobTitle} · {candidate.companyName}</p>
                      <span>{candidate.id}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="dash-grid-2">
            <section className="panel-card">
              <SectionHeader
                eyebrow="Company Records"
                title="Portal Companies"
                subtitle="Companies currently appearing in data entry records."
              />
              <ul className="dash-feed">
                {state.records.companies.map((company) => (
                  <li key={company.id}>
                    <div>
                      <strong>{company.companyName}</strong>
                      <p>{company.location} · {company.totalEntries} linked records</p>
                      <span>{company.latestStatus}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="panel-card">
              <SectionHeader
                eyebrow="Queue Snapshot"
                title="Record Status Queues"
                subtitle="Current draft, pending, approved, and rejected record counts."
              />
              <div className="stats-grid">
                <StatCard label="Draft Jobs" value={String(state.records.queue?.drafts?.length || 0)} helper="Saved but not submitted" tone="default" />
                <StatCard label="Pending" value={String(state.records.queue?.pending?.length || 0)} helper="Awaiting review" tone="warning" />
                <StatCard label="Approved" value={String(state.records.queue?.approved?.length || 0)} helper="Ready on portal" tone="success" />
                <StatCard label="Rejected" value={String(state.records.queue?.rejected?.length || 0)} helper="Needs correction" tone="danger" />
              </div>
            </section>
          </div>

          <section className="panel-card">
            <SectionHeader
              eyebrow="Notifications"
              title="Portal Alerts"
              subtitle="Recent notifications related to records and quality checks."
            />
            <ul className="dash-feed">
              {state.records.notifications.map((notification) => (
                <li key={notification.id}>
                  <div>
                    <strong>{notification.title}</strong>
                    <p>{notification.message}</p>
                    <span>{notification.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : null}
    </div>
  );
};

export default DataEntryRecords;
