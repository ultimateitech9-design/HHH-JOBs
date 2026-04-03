import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import useAuthStore from '../auth/authStore';
import { hasApiAccessToken } from '../../utils/api';
import { normalizeRole } from '../../utils/auth';
import {
  fetchNotifications,
  NOTIFICATION_STREAM_EVENTS,
  openNotificationsStream,
  SUPPORTED_NOTIFICATION_ROLES
} from './notificationApi';
import useNotificationStore from './notificationStore';

const STREAM_RECONNECT_DELAY_MS = 3000;

const NotificationRuntime = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const reconnectTimerRef = useRef(null);

  useEffect(() => {
    const role = normalizeRole(user?.role);
    const canStreamNotifications =
      Boolean(user?.id)
      && Boolean(token)
      && hasApiAccessToken()
      && SUPPORTED_NOTIFICATION_ROLES.has(role);

    if (!canStreamNotifications) {
      clearTimeout(reconnectTimerRef.current);
      useNotificationStore.getState().reset();
      return undefined;
    }

    let disposed = false;
    let controller = null;

    const clearReconnectTimer = () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
    };

    const scheduleReconnect = () => {
      clearReconnectTimer();
      reconnectTimerRef.current = setTimeout(() => {
        if (!disposed) {
          connectStream();
        }
      }, STREAM_RECONNECT_DELAY_MS);
    };

    const loadNotifications = async () => {
      const store = useNotificationStore.getState();
      store.setLoading(true);
      store.setError('');

      try {
        const notifications = await fetchNotifications();
        if (!disposed) {
          useNotificationStore.getState().replaceNotifications(notifications);
        }
      } catch (error) {
        if (!disposed) {
          const nextStore = useNotificationStore.getState();
          nextStore.setLoading(false);
          nextStore.setError(error.message || 'Unable to load notifications.');
        }
      }
    };

    const handleStreamEvent = ({ event, data }) => {
      const store = useNotificationStore.getState();

      if (event === NOTIFICATION_STREAM_EVENTS.CREATED && data?.notification) {
        const notification = data.notification;
        const exists = store.notifications.some((item) => item.id === notification.id);
        store.upsertNotification(notification);

        if (!exists) {
          const title = notification.title || 'New notification';
          const message = notification.message ? `${title}: ${notification.message}` : title;
          toast(message, { id: `notification-${notification.id}` });
        }
        return;
      }

      if (event === NOTIFICATION_STREAM_EVENTS.UPDATED && data?.notification) {
        store.upsertNotification(data.notification);
        return;
      }

      if (event === NOTIFICATION_STREAM_EVENTS.BULK_READ) {
        store.markAllNotificationsReadLocally(data?.notificationIds || [], data?.readAt || new Date().toISOString());
      }
    };

    const connectStream = async () => {
      controller = new AbortController();

      try {
        await openNotificationsStream({
          signal: controller.signal,
          onOpen: () => {
            const store = useNotificationStore.getState();
            store.setStreamConnected(true);
            store.setError('');
          },
          onEvent: handleStreamEvent
        });

        if (!disposed && !controller.signal.aborted) {
          useNotificationStore.getState().setStreamConnected(false);
          scheduleReconnect();
        }
      } catch (error) {
        if (disposed || error?.name === 'AbortError') return;

        const store = useNotificationStore.getState();
        store.setStreamConnected(false);

        if (!store.hydrated) {
          store.setError(error.message || 'Notification stream disconnected.');
        }

        scheduleReconnect();
      }
    };

    loadNotifications();
    connectStream();

    return () => {
      disposed = true;
      clearReconnectTimer();
      controller?.abort();
      useNotificationStore.getState().setStreamConnected(false);
    };
  }, [token, user?.id, user?.role]);

  return null;
};

export default NotificationRuntime;
