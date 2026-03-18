import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatusPill from '../../../shared/components/StatusPill';
import {
  formatDateTime,
  getHrNotifications,
  markAllHrNotificationsRead,
  markHrNotificationRead
} from '../services/hrApi';

const HrNotificationsPage = () => {
  const [state, setState] = useState({ loading: true, error: '', notifications: [] });
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadNotifications = async () => {
      const response = await getHrNotifications();
      if (!mounted) return;

      setState({
        loading: false,
        error: response.error || '',
        notifications: response.data || []
      });
    };

    loadNotifications();

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return state.notifications;
    return state.notifications.filter((item) => !item.is_read);
  }, [filter, state.notifications]);

  const markRead = async (notificationId) => {
    setMessage('');

    try {
      await markHrNotificationRead(notificationId);
      setState((current) => ({
        ...current,
        notifications: current.notifications.map((item) =>
          item.id === notificationId
            ? { ...item, is_read: true, read_at: new Date().toISOString() }
            : item
        )
      }));
      setMessage('Notification marked as read.');
    } catch (error) {
      setMessage(String(error.message || 'Unable to update notification.'));
    }
  };

  const markAllRead = async () => {
    setMessage('');

    try {
      await markAllHrNotificationsRead();
      setState((current) => ({
        ...current,
        notifications: current.notifications.map((item) => ({
          ...item,
          is_read: true,
          read_at: item.read_at || new Date().toISOString()
        }))
      }));
      setMessage('All notifications marked as read.');
    } catch (error) {
      setMessage(String(error.message || 'Unable to mark all read.'));
    }
  };

  return (
    <div className="module-page module-page--hr">
      <SectionHeader
        eyebrow="Notifications"
        title="HR Notifications"
        subtitle="Review job updates, new applications, approvals, and interview events."
      />

      {state.error ? <p className="form-error">{state.error}</p> : null}
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

          <button type="button" className="btn-link" onClick={markAllRead}>Mark all as read</button>
        </div>

        {state.loading ? <p className="module-note">Loading notifications...</p> : null}

        <ul className="student-list">
          {filtered.map((notification) => (
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
                  <button type="button" className="btn-link" onClick={() => markRead(notification.id)}>
                    Mark Read
                  </button>
                ) : null}
              </div>
            </li>
          ))}
          {(!state.loading && filtered.length === 0) ? <li>No notifications found.</li> : null}
        </ul>
      </section>
    </div>
  );
};

export default HrNotificationsPage;
