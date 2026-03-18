import { useEffect, useMemo, useState } from 'react';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatusPill from '../../../shared/components/StatusPill';
import StatCard from '../../../shared/components/StatCard';
import { formatDateTime, getDataEntryNotifications, markDataEntryNotificationRead } from '../services/dataentryApi';

const Notifications = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const response = await getDataEntryNotifications();
      setRows(response.data || []);
      setError(response.error || '');
      setLoading(false);
    };
    load();
  }, []);

  const stats = useMemo(() => ([
    { label: 'Notifications', value: String(rows.length), helper: 'Workflow alerts', tone: 'info' },
    { label: 'Unread', value: String(rows.filter((item) => item.status === 'unread').length), helper: 'Needs attention', tone: 'warning' },
    { label: 'Read', value: String(rows.filter((item) => item.status === 'read').length), helper: 'Already reviewed', tone: 'success' }
  ]), [rows]);

  const markRead = async (notificationId) => {
    const updated = await markDataEntryNotificationRead(notificationId);
    setRows((current) => current.map((item) => (item.id === notificationId ? { ...item, ...updated, status: 'read' } : item)));
  };

  return (
    <div className="module-page module-page--dataentry">
      <SectionHeader eyebrow="Data Entry" title="Notifications" subtitle="Review queue alerts, duplicate warnings, approval updates, and processing events." />
      {error ? <p className="form-error">{error}</p> : null}
      <div className="stats-grid">
        {stats.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
      <section className="panel-card">
        {loading ? <p className="module-note">Loading notifications...</p> : null}
        <ul className="dash-feed">
          {rows.map((item) => (
            <li key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <p>{item.message}</p>
                <span>{formatDateTime(item.createdAt)}</span>
              </div>
              <div className="student-job-actions">
                <StatusPill value={item.status || 'unread'} />
                {item.status !== 'read' ? <button type="button" className="btn-link" onClick={() => markRead(item.id)}>Mark read</button> : null}
              </div>
            </li>
          ))}
          {rows.length === 0 ? <li className="dash-list-empty">No notifications found.</li> : null}
        </ul>
      </section>
    </div>
  );
};

export default Notifications;
