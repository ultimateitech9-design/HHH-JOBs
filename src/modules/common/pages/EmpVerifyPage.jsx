import { FiArrowUpRight, FiCheckCircle, FiClock, FiGlobe, FiLock, FiShield } from 'react-icons/fi';
import './EmpVerifyPage.css';

const highlights = [
  {
    title: 'Automated Verification Flow',
    detail: 'Employee and employer checks run through a structured digital process for faster decisions.',
    icon: FiCheckCircle
  },
  {
    title: 'Fast Turnaround',
    detail: 'The platform messaging emphasizes quick verification results to reduce hiring delays.',
    icon: FiClock
  },
  {
    title: 'Security-First Approach',
    detail: 'Eimager positions itself around secure handling of verification data and compliant processing.',
    icon: FiLock
  },
  {
    title: 'Multi-Industry Coverage',
    detail: 'The website references support across sectors such as IT, finance, healthcare, logistics, and more.',
    icon: FiGlobe
  }
];

const processSteps = [
  'Create organization account and submit candidate details.',
  'Run automated background checks and document validation.',
  'Review generated verification reports and flags.',
  'Proceed with hiring decisions using verified records.'
];

const industries = [
  'IT & Tech',
  'Finance & Banking',
  'Healthcare',
  'Education',
  'Retail & Lifestyle',
  'Hospitality',
  'BPO',
  'Logistics',
  'Manufacturing',
  'Aviation'
];

const EmpVerifyPage = () => (
  <section className="emp-verify-page">
    <header className="emp-verify-hero">
      <div className="emp-verify-hero-copy">
        <p className="emp-verify-kicker">Emp Verify</p>
        <h1>Employee Verification With Eimager</h1>
        <p>
          This page summarizes key details from the Eimager platform so teams can quickly understand what Emp Verify is
          for and how it helps reduce hiring risk through structured background verification.
        </p>
        <div className="emp-verify-actions">
          <a href="https://www.eimager.com/" target="_blank" rel="noreferrer">
            Visit Eimager <FiArrowUpRight size={16} />
          </a>
          <a href="https://eimager.com/about" target="_blank" rel="noreferrer" className="is-secondary">
            Read About Page <FiArrowUpRight size={16} />
          </a>
        </div>
      </div>
      <div className="emp-verify-hero-panel">
        <img src="https://www.eimager.com/images/logo.png" alt="Eimager logo" />
        <ul>
          <li>
            <FiShield size={15} />
            Background verification focus for employers and professionals
          </li>
          <li>
            <FiShield size={15} />
            Claims around fast checks, secure flow, and trust-led hiring
          </li>
          <li>
            <FiShield size={15} />
            Support messaging for 24x7 response and multi-industry use
          </li>
        </ul>
      </div>
    </header>

    <section className="emp-verify-brand-showcase">
      <div className="emp-verify-brand-showcase-image">
        <img src="/images/emiger.png" alt="Eimager brand visual" />
      </div>
      <div className="emp-verify-brand-showcase-copy">
        <h2>Verified Brand Snapshot</h2>
        <p>Official Eimager visual is highlighted here for quick recognition and stronger trust context.</p>
      </div>
    </section>

    <div className="emp-verify-grid">
      {highlights.map((item) => {
        const Icon = item.icon;
        return (
          <article key={item.title} className="emp-verify-card">
            <span className="emp-verify-card-icon"><Icon size={18} /></span>
            <h2>{item.title}</h2>
            <p>{item.detail}</p>
          </article>
        );
      })}
    </div>

    <section className="emp-verify-section">
      <h2>How It Works (Quick View)</h2>
      <ol>
        {processSteps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </section>

    <section className="emp-verify-section">
      <h2>Industries Mentioned on Eimager</h2>
      <div className="emp-verify-tags">
        {industries.map((industry) => (
          <span key={industry}>{industry}</span>
        ))}
      </div>
    </section>
  </section>
);

export default EmpVerifyPage;
