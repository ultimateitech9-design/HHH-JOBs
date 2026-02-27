import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../../../utils/api';
import { getCurrentUser } from '../../../../utils/auth';
import './ReportIssuePage.css';

const areaOfConcernOptions = [
  { value: '', label: 'Select Any Available Option' },
  { value: 'other', label: 'General Platform Issue' },
  { value: 'job', label: 'Job Posting / Jobs Section' },
  { value: 'application', label: 'Application / Candidate Flow' },
  { value: 'user', label: 'User / Account Behavior' }
];

const ReportIssuePage = () => {
  const user = getCurrentUser();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: '',
    landlineStd: '',
    landlineCity: '',
    landlineNumber: '',
    targetType: '',
    targetId: '',
    reason: '',
    details: '',
    screenshotName: ''
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
      setError('Please login first to raise a complaint.');
      return;
    }

    if (!String(form.name || '').trim()) {
      setError('Name is required.');
      return;
    }

    if (!String(form.email || '').trim()) {
      setError('Email is required.');
      return;
    }

    if (!String(form.targetType || '').trim()) {
      setError('Please select area of concern.');
      return;
    }

    const hasContact = Boolean(String(form.mobile || '').trim() || String(form.landlineNumber || '').trim());
    if (!hasContact) {
      setError('Mobile ya landline number me se kam se kam ek required hai.');
      return;
    }

    if (!String(form.reason || '').trim()) {
      setError('Subject is required.');
      return;
    }

    if (!String(form.details || '').trim()) {
      setError('Details of concern are required.');
      return;
    }

    try {
      setSubmitting(true);
      const metaLines = [
        `Reporter Name: ${String(form.name || '').trim()}`,
        `Reporter Email: ${String(form.email || '').trim()}`,
        `Mobile: ${String(form.mobile || '').trim() || '-'}`,
        `Landline: ${[form.landlineStd, form.landlineCity, form.landlineNumber].filter(Boolean).join('-') || '-'}`,
        `Area Of Concern: ${areaOfConcernOptions.find((item) => item.value === form.targetType)?.label || form.targetType}`,
        `Related ID: ${String(form.targetId || '').trim() || '-'}`,
        `Screenshot: ${String(form.screenshotName || '').trim() || 'Not attached'}`
      ];
      const mergedDetails = `${metaLines.join('\n')}\n\nIssue Details:\n${String(form.details || '').trim()}`;

      const response = await apiFetch('/reports', {
        method: 'POST',
        body: JSON.stringify({
          targetType: form.targetType,
          targetId: String(form.targetId || '').trim() || null,
          reason: String(form.reason || '').trim(),
          details: mergedDetails
        })
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setError(payload?.message || 'Failed to submit complaint.');
        return;
      }

      setSuccess('Complaint submitted successfully. Our team will review it.');
      setForm({
        name: user?.name || '',
        email: user?.email || '',
        mobile: '',
        landlineStd: '',
        landlineCity: '',
        landlineNumber: '',
        targetType: '',
        targetId: '',
        reason: '',
        details: '',
        screenshotName: ''
      });
    } catch (submitError) {
      setError(submitError.message || 'Failed to submit complaint.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="module-page">
      <section className="panel-card report-issue-panel">
        <div className="report-issue-head">
          <h2>Report a Problem</h2>
          <p><span>*</span> Compulsory Fields</p>
        </div>
        <p className="report-issue-intro">
          Our <Link to="/help-center" className="inline-link">Help</Link> section will provide answers to FAQs.
          Please fill the form below and we will revert to your email address.
        </p>

        {!user ? (
          <p className="module-note">
            Complaint submit karne ke liye <Link to="/login" className="inline-link">login karein</Link>.
          </p>
        ) : null}

        <form className="report-issue-form" onSubmit={handleSubmit}>
          <label>
            <span className="report-issue-label-text">Your Name <span className="report-issue-required">*</span></span>
            <input
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              placeholder="Your full name"
            />
          </label>

          <label>
            <span className="report-issue-label-text">Email Address <span className="report-issue-required">*</span></span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="name@email.com"
            />
          </label>

          <div className="report-issue-contact-block">
            <p>Contact Numbers <span className="report-issue-required">*</span>: one of mobile/landline is compulsory.</p>
            <label>
              Mobile:
              <input
                value={form.mobile}
                onChange={(event) => updateField('mobile', event.target.value)}
                placeholder="10-digit mobile number"
              />
            </label>
            <label>
              Landline:
              <div className="report-issue-landline">
                <input
                  value={form.landlineStd}
                  onChange={(event) => updateField('landlineStd', event.target.value)}
                  placeholder="STD"
                />
                <input
                  value={form.landlineCity}
                  onChange={(event) => updateField('landlineCity', event.target.value)}
                  placeholder="Code"
                />
                <input
                  value={form.landlineNumber}
                  onChange={(event) => updateField('landlineNumber', event.target.value)}
                  placeholder="Number"
                />
              </div>
            </label>
          </div>

          <label>
            <span className="report-issue-label-text">Area of Concern <span className="report-issue-required">*</span></span>
            <select value={form.targetType} onChange={(event) => updateField('targetType', event.target.value)}>
              {areaOfConcernOptions.map((option) => (
                <option key={option.value || 'empty'} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label>
            Related ID (optional):
            <input
              value={form.targetId}
              onChange={(event) => updateField('targetId', event.target.value)}
              placeholder="Job ID / Application ID / User ID"
            />
          </label>

          <label>
            <span className="report-issue-label-text">Subject <span className="report-issue-required">*</span></span>
            <input
              value={form.reason}
              onChange={(event) => updateField('reason', event.target.value)}
              placeholder="Please enter appropriate subject"
            />
          </label>

          <label>
            <span className="report-issue-label-text">Details of Concern <span className="report-issue-required">*</span></span>
            <textarea
              rows={6}
              value={form.details}
              onChange={(event) => updateField('details', event.target.value)}
              placeholder="Describe the issue in detail"
            />
          </label>

          <label>
            Attach Screenshot:
            <input
              type="file"
              accept=".gif,.png,.jpg,.jpeg,image/gif,image/png,image/jpeg"
              onChange={(event) => updateField('screenshotName', event.target.files?.[0]?.name || '')}
            />
            <small>Please upload gif/png/jpg/jpeg (max recommended 150 KB).</small>
          </label>

          {error ? <p className="form-error">{error}</p> : null}
          {success ? <p className="form-success">{success}</p> : null}

          <button type="submit" className="btn-primary report-issue-submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default ReportIssuePage;
