import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../../../utils/api';
import { getCurrentUser } from '../../../../utils/auth';
import './HelpCenterPage.css';

const concernOptions = [
  { value: 'other', label: 'General Support' },
  { value: 'job', label: 'Jobs / Job Posting' },
  { value: 'application', label: 'Applications / Hiring Flow' },
  { value: 'user', label: 'Account / User Issue' }
];

const quickFaqs = [
  {
    q: 'Profile complete karne ka best order kya hai?',
    a: 'Basic details, education, skills, resume text, aur preferences fill karein. Isse applications aur ATS dono improve hote hain.'
  },
  {
    q: 'Mera application status update nahi ho raha?',
    a: 'Dashboard refresh karein, notifications check karein, aur 24h wait karein. Issue continue ho to form se ticket raise karein.'
  },
  {
    q: 'HR approval pending hai to kya karein?',
    a: 'Account details aur company profile complete rakhein. Admin approval ke liye support ticket me registered email mention karein.'
  },
  {
    q: 'How do I apply for a job?',
    a: 'Open a job detail page and click Apply.'
  },
  {
    q: 'How does HR approval work?',
    a: 'Admins can approve HR accounts from the admin panel.'
  },
  {
    q: 'Can I track my applications?',
    a: 'Your dashboard shows real-time application status.'
  },
  {
    q: 'Does HHH Job support ATS checks?',
    a: 'Yes, ATS scoring and resume checks are available.'
  }
];

const HelpCenterPage = () => {
  const user = getCurrentUser();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    concern: 'other',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      setError('Help request submit karne ke liye login karein.');
      return;
    }

    if (!String(form.subject || '').trim()) {
      setError('Subject required hai.');
      return;
    }

    if (!String(form.message || '').trim()) {
      setError('Issue details required hain.');
      return;
    }

    try {
      setSubmitting(true);
      const details = [
        `Requester Name: ${String(form.name || '').trim() || '-'}`,
        `Requester Email: ${String(form.email || '').trim() || '-'}`,
        `Concern Area: ${concernOptions.find((item) => item.value === form.concern)?.label || form.concern}`,
        '',
        'Message:',
        String(form.message || '').trim()
      ].join('\n');

      const response = await apiFetch('/reports', {
        method: 'POST',
        body: JSON.stringify({
          targetType: form.concern,
          targetId: null,
          reason: String(form.subject || '').trim(),
          details
        })
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setError(payload?.message || 'Help request submit nahi ho payi.');
        return;
      }

      setSuccess('Support request submit ho gayi. Team jaldi revert karegi.');
      setForm((current) => ({
        ...current,
        subject: '',
        message: ''
      }));
    } catch (requestError) {
      setError(requestError.message || 'Help request submit nahi ho payi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="module-page">
      <section className="panel-card help-center-shell">
        <header className="help-center-hero">
          <p className="help-center-kicker">Help Center</p>
          <h1>Need help? Raise a support request</h1>
          <p>
            Quick FAQs niche hain. Agar issue solve na ho, form submit karo and support team ticket handle karegi.
          </p>
        </header>

        <div className="help-center-grid">
          <article className="help-center-faq">
            <h2>Quick Answers</h2>
            <div className="help-center-faq-list">
              {quickFaqs.map((item) => (
                <section key={item.q}>
                  <h3>{item.q}</h3>
                  <p>{item.a}</p>
                </section>
              ))}
            </div>
          </article>

          <article className="help-center-form-wrap">
            <h2>Support Form</h2>

            {!user ? (
              <p className="module-note">
                Request submit karne ke liye <Link to="/login" className="inline-link">login</Link> karein.
              </p>
            ) : null}

            <form className="help-center-form" onSubmit={handleSubmit}>
              <label>
                Name
                <input
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  placeholder="Your full name"
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  placeholder="you@example.com"
                />
              </label>

              <label>
                Area of concern
                <select value={form.concern} onChange={(event) => updateField('concern', event.target.value)}>
                  {concernOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>

              <label>
                Subject
                <input
                  value={form.subject}
                  onChange={(event) => updateField('subject', event.target.value)}
                  placeholder="Short issue summary"
                />
              </label>

              <label>
                Message
                <textarea
                  rows={6}
                  value={form.message}
                  onChange={(event) => updateField('message', event.target.value)}
                  placeholder="Describe your issue in detail"
                />
              </label>

              {error ? <p className="form-error">{error}</p> : null}
              {success ? <p className="form-success">{success}</p> : null}

              <button type="submit" className="btn-primary help-center-submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </article>
        </div>
      </section>
    </div>
  );
};

export default HelpCenterPage;
