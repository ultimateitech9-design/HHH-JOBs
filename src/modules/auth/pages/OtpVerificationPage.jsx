import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../../utils/api';
import { getCurrentUser, getDashboardPathByRole, setAuthSession } from '../../../utils/auth';
import { generateRetiredEmployeeId, generateStudentCandidateId } from '../../../utils/hrIdentity';
import { resendLocalSignupOtp, verifyLocalSignupOtp } from '../../../utils/localAuthFallback';

const OtpVerificationPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [counter, setCounter] = useState(60);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || getCurrentUser()?.email || '';
  const prefilledOtp = String(location.state?.otp || '').replace(/\D/g, '').slice(0, 6);

  useEffect(() => {
    if (!email) {
      navigate('/sign-up', { replace: true });
      return;
    }

    inputRefs.current[0]?.focus();
  }, [email, navigate]);

  useEffect(() => {
    if (prefilledOtp.length !== 6) return;
    setOtp(prefilledOtp.split(''));
  }, [prefilledOtp]);

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

      const nextUser = payload.user?.role === 'student'
        ? {
          ...payload.user,
          studentCandidateId: payload.user?.studentCandidateId || generateStudentCandidateId({
            name: payload.user?.name || '',
            mobile: payload.user?.mobile || payload.user?.phone || ''
          })
        }
        : payload.user?.role === 'retired_employee'
          ? {
            ...payload.user,
            retiredEmployeeId: payload.user?.retiredEmployeeId || generateRetiredEmployeeId({
              name: payload.user?.name || '',
              mobile: payload.user?.mobile || payload.user?.phone || ''
            })
          }
        : payload.user;
      setAuthSession(payload.token, nextUser);
      navigate(payload.redirectTo || getDashboardPathByRole(nextUser?.role), { replace: true });
    } catch (requestError) {
      try {
        const payload = verifyLocalSignupOtp({ email, otp: otpCode });

        const nextUser = payload.user?.role === 'student'
          ? {
            ...payload.user,
            studentCandidateId: payload.user?.studentCandidateId || generateStudentCandidateId({
              name: payload.user?.name || '',
              mobile: payload.user?.mobile || payload.user?.phone || ''
            })
          }
          : payload.user?.role === 'retired_employee'
            ? {
              ...payload.user,
              retiredEmployeeId: payload.user?.retiredEmployeeId || generateRetiredEmployeeId({
                name: payload.user?.name || '',
                mobile: payload.user?.mobile || payload.user?.phone || ''
              })
            }
            : payload.user;

        setAuthSession(payload.token, nextUser);
        navigate(payload.redirectTo || getDashboardPathByRole(nextUser?.role), { replace: true });
        return;
      } catch (fallbackError) {
        setError(fallbackError.message || 'Unable to verify OTP right now.');
      }
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
      const nextOtp = String(payload.otp || '').replace(/\D/g, '').slice(0, 6);
      if (nextOtp.length === 6) {
        setOtp(nextOtp.split(''));
        inputRefs.current[5]?.focus();
      } else {
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (requestError) {
      try {
        const payload = resendLocalSignupOtp(email);
        setCounter(60);
        const nextOtp = String(payload.otp || '').replace(/\D/g, '').slice(0, 6);
        if (nextOtp.length === 6) {
          setOtp(nextOtp.split(''));
          inputRefs.current[5]?.focus();
          return;
        }
      } catch (fallbackError) {
        setError(fallbackError.message || 'Network error while resending OTP.');
      }
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
