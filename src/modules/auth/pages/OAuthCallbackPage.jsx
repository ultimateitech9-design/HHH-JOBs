import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getDashboardPathByRole, setAuthSession } from '../../../utils/auth';
import { generateRetiredEmployeeId, generateStudentCandidateId } from '../../../utils/hrIdentity';

const decodeBase64Url = (value) => {
  const normalized = String(value || '').replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (normalized.length % 4)) % 4);
  return atob(normalized + padding);
};

const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const userEncoded = searchParams.get('user');
    const redirectTo = searchParams.get('redirectTo');
    const providerError = searchParams.get('error');

    if (providerError) {
      setError(providerError);
      return;
    }

    if (!token || !userEncoded) {
      setError('Social login response is incomplete. Please try again.');
      return;
    }

    try {
      const decodedUser = JSON.parse(decodeBase64Url(userEncoded));
      const nextUser = decodedUser?.role === 'student'
        ? {
          ...decodedUser,
          studentCandidateId: decodedUser?.studentCandidateId || generateStudentCandidateId({
            name: decodedUser?.name || '',
            mobile: decodedUser?.mobile || decodedUser?.phone || ''
          })
        }
        : decodedUser?.role === 'retired_employee'
          ? {
            ...decodedUser,
            retiredEmployeeId: decodedUser?.retiredEmployeeId || generateRetiredEmployeeId({
              name: decodedUser?.name || '',
              mobile: decodedUser?.mobile || decodedUser?.phone || ''
            })
          }
          : decodedUser;
      setAuthSession(token, nextUser);
      navigate(redirectTo || getDashboardPathByRole(nextUser?.role), { replace: true });
    } catch (decodeError) {
      setError('Unable to process social login response. Please try again.');
    }
  }, [navigate, searchParams]);

  return (
    <div className="auth-page auth-page--oauth">
      <section className="auth-panel">
        <h1>Finishing Sign In</h1>
        <p>{error || 'Please wait while we complete your social login.'}</p>
        {error ? (
          <div className="auth-links">
            <Link to="/login">Back to login</Link>
            <Link to="/sign-up">Create account manually</Link>
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default OAuthCallbackPage;
