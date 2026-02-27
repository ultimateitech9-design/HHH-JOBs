import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiChrome, FiLinkedin } from 'react-icons/fi';
import { apiFetch, apiUrl } from '../../../utils/api';
import { getDashboardPathByRole, setAuthSession } from '../../../utils/auth';

const genderOptions = [
  { value: '', label: 'Select gender' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' }
];

const casteOptions = [
  { value: '', label: 'Select caste category' },
  { value: 'general', label: 'General' },
  { value: 'obc', label: 'OBC' },
  { value: 'sc', label: 'SC' },
  { value: 'st', label: 'ST' },
  { value: 'ews', label: 'EWS' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' }
];

const religionOptions = [
  { value: '', label: 'Select religion' },
  { value: 'hindu', label: 'Hindu' },
  { value: 'muslim', label: 'Muslim' },
  { value: 'sikh', label: 'Sikh' },
  { value: 'christian', label: 'Christian' },
  { value: 'jain', label: 'Jain' },
  { value: 'buddhist', label: 'Buddhist' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' }
];

const SignupPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    role: 'student',
    gender: '',
    caste: '',
    religion: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState('');
  const navigate = useNavigate();

  const handleChange = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.mobile || !form.password) {
      setError('Name, email, mobile, and password are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.message || 'Unable to create account.');
        return;
      }

      setAuthSession(payload.token, payload.user);

      if (payload.requiresOtpVerification) {
        navigate('/verify-otp', { state: { email: form.email }, replace: true });
        return;
      }

      navigate(payload.redirectTo || getDashboardPathByRole(payload.user?.role), { replace: true });
    } catch (requestError) {
      setError('Signup service unavailable. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startSocialSignup = (provider) => {
    setError('');
    setSocialLoading(provider);
    const endpoint = apiUrl(`/auth/oauth/${provider}/start?role=${encodeURIComponent(form.role)}`);
    window.location.assign(endpoint);
  };

  return (
    <div className="auth-page auth-page--signup">
      <section className="auth-panel">
        <h1>Create Account</h1>
        <p>Register as recruiter or candidate. Admin role is controlled by configuration.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Name
            <input value={form.name} onChange={(event) => handleChange('name', event.target.value)} />
          </label>
          <label>
            Role
            <select
              value={form.role}
              onChange={(event) => handleChange('role', event.target.value)}
              disabled={isSubmitting || Boolean(socialLoading)}
            >
              <option value="student">Student / Candidate</option>
              <option value="hr">HR / Recruiter</option>
            </select>
          </label>
          <label>
            Mobile
            <input value={form.mobile} onChange={(event) => handleChange('mobile', event.target.value)} />
          </label>
          <label>
            Gender
            <select value={form.gender} onChange={(event) => handleChange('gender', event.target.value)}>
              {genderOptions.map((option) => (
                <option key={option.value || 'empty'} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label>
            Caste
            <select value={form.caste} onChange={(event) => handleChange('caste', event.target.value)}>
              {casteOptions.map((option) => (
                <option key={option.value || 'empty'} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label>
            Religion
            <select value={form.religion} onChange={(event) => handleChange('religion', event.target.value)}>
              {religionOptions.map((option) => (
                <option key={option.value || 'empty'} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => handleChange('email', event.target.value)}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => handleChange('password', event.target.value)}
            />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button type="submit" className="btn-primary" disabled={isSubmitting || Boolean(socialLoading)}>
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-divider" aria-hidden="true">
          <span>or create account with</span>
        </div>

        <div className="auth-social">
          <div className="auth-social-head">
            <span className="auth-social-title">Social signup</span>
            <span className="auth-social-helper">
              Selected role: {form.role === 'hr' ? 'HR / Recruiter' : 'Student / Candidate'} (used on first social signup).
            </span>
          </div>
          <div className="auth-social-actions">
            <button
              type="button"
              className="auth-social-btn"
              onClick={() => startSocialSignup('google')}
              disabled={isSubmitting || Boolean(socialLoading)}
            >
              <span className="auth-social-btn__icon"><FiChrome size={15} /></span>
              <span>{socialLoading === 'google' ? 'Redirecting...' : 'Google'}</span>
            </button>
            <button
              type="button"
              className="auth-social-btn auth-social-btn--linkedin"
              onClick={() => startSocialSignup('linkedin')}
              disabled={isSubmitting || Boolean(socialLoading)}
            >
              <span className="auth-social-btn__icon"><FiLinkedin size={15} /></span>
              <span>{socialLoading === 'linkedin' ? 'Redirecting...' : 'LinkedIn'}</span>
            </button>
          </div>
        </div>

        <div className="auth-links">
          <Link to="/login">Already have an account?</Link>
        </div>
      </section>
    </div>
  );
};

export default SignupPage;
