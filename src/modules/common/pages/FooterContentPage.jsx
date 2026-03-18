import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBarChart2, FiBriefcase, FiHeadphones, FiInfo, FiMail } from 'react-icons/fi';
import { FOOTER_LINK_COLUMNS, FOOTER_PAGE_CONTENT } from './footerPages';
import './FooterContentPage.css';
import './footer/AboutPage.css';
import './footer/ReportIssuePage.css';

const aboutHeroMetrics = [
  { value: '12+ Sectors', label: 'Multi-industry Coverage' },
  { value: 'Candidates + Employers', label: 'Core User Groups' },
  { value: 'End-to-End Tracking', label: 'Hiring Visibility' }
];

const FALLBACK_PAGE = {
  title: 'Information Page',
  eyebrow: 'Footer',
  summary: 'The requested content is not available right now.',
  sections: [
    {
      heading: 'Need assistance?',
      body:
        'Please explore related footer links below or contact support@hhh-jobs.com if you need immediate help.'
    }
  ]
};

const getRelatedLinks = (pageKey) =>
  FOOTER_LINK_COLUMNS.flatMap((column) => column.links)
    .filter((link) => link.key !== pageKey)
    .slice(0, 8);

const FooterContentPage = ({ pageKey }) => {
  const pageData = FOOTER_PAGE_CONTENT[pageKey] || FALLBACK_PAGE;
  const relatedLinks = getRelatedLinks(pageKey);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (pageKey === 'contact-us') {
    return (
      <section className="footer-content-page footer-content-page--contact-us">
        <div className="contact-us-block">
          <article className="contact-us-info">
            <h2>Contact Us</h2>
            <p className="contact-us-info-copy">
              For inquiries, hiring support, or business collaboration, connect with the right team below.
            </p>
            <div className="contact-us-departments">
              <section className="contact-us-reason-group">
                <h3 className="contact-us-reason-title">Support Requests</h3>
                <p className="contact-us-reason-copy">Account issues, platform errors, and urgent help.</p>
                <article className="contact-us-department">
                  <span className="contact-us-department-icon"><FiHeadphones size={16} /></span>
                  <h4>Support</h4>
                  <a href="mailto:support@hhh-jobs.com"><FiMail size={14} /> support@hhh-jobs.com</a>
                </article>
              </section>

              <section className="contact-us-reason-group">
                <h3 className="contact-us-reason-title">Business & Partnerships</h3>
                <p className="contact-us-reason-copy">Plans, enterprise onboarding, and commercial discussions.</p>
                <article className="contact-us-department">
                  <span className="contact-us-department-icon"><FiBarChart2 size={16} /></span>
                  <h4>Sales</h4>
                  <div className="contact-us-regional-mails">
                    <a href="mailto:sales@hhh-jobs.com">
                      <FiMail size={14} />
                      <span className="contact-us-region-meta">
                        <span className="contact-us-region-label">India</span>
                        <span className="contact-us-region-mail">sales@hhh-jobs.com</span>
                      </span>
                    </a>
                    <a href="mailto:africa@hhh-jobs.com">
                      <FiMail size={14} />
                      <span className="contact-us-region-meta">
                        <span className="contact-us-region-label">Africa</span>
                        <span className="contact-us-region-mail">africa@hhh-jobs.com</span>
                      </span>
                    </a>
                    <a href="mailto:europe@hhh-jobs.com">
                      <FiMail size={14} />
                      <span className="contact-us-region-meta">
                        <span className="contact-us-region-label">Europe</span>
                        <span className="contact-us-region-mail">europe@hhh-jobs.com</span>
                      </span>
                    </a>
                    <a href="mailto:middleeast@hhh-jobs.com">
                      <FiMail size={14} />
                      <span className="contact-us-region-meta">
                        <span className="contact-us-region-label">Middle East</span>
                        <span className="contact-us-region-mail">middleeast@hhh-jobs.com</span>
                      </span>
                    </a>
                  </div>
                </article>
              </section>

              <section className="contact-us-reason-group">
                <h3 className="contact-us-reason-title">General Information</h3>
                <p className="contact-us-reason-copy">Platform details, service information, and general queries.</p>
                <article className="contact-us-department">
                  <span className="contact-us-department-icon"><FiInfo size={16} /></span>
                  <h4>Info</h4>
                  <a href="mailto:info@hhh-jobs.com"><FiMail size={14} /> info@hhh-jobs.com</a>
                </article>
              </section>

              <section className="contact-us-reason-group">
                <h3 className="contact-us-reason-title">Career & Hiring</h3>
                <p className="contact-us-reason-copy">Recruitment coordination, job-role discussions, and HR conversations.</p>
                <article className="contact-us-department">
                  <span className="contact-us-department-icon"><FiBriefcase size={16} /></span>
                  <h4>HR</h4>
                  <a href="mailto:hr@hhh-jobs.com"><FiMail size={14} /> hr@hhh-jobs.com</a>
                </article>
              </section>
            </div>
          </article>

          <article className="contact-us-form-wrap">
            <h2>Get in Touch</h2>
            <p className="contact-us-form-copy">Share your details and our team will get back to you soon.</p>
            <form
              className="contact-us-form"
              onSubmit={(event) => {
                event.preventDefault();
                setIsSubmitted(true);
              }}
            >
              <div className="contact-us-form-grid">
                <label className="contact-us-field">
                  <span>Your Name</span>
                  <input type="text" name="name" placeholder="Enter full name" required />
                </label>
                <label className="contact-us-field">
                  <span>Your Email</span>
                  <input type="email" name="email" placeholder="name@email.com" required />
                </label>
                <label className="contact-us-field">
                  <span>Contact Number</span>
                  <input type="tel" name="phone" placeholder="Enter phone number" required />
                </label>
                <label className="contact-us-field">
                  <span>Address</span>
                  <input type="text" name="address" placeholder="City, State (optional)" />
                </label>
              </div>
              <label className="contact-us-field">
                <span>Inquiry Type</span>
                <select name="inquiryType" defaultValue="" required>
                  <option value="" disabled>Select inquiry type</option>
                  <option value="career">Career Opportunity</option>
                  <option value="support">Support</option>
                  <option value="business">Business</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label className="contact-us-field">
                <span>Your Message</span>
                <textarea name="message" placeholder="Write your message here..." rows={5} required />
              </label>
              <div className="contact-us-form-actions">
                <button type="submit">Send Message</button>
                {isSubmitted ? (
                  <p className="contact-us-form-success">Message sent successfully. Our team will contact you shortly.</p>
                ) : null}
              </div>
            </form>
          </article>
        </div>
      </section>
    );
  }

  if (pageKey === 'about-us') {
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
              {aboutHeroMetrics.map((item) => (
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
          <h2>Who We Are</h2>
          <p>
            HHH Jobs was created with one clear vision: to simplify the hiring process while maintaining
            professionalism and reliability. In today&apos;s competitive job market, both employers and candidates
            deserve a platform that is easy to navigate, transparent in communication, and focused on results.
          </p>
          <p>
            We understand the challenges businesses face when searching for the right talent. At the same time, we
            recognize the frustration job seekers experience when applying for roles without clear updates or structured
            processes. That&apos;s why HHH Jobs bridges this gap with a solution built on trust and efficiency.
          </p>
        </section>

        <section className="about-section">
          <h2>What We Do</h2>
          <p>
            HHH Jobs serves as a reliable connection point between companies and qualified professionals across various
            industries. Our platform is designed to:
          </p>
          <ul className="about-list">
            <li>Provide clear and structured job listings</li>
            <li>Ensure faster application and response cycles</li>
            <li>Maintain professional communication standards</li>
            <li>Promote transparency in hiring</li>
          </ul>
          <p>
            We prioritize simplicity without compromising on quality. Every feature of our platform is built to reduce
            delays, eliminate unnecessary steps, and make hiring straightforward.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            Our mission is to create a hiring ecosystem where opportunities and talent meet seamlessly. We aim to
            empower businesses to grow with the right workforce and help individuals advance their careers with
            confidence.
          </p>
          <p className="about-note">
            Clarity in job descriptions, speed in communication, and trust in process - these are the pillars that
            define HHH Jobs.
          </p>
        </section>

        <section className="about-section">
          <h2>Why Choose HHH Jobs?</h2>
          <ul className="about-list">
            <li><strong>Clarity</strong> - Clear job requirements, transparent communication, and structured processes.</li>
            <li><strong>Speed</strong> - Efficient application management and faster connections between employers and candidates.</li>
            <li><strong>Trust</strong> - A professional environment built on credibility and accountability.</li>
          </ul>
          <p>
            We believe recruitment should be simple, professional, and results-driven. Whether you are an employer
            searching for dependable talent or a professional seeking the right opportunity, HHH Jobs is here to make
            the process smooth and effective.
          </p>
          <p>At HHH Jobs, hiring is not just about filling positions - it&apos;s about building meaningful professional connections.</p>
        </section>

        <section className="about-cta">
          <h2>Start Your Journey With HHH Jobs</h2>
          <p>Explore opportunities, connect with talent, and experience recruitment with clarity, speed, and trust.</p>
          <div className="about-cta-actions">
            <Link to="/portal/student/jobs">Explore Jobs</Link>
            <Link to="/sign-up">Create Account</Link>
          </div>
        </section>
      </section>
    );
  }

  if (pageKey === 'report-issue') {
    return (
      <section className="footer-content-page footer-content-page--report-issue">
        <header className="footer-content-page__hero">
          <p className="footer-content-page__eyebrow">{pageData.eyebrow || 'Footer'}</p>
          <h1>{pageData.title}</h1>
          {pageData.summary ? <p className="footer-content-page__summary">{pageData.summary}</p> : null}
        </header>

        <article className="report-issue-panel">
          <div className="report-issue-content">
            {Array.isArray(pageData.sections) && pageData.sections.length > 0 ? (
              pageData.sections.map((section, index) => (
                <div className="report-issue-section" key={`${section.heading || 'section'}-${index}`}>
                  <h3>{section.heading || `Section ${index + 1}`}</h3>
                  {section.body ? <p>{section.body}</p> : null}
                  {Array.isArray(section.items) && section.items.length > 0 ? (
                    <ul>
                      {section.items.map((item, itemIndex) => (
                        <li key={`${item}-${itemIndex}`}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))
            ) : (
              <p>Issue details are unavailable right now.</p>
            )}
          </div>

          <form
            className="report-issue-form"
            onSubmit={(event) => {
              event.preventDefault();
              setIsSubmitted(true);
            }}
          >
            <h3 className="report-issue-form-title">Tell Us Your Issue</h3>
            <label>
              <span className="report-issue-label-text">
                <span className="report-issue-required">*</span> Your Name:
              </span>
              <input type="text" name="name" required />
            </label>

            <label>
              <span className="report-issue-label-text">
                <span className="report-issue-required">*</span> Email Address:
              </span>
              <input type="email" name="email" required />
            </label>

            <div className="report-issue-contact-block">
              <label>
                <span className="report-issue-label-text">
                  <span className="report-issue-required">*</span> Contact Numbers:
                </span>
                <p>Out of two phone numbers, one is compulsory.</p>
              </label>
              <label>
                <span>Mobile:</span>
                <input type="tel" name="mobile" />
              </label>
              <label>
                <span>Landline:</span>
                <div className="report-issue-landline">
                  <input type="text" name="landlineStd" aria-label="Landline STD code" />
                  <input type="text" name="landlineArea" aria-label="Landline area code" />
                  <input type="text" name="landlineNumber" aria-label="Landline number" />
                </div>
              </label>
            </div>

            <label>
              <span className="report-issue-label-text">
                <span className="report-issue-required">*</span> Area of Concern:
              </span>
              <select name="areaOfConcern" defaultValue="" required>
                <option value="" disabled>Select Any Available Option</option>
                <option value="technical">Technical Glitches</option>
                <option value="content">Incorrect or Suspicious Content</option>
                <option value="policy">Policy Violations</option>
                <option value="communication">Communication Issues</option>
              </select>
            </label>

            <label>
              <span className="report-issue-label-text">
                <span className="report-issue-required">*</span> Subject:
              </span>
              <input type="text" name="subject" required />
              <small>Please enter appropriate subject to describe the issues you are facing.</small>
            </label>

            <label>
              <span className="report-issue-label-text">
                <span className="report-issue-required">*</span> Details of Concern:
              </span>
              <textarea name="details" rows={6} required />
            </label>

            <label>
              <span className="report-issue-label-text">Attach Screenshot:</span>
              <input type="file" name="screenshot" accept=".gif,.png,.jpg,.jpeg" />
              <small>Please upload a gif, png, jpg or jpeg only and ensure file size is up to 150 KB.</small>
            </label>

            <div className="report-issue-captcha" aria-hidden="true">
              <div className="report-issue-captcha-box" />
              <div>
                <p>I&apos;m not a robot</p>
                <small>reCAPTCHA placeholder</small>
              </div>
            </div>

            <button className="report-issue-submit" type="submit">Submit</button>
            {isSubmitted ? (
              <p className="report-issue-success">Issue submitted successfully. Our support team will review it shortly.</p>
            ) : null}
          </form>
        </article>

        <aside className="footer-content-page__related">
          <h3>Explore More</h3>
          <div className="footer-content-page__related-links">
            {relatedLinks.map((link) => (
              <Link key={link.key} to={link.to}>
                {link.label}
              </Link>
            ))}
          </div>
        </aside>
      </section>
    );
  }

  return (
    <section className={`footer-content-page footer-content-page--${pageKey}`}>
      <header className="footer-content-page__hero">
        <p className="footer-content-page__eyebrow">{pageData.eyebrow || 'Footer'}</p>
        <h1>{pageData.title}</h1>
        {pageData.summary ? <p className="footer-content-page__summary">{pageData.summary}</p> : null}
      </header>

      <div className="footer-content-page__content">
        {Array.isArray(pageData.sections) && pageData.sections.length > 0 ? (
          pageData.sections.map((section, index) => {
            const cardContent = (
              <>
                {section.image ? (
                  <div className="footer-content-page__card-media">
                    <img src={section.image} alt={section.imageAlt || section.heading || 'Article cover'} loading="lazy" />
                    {section.tag || section.readTime ? (
                      <div className="footer-content-page__card-meta">
                        {section.tag ? <span>{section.tag}</span> : null}
                        {section.readTime ? <span>{section.readTime}</span> : null}
                      </div>
                    ) : null}
                  </div>
                ) : null}
                <h2>{section.heading || `Section ${index + 1}`}</h2>
                {section.body ? <p>{section.body}</p> : null}
                {Array.isArray(section.items) && section.items.length > 0 ? (
                  <ul>
                    {section.items.map((item, itemIndex) => (
                      <li key={`${item}-${itemIndex}`}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {section.to ? <span className="footer-content-page__cta">Read full article</span> : null}
              </>
            );

            if (section.to) {
              return (
                <Link
                  to={section.to}
                  className="footer-content-page__card footer-content-page__card--link"
                  key={`${section.heading || 'section'}-${index}`}
                >
                  {cardContent}
                </Link>
              );
            }

            return (
              <article className="footer-content-page__card" key={`${section.heading || 'section'}-${index}`}>
                {cardContent}
              </article>
            );
          })
        ) : (
          <article className="footer-content-page__card">
            <h2>Content coming soon</h2>
            <p>We are preparing detailed information for this page.</p>
          </article>
        )}
      </div>

      <aside className="footer-content-page__related">
        <h3>Explore More</h3>
        <div className="footer-content-page__related-links">
          {relatedLinks.map((link) => (
            <Link key={link.key} to={link.to}>
              {link.label}
            </Link>
          ))}
        </div>
      </aside>
    </section>
  );
};

export default FooterContentPage;
