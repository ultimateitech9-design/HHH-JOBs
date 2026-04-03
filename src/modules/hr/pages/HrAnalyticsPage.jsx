import { useEffect, useMemo, useState } from 'react';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatCard from '../../../shared/components/StatCard';
import { getHrAnalytics } from '../services/hrApi';

const HrAnalyticsPage = () => {
  const [state, setState] = useState({ loading: true, error: '', isDemo: false, analytics: null });

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const response = await getHrAnalytics();
      if (!mounted) return;

      setState({
        loading: false,
        error: response.error && !response.isDemo ? response.error : '',
        isDemo: response.isDemo,
        analytics: response.data
      });
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const cards = useMemo(() => {
    const analytics = state.analytics || {
      totalJobs: 0,
      openJobs: 0,
      closedJobs: 0,
      totalViews: 0,
      totalApplications: 0,
      pipeline: {
        applied: 0,
        shortlisted: 0,
        interviewed: 0,
        offered: 0,
        rejected: 0,
        hired: 0
      }
    };

    return [
      {
        label: 'Total Jobs',
        value: String(analytics.totalJobs || 0),
        helper: `${analytics.openJobs || 0} open / ${analytics.closedJobs || 0} closed`,
        tone: 'info'
      },
      {
        label: 'Total Views',
        value: String(analytics.totalViews || 0),
        helper: 'Reach across active postings',
        tone: 'default'
      },
      {
        label: 'Applications',
        value: String(analytics.totalApplications || 0),
        helper: `${analytics.pipeline?.shortlisted || 0} shortlisted`,
        tone: 'warning'
      },
      {
        label: 'Hires',
        value: String(analytics.pipeline?.hired || 0),
        helper: `${analytics.pipeline?.rejected || 0} rejected`,
        tone: 'success'
      }
    ];
  }, [state.analytics]);

  const pipeline = state.analytics?.pipeline || {
    applied: 0,
    shortlisted: 0,
    interviewed: 0,
    offered: 0,
    rejected: 0,
    hired: 0
  };
  const maxPipeline = Math.max(1, ...Object.values(pipeline).map((value) => Number(value || 0)));

  return (
    <div className="module-page module-page--hr">
      <SectionHeader
        eyebrow="Analytics"
        title="Recruitment Performance"
        subtitle="Monitor hiring pipeline conversion and posting performance."
      />

      {state.isDemo ? <p className="module-note">Backend data is unavailable because backend is unavailable.</p> : null}
      {state.error ? <p className="form-error">{state.error}</p> : null}
      {state.loading ? <p className="module-note">Loading analytics...</p> : null}

      <div className="stats-grid">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <section className="panel-card">
        <SectionHeader eyebrow="Pipeline" title="Application Stage Distribution" />

        <div className="bar-list">
          {Object.entries(pipeline).map(([stage, count]) => {
            const width = Math.round((Number(count || 0) / maxPipeline) * 100);

            return (
              <div className="bar-item" key={stage}>
                <div className="bar-label-row">
                  <span>{stage}</span>
                  <strong>{count}</strong>
                </div>
                <div className="bar-track">
                  <span className="bar-fill" style={{ width: `${width}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default HrAnalyticsPage;

