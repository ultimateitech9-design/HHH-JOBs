export const FOOTER_LINK_COLUMNS = [
  {
    title: '',
    links: [
      { label: 'About us', to: '/about-us', key: 'about-us' },
      { label: 'Contact us', to: '/contact-us', key: 'contact-us' },
      { label: 'Careers', to: '/careers', key: 'careers' },
      { label: 'Employer home', to: '/employer-home', key: 'employer-home' },
      { label: 'Sitemap', to: '/sitemap', key: 'sitemap' }
    ]
  },
  {
    title: '',
    links: [
      { label: 'Help center', to: '/help-center', key: 'help-center' },
      { label: 'Summons/Notices', to: '/summons-notices', key: 'summons-notices' },
      { label: 'Grievances', to: '/grievances', key: 'grievances' },
      { label: 'Report issue', to: '/report-issue', key: 'report-issue' },
      { label: 'Credits', to: '/credits', key: 'credits' }
    ]
  },
  {
    title: '',
    links: [
      { label: 'Privacy policy', to: '/privacy-policy', key: 'privacy-policy' },
      { label: 'Terms & conditions', to: '/terms-and-conditions', key: 'terms-and-conditions' },
      { label: 'Fraud alert', to: '/fraud-alert', key: 'fraud-alert' },
      { label: 'Trust & safety', to: '/trust-and-safety', key: 'trust-and-safety' }
    ]
  }
];

export const BLOG_ARTICLE_PAGE_KEY_BY_SLUG = {
  'ats-friendly-resume-blueprint-2026': 'blog-ats-friendly-resume-blueprint-2026',
  'projects-that-recruiters-notice': 'blog-projects-that-recruiters-notice',
  'interview-preparation-in-14-days': 'blog-interview-preparation-in-14-days',
  'hr-expectations-from-freshers-2026': 'blog-hr-expectations-from-freshers-2026',
  'common-application-mistakes': 'blog-common-application-mistakes'
};

