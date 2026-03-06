import { clearAuthSession, getToken } from './auth';

const configuredApiBase =
  import.meta.env.VITE_API_BASE_URL
  || import.meta.env.VITE_API_URL
  || '';

const runtimeFallbackBase = import.meta.env.DEV
  ? 'http://localhost:5500'
  : (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5500');

export const API_BASE_URL = String(configuredApiBase || runtimeFallbackBase).replace(/\/+$/, '');

export const apiUrl = (path = '') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export const apiFetch = async (path, options = {}) => {
  const token = getToken();
  const headers = { ...(options.headers || {}) };

  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type'] && !headers['content-type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token && !headers.Authorization && !headers.authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const targetUrl = apiUrl(path);
  let response;
  try {
    response = await fetch(targetUrl, {
      ...options,
      headers
    });
  } catch (error) {
    throw new Error(`Unable to connect to server (${targetUrl}). Please check backend is running.`);
  }

  if (response.status === 401) {
    clearAuthSession();
  }

  return response;
};
