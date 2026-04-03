import { PERMISSIONS } from '../constants/permissions';

export const hasPermission = (permissionSet = [], permission) => permissionSet.includes(permission);

export const normalizePermissionSet = (permissionSet = []) => PERMISSIONS.filter((permission) => permissionSet.includes(permission));

export const describePermission = (permission) => {
  return String(permission || '')
    .split('.')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};
