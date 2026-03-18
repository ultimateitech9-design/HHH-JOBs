import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiBarChart2, FiBell, FiBookmark, FiBriefcase, FiCheckSquare, FiCircle, FiFileText, FiLayers, FiShield, FiTrendingUp } from 'react-icons/fi';
import { FaGem, FaMedal } from 'react-icons/fa';
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

const premiumFeatures = [
  {
    key: 'fast-track',
    tabLabel: 'Fast Track Application',
    title: 'Fast Track Application',
    subtitle: 'Priority application boost',
    description: 'Get your applications surfaced quickly for recruiter shortlisting windows.',
    icon: FiLayers
  },
  {
    key: 'direct-connect',
    tabLabel: 'Direct Recruiter Connect',
    title: 'Direct Recruiter Connect',
    subtitle: 'Applied jobs status',
    description: 'Get faster updates and stronger visibility in recruiter activity queues.',
    icon: FiFileText
  },
  {
    key: 'profile-priority',
    tabLabel: 'Profile Priority Ranking',
    title: 'Profile Priority Ranking',
    subtitle: 'Recruiter viewed profile',
    description: 'Boost profile discovery for relevant openings and premium searches.',
    icon: FiShield
  }
];

const jobPostingPlans = [
  {
    title: 'Premium',
    tone: 'premium',
    price: '₹1,200',
    previousPrice: '₹2,000',
    discountText: '40% OFF',
    taxNote: '*GST as applicable',
    features: [
      { label: 'Detailed job description', included: true },
      { label: '20 job locations', included: true },
      { label: 'Unlimited applies', included: true },
      { label: 'Applies expiry 90 days', included: true },
      { label: 'Jobseeker contact details visible', included: true },
      { label: 'Boost on Job Search Page', included: true },
      { label: 'Job Branding', included: true }
    ],
    offerText: 'Flat 10% OFF on 5 Job Postings or more',
    ctaLabel: 'Buy now',
    ctaTo: '/sign-up?plan=Premium',
    withQuantity: true,
    validity: 'Job validity 30 days'
  },
  {
    title: 'Pro',
    tone: 'pro',
    price: '₹600',
    previousPrice: '₹1000',
    discountText: '40% OFF',
    taxNote: '*GST as applicable',
    features: [
      { label: 'Upto 250 character job description', included: true },
      { label: '8 job locations', included: true },
      { label: 'Unlimited applies', included: true },
      { label: 'Applies expiry 60 days', included: true },
      { label: 'Jobseeker contact details visible', included: true },
      { label: 'Boost on Job Search Page', included: false },
      { label: 'Job Branding', included: false }
    ],
    offerText: 'Flat 10% OFF on 5 Job Postings or more',
    ctaLabel: 'Buy now',
    ctaTo: '/sign-up?plan=Pro',
    withQuantity: true,
    validity: 'Job validity 30 days'
  },
  {
    title: 'Standard',
    tone: 'standard',
    price: '₹300',
    previousPrice: '₹500',
    discountText: '40% OFF',
    taxNote: '*GST as applicable',
    features: [
      { label: 'Upto 250 character job description', included: true },
      { label: '3 job locations', included: true },
      { label: '200 applies', included: true },
      { label: 'Applies expiry 30 days', included: true },
      { label: 'Jobseeker contact details visible', included: false },
      { label: 'Boost on Job Search Page', included: false },
      { label: 'Job Branding', included: false }
    ],
    offerText: 'Flat 10% OFF on 5 Job Postings or more',
    ctaLabel: 'Buy now',
    ctaTo: '/sign-up?plan=Standard',
    withQuantity: true,
    validity: 'Job validity 15 days'
  },
  {
    title: 'Free',
    tone: 'free',
    price: 'Free',
    subTitle: 'Job Posting',
    features: [
      { label: 'Upto 250 character job description', included: true },
      { label: '1 job location', included: true },
      { label: '50 applies', included: true },
      { label: 'Applies expiry 15 days', included: true },
      { label: 'Jobseeker contact details visible', included: false },
      { label: 'Boost on Job Search Page', included: false },
      { label: 'Job Branding', included: false }
    ],
    ctaLabel: 'Post a free job',
    ctaTo: '/sign-up?plan=Free',
    withQuantity: false,
    validity: 'Job validity 7 days'
  }
];

