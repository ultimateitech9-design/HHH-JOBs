import { Link } from 'react-router-dom';
import { FiArrowRight, FiBarChart2, FiBell, FiBookmark, FiBriefcase, FiFileText, FiLayers, FiShield, FiTrendingUp } from 'react-icons/fi';
import SectionHeader from '../../../shared/components/SectionHeader';
import { getCurrentUser } from '../../../utils/auth';
import './ServicesPage.css';

const serviceCards = [
  {
    title: 'Job Discovery',
    description: 'Smart job search and personalized job recommendations',
    icon: FiBriefcase
  },
  {
    title: 'Resume & Profile',
    description: 'Build, review and boost your resume & profile visibility',
    icon: FiFileText
  },
  {
    title: 'Career Growth',
    description: 'Prepare for interviews and assess your skills',
    icon: FiTrendingUp
  },
  {
    title: 'Alerts & Notifications',
    description: 'Get smart job alerts and track your applications',
    icon: FiBell
  }
];

const premiumTabs = ['Fast Track Application', 'Direct Recruiter Connect', 'Profile Priority Ranking'];
const premiumCards = [
  { title: 'Fast Track Application', subtitle: 'Priority application boost', icon: FiLayers },
  { title: 'Resume Highlight', subtitle: 'Applied jobs status', icon: FiFileText },
  { title: 'Profile Priority Ranking', subtitle: 'Recruiter viewed profile', icon: FiShield }
];

const studentServicePaths = {
  'Job Discovery': '/portal/student/jobs',
  'Resume & Profile': '/portal/student/profile',
  'Career Growth': '/portal/student/analytics',
  'Alerts & Notifications': '/portal/student/alerts',
  'ATS Resume Score': '/portal/student/ats'
};

const ServicesPage = () => {
  const user = getCurrentUser();
  const isStudent = user?.role === 'student';
  const isHr = user?.role === 'hr' || user?.role === 'admin';
  const fallbackPath = '/login';
  const getServicePath = (title) => (isStudent ? (studentServicePaths[title] || '/portal/student/dashboard') : fallbackPath);
  const atsPath = isStudent ? '/portal/student/ats' : isHr ? '/portal/hr/ats' : '/login';

  return (
    <div className="module-page module-page--services services-page">
      <SectionHeader
        eyebrow="Career Services"
        title="Boost Your Career with Smart Tools"
        subtitle="Discover services for discovery, resume strength, alerts, and recruiter visibility."
      />

      <section className="nks-services">
        <div className="nks-hero">
          <div className="nks-hero-copy">
            <h2>Boost Your Career with Smart Tools</h2>
            <p>Discover powerful services designed to help you land your dream job faster</p>
            <Link to="/portal/student/jobs" className="nks-btn-main">Explore Services</Link>
          </div>
          <div className="nks-hero-visual" aria-hidden="true">
            <div className="nks-orb" />
            <div className="nks-anime-wrap">
              <img src="/images/login-hero-3d.webp" alt="" className="nks-anime" />
            </div>
          </div>
        </div>

        <div className="nks-grid">
          {serviceCards.map(({ title, description, icon: Icon }) => (
            <Link key={title} to={getServicePath(title)} className="nks-card nks-card--link">
              <span className="nks-card-icon"><Icon size={24} /></span>
              <h3>{title}</h3>
              <p>{description}</p>
              <span className="nks-card-cta">Learn More <FiArrowRight size={16} /></span>
            </Link>
          ))}
        </div>

        <Link to={atsPath} className="nks-card nks-card--link nks-card--full">
          <span className="nks-card-icon"><FiBarChart2 size={24} /></span>
          <h3>ATS Resume Score</h3>
          <p>Check resume ATS score instantly and get actionable improvement tips.</p>
          <span className="nks-card-cta">Check Score <FiArrowRight size={16} /></span>
        </Link>

        <article className="nks-premium">
          <div className="nks-premium-banner">
            <h3>Upgrade to Premium &amp; Get Hired Faster</h3>
            <p>Fast Track Application • Direct Recruiter Connect • Resume Highlight</p>
            <Link to="/sign-up" className="nks-btn-main">Go Premium</Link>
            <span className="nks-rocket" aria-hidden="true">🚀</span>
          </div>

          <div className="nks-tabs">
            {premiumTabs.map((tab) => (
              <span key={tab}><FiBookmark size={16} /> {tab}</span>
            ))}
          </div>

          <div className="nks-premium-grid">
            {premiumCards.map(({ title, subtitle, icon: Icon }) => (
              <div key={title} className="nks-premium-card">
                <span><Icon size={22} /></span>
                <h4>{title}</h4>
                <p>{subtitle}</p>
                <Link to="/portal/student/profile">Learn More <FiArrowRight size={16} /></Link>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default ServicesPage;
