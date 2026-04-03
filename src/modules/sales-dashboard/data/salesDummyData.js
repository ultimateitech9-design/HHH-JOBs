const today = new Date('2026-03-11T12:00:00');
const dayMs = 24 * 60 * 60 * 1000;
const isoDaysAgo = (days, hour = 10) => {
  const date = new Date(today.getTime() - dayMs * days);
  date.setHours(hour, 15, 0, 0);
  return date.toISOString();
};

export const salesDummyData = {
  overview: {
    stats: {
      totalRevenue: 485000,
      monthlyRevenue: 182000,
      totalOrders: 126,
      openLeads: 34,
      convertedLeads: 18,
      activeCustomers: 64,
      salesAgents: 9,
      refunds: 7,
      averageOrderValue: 3849
    },
    monthlySales: [
      { month: 'Oct', value: 118000, target: 130000 },
      { month: 'Nov', value: 136000, target: 140000 },
      { month: 'Dec', value: 149000, target: 145000 },
      { month: 'Jan', value: 163000, target: 160000 },
      { month: 'Feb', value: 171000, target: 175000 },
      { month: 'Mar', value: 182000, target: 180000 }
    ],
    revenueTrend: [
      { month: 'Oct', revenue: 118000, refunds: 5000 },
      { month: 'Nov', revenue: 136000, refunds: 4500 },
      { month: 'Dec', revenue: 149000, refunds: 6200 },
      { month: 'Jan', revenue: 163000, refunds: 7800 },
      { month: 'Feb', revenue: 171000, refunds: 6000 },
      { month: 'Mar', revenue: 182000, refunds: 4200 }
    ]
  },
  orders: [
    {
      id: 'SO-2101',
      customer: 'Metro Build Infra',
      product: 'Enterprise Hiring Pack',
      amount: 25000,
      quantity: 1,
      status: 'paid',
      paymentStatus: 'paid',
      salesAgent: 'Neha Arora',
      createdAt: isoDaysAgo(0, 11)
    },
    {
      id: 'SO-2102',
      customer: 'Prime Skill Labs',
      product: 'Featured Listing Credits',
      amount: 12000,
      quantity: 3,
      status: 'processing',
      paymentStatus: 'pending',
      salesAgent: 'Arjun Malik',
      createdAt: isoDaysAgo(1, 14)
    },
    {
      id: 'SO-2103',
      customer: 'Gov Hiring Cell',
      product: 'Government Outreach Plan',
      amount: 48000,
      quantity: 1,
      status: 'paid',
      paymentStatus: 'paid',
      salesAgent: 'Neha Arora',
      createdAt: isoDaysAgo(3, 10)
    },
    {
      id: 'SO-2104',
      customer: 'Northstar Services',
      product: 'Recruiter Subscription',
      amount: 18000,
      quantity: 1,
      status: 'cancelled',
      paymentStatus: 'refunded',
      salesAgent: 'Ritik Singh',
      createdAt: isoDaysAgo(6, 16)
    }
  ],
  leads: [
    {
      id: 'LEAD-101',
      company: 'Greenfield Logistics',
      contactName: 'Rahul Mehta',
      phone: '9876500011',
      email: 'rahul@greenfieldlogistics.com',
      source: 'Website',
      stage: 'qualified',
      assignedTo: 'Neha Arora',
      expectedValue: 22000,
      createdAt: isoDaysAgo(0, 9)
    },
    {
      id: 'LEAD-102',
      company: 'Rural Talent Mission',
      contactName: 'Sonia Dabas',
      phone: '9876500012',
      email: 'sonia@rtm.org',
      source: 'Campaign',
      stage: 'proposal',
      assignedTo: 'Arjun Malik',
      expectedValue: 36000,
      createdAt: isoDaysAgo(2, 11)
    },
    {
      id: 'LEAD-103',
      company: 'Talent Bridge Co.',
      contactName: 'Imran Khan',
      phone: '9876500013',
      email: 'imran@talentbridge.co',
      source: 'Referral',
      stage: 'new',
      assignedTo: 'Ritik Singh',
      expectedValue: 14000,
      createdAt: isoDaysAgo(1, 15)
    }
  ],
  customers: [
    {
      id: 'CUS-501',
      company: 'Metro Build Infra',
      industry: 'Construction',
      city: 'Noida',
      status: 'active',
      lifetimeValue: 118000,
      openOrders: 2,
      owner: 'Neha Arora',
      createdAt: isoDaysAgo(25, 10)
    },
    {
      id: 'CUS-502',
      company: 'Prime Skill Labs',
      industry: 'Education',
      city: 'Gurugram',
      status: 'active',
      lifetimeValue: 76000,
      openOrders: 1,
      owner: 'Arjun Malik',
      createdAt: isoDaysAgo(42, 12)
    },
    {
      id: 'CUS-503',
      company: 'Northstar Services',
      industry: 'Staffing',
      city: 'Delhi',
      status: 'inactive',
      lifetimeValue: 31000,
      openOrders: 0,
      owner: 'Ritik Singh',
      createdAt: isoDaysAgo(68, 13)
    }
  ],
  agents: [
    {
      id: 'AG-11',
      name: 'Neha Arora',
      territory: 'North',
      dealsClosed: 18,
      revenue: 182000,
      leadResponseRate: 91,
      status: 'active'
    },
    {
      id: 'AG-12',
      name: 'Arjun Malik',
      territory: 'West',
      dealsClosed: 11,
      revenue: 126000,
      leadResponseRate: 84,
      status: 'active'
    },
    {
      id: 'AG-13',
      name: 'Ritik Singh',
      territory: 'Central',
      dealsClosed: 7,
      revenue: 76000,
      leadResponseRate: 73,
      status: 'active'
    }
  ],
  products: [
    { id: 'PR-1', name: 'Enterprise Hiring Pack', category: 'Subscription', unitsSold: 19, revenue: 250000, status: 'active' },
    { id: 'PR-2', name: 'Featured Listing Credits', category: 'Add-on', unitsSold: 42, revenue: 118000, status: 'active' },
    { id: 'PR-3', name: 'Government Outreach Plan', category: 'Campaign', unitsSold: 6, revenue: 86000, status: 'active' },
    { id: 'PR-4', name: 'Recruiter Subscription', category: 'Subscription', unitsSold: 14, revenue: 31000, status: 'active' }
  ],
  coupons: [
    { id: 'CP-101', code: 'HHH20', discountType: 'percentage', discountValue: 20, usageCount: 13, status: 'active', expiresAt: isoDaysAgo(-15, 23) },
    { id: 'CP-102', code: 'MARCH5K', discountType: 'flat', discountValue: 5000, usageCount: 4, status: 'active', expiresAt: isoDaysAgo(-10, 20) },
    { id: 'CP-103', code: 'OLD10', discountType: 'percentage', discountValue: 10, usageCount: 31, status: 'expired', expiresAt: isoDaysAgo(8, 20) }
  ],
  refunds: [
    { id: 'SR-9001', orderId: 'SO-2104', customer: 'Northstar Services', amount: 18000, reason: 'Plan cancelled before activation', status: 'refunded', createdAt: isoDaysAgo(4, 15) },
    { id: 'SR-9002', orderId: 'SO-2091', customer: 'Zenith Careers', amount: 8500, reason: 'Duplicate payment', status: 'pending', createdAt: isoDaysAgo(2, 11) }
  ],
  reports: {
    topSources: [
      { label: 'Website', value: 41, status: 'healthy' },
      { label: 'Campaign', value: 23, status: 'healthy' },
      { label: 'Referral', value: 12, status: 'healthy' },
      { label: 'Partner', value: 7, status: 'warning' }
    ],
    conversion: [
      { stage: 'New Leads', count: 34 },
      { stage: 'Qualified', count: 22 },
      { stage: 'Proposal', count: 14 },
      { stage: 'Won', count: 18 }
    ]
  }
};