const resumeDatabasePlans = [
  {
    title: 'Gold',
    tone: 'gold',
    icon: FaMedal,
    subTitle: 'Best for small and medium businesses with focused hiring needs',
    price: '₹3,600',
    taxNote: '*GST as applicable',
    offerText: 'Flat ₹1,500 OFF on purchasing 3 requirements',
    features: [
      '150 CV views per requirement',
      'Up to 600 search results',
      'Candidates active in last 6 months',
      '10+ advanced filters',
      'Single user access',
      '1 search query (role, location) per requirement'
    ],
    ctaLabel: 'Buy now',
    ctaTo: '/sign-up?plan=Gold',
    validity: 'Database validity 15 days',
    withQuantity: true
  },
  {
    title: 'Dimond',
    tone: 'dimond',
    icon: FaGem,
    subTitle: 'Get customised solutions and dedicated support for bigger hiring needs',
    price: "Let's customize",
    taxNote: 'Based on your plan',
    features: [
      'CV views as per plan',
      'Unlimited search results',
      'All available candidates',
      '20+ advanced filters',
      'Multiple user access',
      'Email multiple candidates together',
      'Boolean keyword search',
      'Download CVs in bulk'
    ],
    ctaLabel: 'Contact sales',
    ctaTo: '/contact-us?source=dimond-plan',
    validity: 'Database validity as per the plan',
    withQuantity: false
  }
];

const studentServicePaths = {
  'Job Discovery': '/portal/student/jobs',
  'Resume & Profile': '/portal/student/profile?section=resume&focus=resume-builder#resume-builder',
  'Career Growth': '/portal/student/analytics',
  'Alerts & Notifications': '/portal/student/alerts',
  'ATS Resume Score': '/portal/student/ats'
};

