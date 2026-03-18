const statusTone = {
  active: 'status-pill--success',
  approved: 'status-pill--success',
  shortlisted: 'status-pill--success',
  open: 'status-pill--info',
  read: 'status-pill--info',
  unread: 'status-pill--warning',
  scheduled: 'status-pill--warning',
  completed: 'status-pill--success',
  cancelled: 'status-pill--danger',
  critical: 'status-pill--danger',
  high: 'status-pill--danger',
  medium: 'status-pill--warning',
  low: 'status-pill--info',
  pending: 'status-pill--warning',
  suspended: 'status-pill--danger',
  inactive: 'status-pill--default',
  healthy: 'status-pill--success',
  degraded: 'status-pill--warning',
  offline: 'status-pill--danger',
  paid: 'status-pill--success',
  failed: 'status-pill--danger',
  refunded: 'status-pill--info',
  interviewed: 'status-pill--warning',
  offered: 'status-pill--info',
  interview: 'status-pill--warning',
  blocked: 'status-pill--danger',
  banned: 'status-pill--danger',
  deleted: 'status-pill--danger',
  in_review: 'status-pill--warning',
  resolved: 'status-pill--success',
  escalated: 'status-pill--danger',
  rejected: 'status-pill--danger',
  hired: 'status-pill--success',
  moved: 'status-pill--info',
  default: 'status-pill--default'
};

const StatusPill = ({ value }) => {
  const key = String(value || '').toLowerCase();
  const tone = statusTone[key] || statusTone.default;

  return <span className={`status-pill ${tone}`}>{value}</span>;
};

export default StatusPill;
