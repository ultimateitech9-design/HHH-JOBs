import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { apiFetch } from '../utils/api';
import { getCurrentUser, getDashboardPathByRole, setAuthSession } from '../utils/auth';

const OtpVerification = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
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
        if (resendTimer <= 0) return;
        const timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
        return () => clearTimeout(timer);
    }, [resendTimer]);

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, event) => {
        if (event.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (event) => {
        event.preventDefault();
        const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            setOtp(pasted.split(''));
            inputRefs.current[5]?.focus();
        }
    };

    const handleVerify = async () => {
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Please enter the complete 6-digit OTP.' });
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
                Swal.fire({ icon: 'error', title: 'Verification Failed', text: payload.message || 'Invalid OTP.' });
                return;
            }

            setAuthSession(payload.token, payload.user);
            Swal.fire({
                icon: 'success',
                title: 'Email Verified!',
                text: 'Your email has been successfully verified.',
                timer: 2000,
                showConfirmButton: false
            });

            setTimeout(() => {
                navigate(payload.redirectTo || getDashboardPathByRole(payload.user?.role), { replace: true });
            }, 1500);
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0) return;

        try {
            const response = await apiFetch('/auth/send-otp', {
                method: 'POST',
                body: JSON.stringify({ email })
            });

            const payload = await response.json();

            if (response.ok) {
                setResendTimer(60);
                setOtp(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
                Swal.fire({ icon: 'success', title: 'OTP Sent', text: 'A new OTP has been sent to your email.' });
            } else {
                Swal.fire({ icon: 'error', title: 'Error', text: payload.message || 'Failed to resend OTP.' });
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Network error. Please try again.' });
        }
    };

    return (
        <div className='min-h-screen w-full flex items-center justify-center px-4 page-theme page-theme-auth-login'>
            <div className='auth-card space-y-6 p-8 text-center'>
                <div>
                    <div className='text-5xl mb-4'>📧</div>
                    <h1 className='text-2xl font-bold'>Verify Your Email</h1>
                    <p className='text-gray-500 mt-2 text-sm'>
                        We&apos;ve sent a 6-digit OTP to <strong>{email}</strong>
                    </p>
                </div>

                <div className='flex justify-center gap-2' onPaste={handlePaste}>
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => { inputRefs.current[index] = el; }}
                            type='text'
                            inputMode='numeric'
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className='w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all'
                            id={`otp-input-${index}`}
                        />
                    ))}
                </div>

                <button
                    onClick={handleVerify}
                    disabled={isSubmitting || otp.join('').length !== 6}
                    className='w-full bg-blue text-white font-bold py-3 px-4 rounded-lg focus:outline-none disabled:opacity-60 transition-all hover:opacity-90'
                    id='verify-otp-btn'
                >
                    {isSubmitting ? 'Verifying...' : 'Verify Email'}
                </button>

                <div className='text-sm text-gray-500'>
                    {resendTimer > 0 ? (
                        <span>Resend OTP in <strong>{resendTimer}s</strong></span>
                    ) : (
                        <button
                            onClick={handleResendOtp}
                            className='text-blue-600 hover:underline font-medium'
                            id='resend-otp-btn'
                        >
                            Resend OTP
                        </button>
                    )}
                </div>

                <p className='text-xs text-gray-400'>
                    Check your spam folder if you don&apos;t see the email.
                </p>
            </div>
        </div>
    );
};

export default OtpVerification;
