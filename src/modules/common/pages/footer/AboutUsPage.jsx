import { Link } from 'react-router-dom';
import './AboutPage.css';

const keyMetrics = [
  { label: 'Multi-industry Coverage', value: '12+ Sectors' },
  { label: 'Core User Groups', value: 'Candidates + Employers' },
  { label: 'Hiring Visibility', value: 'End-to-End Tracking' }
];

const pillars = [
  {
    title: 'Executive Summary',
    text: 'HHH Job is built to reduce hiring friction with a clear, measurable, and structured recruitment journey.'
  },
  {
    title: 'Mission',
    text: 'Deliver faster candidate-employer matching with transparent workflows and practical decision support.'
  },
  {
    title: 'Vision',
    text: 'Become the most trusted operating layer for modern recruitment across growth and enterprise teams.'
  }
];

const capabilities = [
  'Verified employer onboarding and role publishing standards',
  'Role-fit discovery using profile, skill, location, and experience signals',
  'Application pipeline tracking from apply to final decision',
  'Interview scheduling and status updates from one shared workflow',
  'Operational controls for HR and admin across hiring stages',
  'Candidate-first communication with transparent progress visibility'
];

const industries = [
  'IT & Software',
  'Hotel & Hospitality',
  'BPO & Support',
  'Sales & Marketing',
  'Retail & Operations',
  'Healthcare',
  'Logistics',
  'Security',
  'Fresher Roles',
  'Part-Time Jobs',
  'Contract Staffing',
  'Back Office'
];

const roadmap = [
  {
    phase: 'Phase 1',
    title: 'Discover',
    text: 'Profile readiness, job discovery, and high-intent applications.'
  },
  {
    phase: 'Phase 2',
    title: 'Evaluate',
    text: 'Screening, shortlisting, and interview planning with full visibility.'
  },
  {
    phase: 'Phase 3',
    title: 'Close',
    text: 'Decision workflow, candidate communication, and hiring closure.'
  }
];

const governancePoints = [
  'Structured data capture for better candidate quality review',
  'Clear status transitions to avoid hiring communication gaps',
  'Audit-friendly process view for consistent recruitment operations'
];

const AboutUsPage = () => {
  return (
    <section className="about-page">
      <header className="about-hero">
        <div>
          <p className="about-kicker">About HHH Job</p>
          <h1>A Professional Hiring Platform Designed For Clarity, Speed, and Trust</h1>
          <p className="about-subtitle">
            HHH Job helps candidates find better-fit opportunities and enables employers to manage hiring with
            structure. The platform is designed as a practical operating model, not just a job listing page.
          </p>
          <div className="about-metrics">
            {keyMetrics.map((item) => (
              <article key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
        </div>
        <div className="about-hero-media">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1280&q=80"
            alt="Professional hiring discussion"
            loading="lazy"
          />
        </div>
      </header>

      <section className="about-section">
        <h2>Company Positioning</h2>
        <div className="about-grid-3">
          {pillars.map((item) => (
            <article key={item.title} className="about-card">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2>Platform Capabilities</h2>
        <ul className="about-list">
          {capabilities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="about-section">
        <h2>Industry Coverage</h2>
        <p className="about-note">HHH Job supports both entry-level and experienced hiring across high-demand categories.</p>
        <div className="about-tags">
          {industries.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2>Operating Model</h2>
        <div className="about-grid-3">
          {roadmap.map((item) => (
            <article key={item.phase} className="about-card about-card--phase">
              <p className="about-phase">{item.phase}</p>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2>Governance and Trust</h2>
        <ul className="about-list">
          {governancePoints.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="about-cta">
        <h2>Build Your Hiring Momentum With HHH Job</h2>
        <p>For candidates and employers, every stage is designed for predictable outcomes and faster decisions.</p>
        <div className="about-cta-actions">
          <Link to="/portal/student/jobs">Explore Jobs</Link>
          <Link to="/sign-up">Create Account</Link>
        </div>
      </section>
    </section>
  );
};

export default AboutUsPage;
