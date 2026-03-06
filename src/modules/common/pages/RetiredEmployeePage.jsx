import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiShield,
  FiStar,
  FiUsers
} from 'react-icons/fi';
import { getCurrentUser } from '../../../utils/auth';
import './RetiredEmployeePage.css';

const supportCards = [
  {
    title: 'Retirement-Friendly Roles',
    detail: 'Browse opportunities suitable for experienced professionals after retirement.',
    icon: FiUsers
  },
  {
    title: 'Profile Verification',
    detail: 'Show verified work history to improve trust and shortlist chances.',
    icon: FiShield
  },
  {
    title: 'Flexible Work Options',
    detail: 'Find part-time, consulting, and remote assignments based on your pace.',
    icon: FiCheckCircle
  }
];

const roleTracks = [
  {
    title: 'Mentor and Trainer',
    subtitle: 'Share your domain knowledge with junior teams and new hires.',
    tag: 'Flexible Hours',
    icon: FiStar
  },
  {
    title: 'Operations Consultant',
    subtitle: 'Help businesses improve process quality, compliance, and efficiency.',
    tag: 'Consulting',
    icon: FiBriefcase
  },
  {
    title: 'Part-time Administration',
    subtitle: 'Support office operations, documentation, and coordination work.',
    tag: 'Part-time',
    icon: FiFileText
  }
];

const onboardingSteps = [
  {
    title: 'Create Profile',
    detail: 'Add your work history, skills, and preferred work type to get better matches.',
    icon: FiFileText
  },
  {
    title: 'Set Availability',
    detail: 'Choose schedule preference like part-time, project-based, or remote.',
    icon: FiCalendar
  },
  {
    title: 'Apply With Confidence',
    detail: 'Submit to curated roles where senior experience is prioritized.',
    icon: FiArrowRight
  }
];

const faqs = [
  {
    question: 'Can retired employees apply for part-time roles only?',
    answer: 'No. You can apply to part-time, contract, consulting, and full-time roles as per your preference.'
  },
  {
    question: 'Is age a barrier for applications?',
    answer: 'Profiles are matched primarily by experience, role fit, and skills.'
  },
  {
    question: 'Can I update my availability later?',
    answer: 'Yes. You can revise schedule and location preferences any time from your profile.'
  }
];

const RetiredEmployeePage = () => {
  const currentUser = getCurrentUser();
  const exploreJobsPath = currentUser?.role === 'retired_employee'
    ? '/portal/student/dashboard'
    : '/sign-up?role=retired_employee&redirect=%2Fportal%2Fstudent%2Fdashboard';

  return (
    <section className="retired-page">
    <header className="retired-hero">
      <div className="retired-hero-copy">
        <p className="retired-kicker">Retired Employee Program</p>
        <h1>Opportunities For Retired Professionals</h1>
        <p>
          Continue your professional journey with roles that value your experience, reliability, and domain knowledge.
          Explore flexible jobs and consultancy options designed for retired employees.
        </p>
        <div className="retired-actions">
          <Link to={exploreJobsPath}>
            Explore Jobs
          </Link>
        </div>
      </div>
      <div className="retired-hero-panel">
        <h2>Why this section?</h2>
        <ul>
          <li>
            <FiCheckCircle size={15} />
            Senior-experience-focused opportunities
          </li>
          <li>
            <FiCheckCircle size={15} />
            Flexible and part-time role discovery
          </li>
          <li>
            <FiCheckCircle size={15} />
            Career support for second innings
          </li>
        </ul>
        <div className="retired-mini-stats">
          <article>
            <FiClock size={14} />
            <strong>Flexible Timings</strong>
          </article>
          <article>
            <FiShield size={14} />
            <strong>Trusted Employers</strong>
          </article>
        </div>
      </div>
    </header>

    <div className="retired-benefits-grid">
      {supportCards.map((item) => {
        const Icon = item.icon;
        return (
          <article key={item.title} className="retired-card">
            <span className="retired-card-icon"><Icon size={18} /></span>
            <h2>{item.title}</h2>
            <p>{item.detail}</p>
          </article>
        );
      })}
    </div>

    <section className="retired-section">
      <div className="retired-section-head">
        <p>Role Tracks</p>
        <h2>Popular job types for retired candidates</h2>
      </div>
      <div className="retired-role-grid">
        {roleTracks.map((track) => {
          const Icon = track.icon;
          return (
            <article key={track.title} className="retired-role-card">
              <span className="retired-role-icon"><Icon size={18} /></span>
              <h3>{track.title}</h3>
              <p>{track.subtitle}</p>
              <small>{track.tag}</small>
            </article>
          );
        })}
      </div>
    </section>

    <section className="retired-section">
      <div className="retired-section-head">
        <p>Getting Started</p>
        <h2>Start in 3 quick steps</h2>
      </div>
      <div className="retired-steps">
        {onboardingSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <article key={step.title} className="retired-step-card">
              <span className="retired-step-number">{index + 1}</span>
              <span className="retired-step-icon"><Icon size={16} /></span>
              <h3>{step.title}</h3>
              <p>{step.detail}</p>
            </article>
          );
        })}
      </div>
    </section>

    <section className="retired-section retired-faq">
      <div className="retired-section-head">
        <p>FAQs</p>
        <h2>Common questions</h2>
      </div>
      <div className="retired-faq-list">
        {faqs.map((item) => (
          <article key={item.question} className="retired-faq-item">
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="retired-cta">
      <h2>Ready for your second innings career move?</h2>
      <p>Build your profile and apply to experience-based roles in minutes.</p>
      <Link to="/sign-up?role=retired_employee&redirect=%2Fportal%2Fretired%2Fjobs">Create Profile</Link>
    </section>
    </section>
  );
};

export default RetiredEmployeePage;
