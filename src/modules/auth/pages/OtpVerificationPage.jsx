import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../../utils/api';
import { getCurrentUser, getDashboardPathByRole, setAuthSession } from '../../../utils/auth';

const OtpVerificationPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [counter, setCounter] = useState(60);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || getCurrentUser()?.email || '';

  useEffect(() => {
    if (!email) {
      navigate('/sign-up', { replace: true });
      return;
    }

    inputRefs.current[0]?.focus();
  }, [email, navigate]);

  useEffect(() => {
    if (counter <= 0) return undefined;
    const timer = setTimeout(() => setCounter((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [counter]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value.slice(-1);
    setOtp(updated);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    setError('');

    if (otpCode.length !== 6) {
      setError('Enter the complete 6-digit OTP.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await apiFetch('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp: otpCode })
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.message || 'OTP verification failed.');
        return;
      }

      setAuthSession(payload.token, payload.user);
      navigate(payload.redirectTo || getDashboardPathByRole(payload.user?.role), { replace: true });
    } catch (requestError) {
      setError('Unable to verify OTP right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (counter > 0) return;
    setError('');

    try {
      const response = await apiFetch('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email })
      });

      const payload = await response.json();
      if (!response.ok) {
        setError(payload.message || 'Unable to resend OTP.');
        return;
      }

      setCounter(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (requestError) {
      setError('Network error while resending OTP.');
    }
  };

  return (
    <div className="auth-page auth-page--otp">
      <section className="auth-panel">
        <h1>Verify OTP</h1>
        <p>Enter the 6-digit code sent to {email}.</p>

        <div className="otp-grid">
          {otp.map((value, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              inputMode="numeric"
              maxLength={1}
              value={value}
              onChange={(event) => handleChange(index, event.target.value)}
            />
          ))}
        </div>

        {error ? <p className="form-error">{error}</p> : null}

        <button type="button" className="btn-primary" onClick={handleVerify} disabled={isSubmitting}>
          {isSubmitting ? 'Verifying...' : 'Verify and Continue'}
        </button>

        <button type="button" className="btn-link" onClick={handleResend} disabled={counter > 0}>
          {counter > 0 ? `Resend OTP in ${counter}s` : 'Resend OTP'}
        </button>
      </section>
    </div>
  );
};

export default OtpVerificationPage;
