import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBarChart2, FiBriefcase, FiHeadphones, FiInfo, FiMail } from 'react-icons/fi';
import { FOOTER_LINK_COLUMNS, FOOTER_PAGE_CONTENT } from './footerPages';
import './FooterContentPage.css';

const FALLBACK_PAGE = {
  title: 'Information Page',
  eyebrow: 'Footer',
  summary: 'The requested content is not available right now.',
  sections: [
    {
      heading: 'Need assistance?',
      body:
        'Please explore related footer links below or contact support@hhhjob.com if you need immediate help.'
    }
  ]
};

const getRelatedLinks = (pageKey) =>
  FOOTER_LINK_COLUMNS.flatMap((column) => column.links).filter((link) => link.key !== pageKey).slice(0, 8);

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
            <p className="contact-us-info-copy">For inquiries, hiring support, or business collaboration, connect with the right team below.</p>
            <div className="contact-us-departments">
              <article className="contact-us-department">
                <span className="contact-us-department-icon"><FiBriefcase size={16} /></span>
                <h3>HR</h3>
                <a href="mailto:hr@hhh-jobs.com"><FiMail size={14} /> hr@hhh-jobs.com</a>
              </article>

              <article className="contact-us-department">
                <span className="contact-us-department-icon"><FiHeadphones size={16} /></span>
                <h3>Support</h3>
                <a href="mailto:support@hhh-jobs.com"><FiMail size={14} /> support@hhh-jobs.com</a>
              </article>

              <article className="contact-us-department">
                <span className="contact-us-department-icon"><FiBarChart2 size={16} /></span>
                <h3>Sales</h3>
                <a href="mailto:sales@hhh-jobs.com"><FiMail size={14} /> sales@hhh-jobs.com</a>
                <a href="mailto:europe@hhh-jobs.com"><FiMail size={14} /> europe@hhh-jobs.com</a>
                <a href="mailto:africa@hhh-jobs.com"><FiMail size={14} /> africa@hhh-jobs.com</a>
                <a href="mailto:middleeast@hhh-jobs.com"><FiMail size={14} /> middleeast@hhh-jobs.com</a>
              </article>

              <article className="contact-us-department">
                <span className="contact-us-department-icon"><FiInfo size={16} /></span>
                <h3>Info</h3>
                <a href="mailto:info@hhh-jobs.com"><FiMail size={14} /> info@hhh-jobs.com</a>
              </article>
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
                <input type="text" name="name" placeholder="Your Name" required />
                <input type="email" name="email" placeholder="Your Email" required />
                <input type="tel" name="phone" placeholder="Contact Number" required />
                <input type="text" name="address" placeholder="Address" />
              </div>
              <select name="inquiryType" defaultValue="" required>
                <option value="" disabled>Select Inquiry Type</option>
                <option value="career">Career Opportunity</option>
                <option value="support">Support</option>
                <option value="business">Business</option>
                <option value="other">Other</option>
              </select>
              <textarea name="message" placeholder="Your Message" rows={5} required />
              <button type="submit">Send Message</button>
              {isSubmitted ? <p className="contact-us-form-success">Message sent successfully. Our team will contact you shortly.</p> : null}
            </form>
          </article>
        </div>
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
                    {(section.tag || section.readTime) ? (
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
                <Link to={section.to} className="footer-content-page__card footer-content-page__card--link" key={`${section.heading || 'section'}-${index}`}>
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
