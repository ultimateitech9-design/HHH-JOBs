import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiChrome, FiLinkedin } from 'react-icons/fi';
import { apiFetch, apiUrl } from '../../../utils/api';
import { getDashboardPathByRole, setAuthSession } from '../../../utils/auth';
import {
  generateHrEmployerId,
  generateRetiredEmployeeId,
  generateStudentCandidateId
} from '../../../utils/hrIdentity';

const genderOptions = [
  { value: '', label: 'Select gender' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' }
];

const casteOptions = [
  { value: '', label: 'Select caste category' },
  { value: 'general', label: 'General' },
  { value: 'obc', label: 'OBC' },
  { value: 'sc', label: 'SC' },
  { value: 'st', label: 'ST' },
  { value: 'ews', label: 'EWS' }
];

const religionOptions = [
  { value: '', label: 'Select religion' },
  { value: 'hindu', label: 'Hindu' },
  { value: 'muslim', label: 'Muslim' },
  { value: 'sikh', label: 'Sikh' },
  { value: 'christian', label: 'Christian' },
  { value: 'jain', label: 'Jain' },
  { value: 'buddhist', label: 'Buddhist' },
  { value: 'other', label: 'Other' }
];

const SignupPage = () => {
  const [form, setForm] = useState({
    name: '',
    companyName: '',
    email: '',
    mobile: '',
    password: '',
    role: 'student',
    dateOfBirth: '',
    gender: '',
    caste: '',
    religion: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const redirectAfterSignupRaw = new URLSearchParams(location.search).get('redirect');
  const redirectAfterSignup = redirectAfterSignupRaw && redirectAfterSignupRaw.startsWith('/')
    ? redirectAfterSignupRaw
    : null;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (!roleParam) return;

    const allowedRoles = new Set(['student', 'hr', 'retired_employee']);
    if (!allowedRoles.has(roleParam)) return;

    setForm((current) => ({ ...current, role: roleParam }));
  }, [location.search]);

  const handleChange = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const dob = new Date(dateOfBirth);
    if (Number.isNaN(dob.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthGap = today.getMonth() - dob.getMonth();
    if (monthGap < 0 || (monthGap === 0 && today.getDate() < dob.getDate())) {
      age -= 1;
    }
    return age;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.mobile || !form.password) {
      setError('Name, email, mobile, and password are required.');
      return;
    }

    if (form.role === 'hr' && !String(form.companyName || '').trim()) {
      setError('Company name is required for HR registration.');
      return;
    }

    if (form.role === 'retired_employee') {
      if (!form.dateOfBirth) {
        setError('Date of birth is required for Retired Employee registration.');
        return;
      }

      const age = calculateAge(form.dateOfBirth);
      if (age === null) {
        setError('Please enter a valid date of birth.');
        return;
      }

      if (age < 60) {
        setError('You are not eligible for Retired Employee registration. Minimum age is 60 years.');
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const signupPayload = {
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        password: form.password,
        role: form.role,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        caste: form.caste,
        religion: form.religion
      };
      const response = await apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(signupPayload)
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.message || 'Unable to create account.');
        return;
      }

      const hrEmployerId = form.role === 'hr'
        ? generateHrEmployerId({ companyName: form.companyName, mobile: form.mobile })
        : '';
      const studentCandidateId = form.role === 'student'
        ? generateStudentCandidateId({ name: form.name, mobile: form.mobile })
        : '';
      const retiredEmployeeId = form.role === 'retired_employee'
        ? generateRetiredEmployeeId({ name: form.name, mobile: form.mobile })
        : '';

      const nextUser = form.role === 'hr'
        ? { ...payload.user, companyName: form.companyName, hrEmployerId }
        : form.role === 'student'
          ? { ...payload.user, studentCandidateId }
          : form.role === 'retired_employee'
            ? { ...payload.user, retiredEmployeeId }
          : payload.user;

      setAuthSession(payload.token, nextUser);

      if (payload.requiresOtpVerification) {
        navigate('/verify-otp', { state: { email: form.email }, replace: true });
        return;
      }

      const fallbackRedirect = payload.redirectTo || getDashboardPathByRole(nextUser?.role);
      const nextPath = nextUser?.role === 'retired_employee' && redirectAfterSignup
        ? redirectAfterSignup
        : fallbackRedirect;

      navigate(nextPath, { replace: true });
    } catch (requestError) {
      setError('Signup service unavailable. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startSocialSignup = (provider) => {
    setError('');

    if (form.role === 'hr' && !String(form.companyName || '').trim()) {
      setError('Company name is required for HR signup.');
      return;
    }

    if (form.role === 'retired_employee') {
      if (!form.dateOfBirth) {
        setError('Date of birth is required for Retired Employee signup.');
        return;
      }

      const age = calculateAge(form.dateOfBirth);
      if (age === null) {
        setError('Please enter a valid date of birth.');
        return;
      }

      if (age < 60) {
        setError('You are not eligible for Retired Employee registration. Minimum age is 60 years.');
        return;
      }
    }

    setSocialLoading(provider);
    const endpoint = apiUrl(`/auth/oauth/${provider}/start?role=${encodeURIComponent(form.role)}`);
    window.location.assign(endpoint);
  };

  return (
    <div className="auth-page auth-page--signup">
      <section className="auth-panel">
        <h1>Create Account</h1>
        <p>Register as recruiter, candidate, or retired employee. Admin role is controlled by configuration.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Name
            <input value={form.name} onChange={(event) => handleChange('name', event.target.value)} />
          </label>
          {form.role === 'hr' ? (
            <label>
              Company Name
              <input value={form.companyName} onChange={(event) => handleChange('companyName', event.target.value)} />
            </label>
          ) : null}
          <label>
            Role
            <select
              value={form.role}
              onChange={(event) => handleChange('role', event.target.value)}
              disabled={isSubmitting || Boolean(socialLoading)}
            >
              <option value="student">Student / Candidate</option>
              <option value="hr">HR / Recruiter</option>
              <option value="retired_employee">Retired Employee</option>
            </select>
          </label>
          <label>
            Mobile
            <input value={form.mobile} onChange={(event) => handleChange('mobile', event.target.value)} />
          </label>
          {form.role === 'hr' && form.companyName && form.mobile ? (
            <p className="module-note">
              HR ID Preview: {generateHrEmployerId({ companyName: form.companyName, mobile: form.mobile })}
            </p>
          ) : null}
          {form.role === 'student' && form.name && form.mobile ? (
            <p className="module-note">
              Student ID Preview: {generateStudentCandidateId({ name: form.name, mobile: form.mobile })}
            </p>
          ) : null}
          {form.role === 'retired_employee' && form.name && form.mobile ? (
            <p className="module-note">
              Retired ID Preview: {generateRetiredEmployeeId({ name: form.name, mobile: form.mobile })}
            </p>
          ) : null}
          <label>
            Date of Birth
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={(event) => handleChange('dateOfBirth', event.target.value)}
            />
          </label>
          {form.role === 'retired_employee' && form.dateOfBirth ? (
            <p className="module-note">
              Calculated age: {calculateAge(form.dateOfBirth) ?? '-'} years (Retired Employee requires 60+).
            </p>
          ) : null}
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
              Selected role: {
                form.role === 'hr'
                  ? 'HR / Recruiter'
                  : form.role === 'retired_employee'
                    ? 'Retired Employee'
                    : 'Student / Candidate'
              } (used on first social signup).
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
