const statusColorMap = {
  active: 'success',
  approved: 'success',
  healthy: 'success',
  paid: 'success',
  open: 'info',
  info: 'info',
  pending: 'warning',
  past_due: 'warning',
  warning: 'warning',
  suspended: 'danger',
  blocked: 'danger',
  failed: 'danger',
  rejected: 'danger',
  critical: 'danger',
  refunded: 'default',
  inactive: 'default'
};

export const getStatusTone = (value) => statusColorMap[String(value || '').toLowerCase()] || 'default';
