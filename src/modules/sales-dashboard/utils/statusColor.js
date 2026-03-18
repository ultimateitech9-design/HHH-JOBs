export const getStatusTone = (status) => {
  const key = String(status || '').toLowerCase();

  const statusMap = {
    active: 'success',
    paid: 'success',
    won: 'success',
    qualified: 'info',
    proposal: 'warning',
    new: 'default',
    pending: 'warning',
    processing: 'warning',
    refunded: 'info',
    cancelled: 'danger',
    expired: 'danger',
    inactive: 'default'
  };

  return statusMap[key] || 'default';
};
