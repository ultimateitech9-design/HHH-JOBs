import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiChrome, FiEye, FiEyeOff, FiLinkedin } from 'react-icons/fi';
import { apiFetch, apiUrl } from '../../../utils/api';
import { getDashboardPathByRole, setAuthSession } from '../../../utils/auth';

const socialRoleOptions = [
  { value: 'student', label: 'Student / Candidate' },
  { value: 'hr', label: 'HR / Recruiter' }
];

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [socialRole, setSocialRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from || null;

  useEffect(() => {
    const oauthError = new URLSearchParams(location.search).get('oauth_error');
    if (oauthError) {
      setError(oauthError);
    }
  }, [location.search]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Email and password are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      let payload = {};
      try {
        payload = await response.json();
      } catch (parseError) {
        payload = {};
      }

      if (!response.ok) {
        setError(payload.message || 'Login failed.');
        return;
      }

      setAuthSession(payload.token, payload.user);

      if (payload.requiresOtpVerification) {
        navigate('/verify-otp', { state: { email: form.email }, replace: true });
        return;
      }

      navigate(redirectTo || payload.redirectTo || getDashboardPathByRole(payload.user?.role), { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'Unable to sign in right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startSocialLogin = (provider) => {
    setError('');
    setSocialLoading(provider);
    const endpoint = apiUrl(`/auth/oauth/${provider}/start?role=${encodeURIComponent(socialRole)}`);
    window.location.assign(endpoint);
  };

  return (
    <div className="auth-page auth-page--login">
      <div className="auth-login-shell">
        <aside className="auth-login-visual" aria-hidden="true">
          <span className="auth-visual-badge">Career Assistant</span>
          <img
            src="/images/login-anime.svg"
            alt=""
            loading="lazy"
          />
          <div className="auth-visual-caption">
            <strong>HHH Job welcomes you</strong>
            <span>Fast apply, smart matching, smoother hiring journey</span>
          </div>
        </aside>

        <section className="auth-panel auth-panel--login">
          <h1>Sign In</h1>
          <p>Sign in to continue to your dashboard.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              Email
              <input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              />
            </label>
            <label>
              Password
              <div className="auth-password-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </label>

            {error ? <p className="form-error">{error}</p> : null}

            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-divider" aria-hidden="true">
            <span>or continue with</span>
          </div>

          <div className="auth-social">
            <div className="auth-social-head">
              <span className="auth-social-title">Social login</span>
              <span className="auth-social-helper">Role will be used on first social sign-in.</span>
            </div>
            <div className="auth-social-role">
              <span>Role</span>
              <div className="auth-role-toggle" role="tablist" aria-label="Social login role selector">
                {socialRoleOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="tab"
                    aria-selected={socialRole === option.value}
                    className={`auth-role-toggle-btn ${socialRole === option.value ? 'is-active' : ''}`}
                    onClick={() => setSocialRole(option.value)}
                    disabled={Boolean(socialLoading)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="auth-social-actions">
              <button
                type="button"
                className="auth-social-btn"
                onClick={() => startSocialLogin('google')}
                disabled={isSubmitting || Boolean(socialLoading)}
              >
                <span className="auth-social-btn__icon"><FiChrome size={15} /></span>
                <span>{socialLoading === 'google' ? 'Redirecting...' : 'Google'}</span>
              </button>
              <button
                type="button"
                className="auth-social-btn auth-social-btn--linkedin"
                onClick={() => startSocialLogin('linkedin')}
                disabled={isSubmitting || Boolean(socialLoading)}
              >
                <span className="auth-social-btn__icon"><FiLinkedin size={15} /></span>
                <span>{socialLoading === 'linkedin' ? 'Redirecting...' : 'LinkedIn'}</span>
              </button>
            </div>
          </div>

          <div className="auth-links">
            <Link to="/forgot-password">Forgot password?</Link>
            <Link to="/sign-up">Create account</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
