export const getStatusTone = (status) => {
  const key = String(status || '').toLowerCase();
  const map = {
    open: 'info',
    pending: 'warning',
    in_progress: 'warning',
    resolved: 'success',
    closed: 'default',
    escalated: 'danger',
    online: 'success',
    busy: 'warning',
    offline: 'default'
  };

  return map[key] || 'default';
};
