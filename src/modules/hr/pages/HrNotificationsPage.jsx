import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatusPill from '../../../shared/components/StatusPill';
import useNotificationStore from '../../../core/notifications/notificationStore';
import {
  fetchNotifications,
  markAllNotificationsReadRequest,
  markNotificationReadRequest
} from '../../../core/notifications/notificationApi';
import { formatDateTime } from '../services/hrApi';

const HrNotificationsPage = () => {
  const notifications = useNotificationStore((state) => state.notifications);
  const loading = useNotificationStore((state) => state.loading);
  const hydrated = useNotificationStore((state) => state.hydrated);
  const storeError = useNotificationStore((state) => state.error);
  const replaceNotifications = useNotificationStore((state) => state.replaceNotifications);
  const setLoading = useNotificationStore((state) => state.setLoading);
  const markNotificationReadLocally = useNotificationStore((state) => state.markNotificationReadLocally);
  const markAllNotificationsReadLocally = useNotificationStore((state) => state.markAllNotificationsReadLocally);
  const upsertNotification = useNotificationStore((state) => state.upsertNotification);

  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState('');
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

  const filteredNotifications = useMemo(() => {
    if (filter === 'all') return notifications;
    return notifications.filter((item) => !item.is_read);
  }, [filter, notifications]);

  const activeError = storeError || pageError;

  const handleMarkRead = async (notificationId) => {
    setMessage('');
    const previousNotification = notifications.find((item) => item.id === notificationId);
    markNotificationReadLocally(notificationId);

    try {
      const updated = await markNotificationReadRequest(notificationId);
      if (updated) {
        upsertNotification(updated);
      }
      setMessage('Notification marked as read.');
    } catch (error) {
      if (previousNotification) {
        upsertNotification(previousNotification);
      }
      setMessage(error.message || 'Unable to update notification.');
    }
  };

  const handleMarkAllRead = async () => {
    setMessage('');
    const previousNotifications = [...notifications];
    markAllNotificationsReadLocally();

    try {
      await markAllNotificationsReadRequest();
      setMessage('All notifications marked as read.');
    } catch (error) {
      replaceNotifications(previousNotifications);
      setMessage(error.message || 'Unable to mark all read.');
    }
  };

  return (
    <div className="module-page module-page--hr">
      <SectionHeader
        eyebrow="Notifications"
        title="HR Notifications"
        subtitle="Review job updates, new applications, approvals, and interview events."
      />

      {activeError ? <p className="form-error">{activeError}</p> : null}
      {message ? <p className="form-success">{message}</p> : null}

      <section className="panel-card">
        <div className="student-inline-controls">
          <label>
            View
            <select value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="all">All</option>
              <option value="unread">Unread</option>
            </select>
          </label>

          <button type="button" className="btn-link" onClick={handleMarkAllRead}>Mark all as read</button>
        </div>

        {loading && !hydrated ? <p className="module-note">Loading notifications...</p> : null}

        <ul className="student-list">
          {filteredNotifications.map((notification) => (
            <li key={notification.id}>
              <div>
                <h4>{notification.title || 'Notification'}</h4>
                <p>{notification.message || '-'}</p>
                <p>{formatDateTime(notification.created_at || notification.createdAt)}</p>
                {notification.link ? <Link to={notification.link} className="inline-link">Open linked page</Link> : null}
              </div>

              <div className="student-list-actions">
                <StatusPill value={notification.is_read ? 'read' : 'unread'} />
                {!notification.is_read ? (
                  <button type="button" className="btn-link" onClick={() => handleMarkRead(notification.id)}>
                    Mark Read
                  </button>
                ) : null}
              </div>
            </li>
          ))}
          {(!loading || hydrated) && filteredNotifications.length === 0 ? <li>No notifications found.</li> : null}
        </ul>
      </section>
    </div>
  );
};

export default HrNotificationsPage;
