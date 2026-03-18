const TOKEN_KEY = 'job_portal_token';
const USER_KEY = 'job_portal_user';

const DELETED_USERS_KEY = 'hhh_jobs_deleted_user_ids';

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
    const user = JSON.parse(rawUser);
    const deletedRaw = localStorage.getItem(DELETED_USERS_KEY);
    const deletedIds = deletedRaw ? JSON.parse(deletedRaw) : [];

    if (Array.isArray(deletedIds) && deletedIds.includes(user?.id)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      notifyAuthChange();
      return null;
    }

    return user;
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

export const isAuthenticated = () => Boolean(getToken() && getCurrentUser());

export const normalizeRole = (role) => {
  const normalized = String(role || '').trim().toLowerCase().replace(/[\s-]+/g, '_');
  if (!normalized) return null;
  if (normalized === 'data_entry') return 'dataentry';
  if (normalized === 'superadmin') return 'super_admin';
  return normalized;
};

export const getUserRole = () => normalizeRole(getCurrentUser()?.role);

export const getDashboardPathByRole = (role) => {
  const normalizedRole = normalizeRole(role);
  if (normalizedRole === 'super_admin') return '/portal/super-admin/dashboard';
  if (normalizedRole === 'admin') return '/portal/admin/dashboard';
  if (normalizedRole === 'hr') return '/portal/hr/dashboard';
  if (normalizedRole === 'dataentry') return '/portal/dataentry/dashboard';
  if (normalizedRole === 'support') return '/portal/support/dashboard';
  if (normalizedRole === 'accounts') return '/portal/accounts/overview';
  if (normalizedRole === 'sales') return '/portal/sales/overview';
  if (normalizedRole === 'retired_employee') return '/portal/student/dashboard';
  return '/portal/student/dashboard';
};

export const getDashboardPath = () => getDashboardPathByRole(getUserRole());

export const canAccessRole = (currentRole, allowedRole) => {
  const normalizedCurrentRole = normalizeRole(currentRole);
  const normalizedAllowedRole = normalizeRole(allowedRole);
  if (!normalizedCurrentRole || !normalizedAllowedRole) return false;
  return normalizedCurrentRole === normalizedAllowedRole;
};

export const hasRole = (allowedRoles = []) => {
  const currentRole = getUserRole();
  return allowedRoles.some((allowedRole) => canAccessRole(currentRole, allowedRole));
};
