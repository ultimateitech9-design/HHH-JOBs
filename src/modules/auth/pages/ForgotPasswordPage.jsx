import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../../utils/api';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async (event) => {
    event.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await apiFetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.message || 'Unable to send OTP.');
        return;
      }

      setStep('reset');
    } catch (requestError) {
      setError('Network error while sending OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    setError('');

    if (!otp || !newPassword || !confirmPassword) {
      setError('OTP and password fields are required.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await apiFetch('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, otp, newPassword })
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.message || 'Unable to reset password.');
        return;
      }

      navigate('/login', { replace: true });
    } catch (requestError) {
      setError('Network error while resetting password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page auth-page--forgot">
      <section className="auth-panel">
        <h1>{step === 'email' ? 'Forgot Password' : 'Reset Password'}</h1>
        <p>
          {step === 'email'
            ? 'Enter your email to receive OTP.'
            : 'Enter OTP and a new password to continue.'}
        </p>

        {step === 'email' ? (
          <form onSubmit={sendOtp} className="auth-form">
            <label>
              Email
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={resetPassword} className="auth-form">
            <label>
              OTP
              <input value={otp} maxLength={6} onChange={(event) => setOtp(event.target.value)} />
            </label>
            <label>
              New Password
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
            </label>
            <label>
              Confirm Password
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="auth-links">
          <Link to="/login">Back to login</Link>
        </div>
      </section>
    </div>
  );
};

export default ForgotPasswordPage;
