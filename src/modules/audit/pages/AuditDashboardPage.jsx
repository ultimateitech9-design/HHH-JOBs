import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatCard from '../../../shared/components/StatCard';
import StatusPill from '../../../shared/components/StatusPill';
import { formatDateTime, getAuditAlerts, getAuditEvents, getAuditSummary } from '../services/auditApi';

const AuditDashboardPage = () => {
  const [state, setState] = useState({
    loading: true,
    isDemo: false,
    error: '',
    summary: null,
    recentEvents: [],
    alerts: []
  });

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setState((current) => ({ ...current, loading: true, error: '' }));

      try {
        const [summaryRes, eventsRes, alertsRes] = await Promise.all([
          getAuditSummary(),
          getAuditEvents({ page: 1, limit: 8 }),
          getAuditAlerts()
        ]);

        if (!mounted) return;

        setState({
          loading: false,
          isDemo: [summaryRes, eventsRes, alertsRes].some((item) => item.isDemo),
          error: [summaryRes, eventsRes, alertsRes].find((item) => item.error && !item.isDemo)?.error || '',
          summary: summaryRes.data,
          recentEvents: eventsRes.data?.auditLogs || [],
          alerts: alertsRes.data || []
        });
      } catch (error) {
        if (!mounted) return;
        setState((current) => ({
          ...current,
          loading: false,
          error: error.message || 'Unable to load audit dashboard.'
        }));
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const cards = useMemo(() => {
    const summary = state.summary || {
      events24h: 0,
      criticalAlerts: 0,
      warnings: 0,
      informational: 0
    };

    return [
      {
        label: 'Events (24h)',
        value: String(summary.events24h || 0),
        helper: 'Tracked system and user actions',
        tone: 'info'
      },
      {
        label: 'Critical Alerts',
        value: String(summary.criticalAlerts || 0),
        helper: 'High-risk events requiring action',
        tone: summary.criticalAlerts > 0 ? 'danger' : 'success'
      },
      {
        label: 'Warnings',
        value: String(summary.warnings || 0),
        helper: 'Watchlist activities',
        tone: summary.warnings > 0 ? 'warning' : 'default'
      },
      {
        label: 'Informational',
        value: String(summary.informational || 0),
        helper: 'Standard activity logs',
        tone: 'default'
      }
    ];
  }, [state.summary]);

  const auditSignals = useMemo(() => {
    const highSeverityAlerts = state.alerts.filter((alert) =>
      ['high', 'critical'].includes(String(alert.severity || '').toLowerCase())
    ).length;
    const openAlerts = state.alerts.filter((alert) => String(alert.status || '').toLowerCase() !== 'resolved').length;
    const dangerEvents = state.recentEvents.filter((event) => String(event.severity || '').toLowerCase() === 'danger').length;

    return [
      { label: 'Events in last 24h', value: state.summary?.events24h || 0 },
      { label: 'High severity alerts', value: highSeverityAlerts },
      { label: 'Open alerts', value: openAlerts },
      { label: 'Danger events', value: dangerEvents }
    ];
  }, [state.summary, state.alerts, state.recentEvents]);

  const investigationChecklist = useMemo(() => {
    const unresolved = state.alerts.filter((alert) => String(alert.status || '').toLowerCase() !== 'resolved').length;
    const warningEvents = state.recentEvents.filter((event) => String(event.severity || '').toLowerCase() === 'warning').length;

    return [
      {
        title: unresolved > 0 ? 'Resolve open alert ownership' : 'Alert ownership is stable',
        description:
          unresolved > 0
            ? `${unresolved} alert signals require owner assignment or closure notes.`
            : 'All alert cases are either resolved or in managed review.'
      },
      {
        title: warningEvents > 0 ? 'Review warning-grade event patterns' : 'Warning trend is low',
        description:
          warningEvents > 0
            ? `${warningEvents} warning events appear in the latest log slice.`
            : 'No significant warning spike in current event window.'
      },
      {
        title: 'Keep evidence trail complete',
        description: 'Attach investigation notes and owner updates directly to alert workflows for compliance.'
      }
    ];
  }, [state.alerts, state.recentEvents]);

  return (
    <div className="module-page module-page--audit">
      <section className="dashboard-hero dashboard-hero--audit">
        <div className="dashboard-hero-main">
          <p className="dashboard-hero-kicker">Audit Dashboard</p>
          <h1>Operational Traceability Overview</h1>
          <p>
            Observe security-relevant events, triage alerts, and maintain a defensible audit trail with
            role-ready investigative visibility.
          </p>
          <div className="dashboard-hero-actions">
            <Link to="/portal/audit/events" className="btn-primary">Open Event Explorer</Link>
            <Link to="/portal/audit/alerts" className="btn-secondary">Review Alerts</Link>
          </div>
        </div>
        <div className="dashboard-hero-side">
          <p className="dashboard-hero-side-title">Risk Signals</p>
          <ul className="hero-highlight-list">
            {auditSignals.map((signal) => (
              <li key={signal.label}>
                <strong>{signal.value}</strong>
                <span>{signal.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {state.isDemo ? <p className="module-note">Backend data is unavailable because backend is unavailable or restricted.</p> : null}
      {state.error ? <p className="form-error">{state.error}</p> : null}
      {state.loading ? <p className="module-note">Loading audit dashboard...</p> : null}

      <div className="quick-action-grid">
        <Link to="/portal/audit/events" className="quick-action-card quick-action-card--audit">
          <p>Event Forensics</p>
          <span>Inspect raw actions with entity and severity context.</span>
        </Link>
        <Link to="/portal/audit/alerts" className="quick-action-card quick-action-card--audit">
          <p>Alert Response</p>
          <span>Assign owners, classify risk, and close policy incidents.</span>
        </Link>
        <Link to="/portal/audit/dashboard" className="quick-action-card quick-action-card--audit">
          <p>Trace Snapshot</p>
          <span>Keep event volume and alert pressure visible each shift.</span>
        </Link>
      </div>

      <section className="panel-card">
        <SectionHeader
          eyebrow="Audit Metrics"
          title="Security Activity Snapshot"
        />
        <div className="stats-grid">
          {cards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>
      </section>

      <section className="panel-card">
        <SectionHeader
          eyebrow="Investigation Brief"
          title="Current Audit Priorities"
          subtitle="Handle these checkpoints first to reduce policy exposure."
        />
        <ul className="ops-checklist">
          {investigationChecklist.map((item) => (
            <li key={item.title}>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel-card">
        <SectionHeader
          eyebrow="Severity Mix"
          title="Alert Distribution"
          subtitle="Quick view of current low/medium/high risk signals."
        />
        <div className="pipeline-summary">
          <article>
            <strong>{state.alerts.filter((alert) => String(alert.severity || '').toLowerCase() === 'low').length}</strong>
            <span>low</span>
          </article>
          <article>
            <strong>{state.alerts.filter((alert) => String(alert.severity || '').toLowerCase() === 'medium').length}</strong>
            <span>medium</span>
          </article>
          <article>
            <strong>{state.alerts.filter((alert) => ['high', 'critical'].includes(String(alert.severity || '').toLowerCase())).length}</strong>
            <span>high / critical</span>
          </article>
        </div>
      </section>

      <div className="split-grid">
        <section className="panel-card">
          <SectionHeader
            eyebrow="Event Trend"
            title="Latest Event Severities"
            subtitle="Based on recent event slice loaded on this dashboard."
          />
          <div className="pipeline-summary">
            <article>
              <strong>{state.recentEvents.filter((event) => String(event.severity || '').toLowerCase() === 'info').length}</strong>
              <span>info</span>
            </article>
            <article>
              <strong>{state.recentEvents.filter((event) => String(event.severity || '').toLowerCase() === 'warning').length}</strong>
              <span>warning</span>
            </article>
            <article>
              <strong>{state.recentEvents.filter((event) => String(event.severity || '').toLowerCase() === 'danger').length}</strong>
              <span>danger</span>
            </article>
          </div>
        </section>

        <section className="panel-card">
          <SectionHeader
            eyebrow="Response Health"
            title="Alert Status Mix"
            subtitle="Monitor how quickly the team is closing investigative tasks."
          />
          <div className="pipeline-summary">
            <article>
              <strong>{state.alerts.filter((alert) => String(alert.status || '').toLowerCase() === 'open').length}</strong>
              <span>open</span>
            </article>
            <article>
              <strong>{state.alerts.filter((alert) => String(alert.status || '').toLowerCase() === 'in_review').length}</strong>
              <span>in review</span>
            </article>
            <article>
              <strong>{state.alerts.filter((alert) => String(alert.status || '').toLowerCase() === 'resolved').length}</strong>
              <span>resolved</span>
            </article>
          </div>
        </section>
      </div>

      <div className="split-grid">
        <section className="panel-card">
          <SectionHeader
            eyebrow="Recent Events"
            title="Latest Logged Actions"
          />
          <ul className="student-list">
            {state.recentEvents.map((event) => (
              <li key={event.id}>
                <div>
                  <h4>{event.action}</h4>
                  <p>{event.entity_type}:{event.entity_id}</p>
                  <p>{formatDateTime(event.created_at)}</p>
                </div>
                <StatusPill value={event.severity} />
              </li>
            ))}
            {state.recentEvents.length === 0 ? <li>No events available.</li> : null}
          </ul>
          <Link to="/portal/audit/events" className="inline-link">Open event explorer</Link>
        </section>

        <section className="panel-card">
          <SectionHeader
            eyebrow="Open Alerts"
            title="Security and Policy Signals"
          />
          <ul className="student-list">
            {state.alerts.slice(0, 8).map((alert) => (
              <li key={alert.id}>
                <div>
                  <h4>{alert.title}</h4>
                  <p>{alert.description}</p>
                  <p>{formatDateTime(alert.created_at)} • Owner: {alert.owner || '-'}</p>
                </div>
                <div className="student-list-actions">
                  <StatusPill value={alert.severity} />
                  <StatusPill value={alert.status} />
                </div>
              </li>
            ))}
            {state.alerts.length === 0 ? <li>No alerts detected.</li> : null}
          </ul>
          <Link to="/portal/audit/alerts" className="inline-link">Open alert manager</Link>
        </section>
      </div>
    </div>
  );
};

export default AuditDashboardPage;

