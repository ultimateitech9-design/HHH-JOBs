export const adminStats = [
  { label: 'Total Users', value: '42,380', helper: '+12% this month', tone: 'info' },
  { label: 'HR Pending Approvals', value: '126', helper: 'Needs admin action', tone: 'warning' },
  { label: 'Open Jobs', value: '4,912', helper: 'Across all tenants', tone: 'success' },
  { label: 'Candidate Flags', value: '38', helper: 'Policy moderation queue', tone: 'danger' }
];

export const masterData = [
  { id: 'md-1', area: 'States', records: 36, lastUpdated: 'Today 09:30' },
  { id: 'md-2', area: 'Districts/Tehsils', records: 842, lastUpdated: 'Today 08:12' },
  { id: 'md-3', area: 'Villages', records: 62910, lastUpdated: 'Yesterday 19:10' },
  { id: 'md-4', area: 'Pincodes', records: 154233, lastUpdated: 'Today 06:48' },
  { id: 'md-5', area: 'Industries', records: 78, lastUpdated: 'Today 10:05' },
  { id: 'md-6', area: 'Skills', records: 1364, lastUpdated: 'Today 10:12' }
];

export const hrApprovalQueue = [
  { id: 'hr-01', recruiter: 'Ritika Sharma', company: 'Blueorbit Labs', status: 'pending', docs: 'Verified', submittedOn: '20 Feb 2026' },
  { id: 'hr-02', recruiter: 'Arjun Nair', company: 'TalentBridge Tech', status: 'approved', docs: 'Verified', submittedOn: '19 Feb 2026' },
  { id: 'hr-03', recruiter: 'Neha Kamat', company: 'RidgePeak Mobility', status: 'pending', docs: 'Pending GST', submittedOn: '20 Feb 2026' },
  { id: 'hr-04', recruiter: 'Vivek Rana', company: 'Comet Skills', status: 'rejected', docs: 'Mismatch found', submittedOn: '18 Feb 2026' }
];

export const jobsOversight = [
  { id: 'job-1102', jobTitle: 'Senior React Engineer', company: 'Blueorbit Labs', applications: 148, status: 'open', payout: 'Paid' },
  { id: 'job-1128', jobTitle: 'Data Engineer', company: 'TalentBridge Tech', applications: 96, status: 'open', payout: 'Paid' },
  { id: 'job-1141', jobTitle: 'Java Backend Lead', company: 'RidgePeak Mobility', applications: 51, status: 'pending', payout: 'Pending' },
  { id: 'job-1179', jobTitle: 'UI Designer', company: 'Comet Skills', applications: 202, status: 'closed', payout: 'Paid' }
];

export const candidateModeration = [
  { id: 'cand-1', candidate: 'Nisha Verma', reason: 'Profile mismatch', status: 'pending' },
  { id: 'cand-2', candidate: 'Kiran Malik', reason: 'Spam applications', status: 'blocked' },
  { id: 'cand-3', candidate: 'Jaya Das', reason: 'Appeal approved', status: 'active' }
];

export const systemSettings = [
  { id: 'set-1', setting: 'Role and Permission Matrix', owner: 'Platform Admin', health: 'active' },
  { id: 'set-2', setting: 'OTP Provider Rotation', owner: 'Security Ops', health: 'active' },
  { id: 'set-3', setting: 'Resume Parsing Engine', owner: 'AI Ops', health: 'active' },
  { id: 'set-4', setting: 'Notification Policy Rules', owner: 'Messaging Team', health: 'active' },
  { id: 'set-5', setting: 'Fraud Detection Rules', owner: 'Trust & Safety', health: 'active' }
];

export const analyticsBars = [
  { id: 'an-1', metric: 'Application Conversion', value: 78 },
  { id: 'an-2', metric: 'HR Approval SLA', value: 92 },
  { id: 'an-3', metric: 'Candidate Response Rate', value: 64 },
  { id: 'an-4', metric: 'Weekly Offer Acceptance', value: 56 }
];
