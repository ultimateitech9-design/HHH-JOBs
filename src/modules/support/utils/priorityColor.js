export const getPriorityTone = (priority) => {
  const key = String(priority || '').toLowerCase();
  const map = {
    low: 'info',
    medium: 'warning',
    high: 'danger',
    critical: 'danger'
  };

  return map[key] || 'default';
};
