import { useEffect, useMemo, useState } from 'react';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatCard from '../../../shared/components/StatCard';
import { getStudentAnalytics } from '../services/studentApi';

const StudentAnalyticsPage = () => {
  const [state, setState] = useState({ loading: true, error: '', isDemo: false, analytics: null });

  useEffect(() => {
    let mounted = true;

    const loadAnalytics = async () => {
      const response = await getStudentAnalytics();
      if (!mounted) return;

      setState({
        loading: false,
        error: response.error && !response.isDemo ? response.error : '',
        isDemo: response.isDemo,
        analytics: response.data
      });
    };

    loadAnalytics();

    return () => {
      mounted = false;
    };
  }, []);

  const cards = useMemo(() => {
    const analytics = state.analytics || { totalApplications: 0, pipeline: {}, atsChecks: 0 };
    const shortlisted = Number(analytics.pipeline?.shortlisted || 0);
    const hired = Number(analytics.pipeline?.hired || 0);
    const totalApplications = Number(analytics.totalApplications || 0);
    const successRate = totalApplications ? Math.round((hired / totalApplications) * 100) : 0;

    return [
      {
        label: 'Total Applications',
        value: String(totalApplications),
        helper: 'All submitted applications',
        tone: 'info'
      },
      {
        label: 'Shortlisted',
        value: String(shortlisted),
        helper: 'Reached shortlist stage',
        tone: 'warning'
      },
      {
        label: 'Hired',
        value: String(hired),
        helper: 'Final success outcomes',
        tone: 'success'
      },
      {
        label: 'ATS Checks',
        value: String(analytics.atsChecks || 0),
        helper: `Hire success rate ${successRate}%`,
        tone: 'default'
      }
    ];
  }, [state.analytics]);

  const pipeline = state.analytics?.pipeline || { applied: 0, shortlisted: 0, rejected: 0, hired: 0 };
  const maxPipeline = Math.max(1, ...Object.values(pipeline));

  return (
    <div className="module-page module-page--student">
      <SectionHeader
        eyebrow="Analytics"
        title="Your Application Performance"
        subtitle="Understand conversion from apply to hire and ATS readiness trends."
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
        <SectionHeader eyebrow="Pipeline" title="Stage Distribution" />

        <div className="bar-list">
          {Object.entries(pipeline).map(([stage, count]) => {
            const width = Math.round((Number(count) / maxPipeline) * 100);

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

export default StudentAnalyticsPage;

