const baseDate = new Date('2026-03-11T12:00:00Z');
const dayMs = 24 * 60 * 60 * 1000;

const isoDaysAgo = (days, hour = 10) => {
  const date = new Date(baseDate.getTime() - dayMs * days);
  date.setUTCHours(hour, 20, 0, 0);
  return date.toISOString();
};

const accountsDemoData = {
  overview: {
    revenueSummary: {
      grossRevenue: 612000,
      collectedRevenue: 548000,
      outstandingRevenue: 64000,
      refundAmount: 18500,
      netRevenue: 421500
    },
    invoiceSummary: {
      totalInvoices: 4,
      paidInvoices: 2,
      pendingInvoices: 1,
      failedInvoices: 1
    },
    subscriptionSummary: {
      totalSubscriptions: 3,
      activeSubscriptions: 2,
      monthlyRecurringRevenue: 188000,
      annualContractValue: 2256000
    },
    transactionSummary: {
      totalTransactions: 4,
      successfulTransactions: 2,
      pendingTransactions: 1,
      failedTransactions: 1
    },
    payoutSummary: {
      totalPayouts: 3,
      completedPayouts: 1,
      pendingPayouts: 1
    },
    expenseSummary: {
      totalExpenses: 126500,
      pendingExpenses: 1,
      approvedExpenses: 2
    },
    monthlyRevenue: [
      { month: 'Oct', revenue: 86000, expenses: 21000, refunds: 3200 },
      { month: 'Nov', revenue: 91000, expenses: 18000, refunds: 2600 },
      { month: 'Dec', revenue: 97000, expenses: 22500, refunds: 1800 },
      { month: 'Jan', revenue: 103000, expenses: 24000, refunds: 4200 },
      { month: 'Feb', revenue: 112000, expenses: 19800, refunds: 3800 },
      { month: 'Mar', revenue: 123000, expenses: 21200, refunds: 2900 }
    ],
    paymentMethods: [
      {
        id: 'PM-101',
        title: 'Razorpay Primary',
        provider: 'Razorpay',
        type: 'Gateway',
        status: 'active',
        settlementCycle: 'T+2 days',
        feeRate: '2.1%',
        descriptor: 'HHH JOBS',
        lastUsedAt: isoDaysAgo(0, 8)
      },
      {
        id: 'PM-102',
        title: 'Bank Transfer',
        provider: 'ICICI Bank',
        type: 'Settlement',
        status: 'active',
        settlementCycle: 'Daily',
        feeRate: '0.35%',
        descriptor: 'HHH CORP',
        lastUsedAt: isoDaysAgo(1, 11)
      }
    ],
    recentTransactions: [
      {
        id: 'TX-2101',
        customer: 'Metro Build Infra',
        type: 'Subscription',
        channel: 'Online',
        amount: 210000,
        currency: 'INR',
        status: 'paid',
        gateway: 'Razorpay',
        createdAt: isoDaysAgo(0, 9)
      },
      {
        id: 'TX-2102',
        customer: 'Zenith Careers',
        type: 'Invoice',
        channel: 'Card',
        amount: 85000,
        currency: 'INR',
        status: 'pending',
        gateway: 'Stripe',
        createdAt: isoDaysAgo(1, 12)
      },
      {
        id: 'TX-2103',
        customer: 'Prime Skill Labs',
        type: 'Top-up',
        channel: 'UPI',
        amount: 54000,
        currency: 'INR',
        status: 'paid',
        gateway: 'Razorpay',
        createdAt: isoDaysAgo(3, 10)
      }
    ],
    recentInvoices: [
      {
        id: 'INV-1801',
        invoiceNumber: 'INV-1801',
        account: 'Metro Build Infra',
        category: 'Enterprise Hiring Renewal',
        amount: 210000,
        currency: 'INR',
        status: 'paid',
        issueDate: isoDaysAgo(5, 9),
        dueDate: isoDaysAgo(-5, 9)
      },
      {
        id: 'INV-1802',
        invoiceNumber: 'INV-1802',
        account: 'Zenith Careers',
        category: 'Growth ATS Monthly',
        amount: 85000,
        currency: 'INR',
        status: 'pending',
        issueDate: isoDaysAgo(2, 9),
        dueDate: isoDaysAgo(-8, 9)
      }
    ]
  },
  transactions: [
    {
      id: 'TX-2101',
      customer: 'Metro Build Infra',
      type: 'Subscription',
      channel: 'Online',
      amount: 210000,
      currency: 'INR',
      status: 'paid',
      gateway: 'Razorpay',
      reference: 'RAZ-8821',
      email: 'finance@metrobuild.in',
      createdAt: isoDaysAgo(0, 9)
    },
    {
      id: 'TX-2102',
      customer: 'Zenith Careers',
      type: 'Invoice',
      channel: 'Card',
      amount: 85000,
      currency: 'INR',
      status: 'pending',
      gateway: 'Stripe',
      reference: 'STR-1142',
      email: 'ops@zenithcareers.com',
      createdAt: isoDaysAgo(1, 12)
    },
    {
      id: 'TX-2103',
      customer: 'Prime Skill Labs',
      type: 'Top-up',
      channel: 'UPI',
      amount: 54000,
      currency: 'INR',
      status: 'paid',
      gateway: 'Razorpay',
      reference: 'UPI-4408',
      email: 'accounts@primeskilllabs.com',
      createdAt: isoDaysAgo(3, 10)
    },
    {
      id: 'TX-2104',
      customer: 'Northstar Services',
      type: 'Refund Reversal',
      channel: 'Card',
      amount: 18000,
      currency: 'INR',
      status: 'failed',
      gateway: 'Stripe',
      reference: 'STR-9928',
      email: 'finance@northstarservices.com',
      createdAt: isoDaysAgo(4, 15)
    }
  ],
  invoices: [
    {
      id: 'INV-1801',
      invoiceNumber: 'INV-1801',
      account: 'Metro Build Infra',
      category: 'Enterprise Hiring Renewal',
      amount: 210000,
      currency: 'INR',
      status: 'paid',
      issueDate: isoDaysAgo(5, 9),
      dueDate: isoDaysAgo(-5, 9)
    },
    {
      id: 'INV-1802',
      invoiceNumber: 'INV-1802',
      account: 'Zenith Careers',
      category: 'Growth ATS Monthly',
      amount: 85000,
      currency: 'INR',
      status: 'pending',
      issueDate: isoDaysAgo(2, 9),
      dueDate: isoDaysAgo(-8, 9)
    },
    {
      id: 'INV-1803',
      invoiceNumber: 'INV-1803',
      account: 'Prime Skill Labs',
      category: 'Resume Database Credits',
      amount: 54000,
      currency: 'INR',
      status: 'paid',
      issueDate: isoDaysAgo(10, 11),
      dueDate: isoDaysAgo(0, 11)
    },
    {
      id: 'INV-1804',
      invoiceNumber: 'INV-1804',
      account: 'Northstar Services',
      category: 'Recruiter Subscription',
      amount: 18000,
      currency: 'INR',
      status: 'failed',
      issueDate: isoDaysAgo(14, 10),
      dueDate: isoDaysAgo(4, 10)
    }
  ],
  subscriptions: [
    {
      id: 'SUB-301',
      company: 'Metro Build Infra',
      plan: 'Enterprise Hiring',
      billingCycle: 'Monthly',
      seats: 25,
      amount: 210000,
      status: 'active',
      renewalDate: isoDaysAgo(-18, 10)
    },
    {
      id: 'SUB-302',
      company: 'Zenith Careers',
      plan: 'Growth ATS',
      billingCycle: 'Monthly',
      seats: 8,
      amount: 85000,
      status: 'past_due',
      renewalDate: isoDaysAgo(-7, 10)
    },
    {
      id: 'SUB-303',
      company: 'Prime Skill Labs',
      plan: 'Subscription Plus',
      billingCycle: 'Annual',
      seats: 5,
      amount: 128000,
      status: 'active',
      renewalDate: isoDaysAgo(-30, 10)
    }
  ],
  expenses: [
    {
      id: 'EXP-801',
      title: 'Cloud Hosting',
      category: 'Infrastructure',
      department: 'Engineering',
      amount: 42000,
      status: 'approved',
      spentOn: isoDaysAgo(6, 8),
      note: 'Core platform hosting and storage'
    },
    {
      id: 'EXP-802',
      title: 'Campaign Design',
      category: 'Marketing',
      department: 'Growth',
      amount: 27500,
      status: 'pending',
      spentOn: isoDaysAgo(3, 14),
      note: 'Seasonal acquisition campaign'
    },
    {
      id: 'EXP-803',
      title: 'Support Training',
      category: 'Operations',
      department: 'Support',
      amount: 17000,
      status: 'approved',
      spentOn: isoDaysAgo(11, 12),
      note: 'Escalation handling workshop'
    }
  ],
  payouts: [
    {
      id: 'PO-101',
      beneficiary: 'Referral Partners Pool',
      purpose: 'Monthly partner commission',
      amount: 24000,
      method: 'Bank Transfer',
      status: 'completed',
      requestedAt: isoDaysAgo(2, 9)
    },
    {
      id: 'PO-102',
      beneficiary: 'Regional Sales Incentives',
      purpose: 'Quarterly incentive release',
      amount: 18000,
      method: 'UPI',
      status: 'pending',
      requestedAt: isoDaysAgo(1, 13)
    },
    {
      id: 'PO-103',
      beneficiary: 'Affiliate Media House',
      purpose: 'Campaign settlement',
      amount: 12000,
      method: 'NEFT',
      status: 'scheduled',
      requestedAt: isoDaysAgo(0, 15)
    }
  ],
  refunds: [
    {
      id: 'RF-401',
      account: 'Northstar Services',
      reason: 'Duplicate subscription charge',
      amount: 18000,
      status: 'refunded',
      requestedAt: isoDaysAgo(5, 10),
      processedAt: isoDaysAgo(4, 11)
    },
    {
      id: 'RF-402',
      account: 'Zenith Careers',
      reason: 'Posting pack cancelled',
      amount: 8500,
      status: 'pending',
      requestedAt: isoDaysAgo(2, 12),
      processedAt: ''
    }
  ],
  reports: {
    revenue: [
      { month: 'Oct', revenue: 86000, expenses: 21000, refunds: 3200 },
      { month: 'Nov', revenue: 91000, expenses: 18000, refunds: 2600 },
      { month: 'Dec', revenue: 97000, expenses: 22500, refunds: 1800 },
      { month: 'Jan', revenue: 103000, expenses: 24000, refunds: 4200 },
      { month: 'Feb', revenue: 112000, expenses: 19800, refunds: 3800 },
      { month: 'Mar', revenue: 123000, expenses: 21200, refunds: 2900 }
    ],
    categoryPerformance: [
      { label: 'Subscriptions', value: 312000, status: 'healthy' },
      { label: 'Posting Packs', value: 146000, status: 'healthy' },
      { label: 'Database Credits', value: 98000, status: 'warning' },
      { label: 'Refund Exposure', value: 18500, status: 'warning' }
    ]
  },
  settlementProfile: {
    companyName: 'HHH Jobs',
    settlementAccount: '0199001002456',
    settlementIfsc: 'ICIC0000199',
    settlementContact: 'finance@hhh-jobs.com',
    gstNumber: '07AABCH1234L1Z9',
    autoPayouts: true
  }
};

export const getAccountsDemoData = () => JSON.parse(JSON.stringify(accountsDemoData));
