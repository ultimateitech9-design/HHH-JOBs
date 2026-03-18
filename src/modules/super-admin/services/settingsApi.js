import { adminDummyData } from '../data/adminDummyData';
import { SUPER_ADMIN_BASE, safeRequest, strictRequest } from './usersApi';

export const getRolesPermissions = async () =>
  safeRequest({
    path: `${SUPER_ADMIN_BASE}/roles-permissions`,
    emptyData: [],
    fallbackData: adminDummyData.rolesPermissions,
    extract: (payload) => payload?.roles || []
  });

export const getSystemSettings = async () =>
  safeRequest({
    path: `${SUPER_ADMIN_BASE}/settings`,
    emptyData: {},
    fallbackData: adminDummyData.systemSettings,
    extract: (payload) => payload?.settings || payload || {}
  });

export const saveSystemSettings = async (settings) => {
  try {
    return await strictRequest({
      path: `${SUPER_ADMIN_BASE}/settings`,
      options: { method: 'PUT', body: JSON.stringify(settings) },
      extract: (payload) => payload?.settings || payload
    });
  } catch (error) {
    return settings;
  }
};

export const saveRolesPermissions = async (roles) => {
  try {
    return await strictRequest({
      path: `${SUPER_ADMIN_BASE}/roles-permissions`,
      options: { method: 'PUT', body: JSON.stringify({ roles }) },
      extract: (payload) => payload?.roles || payload
    });
  } catch (error) {
    return roles;
  }
};
