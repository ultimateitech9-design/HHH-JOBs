export const platformStats = [
  { label: 'Active Tenants', value: '184', helper: '12 enterprise tiers', tone: 'info' },
  { label: 'Billing Renewals (30d)', value: '97%', helper: 'Healthy retention', tone: 'success' },
  { label: 'Security Incidents', value: '0', helper: 'Last 60 days', tone: 'default' },
  { label: 'Support SLA Met', value: '99.2%', helper: 'Priority queue', tone: 'warning' }
];

export const billingPlans = [
  { id: 'plan-1', tier: 'Starter HR', seats: '10 recruiters', limits: '100 live jobs', price: '$499/mo' },
  { id: 'plan-2', tier: 'Growth', seats: '40 recruiters', limits: '600 live jobs', price: '$1,899/mo' },
  { id: 'plan-3', tier: 'Enterprise', seats: 'Unlimited', limits: 'Custom', price: 'Contract' }
];

export const portalSettings = [
  { id: 'cfg-1', key: 'Custom Logo', value: 'Enabled' },
  { id: 'cfg-2', key: 'Theme Colors', value: 'Tenant Based' },
  { id: 'cfg-3', key: 'Custom Domain URL', value: 'Enabled' },
  { id: 'cfg-4', key: 'Role Permission Sets', value: 'Granular' },
  { id: 'cfg-5', key: 'Dashboard Widgets', value: 'Configurable' }
];

export const dataIntegrationFlow = [
  { id: 'di-1', source: 'Geo Master', status: 'active', note: 'States > Districts > Villages > Pincodes' },
  { id: 'di-2', source: 'Skill Taxonomy', status: 'active', note: 'Industry to skill mapping with CRUD' },
  { id: 'di-3', source: 'ATS Sync', status: 'active', note: 'Bidirectional status updates' },
  { id: 'di-4', source: 'Notification Hub', status: 'active', note: 'Email, SMS, and in-app events' }
];

export const securityControls = [
  'GDPR compliant data policy and retention workflows',
  'TLS / HTTPS encryption for all tenant traffic',
  'Role-based access controls and signed audit events',
  'Priority ticketing base with escalation matrix',
  'Knowledge base and runbooks for tenant admins'
];

export const supportTickets = [
  { id: 'sup-1', tenant: 'Blueorbit Labs', priority: 'High', issue: 'Bulk import delay', owner: 'Support L2', state: 'open' },
  { id: 'sup-2', tenant: 'TalentBridge Tech', priority: 'Medium', issue: 'Career page branding request', owner: 'Success Team', state: 'pending' },
  { id: 'sup-3', tenant: 'NexaTalent', priority: 'Low', issue: 'Widget placement help', owner: 'Support L1', state: 'active' }
];
