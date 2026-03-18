import { apiFetch } from '../../../utils/api';

export const ACCOUNTS_BASE = '/accounts';

const parseJson = async (response) => {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const cloneValue = (value) => {
  if (value === null || value === undefined) return value;
  return JSON.parse(JSON.stringify(value));
};

export const strictRequest = async ({ path, options, extract = (payload) => payload }) => {
  const response = await apiFetch(path, options);
  const payload = await parseJson(response);

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed with status ${response.status}`);
  }

  return extract(payload || {});
};

export const safeRequest = async ({ path, options, emptyData, extract = (payload) => payload, fallbackData }) => {
  try {
    const data = await strictRequest({ path, options, extract });
    return { data, isDemo: false, error: '' };
  } catch (error) {
    const resolvedFallback = typeof fallbackData === 'function' ? fallbackData() : fallbackData;

    return {
      data: resolvedFallback !== undefined ? cloneValue(resolvedFallback) : cloneValue(emptyData),
      isDemo: true,
      error: error.message || 'Request failed.'
    };
  }
};

export const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      query.set(key, String(value));
    }
  });

  return query.toString();
};

const today = new Date('2026-03-10T10:30:00');
const dayMs = 24 * 60 * 60 * 1000;
const isoDaysAgo = (days, hour = 10) => {
  const date = new Date(today.getTime() - dayMs * days);
  date.setHours(hour, 15, 0, 0);
  return date.toISOString();
};

const baseTransactions = [
  {
    id: 'TXN-2401',
    reference: 'PAY-EMP-1001',
    customer: 'Metro Build Infra',
    email: 'finance@metrobuild.in',
    type: 'job_posting',
    channel: 'UPI',
    amount: 25000,
    currency: 'INR',
    status: 'paid',
    gateway: 'Razorpay',
    createdAt: isoDaysAgo(1, 11),
    settledAt: isoDaysAgo(0, 9)
  },
  {
    id: 'TXN-2402',
    reference: 'PAY-SUB-1002',
    customer: 'Prime Skill Labs',
    email: 'accounts@primeskill.com',
    type: 'subscription',
    channel: 'Card',
    amount: 48000,
    currency: 'INR',
    status: 'paid',
    gateway: 'Stripe',
    createdAt: isoDaysAgo(4, 13),
    settledAt: isoDaysAgo(3, 16)
  },
  {
    id: 'TXN-2403',
    reference: 'PAY-INV-1003',
    customer: 'Rural Talent Mission',
    email: 'ops@ruraltalent.org',
    type: 'invoice',
    channel: 'Bank Transfer',
    amount: 36000,
    currency: 'INR',
    status: 'pending',
    gateway: 'Manual',
    createdAt: isoDaysAgo(2, 15),
    settledAt: ''
  },
  {
    id: 'TXN-2404',
    reference: 'PAY-EMP-1004',
    customer: 'Northstar Services',
    email: 'payments@northstar.com',
    type: 'featured_listing',
    channel: 'Net Banking',
    amount: 12000,
    currency: 'INR',
    status: 'failed',
    gateway: 'Razorpay',
    createdAt: isoDaysAgo(7, 12),
    settledAt: ''
  },
  {
    id: 'TXN-2405',
    reference: 'PAY-REF-1005',
    customer: 'Zenith Careers',
    email: 'admin@zenithcareers.com',
    type: 'refund',
    channel: 'Card',
    amount: 8500,
    currency: 'INR',
    status: 'refunded',
    gateway: 'Stripe',
    createdAt: isoDaysAgo(9, 10),
    settledAt: isoDaysAgo(8, 17)
  },
  {
    id: 'TXN-2406',
    reference: 'PAY-SUB-1006',
    customer: 'Gov Hiring Cell',
    email: 'billing@govhiring.gov',
    type: 'subscription',
    channel: 'UPI',
    amount: 64000,
    currency: 'INR',
    status: 'paid',
    gateway: 'Razorpay',
    createdAt: isoDaysAgo(12, 9),
    settledAt: isoDaysAgo(11, 10)
  }
];

const baseInvoices = [
  {
    id: 'INV-9001',
    account: 'Metro Build Infra',
    category: 'Enterprise Hiring',
    amount: 25000,
    currency: 'INR',
    status: 'paid',
    issueDate: isoDaysAgo(5),
    dueDate: isoDaysAgo(1),
    invoiceNumber: 'HHH/2026/9001'
  },
  {
    id: 'INV-9002',
    account: 'Rural Talent Mission',
    category: 'Bulk Employer Credits',
    amount: 36000,
    currency: 'INR',
    status: 'pending',
    issueDate: isoDaysAgo(3),
    dueDate: isoDaysAgo(-4),
    invoiceNumber: 'HHH/2026/9002'
  },
  {
    id: 'INV-9003',
    account: 'Prime Skill Labs',
    category: 'Subscription Renewal',
    amount: 48000,
    currency: 'INR',
    status: 'paid',
    issueDate: isoDaysAgo(18),
    dueDate: isoDaysAgo(13),
    invoiceNumber: 'HHH/2026/9003'
  },
  {
    id: 'INV-9004',
    account: 'Northstar Services',
    category: 'Featured Listing Pack',
    amount: 12000,
    currency: 'INR',
    status: 'failed',
    issueDate: isoDaysAgo(7),
    dueDate: isoDaysAgo(2),
    invoiceNumber: 'HHH/2026/9004'
  }
];

const baseSubscriptions = [
  {
    id: 'SUB-101',
    company: 'Metro Build Infra',
    plan: 'Enterprise Annual',
    billingCycle: 'Annual',
    seats: 20,
    amount: 240000,
    status: 'active',
    renewalDate: isoDaysAgo(-22)
  },
  {
    id: 'SUB-102',
    company: 'Prime Skill Labs',
    plan: 'Growth Monthly',
    billingCycle: 'Monthly',
    seats: 8,
    amount: 48000,
    status: 'active',
    renewalDate: isoDaysAgo(-5)
  },
  {
    id: 'SUB-103',
    company: 'Northstar Services',
    plan: 'Starter Monthly',
    billingCycle: 'Monthly',
    seats: 3,
    amount: 12000,
    status: 'past_due',
    renewalDate: isoDaysAgo(-1)
  },
  {
    id: 'SUB-104',
    company: 'Gov Hiring Cell',
    plan: 'Government Hiring Suite',
    billingCycle: 'Quarterly',
    seats: 15,
    amount: 192000,
    status: 'active',
    renewalDate: isoDaysAgo(-35)
  }
];

const baseExpenses = [
  {
    id: 'EXP-301',
    title: 'Google Ads Campaign',
    category: 'Marketing',
    department: 'Growth',
    amount: 18000,
    status: 'approved',
    spentOn: isoDaysAgo(2),
    note: 'March employer acquisition push'
  },
  {
    id: 'EXP-302',
    title: 'Server Scaling',
    category: 'Infrastructure',
    department: 'Engineering',
    amount: 26500,
    status: 'approved',
    spentOn: isoDaysAgo(6),
    note: 'API and ATS compute expansion'
  },
  {
    id: 'EXP-303',
    title: 'Field Hiring Drive',
    category: 'Operations',
    department: 'Operations',
    amount: 9500,
    status: 'pending',
    spentOn: isoDaysAgo(1),
    note: 'District-level employer onboarding'
  }
];

const basePayouts = [
  {
    id: 'PO-701',
    beneficiary: 'Vendor Ops Services',
    purpose: 'Vendor settlement',
    amount: 32000,
    status: 'completed',
    requestedAt: isoDaysAgo(4),
    processedAt: isoDaysAgo(2),
    method: 'Bank Transfer'
  },
  {
    id: 'PO-702',
    beneficiary: 'Affiliate Partner Network',
    purpose: 'Referral payout',
    amount: 14500,
    status: 'pending',
    requestedAt: isoDaysAgo(2),
    processedAt: '',
    method: 'NEFT'
  },
  {
    id: 'PO-703',
    beneficiary: 'Freelance Content Team',
    purpose: 'Campaign creatives',
    amount: 8800,
    status: 'scheduled',
    requestedAt: isoDaysAgo(0),
    processedAt: '',
    method: 'UPI'
  }
];

const baseRefunds = [
  {
    id: 'RF-501',
    account: 'Zenith Careers',
    reason: 'Duplicate employer payment',
    amount: 8500,
    status: 'refunded',
    requestedAt: isoDaysAgo(10),
    processedAt: isoDaysAgo(8),
    sourceTransactionId: 'TXN-2405'
  },
  {
    id: 'RF-502',
    account: 'Northstar Services',
    reason: 'Failed listing upgrade',
    amount: 12000,
    status: 'pending',
    requestedAt: isoDaysAgo(5),
    processedAt: '',
    sourceTransactionId: 'TXN-2404'
  }
];

const basePaymentMethods = [
  {
    id: 'PM-1',
    title: 'Razorpay Primary',
    type: 'gateway',
    provider: 'Razorpay',
    status: 'active',
    settlementCycle: 'T+2',
    feeRate: '2.0%',
    lastUsedAt: isoDaysAgo(0),
    descriptor: 'HHH Jobs'
  },
  {
    id: 'PM-2',
    title: 'Stripe International',
    type: 'gateway',
    provider: 'Stripe',
    status: 'active',
    settlementCycle: 'T+3',
    feeRate: '2.9%',
    lastUsedAt: isoDaysAgo(3),
    descriptor: 'HHH Global'
  },
  {
    id: 'PM-3',
    title: 'Manual Bank Collection',
    type: 'bank',
    provider: 'HDFC Bank',
    status: 'active',
    settlementCycle: 'Manual',
    feeRate: '0%',
    lastUsedAt: isoDaysAgo(2),
    descriptor: 'HHH Jobs Ops'
  }
];

const monthlyRevenue = [
  { month: 'Oct', revenue: 168000, expenses: 71000, refunds: 12000 },
  { month: 'Nov', revenue: 192000, expenses: 82000, refunds: 9000 },
  { month: 'Dec', revenue: 205000, expenses: 88000, refunds: 7000 },
  { month: 'Jan', revenue: 238000, expenses: 97000, refunds: 10000 },
  { month: 'Feb', revenue: 264000, expenses: 103000, refunds: 8500 },
  { month: 'Mar', revenue: 289000, expenses: 112000, refunds: 6500 }
];

const baseExpenseBreakdown = [
  { category: 'Marketing', amount: 18000 },
  { category: 'Infrastructure', amount: 26500 },
  { category: 'Operations', amount: 9500 },
  { category: 'Support', amount: 6000 }
];

const buildOverview = () => {
  const paidTransactions = baseTransactions.filter((item) => item.status === 'paid');
  const pendingTransactions = baseTransactions.filter((item) => item.status === 'pending');
  const paidInvoices = baseInvoices.filter((item) => item.status === 'paid');
  const pendingInvoices = baseInvoices.filter((item) => item.status === 'pending');
  const activeSubscriptions = baseSubscriptions.filter((item) => item.status === 'active');
  const totalRevenue = paidTransactions.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalExpense = baseExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalRefunds = baseRefunds.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return {
    revenueSummary: {
      grossRevenue: totalRevenue,
      collectedRevenue: paidInvoices.reduce((sum, item) => sum + Number(item.amount || 0), 0),
      outstandingRevenue: pendingInvoices.reduce((sum, item) => sum + Number(item.amount || 0), 0),
      refundAmount: totalRefunds,
      netRevenue: totalRevenue - totalExpense - totalRefunds
    },
    transactionSummary: {
      totalTransactions: baseTransactions.length,
      successfulTransactions: paidTransactions.length,
      pendingTransactions: pendingTransactions.length,
      failedTransactions: baseTransactions.filter((item) => item.status === 'failed').length
    },
    invoiceSummary: {
      totalInvoices: baseInvoices.length,
      paidInvoices: paidInvoices.length,
      pendingInvoices: pendingInvoices.length,
      failedInvoices: baseInvoices.filter((item) => item.status === 'failed').length
    },
    subscriptionSummary: {
      totalSubscriptions: baseSubscriptions.length,
      activeSubscriptions: activeSubscriptions.length,
      monthlyRecurringRevenue: activeSubscriptions
        .filter((item) => item.billingCycle === 'Monthly')
        .reduce((sum, item) => sum + Number(item.amount || 0), 0),
      annualContractValue: activeSubscriptions
        .filter((item) => item.billingCycle === 'Annual')
        .reduce((sum, item) => sum + Number(item.amount || 0), 0)
    },
    payoutSummary: {
      totalPayouts: basePayouts.length,
      completedPayouts: basePayouts.filter((item) => item.status === 'completed').length,
      pendingPayouts: basePayouts.filter((item) => item.status === 'pending').length
    },
    expenseSummary: {
      totalExpenses: totalExpense,
      pendingExpenses: baseExpenses.filter((item) => item.status === 'pending').length,
      approvedExpenses: baseExpenses.filter((item) => item.status === 'approved').length
    },
    monthlyRevenue,
    expenseBreakdown: baseExpenseBreakdown,
    recentTransactions: baseTransactions.slice(0, 5),
    recentInvoices: baseInvoices.slice(0, 4),
    paymentMethods: basePaymentMethods
  };
};

export const getAccountsDemoData = () => ({
  overview: buildOverview(),
  transactions: baseTransactions,
  invoices: baseInvoices,
  subscriptions: baseSubscriptions,
  expenses: baseExpenses,
  payouts: basePayouts,
  refunds: baseRefunds,
  paymentMethods: basePaymentMethods,
  monthlyRevenue,
  expenseBreakdown: baseExpenseBreakdown,
  reports: {
    revenue: monthlyRevenue,
    categoryPerformance: [
      { label: 'Employer Subscriptions', value: 352000, status: 'healthy' },
      { label: 'Job Posting Revenue', value: 187000, status: 'healthy' },
      { label: 'Featured Listings', value: 74000, status: 'healthy' },
      { label: 'Refund Exposure', value: 21500, status: 'warning' }
    ]
  },
  settlementProfile: {
    companyName: 'HHH Jobs Private Limited',
    settlementAccount: 'XXXXXX2819',
    settlementIfsc: 'HDFC0001022',
    settlementContact: 'accounts@hhh-jobs.com',
    gstNumber: '06AAAAH1234Q1Z2',
    autoPayouts: true
  }
});

export const getAccountsOverview = async () =>
  safeRequest({
    path: `${ACCOUNTS_BASE}/overview`,
    emptyData: buildOverview(),
    fallbackData: () => getAccountsDemoData().overview,
    extract: (payload) => payload?.overview || payload || {}
  });

export const getSubscriptions = async () =>
  safeRequest({
    path: `${ACCOUNTS_BASE}/subscriptions`,
    emptyData: [],
    fallbackData: () => getAccountsDemoData().subscriptions,
    extract: (payload) => payload?.subscriptions || []
  });

export const getExpenses = async () =>
  safeRequest({
    path: `${ACCOUNTS_BASE}/expenses`,
    emptyData: [],
    fallbackData: () => getAccountsDemoData().expenses,
    extract: (payload) => payload?.expenses || []
  });

export const createExpense = async (expensePayload) =>
  strictRequest({
    path: `${ACCOUNTS_BASE}/expenses`,
    options: { method: 'POST', body: JSON.stringify(expensePayload) },
    extract: (payload) => payload?.expense || payload
  });