export const FOOTER_PAGE_CONTENT = {
  blog: {
    title: 'HHH Job Blog',
    eyebrow: 'Insights',
    summary:
      'Read practical insights on job search strategy, ATS optimization, interview preparation, and hiring trends.',
    sections: [
      {
        heading: 'Blog 1: ATS-Friendly Resume Blueprint (2026)',
        tag: 'Resume',
        readTime: '6 min read',
        image: '/images/blog/ats-resume-cover.svg',
        imageAlt: 'Resume and ATS optimization visual',
        to: '/blog/ats-friendly-resume-blueprint-2026',
        body:
          'Most candidates lose shortlisting because resumes are keyword-heavy but context-light. A strong ATS resume must combine role keywords, measurable outcomes, and clean section hierarchy.',
        items: [
          'Use a single-column layout with clear headings: Summary, Skills, Experience, Projects, Education',
          'Mirror job description keywords naturally inside project and impact lines',
          'Prefer quantified bullets: "Improved API latency by 32%" over generic task descriptions',
          'Keep file naming clean: full-name-role-resume.pdf'
        ]
      },
      {
        heading: 'Blog 2: How to Build Projects That Recruiters Actually Notice',
        tag: 'Projects',
        readTime: '5 min read',
        image: '/images/blog/projects-cover.svg',
        imageAlt: 'Project showcase and portfolio visual',
        to: '/blog/projects-that-recruiters-notice',
        body:
          'Projects are your proof of execution. Recruiters evaluate clarity of problem statement, ownership, and measurable outcomes far more than fancy tech stack names.',
        items: [
          'Start with one-line problem statement and target users',
          'Add architecture snapshot: frontend, backend, database, deployment',
          'Highlight your personal contribution and decisions',
          'Close with results: users served, performance gains, or business impact'
        ]
      },
      {
        heading: 'Blog 3: Interview Preparation in 14 Days',
        tag: 'Interviews',
        readTime: '7 min read',
        image: '/images/blog/interview-cover.svg',
        imageAlt: 'Interview planning board visual',
        to: '/blog/interview-preparation-in-14-days',
        body:
          'Consistency beats random practice. A focused two-week plan helps candidates improve communication, technical depth, and confidence under pressure.',
        items: [
          'Days 1-4: core fundamentals and role-specific question bank',
          'Days 5-8: project deep-dive narration and mock HR rounds',
          'Days 9-12: timed coding/case simulations',
          'Days 13-14: final mock interviews with feedback tracking'
        ]
      },
      {
        heading: 'Blog 4: What HR Teams Expect from Freshers in 2026',
        tag: 'Hiring',
        readTime: '4 min read',
        image: '/images/blog/hr-expectations-cover.svg',
        imageAlt: 'Hiring checklist and recruiter workflow visual',
        to: '/blog/hr-expectations-from-freshers-2026',
        body:
          'Hiring teams now prioritize reliability, communication, and learning velocity. Domain fit and ownership mindset often outweigh perfect academic scores.',
        items: [
          'Strong communication in interviews and follow-up mails',
          'Evidence of self-learning through projects/certifications',
          'Basic understanding of collaboration tools and workflows',
          'Professional behavior: punctuality, clarity, and accountability'
        ]
      },
      {
        heading: 'Blog 5: Common Application Mistakes and How to Avoid Them',
        tag: 'Applications',
        readTime: '5 min read',
        image: '/images/blog/application-mistakes-cover.svg',
        imageAlt: 'Job application quality and review visual',
        to: '/blog/common-application-mistakes',
        body:
          'Candidates often miss opportunities due to avoidable process errors. Small fixes in profile quality and application hygiene can significantly improve response rate.',
        items: [
          'Applying with incomplete profile or outdated resume',
          'Using one generic resume for every role',
          'Ignoring application status and interview updates',
          'Skipping post-interview thank-you and feedback communication'
        ]
      }
    ]
  },
  'blog-ats-friendly-resume-blueprint-2026': {
    title: 'ATS-Friendly Resume Blueprint (2026)',
    eyebrow: 'Resume',
    summary:
      'A complete framework to improve ATS match quality without making your resume look robotic.',
    sections: [
      {
        heading: 'Why ATS rejects resumes',
        image: '/images/blog/ats-resume-cover.svg',
        imageAlt: 'ATS optimization cover',
        body:
          'Most ATS engines prioritize structured text, role keywords, and contextual relevance. Resumes fail when important terms are missing or buried inside noisy formatting.',
        items: [
          'Use clear section headers and consistent chronology',
          'Avoid text in images/tables for critical details',
          'Keep role title and skills aligned with target jobs'
        ]
      },
      {
        heading: 'High-impact bullet formula',
        body:
          'Write each bullet as Action + Scope + Impact. This format improves both ATS keyword density and recruiter readability.',
        items: [
          'Built candidate portal modules in React + Node.js',
          'Reduced page load time by 34% via code splitting and caching',
          'Improved form completion by 22% using validation and UX changes'
        ]
      },
      {
        heading: 'Final pre-apply checklist',
        body:
          'Before every application, adjust summary and skills order, then ensure top 40% of resume reflects role-fit keywords naturally.'
      }
    ]
  },
  'blog-projects-that-recruiters-notice': {
    title: 'How to Build Projects That Recruiters Notice',
    eyebrow: 'Projects',
    summary:
      'Turn side projects into strong hiring proof with outcome-driven storytelling and clear ownership.',
    sections: [
      {
        heading: 'What recruiters scan first',
        image: '/images/blog/projects-cover.svg',
        imageAlt: 'Project hiring proof visual',
        body:
          'Recruiters first check if your project solves a real problem, whether you led meaningful decisions, and if outcomes are measurable.',
        items: [
          'Problem statement clarity',
          'Your exact contribution',
          'Measurable result or learning depth'
        ]
      },
      {
        heading: 'Project section structure',
        body:
          'Keep each project compact: objective, tech stack, your role, and results. Avoid long tool lists without context.',
        items: [
          '2 lines: objective + user context',
          '2 lines: architecture + tools',
          '3 bullets: impact and improvements'
        ]
      },
      {
        heading: 'Portfolio quality signal',
        body:
          'A polished README, live demo link, and short architecture note often outperform raw number of projects.'
      }
    ]
  },
  'blog-interview-preparation-in-14-days': {
    title: 'Interview Preparation in 14 Days',
    eyebrow: 'Interviews',
    summary:
      'A practical two-week system to improve technical rounds, HR communication, and confidence.',
    sections: [
      {
        heading: 'Week 1: Build depth',
        image: '/images/blog/interview-cover.svg',
        imageAlt: 'Interview plan board',
        body:
          'Focus on fundamentals, role-specific patterns, and project walkthrough practice. Record mock answers to find clarity gaps.',
        items: [
          'Daily 90-minute focused prep block',
          'Role-specific question tracker',
          'Project story in 2-minute and 6-minute versions'
        ]
      },
      {
        heading: 'Week 2: Simulate pressure',
        body:
          'Run timed mock interviews and reflection loops. Prioritize accuracy, structure, and communication over speed.',
        items: [
          '2 coding/case rounds under timer',
          '2 HR + behavioral rounds',
          'Debrief sheet after every mock'
        ]
      },
      {
        heading: 'Interview-day protocol',
        body:
          'Keep a one-page quick sheet: achievements, project metrics, role-fit reasons, and questions for interviewer.'
      }
    ]
  },
  'blog-hr-expectations-from-freshers-2026': {
    title: 'What HR Teams Expect from Freshers in 2026',
    eyebrow: 'Hiring',
    summary:
      'Understand what hiring teams look for beyond marks and certifications.',
    sections: [
      {
        heading: 'Top evaluation signals',
        image: '/images/blog/hr-expectations-cover.svg',
        imageAlt: 'Recruiter expectation visual',
        body:
          'Freshers are evaluated on communication quality, reliability, and problem-solving discipline. These signals predict onboarding success.',
        items: [
          'Clear and concise communication',
          'Ownership mindset in projects',
          'Consistency in follow-ups and process discipline'
        ]
      },
      {
        heading: 'Common rejection triggers',
        body:
          'Generic resumes, weak project clarity, and poor interview structure are still the most common reasons for rejection.',
        items: [
          'No quantifiable impact in resume bullets',
          'Unclear role preference',
          'Inconsistent answers about project ownership'
        ]
      },
      {
        heading: 'How to stand out',
        body:
          'Show evidence of learning velocity: recent projects, feedback incorporation, and focused role preparation.'
      }
    ]
  },
  'blog-common-application-mistakes': {
    title: 'Common Application Mistakes and How to Avoid Them',
    eyebrow: 'Applications',
    summary:
      'Fix the most frequent errors that reduce shortlist rates and response quality.',
    sections: [
      {
        heading: 'Application hygiene basics',
        image: '/images/blog/application-mistakes-cover.svg',
        imageAlt: 'Application quality checks visual',
        body:
          'Poorly filled profiles and one-size-fits-all resumes weaken application quality before interviews even begin.',
        items: [
          'Keep profile data complete and updated',
          'Tailor summary and key skills per role',
          'Track applied roles and status weekly'
        ]
      },
      {
        heading: 'Communication mistakes',
        body:
          'Late replies, vague email responses, and no follow-up after interviews hurt professional perception.',
        items: [
          'Respond within 24 hours to recruiter updates',
          'Use concise and professional follow-up',
          'Send thank-you note after interview'
        ]
      },
      {
        heading: 'Fix in one week',
        body:
          'Audit all active applications, improve top 3 resumes, and run ATS checks with targeted job descriptions for better relevance.'
      }
    ]
  },
  'about-us': {
    title: 'About HHH Job',
    eyebrow: 'Company',
    summary:
      'HHH Job connects students, recruiters, and operations teams in one hiring workspace so every stage from application to interview stays trackable and transparent.',
    sections: [
      {
        heading: 'What we do',
        body:
          'We provide a structured platform for job discovery, candidate screening, and hiring operations with role-based dashboards for students, HR teams, and administrators.'
      },
      {
        heading: 'Our focus',
        body:
          'We focus on practical hiring outcomes: faster shortlist cycles, clear communication, and measurable improvements in conversion from application to offer.',
        items: ['Student-first experience', 'Recruiter productivity tools', 'Operational control for admins']
      },
      {
        heading: 'How we build',
        body:
          'We design features around data accuracy, process visibility, and privacy controls so teams can scale hiring without losing quality.'
      }
    ]
  },
  careers: {
    title: 'Careers at HHH Job',
    eyebrow: 'Careers',
    summary:
      'Join a product team building reliable hiring infrastructure for students and employers across India.',
    sections: [
      {
        heading: 'Who we hire',
        body:
          'We hire engineers, product thinkers, operations specialists, and customer success professionals who can simplify complex workflows.'
      },
      {
        heading: 'What we value',
        body:
          'We value ownership, execution speed, and clear communication. Every team member is expected to ship responsibly and improve quality continuously.',
        items: ['Execution over noise', 'User empathy', 'Data-backed decisions']
      },
      {
        heading: 'How to apply',
        body:
          'Send your profile and role interest to careers@hhhjob.com. Include relevant work samples and a short note on the impact you have driven.'
      }
    ]
  },
  'employer-home': {
    title: 'Employer Home',
    eyebrow: 'For Employers',
    summary:
      'Manage openings, applicant pipelines, interviews, and team collaboration from one recruiter workspace.',
    sections: [
      {
        heading: 'Hiring workflow',
        body:
          'Create job posts, define screening criteria, and move candidates through clear pipeline stages with audit-friendly timelines.'
      },
      {
        heading: 'Recruiter tools',
        body:
          'Use role-specific dashboards for sourcing, interview scheduling, and communication tracking across hiring managers and HR partners.',
        items: ['Job publishing', 'Applicant shortlisting', 'Interview coordination']
      },
      {
        heading: 'Start with your team',
        body:
          'If you already have an employer account, log in and open your HR dashboard. New organizations can reach us at employers@hhhjob.com.'
      }
    ]
  },
  sitemap: {
    title: 'Sitemap',
    eyebrow: 'Navigation',
    summary:
      'Use this page to quickly navigate all major product areas and policy sections.',
    sections: [
      {
        heading: 'Public pages',
        body:
          'Home, authentication pages, and all support/policy pages are publicly accessible.'
      },
      {
        heading: 'Role dashboards',
        body:
          'Student, HR, Admin, Platform, and Audit dashboards are available after authentication with role-based access control.',
        items: ['Student: jobs, applications, alerts', 'HR: openings, candidates, interviews', 'Admin/Platform/Audit: controls, billing, governance']
      },
      {
        heading: 'Support and legal',
        body:
          'Help center, grievances, fraud alerts, privacy policy, and terms are available in the footer section.'
      }
    ]
  },
  credits: {
    title: 'Credits',
    eyebrow: 'Acknowledgements',
    summary:
      'HHH Job is built with modern open-source tools and contributions from our internal product and engineering teams.',
    sections: [
      {
        heading: 'Core stack',
        body:
          'Frontend uses React with role-based routing; backend services are built with Node.js and Supabase for secure persistence.'
      },
      {
        heading: 'Design and operations',
        body:
          'Design, product operations, and QA teams contribute continuously to ensure a stable and consistent hiring experience.',
        items: ['Design system contributors', 'Product owners', 'Engineering and QA']
      },
      {
        heading: 'Third-party assets',
        body:
          'Icons and utility libraries are used under their respective open-source licenses.'
      }
    ]
  },
  'help-center': {
    title: 'Help Center',
    eyebrow: 'Support',
    summary:
      'Find answers for account access, job applications, recruiter workflows, and dashboard-related issues.',
    sections: [
      {
        heading: 'Common help topics',
        body:
          'Password reset, profile completion, application status visibility, and interview notifications are the most frequent support requests.'
      },
      {
        heading: 'Support channels',
        body:
          'Contact support@hhhjob.com for account and technical issues. Include your registered email and issue screenshots for faster resolution.',
        items: ['Email support', 'Issue triage', 'Escalation handling']
      },
      {
        heading: 'Response windows',
        body:
          'Critical access issues are prioritized first. Standard requests are handled in queue order based on severity.'
      }
    ]
  },
  'summons-notices': {
    title: 'Summons / Notices',
    eyebrow: 'Legal',
    summary:
      'This page outlines the official process for legal communications addressed to HHH Job.',
    sections: [
      {
        heading: 'Authorized channel',
        body:
          'All legal notices should be sent to legal@hhhjob.com with complete sender details and supporting documents.'
      },
      {
        heading: 'Required details',
        body:
          'Include your full name, organization details, contact information, case reference number, and clear statement of notice scope.',
        items: ['Identity details', 'Reference numbers', 'Document attachments']
      },
      {
        heading: 'Review process',
        body:
          'Our legal team acknowledges valid notices and responds as per applicable timelines and jurisdictional requirements.'
      }
    ]
  },
  grievances: {
    title: 'Grievances',
    eyebrow: 'Resolution',
    summary:
      'Submit unresolved platform concerns through the grievance process for formal review and closure tracking.',
    sections: [
      {
        heading: 'When to raise a grievance',
        body:
          'Raise a grievance when a support ticket remains unresolved, policy concerns are not addressed, or service commitments are not met.'
      },
      {
        heading: 'How to file',
        body:
          'Email grievances@hhhjob.com with ticket references, issue summary, expected resolution, and supporting evidence.'
      },
      {
        heading: 'Resolution workflow',
        body:
          'Each grievance is logged, assigned, reviewed by responsible teams, and closed only after final response is shared.'
      }
    ]
  },
  'report-issue': {
    title: 'Report an Issue',
    eyebrow: 'Issue Reporting',
    summary:
      'Found a bug, broken flow, or suspicious behavior? Report it here for immediate triage.',
    sections: [
      {
        heading: 'What to include',
        body:
          'Share exact steps to reproduce, expected behavior, actual behavior, browser/device details, and screenshots or screen recordings.',
        items: ['Page URL', 'Time of incident', 'User role and account email']
      },
      {
        heading: 'Where to report',
        body:
          'Send reports to support@hhhjob.com with subject line "Platform Issue". Security-sensitive issues can be sent to security@hhhjob.com.'
      },
      {
        heading: 'After submission',
        body:
          'You will receive a tracking reference. Critical issues are escalated immediately; standard issues are prioritized by impact.'
      }
    ]
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    eyebrow: 'Policy',
    summary:
      'This policy explains what data we collect, how we use it, and the controls available to users.',
    sections: [
      {
        heading: 'Data we collect',
        body:
          'We collect profile details, job activity, and operational telemetry required to deliver platform functionality and security.'
      },
      {
        heading: 'How data is used',
        body:
          'Data is used for authentication, recommendation relevance, hiring workflow operations, and service quality monitoring.',
        items: ['Account security', 'Product functionality', 'Operational analytics']
      },
      {
        heading: 'User controls',
        body:
          'Users can request profile updates and support-led corrections through official support channels.'
      }
    ]
  },
  'terms-and-conditions': {
    title: 'Terms & Conditions',
    eyebrow: 'Policy',
    summary:
      'By using HHH Job, users agree to responsible platform usage, accurate information submission, and policy compliance.',
    sections: [
      {
        heading: 'Account responsibilities',
        body:
          'You are responsible for maintaining account confidentiality, accurate profile information, and lawful usage of platform features.'
      },
      {
        heading: 'Platform usage',
        body:
          'Misuse, impersonation, fraudulent postings, and abusive conduct are prohibited and may lead to access restrictions.'
      },
      {
        heading: 'Service changes',
        body:
          'We may update features and terms as required. Continued usage after updates implies acceptance of revised terms.'
      }
    ]
  },
  'fraud-alert': {
    title: 'Fraud Alert',
    eyebrow: 'Safety',
    summary:
      'Stay safe from recruitment scams. HHH Job never asks users to pay money for guaranteed jobs.',
    sections: [
      {
        heading: 'Common fraud patterns',
        body:
          'Fraudsters may request fees, fake document charges, or direct payments through personal accounts.'
      },
      {
        heading: 'How to protect yourself',
        body:
          'Verify communications through official channels and avoid sharing OTPs, passwords, or sensitive financial details.',
        items: ['Never pay for offers', 'Use verified platform communication', 'Report suspicious requests immediately']
      },
      {
        heading: 'Report fraud',
        body:
          'Send suspicious communication evidence to security@hhhjob.com and include relevant screenshots or email headers.'
      }
    ]
  },
  'trust-and-safety': {
    title: 'Trust & Safety',
    eyebrow: 'Safety',
    summary:
      'Trust and safety practices help maintain a reliable ecosystem for students, recruiters, and partner organizations.',
    sections: [
      {
        heading: 'Safety standards',
        body:
          'We enforce role-based access, workflow accountability, and operational checks to reduce misuse and policy violations.'
      },
      {
        heading: 'Risk monitoring',
        body:
          'Audit logs, security checks, and issue escalation workflows are used to detect anomalies and respond quickly.'
      },
      {
        heading: 'Your contribution',
        body:
          'Users strengthen platform safety by reporting abuse, keeping account details secure, and following policy guidelines.'
      }
    ]
  }
};
