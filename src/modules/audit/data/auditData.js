export const auditSummary = [
  { label: 'Events (24h)', value: '18,204', helper: 'Across auth, jobs, applications', tone: 'info' },
  { label: 'Critical Alerts', value: '2', helper: 'Escalated to security team', tone: 'danger' },
  { label: 'Policy Violations', value: '7', helper: 'Need admin review', tone: 'warning' },
  { label: 'Resolved Alerts', value: '53', helper: 'This week', tone: 'success' }
];

export const auditRows = [
  {
    id: 'log-301',
    timestamp: '20 Feb 2026 11:58',
    actor: 'admin@hhhjob.com',
    action: 'HR_APPROVAL',
    entity: 'user/hr-01',
    severity: 'info'
  },
  {
    id: 'log-302',
    timestamp: '20 Feb 2026 11:40',
    actor: 'hr@blueorbit.com',
    action: 'JOB_STATUS_CHANGE',
    entity: 'job/job-1141',
    severity: 'warning'
  },
  {
    id: 'log-303',
    timestamp: '20 Feb 2026 10:33',
    actor: 'system',
    action: 'OTP_PROVIDER_FAILOVER',
    entity: 'otp/provider-cluster-a',
    severity: 'danger'
  },
  {
    id: 'log-304',
    timestamp: '20 Feb 2026 09:56',
    actor: 'student@nexa.com',
    action: 'APPLICATION_STATUS_VIEW',
    entity: 'application/app-221',
    severity: 'info'
  },
  {
    id: 'log-305',
    timestamp: '19 Feb 2026 21:17',
    actor: 'admin@hhhjob.com',
    action: 'USER_STATUS_CHANGE',
    entity: 'user/cand-2',
    severity: 'warning'
  }
];
