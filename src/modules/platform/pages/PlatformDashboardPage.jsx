import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatCard from '../../../shared/components/StatCard';
import StatusPill from '../../../shared/components/StatusPill';
import {
  formatDateTime,
  getPlatformIntegrations,
  getPlatformOverview,
  getPlatformSecurityChecks,
  getPlatformSupportTickets,
  getPlatformTenants
} from '../services/platformApi';

const PlatformDashboardPage = () => {
  const [state, setState] = useState({
    loading: true,
    isDemo: false,
    error: '',
    overview: null,
    tenants: [],
    tickets: [],
    integrations: [],
    checks: []
  });

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setState((current) => ({ ...current, loading: true, error: '' }));

      try {
        const [overviewRes, tenantsRes, ticketsRes, integrationsRes, checksRes] = await Promise.all([
          getPlatformOverview(),
          getPlatformTenants(),
          getPlatformSupportTickets(),
          getPlatformIntegrations(),
          getPlatformSecurityChecks()
        ]);

        if (!mounted) return;

        setState({
          loading: false,
          isDemo: [overviewRes, tenantsRes, ticketsRes, integrationsRes, checksRes].some((item) => item.isDemo),
          error: '',
          overview: overviewRes.data,
          tenants: tenantsRes.data || [],
          tickets: ticketsRes.data || [],
          integrations: integrationsRes.data || [],
          checks: checksRes.data || []
        });
      } catch (error) {
        if (!mounted) return;
        setState((current) => ({
          ...current,
          loading: false,
          error: error.message || 'Unable to load platform dashboard.'
        }));
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const cards = useMemo(() => {
    const overview = state.overview || {
      totalTenants: 0,
      activeTenants: 0,
      suspendedTenants: 0,
      pendingTenants: 0,
      openTickets: 0,
      healthyIntegrations: 0,
      degradedIntegrations: 0,
      monthlyRevenue: 0,
      complianceHealthy: 0,
      complianceTotal: 0
    };

    return [
      {
        label: 'Tenants',
        value: String(overview.totalTenants || 0),
        helper: `${overview.activeTenants || 0} active • ${overview.suspendedTenants || 0} suspended`,
        tone: 'info'
      },
      {
        label: 'Revenue (Monthly)',
        value: String(overview.monthlyRevenue || 0),
        helper: 'Paid invoices aggregate',
        tone: 'success'
      },
      {
        label: 'Open Tickets',
        value: String(overview.openTickets || 0),
        helper: 'Priority support queue',
        tone: overview.openTickets > 0 ? 'warning' : 'default'
      },
      {
        label: 'Compliance Health',
        value: `${overview.complianceHealthy || 0}/${overview.complianceTotal || 0}`,
        helper: `${overview.healthyIntegrations || 0} healthy integrations`,
        tone: overview.degradedIntegrations > 0 ? 'warning' : 'success'
      }
    ];
  }, [state.overview]);

  const platformSignals = useMemo(() => {
    const highPriorityTickets = state.tickets.filter((ticket) => String(ticket.priority || '').toLowerCase() === 'high').length;
    const degradedIntegrations = state.integrations.filter(
      (integration) => String(integration.status || '').toLowerCase() !== 'active'
    ).length;
    const unhealthyChecks = state.checks.filter((check) => String(check.status || '').toLowerCase() !== 'healthy').length;
    const nonActiveTenants = state.tenants.filter((tenant) => String(tenant.status || '').toLowerCase() !== 'active').length;

    return [
      { label: 'Non-active tenants', value: nonActiveTenants },
      { label: 'High priority tickets', value: highPriorityTickets },
      { label: 'Degraded integrations', value: degradedIntegrations },
      { label: 'Compliance warnings', value: unhealthyChecks }
    ];
  }, [state.tenants, state.tickets, state.integrations, state.checks]);

  const operationsChecklist = useMemo(() => {
    const openTickets = state.tickets.filter((ticket) => String(ticket.status || '').toLowerCase() === 'open').length;
    const degradedIntegrations = state.integrations.filter(
      (integration) => String(integration.status || '').toLowerCase() !== 'active'
    ).length;
    const unhealthyChecks = state.checks.filter((check) => String(check.status || '').toLowerCase() !== 'healthy').length;

    return [
      {
        title: openTickets > 0 ? 'Support queue requires action' : 'Support queue is under control',
        description:
          openTickets > 0
            ? `${openTickets} support tickets remain open across tenant environments.`
            : 'No pending open tickets right now.'
      },
      {
        title: degradedIntegrations > 0 ? 'Connectors need recovery' : 'All integrations are healthy',
        description:
          degradedIntegrations > 0
            ? `${degradedIntegrations} integrations show degraded/offline status.`
            : 'Sync health is stable across integration catalog.'
      },
      {
        title: unhealthyChecks > 0 ? 'Compliance controls need review' : 'Compliance checks are healthy',
        description:
          unhealthyChecks > 0
            ? `${unhealthyChecks} controls are flagged for follow-up.`
            : 'No compliance risk signals detected.'
      }
    ];
  }, [state.tickets, state.integrations, state.checks]);

  return (
    <div className="module-page module-page--platform">
      <section className="dashboard-hero dashboard-hero--platform">
        <div className="dashboard-hero-main">
          <p className="dashboard-hero-kicker">Platform Dashboard</p>
          <h1>Operations Command Center</h1>
          <p>
            Monitor multi-tenant reliability, billing posture, integration state, and support load from one
            executive operations screen.
          </p>
          <div className="dashboard-hero-actions">
            <Link to="/portal/platform/tenants" className="btn-primary">Manage Tenants</Link>
            <Link to="/portal/platform/support" className="btn-secondary">Open Support Ops</Link>
          </div>
        </div>
        <div className="dashboard-hero-side">
          <p className="dashboard-hero-side-title">Platform Signals</p>
          <ul className="hero-highlight-list">
            {platformSignals.map((signal) => (
              <li key={signal.label}>
                <strong>{signal.value}</strong>
                <span>{signal.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {state.isDemo ? <p className="module-note">Backend data is unavailable (platform backend endpoints are not connected).</p> : null}
      {state.error ? <p className="form-error">{state.error}</p> : null}
      {state.loading ? <p className="module-note">Loading platform dashboard...</p> : null}

      <div className="quick-action-grid">
        <Link to="/portal/platform/tenants" className="quick-action-card quick-action-card--platform">
          <p>Tenant Lifecycle</p>
          <span>Oversee tenant status, plan allocations, and renewal posture.</span>
        </Link>
        <Link to="/portal/platform/billing" className="quick-action-card quick-action-card--platform">
          <p>Billing Control</p>
          <span>Track invoice health, payment states, and revenue consistency.</span>
        </Link>
        <Link to="/portal/platform/integrations" className="quick-action-card quick-action-card--platform">
          <p>Integration Health</p>
          <span>Detect degraded connectors and trigger sync recovery quickly.</span>
        </Link>
        <Link to="/portal/platform/security" className="quick-action-card quick-action-card--platform">
          <p>Security Controls</p>
          <span>Review compliance checks and close risk observations proactively.</span>
        </Link>
      </div>

      <section className="panel-card">
        <SectionHeader eyebrow="Operations Metrics" title="Platform Health Snapshot" />
        <div className="stats-grid">
          {cards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>
      </section>

      <section className="panel-card">
        <SectionHeader
          eyebrow="Shift Brief"
          title="Immediate Platform Priorities"
          subtitle="Suggested order to stabilize reliability and tenant service quality."
        />
        <ul className="ops-checklist">
          {operationsChecklist.map((item) => (
            <li key={item.title}>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="split-grid">
        <section className="panel-card">
          <SectionHeader
            eyebrow="Tenant Mix"
            title="Status Distribution"
            subtitle="Understand growth posture across active, pending, and suspended accounts."
          />
          <div className="pipeline-summary">
            <article>
              <strong>{state.overview?.activeTenants || 0}</strong>
              <span>active</span>
            </article>
            <article>
              <strong>{state.overview?.pendingTenants || 0}</strong>
              <span>pending</span>
            </article>
            <article>
              <strong>{state.overview?.suspendedTenants || 0}</strong>
              <span>suspended</span>
            </article>
          </div>
        </section>

        <section className="panel-card">
          <SectionHeader
            eyebrow="Reliability"
            title="Integration and Control Signals"
            subtitle="Cross-check connector state with compliance outcomes."
          />
          <div className="pipeline-summary">
            <article>
              <strong>{state.overview?.healthyIntegrations || 0}</strong>
              <span>healthy integrations</span>
            </article>
            <article>
              <strong>{state.overview?.degradedIntegrations || 0}</strong>
              <span>degraded integrations</span>
            </article>
            <article>
              <strong>{state.overview?.complianceHealthy || 0}</strong>
              <span>healthy controls</span>
            </article>
          </div>
        </section>
      </div>

      <div className="split-grid">
        <section className="panel-card">
          <SectionHeader
            eyebrow="Top Tenants"
            title="Active Tenant Footprint"
          />
          <ul className="student-list">
            {state.tenants.slice(0, 6).map((tenant) => (
              <li key={tenant.id}>
                <div>
                  <h4>{tenant.name}</h4>
                  <p>{tenant.domain || '-'} • Plan: {tenant.plan}</p>
                  <p>Users: {tenant.activeUsers || 0} • Renewal: {tenant.renewalDate || '-'}</p>
                </div>
                <StatusPill value={tenant.status || 'active'} />
              </li>
            ))}
            {state.tenants.length === 0 ? <li>No tenant records available.</li> : null}
          </ul>
          <Link to="/portal/platform/tenants" className="inline-link">Open tenant manager</Link>
        </section>

        <section className="panel-card">
          <SectionHeader
            eyebrow="Support Queue"
            title="Recent Priority Tickets"
          />
          <ul className="student-list">
            {state.tickets.slice(0, 6).map((ticket) => (
              <li key={ticket.id}>
                <div>
                  <h4>{ticket.title}</h4>
                  <p>{ticket.tenantName || ticket.tenantId} • Owner: {ticket.owner || '-'}</p>
                  <p>Updated: {formatDateTime(ticket.updatedAt)}</p>
                </div>
                <div className="student-list-actions">
                  <StatusPill value={ticket.priority || 'low'} />
                  <StatusPill value={ticket.status || 'open'} />
                </div>
              </li>
            ))}
            {state.tickets.length === 0 ? <li>No support tickets.</li> : null}
          </ul>
          <Link to="/portal/platform/support" className="inline-link">Open support operations</Link>
        </section>
      </div>

      <div className="split-grid">
        <section className="panel-card">
          <SectionHeader
            eyebrow="Integrations"
            title="Connector Health"
          />
          <ul className="student-list">
            {state.integrations.slice(0, 6).map((integration) => (
              <li key={integration.id}>
                <div>
                  <h4>{integration.name}</h4>
                  <p>{integration.category} • Owner: {integration.owner}</p>
                  <p>Last sync: {formatDateTime(integration.lastSyncAt)}</p>
                </div>
                <StatusPill value={integration.status || 'active'} />
              </li>
            ))}
            {state.integrations.length === 0 ? <li>No integrations available.</li> : null}
          </ul>
          <Link to="/portal/platform/integrations" className="inline-link">Open integration manager</Link>
        </section>

        <section className="panel-card">
          <SectionHeader
            eyebrow="Security"
            title="Compliance Controls"
          />
          <ul className="student-list">
            {state.checks.slice(0, 6).map((check) => (
              <li key={check.id}>
                <div>
                  <h4>{check.control}</h4>
                  <p>{check.note}</p>
                </div>
                <StatusPill value={check.status || 'healthy'} />
              </li>
            ))}
            {state.checks.length === 0 ? <li>No compliance checks available.</li> : null}
          </ul>
          <Link to="/portal/platform/security" className="inline-link">Open security controls</Link>
        </section>
      </div>
    </div>
  );
};

export default PlatformDashboardPage;

