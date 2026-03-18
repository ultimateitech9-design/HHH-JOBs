import { apiFetch } from '../../../utils/api';
import {
  createManagedAccount,
  deleteManagedAccount,
  filterDeletedUsers,
  findManagedAccountByEmail,
  getManagedAccounts,
  markUserDeleted
} from '../../../utils/managedUsers';
import { adminDummyData } from '../data/adminDummyData';

export const SUPER_ADMIN_BASE = '/super-admin';

export const clone = (value) => {
  if (value === null || value === undefined) return value;
  return JSON.parse(JSON.stringify(value));
};

export const parseJson = async (response) => {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const strictRequest = async ({ path, options, extract = (payload) => payload }) => {
  const response = await apiFetch(path, options);
  const payload = await parseJson(response);

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed with status ${response.status}`);
  }

  return extract(payload || {});
};

export const safeRequest = async ({ path, options, emptyData, fallbackData, extract = (payload) => payload }) => {
  try {
    const data = await strictRequest({ path, options, extract });
    return { data, isDemo: false, error: '' };
  } catch (error) {
    const fallback = typeof fallbackData === 'function' ? fallbackData() : fallbackData;
    return {
      data: clone(fallback !== undefined ? fallback : emptyData),
      isDemo: true,
      error: error.message || 'Request failed.'
    };
  }
};

const filterUsers = (users, filters = {}) => {
  return users.filter((user) => {
    const search = String(filters.search || '').toLowerCase();
    const matchesSearch = !search || [user.name, user.email, user.company, user.id].some((value) => String(value || '').toLowerCase().includes(search));
    const matchesRole = !filters.role || user.role === filters.role;
    const matchesStatus = !filters.status || user.status === filters.status;
    return matchesSearch && matchesRole && matchesStatus;
  });
};

const mapManagedAccountToUser = (account) => ({
  id: account.id,
  name: account.name,
  email: account.email,
  role: account.role,
  company: account.department || 'HHH Jobs',
  status: account.status || 'active',
  verified: true,
  lastActiveAt: account.last_login_at || null,
  createdAt: account.created_at || new Date().toISOString()
});

const buildVisibleUsers = (filters = {}) => {
  const mergedUsers = [
    ...adminDummyData.users,
    ...getManagedAccounts().map(mapManagedAccountToUser)
  ];

  return filterDeletedUsers(filterUsers(mergedUsers, filters));
};

export const getUsers = async (filters = {}) =>
  safeRequest({
    path: `${SUPER_ADMIN_BASE}/users`,
    emptyData: [],
    fallbackData: () => buildVisibleUsers(filters),
    extract: (payload) => {
      const apiUsers = Array.isArray(payload?.users) ? payload.users : [];
      const managedUsers = getManagedAccounts().map(mapManagedAccountToUser);
      return filterDeletedUsers(filterUsers([...apiUsers, ...managedUsers], filters));
    }
  });

export const updateUserStatus = async (userId, status) => {
  try {
    return await strictRequest({
      path: `${SUPER_ADMIN_BASE}/users/${userId}/status`,
      options: { method: 'PATCH', body: JSON.stringify({ status }) },
      extract: (payload) => payload?.user || payload
    });
  } catch (error) {
    return { ...(adminDummyData.users.find((user) => user.id === userId) || {}), status };
  }
};

export const createAdminUser = async (payload) => {
  const managedRole = String(payload.role || 'admin').trim().toLowerCase();
  const managedPayload = {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role: managedRole === 'data_entry' ? 'dataentry' : managedRole
  };

  if (!findManagedAccountByEmail(managedPayload.email)) {
    createManagedAccount(managedPayload);
  }

  try {
    return await strictRequest({
      path: `${SUPER_ADMIN_BASE}/users`,
      options: { method: 'POST', body: JSON.stringify(payload) },
      extract: (response) => response?.user || response
    });
  } catch (error) {
    const nextId = `USR-${1000 + adminDummyData.users.length + 1}`;
    return {
      id: nextId,
      name: payload.name,
      email: payload.email,
      role: managedPayload.role,
      company: payload.company || 'HHH Jobs',
      status: 'active',
      verified: true,
      lastActiveAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
  }
};

export const deleteUser = async (userId) => {
  if (String(userId).startsWith('managed-')) {
    return deleteManagedAccount(userId);
  }

  try {
    const deletedUser = await strictRequest({
      path: `${SUPER_ADMIN_BASE}/users/${userId}`,
      options: { method: 'DELETE' },
      extract: (response) => response?.deletedUser || { id: userId }
    });
    markUserDeleted(userId);
    return deletedUser;
  } catch (error) {
    markUserDeleted(userId);
    return adminDummyData.users.find((user) => user.id === userId) || { id: userId };
  }
};
