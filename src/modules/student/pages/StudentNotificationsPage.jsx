import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiBell,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiExternalLink,
  FiXCircle
} from 'react-icons/fi';
import useNotificationStore from '../../../core/notifications/notificationStore';
import {
  fetchNotifications,
  markAllNotificationsReadRequest,
  markNotificationReadRequest
} from '../../../core/notifications/notificationApi';
import { formatDateTime } from '../services/studentApi';

const StudentNotificationsPage = () => {
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

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.is_read).length,
    [notifications]
  );

  const activeError = storeError || pageError;
  const isLoading = loading && !hydrated;

  const handleMarkRead = async (notificationId) => {
    setMessage('');
    const previousNotification = notifications.find((item) => item.id === notificationId);
    markNotificationReadLocally(notificationId);

    try {
      const updated = await markNotificationReadRequest(notificationId);
      if (updated) {
        upsertNotification(updated);
      }
    } catch (error) {
      if (previousNotification) {
        upsertNotification(previousNotification);
      }
      setMessage(error.message || 'Unable to mark notification as read.');
    }
  };

  const handleMarkAllRead = async () => {
    setMessage('');
    const previousNotifications = [...notifications];

    markAllNotificationsReadLocally();

    try {
      await markAllNotificationsReadRequest();
      setMessage('All notifications marked as read.');
      window.setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      replaceNotifications(previousNotifications);
      setMessage(error.message || 'Unable to mark all as read.');
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="mb-2 flex items-center gap-3 text-3xl font-extrabold tracking-tight text-primary font-heading">
            Notifications
            {unreadCount > 0 ? (
              <span className="rounded-full bg-brand-600 px-3 py-1 text-sm font-bold text-white">
                {unreadCount} New
              </span>
            ) : null}
          </h1>
          <p className="text-lg text-neutral-500">Stay updated on application status, interviews, and updates.</p>
        </div>
      </header>

      {activeError ? (
        <div className="animate-fade-in flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-600 shadow-sm">
          <FiXCircle size={20} className="shrink-0" /> <span className="font-semibold">{activeError}</span>
        </div>
      ) : null}
      {message && !activeError ? (
        <div className="animate-fade-in flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 shadow-sm">
          <FiCheckCircle size={20} className="shrink-0" /> <span className="font-semibold">{message}</span>
        </div>
      ) : null}

      <section className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm sm:flex-row">
        <div className="flex w-full rounded-xl bg-neutral-100 p-1 sm:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 rounded-lg px-6 py-2 text-sm font-bold transition-all sm:flex-none ${
              filter === 'all' ? 'bg-white text-primary shadow-sm' : 'text-neutral-500 hover:text-primary'
            }`}
          >
            All Notifications
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`flex-1 rounded-lg px-6 py-2 text-sm font-bold transition-all sm:flex-none ${
              filter === 'unread' ? 'bg-white text-primary shadow-sm' : 'text-neutral-500 hover:text-primary'
            }`}
          >
            Unread Only
          </button>
        </div>

        {unreadCount > 0 ? (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-brand-600 transition-colors hover:bg-brand-50 sm:w-auto"
          >
            <FiCheck size={18} /> Mark all as read
          </button>
        ) : null}
      </section>

      <div className="overflow-hidden rounded-[2rem] border border-neutral-100 bg-white shadow-sm">
        {isLoading ? (
          <div className="space-y-4 p-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-24 animate-pulse rounded-2xl bg-neutral-100" />
            ))}
          </div>
        ) : filteredNotifications.length > 0 ? (
          <div className="divide-y divide-neutral-100">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`group flex flex-col gap-6 p-6 transition-colors md:flex-row md:items-start md:p-8 ${
                  !notification.is_read ? 'bg-brand-50/30' : 'hover:bg-neutral-50'
                }`}
              >
                <div className="flex flex-1 items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-sm transition-colors ${
                    !notification.is_read
                      ? 'border-brand-200 bg-brand-100 text-brand-600'
                      : 'border-neutral-200 bg-white text-neutral-400'
                  }`}>
                    <FiBell size={20} />
                  </div>
                  <div>
                    <h4 className={`mb-1 text-lg ${!notification.is_read ? 'font-extrabold text-primary' : 'font-bold text-neutral-700'}`}>
                      {notification.title || 'Notification'}
                    </h4>
                    <p className={`mb-3 ${!notification.is_read ? 'font-medium text-neutral-700' : 'text-neutral-500'}`}>
                      {notification.message || '-'}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-neutral-400">
                      <span className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1">
                        <FiClock size={12} /> {formatDateTime(notification.created_at || notification.createdAt)}
                      </span>
                      {notification.link ? (
                        <Link
                          to={notification.link}
                          className="flex items-center gap-1.5 px-2 py-1 text-brand-600 hover:text-brand-700 hover:underline"
                        >
                          <FiExternalLink size={12} /> View Details
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3 pl-16 md:w-48 md:justify-end md:pl-0">
                  {!notification.is_read ? (
                    <button
                      type="button"
                      onClick={() => handleMarkRead(notification.id)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-bold text-neutral-600 transition-all hover:border-brand-200 hover:bg-brand-50 hover:text-brand-600 md:w-auto"
                    >
                      <FiCheckCircle size={16} /> Mark Read
                    </button>
                  ) : (
                    <span className="flex w-full items-center justify-center gap-1.5 px-4 py-2 text-sm font-bold text-neutral-400 md:w-auto md:justify-end">
                      <FiCheck size={16} /> Read
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 rounded-full bg-neutral-50 text-neutral-300">
              <FiBell size={40} className="m-auto" />
            </div>
            <h3 className="mb-3 text-2xl font-bold text-primary">You&apos;re all caught up!</h3>
            <p className="mx-auto max-w-sm text-neutral-500">
              {filter === 'unread'
                ? "You don&apos;t have any unread notifications right now."
                : "You don&apos;t have any notifications yet. System updates and recruiter messages will appear here."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentNotificationsPage;
