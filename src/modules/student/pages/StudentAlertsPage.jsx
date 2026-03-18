import { useEffect, useState } from 'react';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatusPill from '../../../shared/components/StatusPill';
import {
  createStudentAlert,
  deleteStudentAlert,
  getStudentAlerts,
  updateStudentAlert
} from '../services/studentApi';

const initialAlertForm = {
  keywords: '',
  location: '',
  experienceLevel: '',
  employmentType: '',
  minSalary: '',
  maxSalary: ''
};

const StudentAlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [form, setForm] = useState(initialAlertForm);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadAlerts = async () => {
      const response = await getStudentAlerts();
      if (!mounted) return;

      setAlerts(response.data || []);
      setError(response.error || '');
      setLoading(false);
    };

    loadAlerts();

    return () => {
      mounted = false;
    };
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    const payload = {
      keywords: form.keywords
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      location: form.location || null,
      experienceLevel: form.experienceLevel || null,
      employmentType: form.employmentType || null,
      minSalary: form.minSalary ? Number(form.minSalary) : null,
      maxSalary: form.maxSalary ? Number(form.maxSalary) : null,
      isActive: true
    };

    try {
      const created = await createStudentAlert(payload);
      setAlerts((current) => [created, ...current]);
      setForm(initialAlertForm);
      setMessage('Alert created successfully.');
    } catch (createError) {
      setError(createError.message || 'Failed to create alert.');
    }
  };

  const toggleAlert = async (alert) => {
    const nextActiveState = !alert.is_active;
    setMessage('');
    setError('');

    try {
      const updated = await updateStudentAlert(alert.id, { isActive: nextActiveState });
      setAlerts((current) => current.map((item) => (item.id === alert.id ? updated : item)));
      setMessage('Alert updated successfully.');
    } catch (updateError) {
      setError(updateError.message || 'Failed to update alert.');
    }
  };

  const removeAlert = async (alertId) => {
    setMessage('');
    setError('');

    try {
      await deleteStudentAlert(alertId);
      setAlerts((current) => current.filter((item) => item.id !== alertId));
      setMessage('Alert removed successfully.');
    } catch (deleteError) {
      setError(deleteError.message || 'Failed to remove alert.');
    }
  };

  return (
    <div className="module-page module-page--student">
      <SectionHeader
        eyebrow="Job Alerts"
        title="Create and Manage Alert Rules"
        subtitle="Configure keywords, location, experience, and salary range for automatic job alerts."
      />

      {error ? <p className="form-error">{error}</p> : null}
      {message ? <p className="form-success">{message}</p> : null}

      <section className="panel-card">
        <form className="form-grid" onSubmit={handleCreate}>
          <label className="full-row">
            Keywords (comma separated)
            <input
              value={form.keywords}
              onChange={(event) => setForm((current) => ({ ...current, keywords: event.target.value }))}
              placeholder="react, frontend, typescript"
            />
          </label>

          <label>
            Location
            <input
              value={form.location}
              onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
            />
          </label>

          <label>
            Experience Level
            <input
              value={form.experienceLevel}
              onChange={(event) => setForm((current) => ({ ...current, experienceLevel: event.target.value }))}
            />
          </label>

          <label>
            Employment Type
            <input
              value={form.employmentType}
              onChange={(event) => setForm((current) => ({ ...current, employmentType: event.target.value }))}
            />
          </label>

          <label>
            Min Salary
            <input
              type="number"
              value={form.minSalary}
              onChange={(event) => setForm((current) => ({ ...current, minSalary: event.target.value }))}
            />
          </label>

          <label>
            Max Salary
            <input
              type="number"
              value={form.maxSalary}
              onChange={(event) => setForm((current) => ({ ...current, maxSalary: event.target.value }))}
            />
          </label>

          <button type="submit" className="btn-primary">Create Alert</button>
        </form>
      </section>

      <section className="panel-card">
        {loading ? <p className="module-note">Loading alerts...</p> : null}

        <ul className="student-list">
          {alerts.map((alert) => (
            <li key={alert.id}>
              <div>
                <h4>{(alert.keywords || []).join(', ') || 'Alert rule'}</h4>
                <p>
                  {alert.location || 'Any location'} • {alert.experience_level || alert.experienceLevel || 'Any experience'}
                  {' '}• {alert.employment_type || alert.employmentType || 'Any type'}
                </p>
              </div>

              <div className="student-list-actions">
                <StatusPill value={alert.is_active ? 'active' : 'inactive'} />
                <button type="button" className="btn-link" onClick={() => toggleAlert(alert)}>
                  {alert.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button type="button" className="btn-link" onClick={() => removeAlert(alert.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
          {(!loading && alerts.length === 0) ? <li>No alerts created yet.</li> : null}
        </ul>
      </section>
    </div>
  );
};

export default StudentAlertsPage;
