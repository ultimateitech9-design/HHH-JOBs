import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { apiFetch } from '../utils/api';

const ForgotPassword = () => {
    const [step, setStep] = useState('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = async (event) => {
        event.preventDefault();

        if (!email) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Please enter your email address.' });
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await apiFetch('/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify({ email })
            });

            const payload = await response.json();

            if (response.ok) {
                setStep('reset');
                Swal.fire({
                    icon: 'success',
                    title: 'OTP Sent',
                    text: 'If the email exists, an OTP has been sent. Please check your inbox.'
                });
            } else {
                Swal.fire({ icon: 'error', title: 'Error', text: payload.message || 'Something went wrong.' });
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Network error. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetPassword = async (event) => {
        event.preventDefault();

        if (!otp || !newPassword) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Please enter OTP and new password.' });
            return;
        }

        if (newPassword.length < 6) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Password must be at least 6 characters.' });
            return;
        }

        if (newPassword !== confirmPassword) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Passwords do not match.' });
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await apiFetch('/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify({ email, otp, newPassword })
            });

            const payload = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Password Reset!',
                    text: 'Your password has been reset. Please login with your new password.',
                    timer: 3000,
                    showConfirmButton: false
                });
                setTimeout(() => navigate('/login', { replace: true }), 2500);
            } else {
                Swal.fire({ icon: 'error', title: 'Reset Failed', text: payload.message || 'Failed to reset password.' });
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Network error. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='min-h-screen w-full flex items-center justify-center px-4 page-theme page-theme-auth-login'>
            <div className='auth-card space-y-4 p-6'>
                <div className='text-center'>
                    <div className='text-4xl mb-3'>🔑</div>
                    <h1 className='text-2xl font-bold'>
                        {step === 'email' ? 'Forgot Password' : 'Reset Password'}
                    </h1>
                    <p className='text-gray-500 text-sm mt-1'>
                        {step === 'email'
                            ? 'Enter your email to receive a password reset OTP.'
                            : 'Enter the OTP and your new password.'
                        }
                    </p>
                </div>

                {step === 'email' ? (
                    <form onSubmit={handleSendOtp} className='space-y-4'>
                        <div>
                            <label className='block text-sm font-bold mb-2' htmlFor='forgot-email'>Email</label>
                            <input
                                id='forgot-email'
                                type='email'
                                placeholder='Enter your email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                            />
                        </div>
                        <button
                            type='submit'
                            disabled={isSubmitting}
                            className='w-full bg-blue text-white font-bold py-2 px-4 rounded focus:outline-none disabled:opacity-60'
                            id='send-otp-btn'
                        >
                            {isSubmitting ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className='space-y-4'>
                        <div>
                            <label className='block text-sm font-bold mb-2' htmlFor='reset-otp'>OTP Code</label>
                            <input
                                id='reset-otp'
                                type='text'
                                inputMode='numeric'
                                maxLength={6}
                                placeholder='Enter 6-digit OTP'
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className='shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center text-xl tracking-widest font-bold'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-bold mb-2' htmlFor='new-password'>New Password</label>
                            <input
                                id='new-password'
                                type='password'
                                placeholder='Enter new password (min 6 chars)'
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className='shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-bold mb-2' htmlFor='confirm-password'>Confirm Password</label>
                            <input
                                id='confirm-password'
                                type='password'
                                placeholder='Confirm new password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className='shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                            />
                        </div>
                        <button
                            type='submit'
                            disabled={isSubmitting}
                            className='w-full bg-blue text-white font-bold py-2 px-4 rounded focus:outline-none disabled:opacity-60'
                            id='reset-password-btn'
                        >
                            {isSubmitting ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                <div className='text-center pt-2'>
                    <button
                        onClick={() => navigate('/login')}
                        className='text-blue-600 text-sm hover:underline'
                    >
                        ← Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
