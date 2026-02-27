import { useEffect, useMemo, useState } from 'react';
import DataTable from '../../../shared/components/DataTable';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatCard from '../../../shared/components/StatCard';
import StatusPill from '../../../shared/components/StatusPill';
import {
  formatDateTime,
  getAuditAlerts,
  getAuditComplianceChecks,
  updateAuditAlert,
  updateAuditComplianceCheck
} from '../services/auditApi';

const mapSeverityTone = (value = '') => {
  const key = String(value).toLowerCase();
  if (key === 'critical' || key === 'high') return 'danger';
  if (key === 'medium') return 'warning';
  return 'info';
};

const AuditAlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [compliance, setCompliance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const [alertsRes, complianceRes] = await Promise.all([getAuditAlerts(), getAuditComplianceChecks()]);
      if (!mounted) return;

      setAlerts(alertsRes.data || []);
      setCompliance(complianceRes.data || []);
      setIsDemo(alertsRes.isDemo || complianceRes.isDemo);
      setError([alertsRes, complianceRes].find((item) => item.error && !item.isDemo)?.error || '');
      setLoading(false);
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const open = alerts.filter((alert) => alert.status === 'open').length;
    const inReview = alerts.filter((alert) => alert.status === 'in_review').length;
    const resolved = alerts.filter((alert) => alert.status === 'resolved').length;
    const critical = alerts.filter((alert) => {
      const severity = String(alert.severity || '').toLowerCase();
      return severity === 'critical' || severity === 'high';
    }).length;

    return [
      { label: 'Total Alerts', value: String(alerts.length), helper: 'All active and historical signals', tone: 'info' },
      { label: 'Critical/High', value: String(critical), helper: 'Immediate attention required', tone: critical > 0 ? 'danger' : 'success' },
      { label: 'Open + In Review', value: String(open + inReview), helper: `${open} open, ${inReview} in review`, tone: open + inReview > 0 ? 'warning' : 'default' },
      { label: 'Resolved', value: String(resolved), helper: 'Closed by audit owners', tone: 'success' }
    ];
  }, [alerts]);

  const updateAlertStatus = async (alertId, status) => {
    setError('');
    setMessage('');

    try {
      const updated = await updateAuditAlert(alertId, { status });
      setAlerts((current) =>
        current.map((alert) => (alert.id === alertId ? { ...alert, ...updated } : alert))
      );
      setMessage(`Alert ${alertId} marked ${status}.`);
    } catch (actionError) {
      setError(actionError.message || 'Unable to update alert status.');
    }
  };

  const updateComplianceStatus = async (checkId, status) => {
    setError('');
    setMessage('');

    try {
      const updated = await updateAuditComplianceCheck(checkId, { status });
      setCompliance((current) =>
        current.map((check) => (check.id === checkId ? { ...check, ...updated } : check))
      );
      setMessage(`Compliance check ${checkId} updated.`);
    } catch (actionError) {
      setError(actionError.message || 'Unable to update compliance check.');
    }
  };

  const complianceColumns = [
    { key: 'control', label: 'Control' },
    { key: 'owner', label: 'Owner' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusPill value={value} />
    },
    { key: 'target', label: 'Target' },
    { key: 'observed', label: 'Observed' },
    {
      key: 'id',
      label: 'Actions',
      render: (_, row) => (
        <div className="student-job-actions">
          <button type="button" className="btn-link" onClick={() => updateComplianceStatus(row.id, 'healthy')}>Healthy</button>
          <button type="button" className="btn-link" onClick={() => updateComplianceStatus(row.id, 'degraded')}>Degraded</button>
          <button type="button" className="btn-link" onClick={() => updateComplianceStatus(row.id, 'critical')}>Critical</button>
        </div>
      )
    }
  ];

  return (
    <div className="module-page module-page--audit">
      <SectionHeader
        eyebrow="Alerts and Compliance"
        title="Risk Signals and Control Health"
        subtitle="Review alerts, change triage status, and monitor compliance controls in one place."
      />

      {isDemo ? <p className="module-note">Backend data is unavailable because backend is unavailable or restricted.</p> : null}
      {error ? <p className="form-error">{error}</p> : null}
      {message ? <p className="form-success">{message}</p> : null}
      {loading ? <p className="module-note">Loading alerts and controls...</p> : null}

      <div className="stats-grid">
        {stats.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <section className="panel-card">
        <SectionHeader
          eyebrow="Alert Queue"
          title="Security and Policy Alerts"
        />
        <ul className="student-list">
          {alerts.map((alert) => (
            <li key={alert.id}>
              <div>
                <h4>{alert.title}</h4>
                <p>{alert.description}</p>
                <p>{formatDateTime(alert.created_at)} • Owner: {alert.owner || '-'}</p>
              </div>
              <div className="student-list-actions">
                <StatusPill value={mapSeverityTone(alert.severity)} />
                <StatusPill value={alert.status || 'open'} />
                <div className="student-job-actions">
                  <button type="button" className="btn-link" onClick={() => updateAlertStatus(alert.id, 'in_review')}>Review</button>
                  <button type="button" className="btn-link" onClick={() => updateAlertStatus(alert.id, 'resolved')}>Resolve</button>
                  <button type="button" className="btn-link" onClick={() => updateAlertStatus(alert.id, 'open')}>Reopen</button>
                </div>
              </div>
            </li>
          ))}
          {alerts.length === 0 ? <li>No alerts available.</li> : null}
        </ul>
      </section>

      <section className="panel-card">
        <SectionHeader
          eyebrow="Compliance Controls"
          title="Control Health Matrix"
        />
        <DataTable columns={complianceColumns} rows={compliance} />
      </section>
    </div>
  );
};

export default AuditAlertsPage;

