export const FOOTER_LINK_COLUMNS = [
  {
    title: '',
    links: [
      { label: 'About us', to: '/about-us', key: 'about-us' },
      { label: 'Contact us', to: '/contact-us', key: 'contact-us' },
      { label: 'Careers', to: '/careers', key: 'careers' },
      { label: 'Employer home', to: '/employer-home', key: 'employer-home' },
      { label: 'Sitemap', to: '/sitemap', key: 'sitemap' },
      { label: 'Blogs', to: '/blog', key: 'blog' }
    ]
  },
  {
    title: '',
    links: [
      { label: 'Help center', to: '/help-center', key: 'help-center' },
      { label: 'Summons/Notices', to: '/summons-notices', key: 'summons-notices' },
      { label: 'Grievances', to: '/grievances', key: 'grievances' },
      { label: 'Report issue', to: '/report-issue', key: 'report-issue' },
      { label: 'Credits', to: '/credits', key: 'credits' },
      { label: 'Employee Verification', to: '/emp-verify', key: 'employee-verification' }
    ]
  },
  {
    title: '',
    links: [
      { label: 'Privacy policy', to: '/privacy-policy', key: 'privacy-policy' },
      { label: 'Terms & conditions', to: '/terms-and-conditions', key: 'terms-and-conditions' },
      { label: 'Fraud alert', to: '/fraud-alert', key: 'fraud-alert' },
      { label: 'Trust & safety', to: '/trust-and-safety', key: 'trust-and-safety' },
      { label: 'Retired Employee', to: '/retired-employee', key: 'retired-employee' }
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
        heading: 'ATS-Friendly Resume Blueprint (2026)',
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
        heading: 'Projects That Recruiters Actually Notice',
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
        heading: 'Interview Preparation in 14 Days',
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
      'Welcome to HHH Jobs, a professional hiring platform designed for clarity, speed, and trust.',
    sections: [
      {
        heading: 'HHH Jobs',
        body:
          'We connect employers and job seekers through a streamlined, transparent, and efficient recruitment experience that removes confusion often associated with traditional hiring.'
      },
      {
        heading: 'Who We Are',
        body:
          'HHH Jobs was created to simplify the hiring process while maintaining professionalism and reliability. We understand employer challenges in finding the right talent and job seeker frustrations around unclear updates, so we bridge this gap with a solution built on trust and efficiency.'
      },
      {
        heading: 'What We Do',
        body:
          'HHH Jobs serves as a reliable connection point between companies and qualified professionals across industries. Our platform is designed to:',
        items: [
          'Provide clear and structured job listings',
          'Ensure faster application and response cycles',
          'Maintain professional communication standards',
          'Promote transparency in hiring'
        ]
      },
      {
        heading: 'Our Approach',
        body:
          'We prioritize simplicity without compromising quality. Every feature is built to reduce delays, remove unnecessary steps, and make hiring straightforward.'
      },
      {
        heading: 'Our Mission',
        body:
          'Our mission is to create a hiring ecosystem where opportunities and talent meet seamlessly. We empower businesses to grow with the right workforce and help individuals advance their careers with confidence.'
      },
      {
        heading: 'Why Choose HHH Jobs?',
        body:
          'Our platform is built on three pillars:',
        items: [
          'Clarity - Clear job requirements, transparent communication, and structured processes.',
          'Speed - Efficient application management and faster employer-candidate connections.',
          'Trust - A professional environment built on credibility and accountability.'
        ]
      },
      {
        heading: 'Closing Note',
        body:
          'Whether you are an employer searching for dependable talent or a professional seeking the right opportunity, HHH Jobs makes the process smooth and effective. At HHH Jobs, hiring is not just about filling positions, it is about building meaningful professional connections.'
      }
    ]
  },
  careers: {
    title: 'Careers at HHH Jobs',
    eyebrow: 'Careers',
    summary:
      'At HHH Jobs, we are shaping the future of recruitment with clarity, speed, and trust.',
    sections: [
      {
        heading: 'Careers at HHH Jobs',
        body:
          'We are not just building a hiring platform, we are building a better hiring experience. To do that, we are looking for passionate, innovative, and dedicated people who want to make a real difference in the world of work.'
      },
      {
        heading: 'Why Work With Us?',
        body:
          'Working at HHH Jobs means being part of a team that values creativity, collaboration, and continuous growth. Great ideas come from diverse perspectives, and every team member contributes to our success.',
        items: [
          'Purpose-Driven Culture - Every role contributes to improving how employers and job seekers connect.',
          'Growth & Learning Opportunities - Build skills, grow professionally, and take on new challenges.',
          'Collaboration & Respect - Work in a culture of teamwork, open communication, and mutual respect.',
          'Innovation & Impact - Bring forward ideas that directly improve our platform and hiring outcomes.'
        ]
      },
      {
        heading: 'Who We Are Looking For',
        body:
          'We welcome talented people across technology, customer success, marketing, operations, and design who are excited to make an impact.',
        items: [
          'Problem solvers who enjoy tackling new challenges',
          'Team players who thrive in collaborative environments',
          'Innovators who push boundaries with fresh ideas',
          'Professionals who embrace quality and integrity'
        ]
      },
      {
        heading: 'Join Our Team',
        body:
          'At HHH Jobs, careers should be fulfilling, dynamic, and rewarding. If you are ready to grow with a company transforming recruitment, explore available opportunities and take the next step in your career.'
      },
      {
        heading: 'Ready to Make an Impact?',
        body:
          'Visit our Careers section to view open roles and apply today. HHH Jobs - where talent meets opportunity.'
      }
    ]
  },
  'employer-home': {
    title: 'Employer Home',
    eyebrow: 'For Employers',
    summary:
      'Welcome to HHH Jobs, your trusted partner for professional and efficient hiring.',
    sections: [
      {
        heading: 'Hire Smarter with HHH Jobs',
        body:
          'Our Employer Home is designed to help businesses of all sizes find the right talent quickly and with confidence, without the confusion and delays often associated with traditional recruitment.'
      },
      {
        heading: 'Who We Support',
        body:
          'Whether you are a startup building your first team or an established company scaling for growth, HHH Jobs provides the tools, clarity, and support you need to hire better.'
      },
      {
        heading: 'What We Offer Employers',
        body:
          'At HHH Jobs, we understand that business success starts with the right people. Our streamlined hiring platform empowers employers with:',
        items: [
          'Clear Job Posting Tools - Create and publish structured listings that highlight key skills, responsibilities, and expectations.',
          'Faster Candidate Connections - Communicate seamlessly with applicants and engage qualified professionals quickly.',
          'Smart Candidate Filtering - Shortlist candidates by skills, experience, and relevance.',
          'Professional Interaction - Use messaging and application tracking features designed for clarity and transparency.'
        ]
      },
      {
        heading: 'Why Employers Choose HHH Jobs',
        body:
          'HHH Jobs is built on three core principles:',
        items: [
          'Clarity - Present opportunities in a clean, structured format so candidates understand exactly what you are looking for.',
          'Speed - Connect with talent faster and reduce time-to-hire with efficient communication and workflow tools.',
          'Trust - Build confidence with candidates through a transparent and professional hiring process.'
        ]
      },
      {
        heading: 'Our Focus',
        body:
          'Our focus is not just to help you find applicants, but to help you find the right applicants.'
      },
      {
        heading: 'A Hiring Platform That Works for You',
        body:
          'With HHH Jobs, recruitment becomes easier and more effective. Our employer-focused features help you:',
        items: [
          'Reach a wide pool of qualified candidates',
          'Manage applications with ease',
          'Communicate directly with prospects',
          'Make informed hiring decisions',
          'Strengthen your workforce'
        ]
      },
      {
        heading: 'Scale with Confidence',
        body:
          'Whether you are hiring for one role or many, HHH Jobs equips you with everything needed to build a strong team and grow your business.'
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
      'At HHH Jobs, we acknowledge the people, technologies, and contributors who make the platform valuable and reliable.',
    sections: [
      {
        heading: 'HHH Jobs',
        body:
          'Our Credits page is dedicated to recognizing efforts across design, development, content, and support. We are grateful for the collective contributions that strengthen our platform for both job seekers and employers.'
      },
      {
        heading: 'Platform Development & Technology',
        body:
          'HHH Jobs is powered by modern technologies and expert development practices that ensure performance, security, and scalability. We appreciate the tools, libraries, frameworks, and services used in building and maintaining our platform, including:',
        items: [
          'Front-end and back-end frameworks',
          'Database and cloud services',
          'API integrations and security protocols',
          'Analytics and performance monitoring tools'
        ]
      },
      {
        heading: 'Technology Impact',
        body:
          'These technologies help us deliver a smooth, secure, and responsive user experience across devices.'
      },
      {
        heading: 'Content, Design & User Experience',
        body:
          'Creating helpful content and intuitive design is fundamental to HHH Jobs. We thank the professionals involved in:',
        items: [
          'Website content writing and editorial guidance',
          'User interface (UI) and visual design',
          'Accessibility, usability, and navigation enhancements',
          'Brand messaging and tone development'
        ]
      },
      {
        heading: 'Experience Outcome',
        body:
          'Their work ensures you have clear information, easy navigation, and a positive experience on every page.'
      },
      {
        heading: 'Partners & Contributors',
        body:
          'We acknowledge the support and collaboration of individuals and organizations who have contributed to HHH Jobs, including:',
        items: [
          'Strategic advisors and industry experts',
          'Beta testers and early adopters who provided valuable feedback',
          'Support team members who assist users every day',
          'Community champions who help spread the word'
        ]
      },
      {
        heading: 'Community Value',
        body:
          'Your input and participation play a key role in shaping the growth and evolution of our platform.'
      },
      {
        heading: 'Sources & Inspiration',
        body:
          'Some aspects of HHH Jobs content and features are inspired by industry standards and best practices in hiring technology, HR trends, and user-centric design. Where applicable, references and credits to specific sources are documented for transparency.'
      },
      {
        heading: 'Thank You',
        body:
          'The success of HHH Jobs is not just about technology, it is about people. We thank everyone involved in the journey so far and those continuing to support our mission of clarity, speed, and trust.'
      },
      {
        heading: 'Closing Note',
        body:
          'Your contribution, whether big or small, makes a difference. HHH Jobs - a collaborative effort by professionals, for professionals.'
      }
    ]
  },
  'help-center': {
    title: 'Help Center',
    eyebrow: 'Support',
    summary:
      'Welcome to the HHH Jobs Help Center, your go-to resource for answers, support, and step-by-step guidance.',
    sections: [
      {
        heading: 'Support & Guidance for Your Hiring Journey',
        body:
          'Whether you are an employer posting your first job, a job seeker navigating applications, or you need help with your HHH Jobs account, we are here to make every step clear, easy, and stress-free.'
      },
      {
        heading: 'What You Will Find Here',
        body:
          'Our Help Center is designed to be intuitive and user-friendly, offering support across key areas:',
        items: [
          'Getting Started - Create your account, build your profile, and navigate the dashboard with confidence.',
          'For Job Seekers - Search jobs, apply with your resume, manage applications, and optimize profile visibility.',
          'For Employers - Post jobs, manage listings, review applicants, use filters, and communicate efficiently.',
          'Account & Settings - Update profile details, reset password, and manage email notifications.',
          'Platform Features - Understand application tracking, messaging, and other platform tools.'
        ]
      },
      {
        heading: 'Common Questions Answered',
        body:
          'Our Help Center provides clear answers to frequently asked questions such as:',
        items: [
          'How do I post a job listing?',
          'How do I edit my profile or job post?',
          'How do I submit or update a job application?',
          'What should I do if I forget my password?',
          'How can I contact support if I need further assistance?'
        ]
      },
      {
        heading: 'Guided Support',
        body:
          'Each topic includes step-by-step guidance so you can find what you need quickly and confidently.'
      },
      {
        heading: 'Need More Help?',
        body:
          'If you do not find the answer you are looking for, our support team is here to assist you. Reach out through the contact form or support link on this page, and a team member will respond promptly.'
      },
      {
        heading: 'Our Commitment',
        body:
          'At HHH Jobs, your satisfaction and success on our platform are top priorities. We are committed to providing helpful, responsive support whenever you need it.'
      },
      {
        heading: 'Get Started',
        body:
          'Browse Help Center topics, follow the guides, and feel confident using HHH Jobs to manage your job search or hiring process. HHH Jobs - where clarity, speed, and trust make hiring easier for everyone.'
      }
    ]
  },
  'summons-notices': {
    title: 'Summons / Notices',
    eyebrow: 'Legal',
    summary:
      'At HHH Jobs, we are committed to transparency and keeping users informed about important legal and policy updates.',
    sections: [
      {
        heading: 'HHH Jobs',
        body:
          'The Summons & Notices page is where we share official legal communications or policy-related notices relevant to our services, terms, or user obligations.'
      },
      {
        heading: 'What Are Summons & Notices?',
        body:
          'A summons is an official communication, typically issued in legal, regulatory, or administrative contexts, that notifies a party about a required action or response. A notice is broader and refers to information shared to alert users about changes, obligations, updates, or actions they may need to take. In legal practice, a summons usually requires a response or appearance, while a notice informs about rights, deadlines, or process changes.',
      },
      {
        heading: 'Why This Page Exists',
        body:
          'While most interactions on HHH Jobs are straightforward and digital, there may be occasions where we need to share formal communications affecting user rights, safety, or compliance. This page serves as the authoritative source for:',
        items: [
          'Official notices regarding changes to policies',
          'Legal summons or court orders served to HHH Jobs',
          'Regulatory communications that affect platform operations',
          'Public updates about service terms, data handling, or compliance requirements'
        ]
      },
      {
        heading: 'How We Share Summons & Notices',
        body:
          'To ensure clarity and accessibility:',
        items: [
          'Summons or notices are published in the form they are officially received',
          'Each communication includes dates, subject matter, and guidance on next steps',
          'Where applicable, we explain what actions users may need to take'
        ]
      },
      {
        heading: 'Our Commitment',
        body:
          'This is part of our commitment to clarity, speed, and trust - our core principles at HHH Jobs.'
      },
      {
        heading: 'Why This Matters',
        body:
          'By making official communications publicly available:',
        items: [
          'You can verify the authenticity and relevance of notices',
          'You have clear information about any legal or policy obligations',
          'You understand how changes may impact your use of the HHH Jobs platform'
        ]
      },
      {
        heading: 'User Benefit',
        body:
          'Staying informed helps protect your rights and ensures compliance with applicable procedures.'
      },
      {
        heading: 'Questions or Support',
        body:
          'If you have questions about a specific summons or notice listed on this page, or if you need clarification on how it affects your account or activity, please contact our support team. We are here to help you understand and navigate any required actions.'
      },
      {
        heading: 'Closing Note',
        body:
          'HHH Jobs - keeping you informed with transparency and professionalism.'
      }
    ]
  },
  grievances: {
    title: 'Grievances',
    eyebrow: 'Resolution',
    summary:
      'At HHH Jobs, we believe in a fair, respectful, and transparent environment for all users.',
    sections: [
      {
        heading: 'HHH Jobs',
        body:
          'Our Grievances page is dedicated to addressing concerns, feedback, and complaints in a structured and supportive way. We understand that issues can arise during the hiring process or while using any online platform. What matters most is how concerns are heard, acknowledged, and resolved.'
      },
      {
        heading: 'What Is a Grievance?',
        body:
          'A grievance is any concern, complaint, or feedback you may have regarding your experience with HHH Jobs. This can include:',
        items: [
          'Issues with job postings or applications',
          'Discrepancies in communication between candidates and employers',
          'Problems navigating the platform',
          'Questions about terms, fees, or account activity',
          'Concerns related to user conduct, policies, or safety'
        ]
      },
      {
        heading: 'Our Assurance',
        body:
          'We take all grievances seriously, no matter how big or small, because your trust is important to us.'
      },
      {
        heading: 'How We Handle Grievances',
        body:
          'Our grievance resolution process is designed to be fair, transparent, and timely:',
        items: [
          '1. Submission - You can submit a grievance through the grievance form on this page or via support contact options. Please provide complete details.',
          '2. Acknowledgment - Our support team confirms receipt and shares next steps with approximate timelines.',
          '3. Review & Assessment - We review all details and may request additional information if needed.',
          '4. Resolution - We address concerns professionally and communicate outcomes clearly.',
          '5. Follow-Up - We continue support for any follow-up questions until the issue is fully addressed.'
        ]
      },
      {
        heading: 'Our Commitment to You',
        body:
          'By providing a structured grievance process, we aim to:',
        items: [
          'Maintain fairness and accountability',
          'Improve user experience',
          'Foster trust and confidence',
          'Address concerns quickly and respectfully'
        ]
      },
      {
        heading: 'Need to Submit a Grievance?',
        body:
          'If you have a concern, question, or complaint, use the grievance form below or contact our support team directly. We are here to listen and assist you with professionalism and care.'
      },
      {
        heading: 'Closing Note',
        body:
          'HHH Jobs - dedicated to fairness and clarity.'
      }
    ]
  },
  'report-issue': {
    title: 'Report an Issue',
    eyebrow: 'Issue Reporting',
    summary:
      'At HHH Jobs, we strive to provide a seamless, professional, and reliable platform for both job seekers and employers.',
    sections: [
      {
        heading: 'HHH Jobs',
        body:
          'We understand that from time to time, you may encounter challenges or unexpected issues while using our services. That is why we have created the Report an Issue page, your direct channel to let us know when something is not right so we can fix it quickly.'
      },
      {
        heading: 'Why Reporting Matters',
        body:
          'Whether it is a technical problem, content discrepancy, or concern about a listing or interaction, reporting issues helps us maintain a safe and efficient hiring environment for everyone.'
      },
      {
        heading: 'What Can You Report?',
        body:
          'You can use this page to report a variety of concerns, including:',
        items: [
          'Technical Glitches - Errors on the site, broken links, login problems, or issues submitting applications or postings.',
          'Incorrect or Suspicious Content - Listings, profiles, or messages that look misleading, inappropriate, or potentially fraudulent.',
          'Policy Violations - Cases where a user may have violated terms of service, community standards, or misused the platform.',
          'Communication Issues - Problems related to messages, responses, or unclear interactions between job seekers and employers.'
        ]
      },
      {
        heading: 'How Reporting Works',
        body:
          'Our process is clear and action-oriented:',
        items: [
          '1. Submit Your Report - Fill out the form on this page with as much detail as possible.',
          '2. Acknowledgment - Our support team confirms receipt and begins review.',
          '3. Investigation - We investigate thoroughly and take appropriate action based on policies and findings.',
          '4. Follow-Up - If needed, we contact you for additional details or provide updates.'
        ]
      },
      {
        heading: 'Your Feedback Helps Us Improve',
        body:
          'By reporting issues, you help us:',
        items: [
          'Enhance platform performance',
          'Remove inappropriate or unsafe content',
          'Maintain a trustworthy community',
          'Improve overall user experience'
        ]
      },
      {
        heading: 'Our Commitment',
        body:
          'We value your trust and take every report seriously.'
      },
      {
        heading: 'Need Additional Support?',
        body:
          'If you are unsure whether your concern should be reported here, or if you need help with something else, reach out through the contact options on our website.'
      },
      {
        heading: 'Closing Note',
        body:
          'Thank you for helping make HHH Jobs a professional, safe, and effective hiring platform. HHH Jobs - where clarity, speed, and trust meet support and reliability.'
      }
    ]
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    eyebrow: 'Policy',
    summary:
      'At HHH Jobs, we are committed to protecting your privacy and handling personal information with care and transparency.',
    sections: [
      {
        heading: 'HHH Jobs',
        body:
          'Effective Date: March 2, 2026. This Privacy Policy explains what data we collect, how we use it, whom we may share it with, how it is protected, and your rights as a user of our platform.'
      },
      {
        heading: '1. Information We Collect',
        body:
          'We may collect personal information that you voluntarily provide when using our services, such as:',
        items: [
          'Name, email address, phone number',
          'Professional or business details (for example, job title and company name)',
          'Login credentials and account profile data',
          'IP address, device and browser information, pages visited, and interaction activity'
        ]
      },
      {
        heading: '2. How Your Information Is Used',
        body:
          'Your information may be used to provide and personalize services, manage your account, communicate updates, facilitate hiring workflows, and improve platform performance. We do not collect more information than needed for these purposes.'
      },
      {
        heading: '3. Sharing Your Information',
        body:
          'HHH Jobs may share your personal data with service providers and partners that help operate the platform, legal authorities when required by law, and other users when you use public features such as job applications. We do not sell your personal data to third parties for commercial purposes.'
      },
      {
        heading: '4. Cookies and Tracking Technologies',
        body:
          'We use cookies and similar technologies to improve user experience, understand site usage, and remember preferences. This may include first-party and third-party cookies. You can manage cookie settings through your browser.'
      },
      {
        heading: '5. Data Security',
        body:
          'We employ reasonable administrative, technical, and physical safeguards to protect your personal data against unauthorized access, loss, or misuse. While no method of transmission or storage is completely secure, we use industry-standard protections to help keep your information safe.'
      },
      {
        heading: '6. Your Rights',
        body:
          'You may have the right to:',
        items: [
          'Access, correct, or delete your personal information',
          'Opt out of marketing communications',
          'Request information about how your data is processed'
        ]
      },
      {
        heading: '7. Changes to This Policy',
        body:
          'We may update this Privacy Policy from time to time to reflect changes in law, technology, or our platform. Any updates will be posted here with the updated effective date.'
      },
      {
        heading: 'Contact Us',
        body:
          'If you have questions about this Privacy Policy or wish to exercise your rights, please contact our support team through the contact details provided on our website.'
      },
      {
        heading: 'Closing Note',
        body:
          'HHH Jobs - your privacy matters.'
      }
    ]
  },
  'terms-and-conditions': {
    title: 'Terms & Conditions',
    eyebrow: 'Policy',
    summary:
      'Welcome to HHH Jobs. These Terms and Conditions govern your use of our website, services, and platform.',
    sections: [
      {
        heading: 'HHH Jobs',
        body:
          'Effective Date: March 2, 2026. By accessing or using HHH Jobs, you agree to abide by these Terms and Conditions, so please read them carefully.'
      },
      {
        heading: '1. Acceptance of Terms',
        body:
          'By using the HHH Jobs platform, including accessing job listings, posting opportunities, submitting applications, or engaging with any feature, you confirm that you accept these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.'
      },
      {
        heading: '2. Who Can Use HHH Jobs',
        body:
          'You must be at least 18 years old or of legal age in your country to use our platform. By creating an account, you represent that you meet this requirement and that all information you provide is accurate and complete.'
      },
      {
        heading: '3. Accounts and Security',
        body:
          'When you register on HHH Jobs, you agree to:',
        items: [
          'Provide truthful and current information',
          'Keep your login credentials confidential',
          'Notify us immediately if your account is compromised'
        ]
      },
      {
        heading: 'Account Responsibility',
        body:
          'You are responsible for all activity that occurs under your account. HHH Jobs is not responsible for unauthorized access due to account misuse.'
      },
      {
        heading: '4. Job Listings and Applications',
        body:
          'Employers posting job opportunities must provide accurate, lawful, and non-discriminatory information. Job seekers must submit truthful and relevant details when applying. HHH Jobs is a platform provider, not an employer or recruiter. We facilitate connections between employers and candidates but do not guarantee employment, placement, or suitability of any job or applicant.'
      },
      {
        heading: '5. User Conduct',
        body:
          'While using HHH Jobs, you agree to:',
        items: [
          'Communicate respectfully with other users',
          'Avoid harassment, abuse, or discriminatory behaviour',
          'Not upload harmful, misleading, or illegal content',
          'Comply with all applicable laws'
        ]
      },
      {
        heading: 'Policy Enforcement',
        body:
          'We may suspend or terminate accounts that violate these standards.'
      },
      {
        heading: '6. Content Ownership and Use',
        body:
          'All content on HHH Jobs, including text, graphics, logos, and software, is owned by HHH Jobs or its partners. You may not copy, reproduce, or distribute content without written permission, except as necessary for platform use, such as applying for a job.'
      },
      {
        heading: '7. Limitation of Liability',
        body:
          'HHH Jobs provides the platform "as is" and does not guarantee that the site will be error-free or uninterrupted. We are not responsible for:',
        items: [
          'Employment outcomes',
          'Accuracy of third-party content',
          'Losses resulting from use of the platform'
        ]
      },
      {
        heading: 'Liability Cap',
        body:
          'To the maximum extent permitted by law, our liability is limited.'
      },
      {
        heading: '8. Termination',
        body:
          'HHH Jobs may suspend or terminate your access if:',
        items: [
          'You violate these terms',
          'We suspect fraudulent or harmful activity',
          'Required by law or safety reasons'
        ]
      },
      {
        heading: 'Termination Effect',
        body:
          'Termination does not affect rights or obligations incurred before termination.'
      },
      {
        heading: '9. Changes to Terms',
        body:
          'We may update these Terms and Conditions from time to time. Updated terms will be posted on this page with a revised effective date. Continued use of the platform after changes means you accept the updated terms.'
      },
      {
        heading: '10. Governing Law',
        body:
          'These Terms and Conditions are governed by the laws of the jurisdiction where HHH Jobs operates. Any legal disputes will be subject to applicable law and competent courts.'
      },
      {
        heading: 'Contact Us',
        body:
          'If you have questions or concerns about these Terms and Conditions, reach out to our support team through the contact options on our website. HHH Jobs power hiring with trust and clarity.'
      }
    ]
  },
  'fraud-alert': {
    title: 'Fraud Alert',
    eyebrow: 'Safety',
    summary:
      'At HHH Jobs, your security and trust are top priorities in every hiring interaction.',
    sections: [
      {
        heading: 'HHH Jobs',
        body:
          'While most job seekers and employers use our platform safely and professionally, online hiring environments can sometimes attract fraudulent activity. This page helps you stay informed, vigilant, and protected against scams, misleading offers, and suspicious behaviour.'
      },
      {
        heading: 'What Is Fraud?',
        body:
          'Fraud refers to deceptive actions or schemes designed to mislead users for personal or financial gain. In a job marketplace, fraudulent activity can include:',
        items: [
          'Fake job postings that request payment or personal details',
          'Offers that seem too good to be true',
          'Requests for money, gift cards, or sensitive information',
          'Unverified recruiters or unsolicited contact from unknown sources'
        ]
      },
      {
        heading: 'Policy Position',
        body:
          'These activities are not permitted on HHH Jobs and are strictly against our policies.'
      },
      {
        heading: 'How to Spot Fraudulent Activity',
        body:
          'Being alert to red flags can help you protect yourself. Watch out for:',
        items: [
          'Unusual Payment Requests - Legitimate employers will never ask for money to apply, secure a position, or access training.',
          'Requests for Sensitive Information Upfront - Be cautious if someone asks for bank details, tax ID, or private data before a formal hiring process.',
          'Poor Grammar or Unprofessional Communication - Fake offers often contain vague messages, unclear descriptions, or unofficial channels.',
          'Unrealistic Salary Promises - Exceptionally high pay promises with little effort may indicate a scam.'
        ]
      },
      {
        heading: 'How HHH Jobs Helps Protect You',
        body:
          'We use a combination of technology and policy safeguards:',
        items: [
          'Monitoring and filtering of suspicious listings or accounts',
          'Verification practices for employer profiles',
          'Secure communication channels within the platform',
          'Reporting tools that let you flag concerns immediately'
        ]
      },
      {
        heading: 'Shared Responsibility',
        body:
          'Fraud prevention is a shared responsibility, and your awareness plays a key role.'
      },
      {
        heading: 'What to Do If You Encounter Fraud',
        body:
          'If you believe you have encountered a fraudulent employer, message, job post, or user:',
        items: [
          'Do not respond further to suspicious communication',
          'Report the issue immediately using platform reporting tools or the contact form on this page',
          'Provide details such as screenshots, usernames, and descriptions to support investigation'
        ]
      },
      {
        heading: 'Our Response',
        body:
          'We take all reports seriously and act promptly to protect our community.'
      },
      {
        heading: 'Stay Safe and Secure',
        body:
          'Fraud prevention helps ensure:',
        items: [
          'Employers find quality candidates without disruption',
          'Job seekers pursue genuine opportunities',
          'The HHH Jobs community remains professional and trustworthy'
        ]
      },
      {
        heading: 'Need Help?',
        body:
          'If you need help identifying a suspicious offer or have questions about our safety measures, our support team is here to assist you.'
      },
      {
        heading: 'Closing Note',
        body:
          'HHH Jobs - committed to your security and trust.'
      }
    ]
  },
  'trust-and-safety': {
    title: 'Trust & Safety',
    eyebrow: 'Safety',
    summary:
      'At HHH Jobs, trust and safety are central to creating a secure, respectful, and transparent hiring platform.',
    sections: [
      {
        heading: 'HHH Jobs',
        body:
          'At HHH Jobs, your trust and safety are at the heart of everything we do. Whether you are searching for the right job or seeking quality candidates, we strive to provide a secure, respectful, and transparent environment across our platform. Our Trust & Safety page explains how we protect our users, maintain integrity, and promote a professional hiring experience you can depend on.'
      },
      {
        heading: 'Our Commitment to Safety',
        body:
          'We understand that online hiring involves sensitive information, personal communication, and real career opportunities. That is why we prioritize safety practices that protect:',
        items: [
          'Your personal data and privacy',
          'The authenticity of job listings and user profiles',
          'Communications between employers and job seekers',
          'Fair and respectful interactions'
        ]
      },
      {
        heading: 'How We Keep HHH Jobs Secure',
        body:
          'To maintain a safe platform, we employ a combination of advanced technology and proactive policies:',
        items: [
          'Identity Verification - We encourage users to provide accurate information and employ measures to reduce fake profiles or fraudulent activity.',
          'Secure Data Practices - We use industry-standard safeguards to protect your data, including encryption, secure protocols, and responsible storage practices.',
          'Monitoring & Review - Our team continually monitors activity to detect unusual behavior, inappropriate content, or policy violations.',
          'Reporting Tools - If you encounter suspicious listings, inappropriate messages, or violations of our standards, you can report them easily and our support team will investigate promptly.'
        ]
      },
      {
        heading: 'Policies You Can Trust',
        body:
          'Our platform operates under clear and transparent policies, including:',
        items: [
          'Terms of Use - Defines user rights and responsibilities',
          'Privacy Policy - Details how your data is used, stored, and protected',
          'Community Standards - Ensures respectful and appropriate interactions',
          'Content Guidelines - Helps maintain quality and relevance of job postings'
        ]
      },
      {
        heading: 'Your Role in a Safe Community',
        body:
          'Trust and safety is a shared responsibility. As a user of HHH Jobs:',
        items: [
          'Provide honest and complete information',
          'Respect others in communication and conduct',
          'Report concerns you may encounter',
          'Follow guidelines and platform rules'
        ]
      },
      {
        heading: 'Need Assistance?',
        body:
          'If you have questions about safety practices, privacy concerns, or need help reporting an issue, our support team is here to help. We take every concern seriously and will respond with care and professionalism.'
      },
      {
        heading: 'Our Promise',
        body:
          'At HHH Jobs, we believe that trust is earned and safety is essential. We are committed to protecting you while helping you find opportunities and talent with confidence.'
      }
    ]
  }
};
