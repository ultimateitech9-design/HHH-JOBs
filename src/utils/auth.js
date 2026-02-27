const TOKEN_KEY = 'job_portal_token';
const USER_KEY = 'job_portal_user';

const notifyAuthChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth-changed'));
  }
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getCurrentUser = () => {
  const rawUser = localStorage.getItem(USER_KEY);
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser);
  } catch (error) {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const setAuthSession = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  notifyAuthChange();
};

export const clearAuthSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  notifyAuthChange();
};

export const isAuthenticated = () => Boolean(getToken());

export const getUserRole = () => getCurrentUser()?.role || null;

export const getDashboardPathByRole = (role) => {
  if (role === 'admin') return '/portal/admin/dashboard';
  if (role === 'hr') return '/portal/hr/dashboard';
  return '/portal/student/dashboard';
};

export const getDashboardPath = () => getDashboardPathByRole(getUserRole());

export const hasRole = (allowedRoles = []) => {
  const role = getUserRole();
  return allowedRoles.includes(role);
};
