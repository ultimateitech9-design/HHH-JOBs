const now = new Date('2026-03-11T12:15:00');
const dayMs = 24 * 60 * 60 * 1000;
const isoDaysAgo = (days, hour = 10) => {
  const date = new Date(now.getTime() - dayMs * days);
  date.setHours(hour, 20, 0, 0);
  return date.toISOString();
};

export const supportDummyData = {
  stats: {
    totalTickets: 148,
    openTickets: 26,
    pendingTickets: 14,
    resolvedTickets: 96,
    escalatedTickets: 6,
    liveChats: 9,
    complaints: 5,
    feedbackItems: 18,
    avgResolutionHours: 6.8
  },
  tickets: [
    {
      id: 'SUP-1001',
      title: 'Employer cannot publish approved job',
      customer: 'Metro Build Infra',
      customerType: 'employer',
      category: 'job_posting',
      priority: 'high',
      status: 'open',
      assignedTo: 'Ananya Support',
      createdAt: isoDaysAgo(0, 9),
      updatedAt: isoDaysAgo(0, 11),
      description: 'Approved posting is not visible in HR dashboard after payment confirmation.',
      replies: [
        { id: 'R-1', author: 'Metro Build Infra', role: 'customer', message: 'Payment was marked paid but publish action is disabled.', createdAt: isoDaysAgo(0, 9) },
        { id: 'R-2', author: 'Ananya Support', role: 'agent', message: 'Checking the job credit linkage and approval sync now.', createdAt: isoDaysAgo(0, 11) }
      ]
    },
    {
      id: 'SUP-1002',
      title: 'Student profile photo upload failing',
      customer: 'Kriti Arora',
      customerType: 'student',
      category: 'technical',
      priority: 'medium',
      status: 'pending',
      assignedTo: 'Rohit Desk',
      createdAt: isoDaysAgo(1, 13),
      updatedAt: isoDaysAgo(1, 16),
      description: 'Image upload returns validation error on JPG files.',
      replies: []
    },
    {
      id: 'SUP-1003',
      title: 'Invoice mismatch on subscription renewal',
      customer: 'Prime Skill Labs',
      customerType: 'employer',
      category: 'billing',
      priority: 'critical',
      status: 'escalated',
      assignedTo: 'Billing Escalation',
      createdAt: isoDaysAgo(2, 10),
      updatedAt: isoDaysAgo(0, 15),
      description: 'Renewal invoice shows incorrect seat count versus contracted plan.',
      replies: []
    },
    {
      id: 'SUP-1004',
      title: 'Unable to access ATS check history',
      customer: 'Gov Hiring Cell',
      customerType: 'employer',
      category: 'account',
      priority: 'low',
      status: 'resolved',
      assignedTo: 'Ananya Support',
      createdAt: isoDaysAgo(3, 8),
      updatedAt: isoDaysAgo(2, 17),
      description: 'ATS history page was timing out; issue resolved after cache refresh.',
      replies: []
    }
  ],
  chats: [
    {
      id: 'CHAT-201',
      visitor: 'Rahul Mehta',
      company: 'Greenfield Logistics',
      status: 'online',
      assignedTo: 'Support Bot',
      messages: [
        { id: 'M-1', author: 'Rahul Mehta', role: 'customer', text: 'How do I reactivate a past-due subscription?', createdAt: isoDaysAgo(0, 12) },
        { id: 'M-2', author: 'Support Bot', role: 'agent', text: 'Open Billing in your dashboard and clear the due invoice to reactivate the subscription.', createdAt: isoDaysAgo(0, 12) }
      ]
    },
    {
      id: 'CHAT-202',
      visitor: 'Sonia Dabas',
      company: 'Rural Talent Mission',
      status: 'busy',
      assignedTo: 'Nisha Chat',
      messages: [
        { id: 'M-3', author: 'Sonia Dabas', role: 'customer', text: 'We need help importing candidate records in bulk.', createdAt: isoDaysAgo(0, 11) }
      ]
    }
  ],
  faqs: [
    {
      id: 'FAQ-1',
      category: 'billing',
      question: 'How do I download my invoice?',
      answer: 'Open your billing or accounts dashboard, go to invoices, and download the invoice linked to your order or subscription.'
    },
    {
      id: 'FAQ-2',
      category: 'job_posting',
      question: 'Why is my job posting still pending?',
      answer: 'Jobs remain pending until payment, moderation, and role-level publishing validations are complete.'
    },
    {
      id: 'FAQ-3',
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Use the forgot password flow on the login screen and verify the OTP sent to your registered email.'
    }
  ],
  complaints: [
    {
      id: 'CMP-301',
      subject: 'Delayed recruiter response after payment',
      customer: 'Zenith Careers',
      severity: 'high',
      status: 'open',
      owner: 'Escalation Desk',
      createdAt: isoDaysAgo(1, 10)
    },
    {
      id: 'CMP-302',
      subject: 'Student reports duplicate rejection issue',
      customer: 'Kriti Arora',
      severity: 'medium',
      status: 'pending',
      owner: 'Quality Review',
      createdAt: isoDaysAgo(2, 13)
    }
  ],
  feedback: [
    {
      id: 'FDB-401',
      channel: 'Web',
      customer: 'Metro Build Infra',
      rating: 4,
      sentiment: 'positive',
      message: 'The employer dashboard is strong, but approval visibility can be improved.',
      createdAt: isoDaysAgo(0, 16)
    },
    {
      id: 'FDB-402',
      channel: 'App',
      customer: 'Kriti Arora',
      rating: 3,
      sentiment: 'neutral',
      message: 'Resume builder is useful, but the profile upload flow is slow on mobile.',
      createdAt: isoDaysAgo(3, 14)
    }
  ],
  knowledgeBase: [
    {
      id: 'KB-1',
      title: 'Employer Billing and Subscription Guide',
      category: 'billing',
      summary: 'Understand invoices, subscriptions, refunds, and payment verification.',
      updatedAt: isoDaysAgo(2, 15)
    },
    {
      id: 'KB-2',
      title: 'Job Posting Moderation Checklist',
      category: 'job_posting',
      summary: 'Checklist for approval delays, plan credits, and publish blockers.',
      updatedAt: isoDaysAgo(5, 11)
    },
    {
      id: 'KB-3',
      title: 'Student Profile Recovery Steps',
      category: 'account',
      summary: 'Password reset, profile restoration, and document upload troubleshooting.',
      updatedAt: isoDaysAgo(4, 9)
    }
  ],
  reports: {
    byCategory: [
      { label: 'Technical', value: 38, status: 'healthy' },
      { label: 'Billing', value: 24, status: 'warning' },
      { label: 'Account', value: 19, status: 'healthy' },
      { label: 'Job Posting', value: 31, status: 'warning' }
    ],
    resolutionTrend: [
      { period: 'Mon', opened: 18, resolved: 15 },
      { period: 'Tue', opened: 21, resolved: 18 },
      { period: 'Wed', opened: 16, resolved: 17 },
      { period: 'Thu', opened: 22, resolved: 20 },
      { period: 'Fri', opened: 19, resolved: 21 }
    ]
  }
};
