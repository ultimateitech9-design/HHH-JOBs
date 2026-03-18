import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import StatusPill from '../../../shared/components/StatusPill';
import { getDataEntryDashboard } from '../services/dataentryApi';

const emptyDashboard = {
  totals: {
    candidatesAdded: 0,
    jobsPosted: 0,
    companiesAdded: 0,
    hrContactsAdded: 0,
    totalEntries: 0
  },
  candidateWorkflow: {
    profileCreated: 0,
    resumeUploaded: 0,
    detailsUpdated: 0,
    candidateIdsGenerated: 0
  },
  companyWorkflow: {
    companyDetailsAdded: 0,
    hrContactsAdded: 0,
    jobOpeningsAdded: 0
  },
  pipeline: {
    applied: 0,
    shortlisted: 0,
    interview: 0,
    selected: 0,
    rejected: 0
  },
  quality: {
    errors: 0,
    duplicateEntries: 0,
    pendingReview: 0,
    approved: 0,
    drafts: 0
  },
  activityFeed: []
};

const DataEntryDashboard = () => {
  const [state, setState] = useState({
    loading: true,
    error: '',
    isDemo: false,
    dashboard: emptyDashboard
  });

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setState((current) => ({ ...current, loading: true, error: '' }));

      try {
        const dashboardRes = await getDataEntryDashboard();
        if (!mounted) return;

        setState({
          loading: false,
          error: dashboardRes.error || '',
          isDemo: Boolean(dashboardRes.isDemo),
          dashboard: { ...emptyDashboard, ...(dashboardRes.data || {}) }
        });
      } catch (error) {
        if (!mounted) return;
        setState((current) => ({
          ...current,
          loading: false,
          error: error.message || 'Unable to load data entry dashboard.'
        }));
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const totals = state.dashboard.totals || {};
    const quality = state.dashboard.quality || {};

    return [
      {
        label: 'Candidates Added',
        value: Number(totals.candidatesAdded || 0),
        helper: 'Profiles created by the data entry team'
      },
      {
        label: 'Jobs Posted',
        value: Number(totals.jobsPosted || 0),
        helper: 'Openings added to the system'
      },
      {
        label: 'Companies Added',
        value: Number(totals.companiesAdded || 0),
        helper: 'Company records created'
      },
      {
        label: 'Errors / Duplicates',
        value: Number(quality.errors || 0) + Number(quality.duplicateEntries || 0),
        helper: `${quality.errors || 0} errors | ${quality.duplicateEntries || 0} duplicates`
      }
    ];
  }, [state.dashboard]);

  const workflowItems = useMemo(() => {
    const candidateWorkflow = state.dashboard.candidateWorkflow || {};
    const companyWorkflow = state.dashboard.companyWorkflow || {};

    return [
      { label: 'Candidate Profiles Created', value: Number(candidateWorkflow.profileCreated || 0) },
      { label: 'Resumes Uploaded', value: Number(candidateWorkflow.resumeUploaded || 0) },
      { label: 'Candidate Details Updated', value: Number(candidateWorkflow.detailsUpdated || 0) },
      { label: 'Candidate IDs Generated', value: Number(candidateWorkflow.candidateIdsGenerated || 0) },
      { label: 'Company Details Added', value: Number(companyWorkflow.companyDetailsAdded || 0) },
      { label: 'HR Contacts Added', value: Number(companyWorkflow.hrContactsAdded || 0) },
      { label: 'Job Openings Added', value: Number(companyWorkflow.jobOpeningsAdded || 0) }
    ];
  }, [state.dashboard]);

  const pipelineItems = useMemo(() => {
    const pipeline = state.dashboard.pipeline || {};
    return [
      { key: 'applied', label: 'Applied', value: Number(pipeline.applied || 0) },
      { key: 'shortlisted', label: 'Shortlisted', value: Number(pipeline.shortlisted || 0) },
      { key: 'interview', label: 'Interview', value: Number(pipeline.interview || 0) },
      { key: 'selected', label: 'Selected', value: Number(pipeline.selected || 0) },
      { key: 'rejected', label: 'Rejected', value: Number(pipeline.rejected || 0) }
    ];
  }, [state.dashboard]);

  const monitoringItems = useMemo(() => {
    const quality = state.dashboard.quality || {};
    return [
      { label: 'Total Entries Handled', value: Number(state.dashboard.totals?.totalEntries || 0), tone: 'info' },
      { label: 'Pending Review', value: Number(quality.pendingReview || 0), tone: 'warning' },
      { label: 'Approved Entries', value: Number(quality.approved || 0), tone: 'success' },
      { label: 'Draft Entries', value: Number(quality.drafts || 0), tone: 'default' },
      { label: 'Errors', value: Number(quality.errors || 0), tone: Number(quality.errors || 0) > 0 ? 'danger' : 'default' },
      {
        label: 'Duplicate Entries',
        value: Number(quality.duplicateEntries || 0),
        tone: Number(quality.duplicateEntries || 0) > 0 ? 'danger' : 'default'
      }
    ];
  }, [state.dashboard]);

  const activityFeed = useMemo(() => {
    const items = Array.isArray(state.dashboard.activityFeed) ? state.dashboard.activityFeed : [];
    return items.slice(0, 6);
  }, [state.dashboard]);

  return (
    <div className="dashboard-page dashboard-page--dataentry">
      {state.isDemo ? <p className="module-note">Demo data is being shown because the data entry backend is not connected.</p> : null}
      {state.error ? <p className="form-error">{state.error}</p> : null}

      <section className="dash-banner dash-banner--admin">
        <div>
          <p className="dash-banner-kicker">Data Entry Dashboard</p>
          <h2>Candidate, company, and job entry operations in one view</h2>
          <p>Track operator output, record flow across the pipeline, and data quality issues such as errors or duplicate entries.</p>
          <div className="dash-banner-actions">
            <Link to="/portal/dataentry/add-job" className="btn-primary">Add Job</Link>
            <Link to="/portal/dataentry/manage-entries" className="btn-secondary">Manage Entries</Link>
          </div>
        </div>

        <ul className="dash-banner-metrics">
          {monitoringItems.slice(0, 4).map((item) => (
            <li key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {state.loading ? <p className="module-note">Loading dashboard...</p> : null}

      {!state.loading ? (
        <>
          <section className="dash-stat-grid">
            {stats.map((card) => (
              <article key={card.label} className="dash-stat dash-stat--info">
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
                  <h3>Operator Activity</h3>
                  <p>What the data entry team is adding to the system.</p>
                </div>
              </div>
              <ul className="dash-list">
                {workflowItems.map((item) => (
                  <li key={item.label}>
                    <div>
                      <strong>{item.label}</strong>
                      <span>Recorded actions</span>
                    </div>
                    <strong>{item.value}</strong>
                  </li>
                ))}
              </ul>
            </section>

            <section className="dash-card">
              <div className="dash-card-head">
                <div>
                  <h3>Status Pipeline</h3>
                  <p>Movement from application to rejection.</p>
                </div>
              </div>
              <ul className="dash-list">
                {pipelineItems.map((item) => (
                  <li key={item.key}>
                    <div>
                      <strong>{item.label}</strong>
                      <span>Candidate stage count</span>
                    </div>
                    <StatusPill value={item.label.toLowerCase()} />
                  </li>
                ))}
              </ul>
              <div className="stats-grid">
                {pipelineItems.map((item) => (
                  <article key={item.key} className="dash-stat dash-stat--default">
                    <p>{item.label}</p>
                    <h3>{item.value}</h3>
                    <span>Current stage volume</span>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <div className="dash-grid-2">
            <section className="dash-card">
              <div className="dash-card-head">
                <div>
                  <h3>Data Quality Monitoring</h3>
                  <p>Errors, duplicate entries, and approval progress.</p>
                </div>
                <Link to="/portal/dataentry/pending" className="inline-link">Open Queue</Link>
              </div>
              <ul className="dash-list">
                {monitoringItems.map((item) => (
                  <li key={item.label}>
                    <div>
                      <strong>{item.label}</strong>
                      <span>Dashboard monitor</span>
                    </div>
                    <StatusPill value={item.tone} />
                  </li>
                ))}
              </ul>
            </section>

            <section className="dash-card">
              <div className="dash-card-head">
                <div>
                  <h3>Recent Activity Feed</h3>
                  <p>Latest updates from the data entry workflow.</p>
                </div>
              </div>
              <ul className="dash-feed">
                {activityFeed.map((item, index) => (
                  <li key={item.id || `feed-${index}`}>
                    <div>
                      <strong>{item.title || item.action || `Activity ${index + 1}`}</strong>
                      <p>{item.description || item.message || 'Recent workflow activity recorded.'}</p>
                      <span>{item.time || item.createdAt || 'Just now'}</span>
                    </div>
                    <StatusPill value={item.status || 'updated'} />
                  </li>
                ))}
                {activityFeed.length === 0 ? <li className="dash-list-empty">No recent activity is available.</li> : null}
              </ul>
            </section>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default DataEntryDashboard;
