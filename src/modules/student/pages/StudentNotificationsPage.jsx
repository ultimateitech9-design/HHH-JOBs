import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatusPill from '../../../shared/components/StatusPill';
import {
  formatDateTime,
  getStudentNotifications,
  markAllNotificationsRead,
  markNotificationRead
} from '../services/studentApi';

const StudentNotificationsPage = () => {
  const [state, setState] = useState({ loading: true, error: '', notifications: [] });
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadNotifications = async () => {
      const response = await getStudentNotifications();
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

  const filteredNotifications = useMemo(() => {
    if (filter === 'all') return state.notifications;
    return state.notifications.filter((item) => !item.is_read);
  }, [filter, state.notifications]);

  const handleMarkRead = async (id) => {
    setMessage('');

    try {
      await markNotificationRead(id);
    } catch (error) {
      setMessage(error.message || 'Unable to mark notification as read.');
      return;
    }

    setState((current) => ({
      ...current,
      notifications: current.notifications.map((item) =>
        item.id === id ? { ...item, is_read: true, read_at: new Date().toISOString() } : item
      )
    }));
    setMessage('Notification marked as read.');
  };

  const handleMarkAllRead = async () => {
    setMessage('');

    try {
      await markAllNotificationsRead();
    } catch (error) {
      setMessage(error.message || 'Unable to mark all as read.');
      return;
    }

    setState((current) => ({
      ...current,
      notifications: current.notifications.map((item) => ({
        ...item,
        is_read: true,
        read_at: item.read_at || new Date().toISOString()
      }))
    }));
    setMessage('All notifications marked as read.');
  };

  return (
    <div className="module-page module-page--student">
      <SectionHeader
        eyebrow="Notifications"
        title="Recruiter and System Updates"
        subtitle="Stay updated on application status, interviews, and profile recommendations."
      />

      {state.error ? <p className="form-error">{state.error}</p> : null}
      {message ? <p className="form-success">{message}</p> : null}

      <section className="panel-card">
        <div className="student-inline-controls">
          <label>
            View
            <select value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="all">All notifications</option>
              <option value="unread">Unread only</option>
            </select>
          </label>

          <button type="button" className="btn-link" onClick={handleMarkAllRead}>
            Mark all as read
          </button>
        </div>

        {state.loading ? <p className="module-note">Loading notifications...</p> : null}

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
          {(!state.loading && filteredNotifications.length === 0) ? <li>No notifications found.</li> : null}
        </ul>
      </section>
    </div>
  );
};

export default StudentNotificationsPage;