const ServicesPage = () => {
  const user = getCurrentUser();
  const isStudent = user?.role === 'student';
  const isHr = user?.role === 'hr' || user?.role === 'admin';
  const fallbackPath = '/login';
  const [activePremiumKey, setActivePremiumKey] = useState(premiumFeatures[0].key);
  const getServicePath = (title) => (isStudent ? (studentServicePaths[title] || '/portal/student/dashboard') : fallbackPath);
  const atsPath = isStudent ? '/portal/student/ats' : isHr ? '/portal/hr/ats' : '/login';
  const premiumCtaPath = isStudent ? '/contact-us' : isHr ? '/portal/hr/jobs' : '/sign-up';
  const premiumLearnMorePath = (featureKey) => {
    if (isStudent) {
      if (featureKey === 'fast-track') return '/portal/student/jobs';
      if (featureKey === 'direct-connect') return '/portal/student/applications';
      if (featureKey === 'profile-priority') return '/portal/student/profile?section=resume&focus=resume-builder#resume-builder';
      return '/portal/student/dashboard';
    }
    if (isHr) return '/portal/hr/jobs';
    return '/sign-up';
  };
  const activePremiumFeature = premiumFeatures.find((feature) => feature.key === activePremiumKey) || premiumFeatures[0];

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
            <p>{activePremiumFeature.title} • {activePremiumFeature.subtitle}</p>
            <Link to={premiumCtaPath} className="nks-btn-main">Go Premium</Link>
            <span className="nks-rocket" aria-hidden="true">🚀</span>
          </div>

          <div className="nks-tabs">
            {premiumFeatures.map((feature) => (
              <button
                key={feature.key}
                type="button"
                className={feature.key === activePremiumKey ? 'is-active' : ''}
                onClick={() => setActivePremiumKey(feature.key)}
              >
                <FiBookmark size={16} /> {feature.tabLabel}
              </button>
            ))}
          </div>

          <div className="nks-premium-grid">
            {premiumFeatures.map(({ key, title, subtitle, description, icon: Icon }) => (
              <article
                key={key}
                className={`nks-premium-card ${key === activePremiumKey ? 'is-active' : ''}`}
                onClick={() => setActivePremiumKey(key)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setActivePremiumKey(key);
                  }
                }}
              >
                <span><Icon size={22} /></span>
                <h4>{title}</h4>
                <p>{subtitle}</p>
                <small>{description}</small>
                <Link to={premiumLearnMorePath(key)}>Learn More <FiArrowRight size={16} /></Link>
              </article>
            ))}
          </div>
        </article>

        <section className="nks-plans-block">
          <p className="nks-plans-kicker">Job Posting</p>
          <h3>Attract candidates</h3>
          <p>with quick and easy plans on India&apos;s leading job site</p>
          <div className="nks-plans-grid">
            {jobPostingPlans.map((plan) => (
              <article key={plan.title} className={`nks-plan-card nks-plan-card--${plan.tone}`}>
                <h4>{plan.title}</h4>
                <strong>{plan.price}</strong>
                {plan.previousPrice ? (
                  <p className="nks-plan-price-row">
                    <s>{plan.previousPrice}</s>
                    <span>{plan.discountText}</span>
                  </p>
                ) : null}
                <small>{plan.taxNote || plan.subTitle}</small>
                <div className="nks-plan-divider" />
                <p className="nks-plan-feature-title">Key Features</p>
                {plan.offerText ? <p className="nks-plan-offer">{plan.offerText}</p> : null}
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature.label} className={feature.included ? '' : 'is-disabled'}>
                      {feature.included ? <FiCheckSquare size={13} /> : <FiCircle size={12} />}
                      <span>{feature.label}</span>
                    </li>
                  ))}
                </ul>
                <div className="nks-plan-divider" />
                <div className="nks-plan-footer">
                  {plan.withQuantity ? (
                    <div className="nks-plan-actions">
                      <label className="nks-plan-qty" aria-label={`${plan.title} quantity`}>
                        <select defaultValue="01">
                          <option value="01">01</option>
                          <option value="02">02</option>
                          <option value="03">03</option>
                          <option value="04">04</option>
                          <option value="05">05</option>
                        </select>
                      </label>
                      <Link to={plan.ctaTo}>{plan.ctaLabel}</Link>
                    </div>
                  ) : (
                    <Link to={plan.ctaTo}>{plan.ctaLabel}</Link>
                  )}
                  <p className="nks-plan-validity">{plan.validity}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="nks-resume-db-block">
          <h3>Search India&apos;s largest resume database</h3>
          <p>by location, industry, skills, and more to find the right fit</p>
          <div className="nks-resume-db-grid">
            {resumeDatabasePlans.map((plan) => {
              const Icon = plan.icon;
              return (
              <article key={plan.title} className={`nks-resume-db-card nks-resume-db-card--${plan.tone}`}>
                <h4>
                  <span className="nks-resume-db-title-icon" aria-hidden="true"><Icon size={18} /></span>
                  <span>{plan.title}</span>
                </h4>
                <p className="nks-resume-db-subtitle">{plan.subTitle}</p>
                <strong>{plan.price}</strong>
                <small>{plan.taxNote}</small>
                {plan.offerText ? <p className="nks-plan-offer">{plan.offerText}</p> : null}
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}><FiCheckSquare size={13} /> {feature}</li>
                  ))}
                </ul>
                {plan.withQuantity ? (
                  <div className="nks-plan-actions">
                    <label className="nks-plan-qty" aria-label={`${plan.title} quantity`}>
                      <select defaultValue="01">
                        <option value="01">01</option>
                        <option value="02">02</option>
                        <option value="03">03</option>
                        <option value="04">04</option>
                        <option value="05">05</option>
                      </select>
                    </label>
                    <Link to={plan.ctaTo}>{plan.ctaLabel}</Link>
                  </div>
                ) : (
                  <Link to={plan.ctaTo}>{plan.ctaLabel}</Link>
                )}
                <p className="nks-plan-validity">{plan.validity}</p>
              </article>
              );
            })}
          </div>
        </section>
      </section>
    </div>
  );
};

export default ServicesPage;
