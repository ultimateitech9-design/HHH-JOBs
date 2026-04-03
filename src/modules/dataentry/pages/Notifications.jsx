import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatusPill from '../../../shared/components/StatusPill';
import StatCard from '../../../shared/components/StatCard';
import useNotificationStore from '../../../core/notifications/notificationStore';
import {
  fetchNotifications,
  markNotificationReadRequest
} from '../../../core/notifications/notificationApi';
import { formatDateTime } from '../services/dataentryApi';

const Notifications = () => {
  const notifications = useNotificationStore((state) => state.notifications);
  const loading = useNotificationStore((state) => state.loading);
  const hydrated = useNotificationStore((state) => state.hydrated);
  const storeError = useNotificationStore((state) => state.error);
  const replaceNotifications = useNotificationStore((state) => state.replaceNotifications);
  const setLoading = useNotificationStore((state) => state.setLoading);
  const markNotificationReadLocally = useNotificationStore((state) => state.markNotificationReadLocally);
  const upsertNotification = useNotificationStore((state) => state.upsertNotification);

  const [pageError, setPageError] = useState('');

  useEffect(() => {
    if (hydrated || loading) return undefined;

    let active = true;

    const loadNotifications = async () => {
      setPageError('');
      setLoading(true);

      try {
        const rows = await fetchNotifications();
        if (active) {
          replaceNotifications(rows);
        }
      } catch (error) {
        if (active) {
          setLoading(false);
          setPageError(error.message || 'Unable to load notifications.');
        }
      }
    };

    loadNotifications();

    return () => {
      active = false;
    };
  }, [hydrated, loading, replaceNotifications, setLoading]);

  const stats = useMemo(() => ([
    { label: 'Notifications', value: String(notifications.length), helper: 'Workflow alerts', tone: 'info' },
    { label: 'Unread', value: String(notifications.filter((item) => !item.is_read).length), helper: 'Needs attention', tone: 'warning' },
    { label: 'Read', value: String(notifications.filter((item) => item.is_read).length), helper: 'Already reviewed', tone: 'success' }
  ]), [notifications]);

  const activeError = storeError || pageError;

  const markRead = async (notificationId) => {
    const previousNotification = notifications.find((item) => item.id === notificationId);
    markNotificationReadLocally(notificationId);

    try {
      const updated = await markNotificationReadRequest(notificationId);
      if (updated) {
        upsertNotification(updated);
      }
    } catch (_error) {
      if (previousNotification) {
        upsertNotification(previousNotification);
      }
    }
  };

  return (
    <div className="module-page module-page--dataentry">
      <SectionHeader eyebrow="Data Entry" title="Notifications" subtitle="Review queue alerts, duplicate warnings, approval updates, and processing events." />
      {activeError ? <p className="form-error">{activeError}</p> : null}
      <div className="stats-grid">
        {stats.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
      <section className="panel-card">
        {loading && !hydrated ? <p className="module-note">Loading notifications...</p> : null}
        <ul className="dash-feed">
          {notifications.map((item) => (
            <li key={item.id}>
              <div>
                <strong>{item.title || 'Notification'}</strong>
                <p>{item.message || '-'}</p>
                <span>{formatDateTime(item.created_at || item.createdAt)}</span>
                {item.link ? <Link to={item.link} className="inline-link">Open linked page</Link> : null}
              </div>
              <div className="student-job-actions">
                <StatusPill value={item.is_read ? 'read' : 'unread'} />
                {!item.is_read ? <button type="button" className="btn-link" onClick={() => markRead(item.id)}>Mark read</button> : null}
              </div>
            </li>
          ))}
          {notifications.length === 0 && (!loading || hydrated) ? <li className="dash-list-empty">No notifications found.</li> : null}
        </ul>
      </section>
    </div>
  );
};

export default Notifications;
