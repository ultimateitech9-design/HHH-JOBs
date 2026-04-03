import { apiFetch } from '../../../utils/api';

const parseJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export const getPublicCompanies = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);

  const query = params.toString();
  const path = query ? `/companies?${query}` : '/companies';

  try {
    const response = await apiFetch(path);
    const payload = await parseJson(response);

    if (!response.ok) {
      return {
        data: { companies: [], summary: null },
        error: payload?.message || `Request failed (${response.status})`
      };
    }

    return {
      data: {
        companies: payload?.companies || [],
        summary: payload?.summary || null
      },
      error: ''
    };
  } catch (error) {
    return {
      data: { companies: [], summary: null },
      error: error.message || 'Unable to load companies'
    };
  }
};

export const getSponsoredCompanies = async () => {
  try {
    const response = await apiFetch('/companies/sponsors');
    const payload = await parseJson(response);

    if (!response.ok) {
      return {
        data: { companies: [], summary: null },
        error: payload?.message || `Request failed (${response.status})`
      };
    }

    return {
      data: {
        companies: payload?.companies || [],
        summary: payload?.summary || null
      },
      error: ''
    };
  } catch (error) {
    return {
      data: { companies: [], summary: null },
      error: error.message || 'Unable to load sponsor companies'
    };
  }
};

export const getPublicCompanyDetail = async (companySlug) => {
  const slug = String(companySlug || '').trim();

  if (!slug) {
    return {
      data: { company: null, jobs: { total: 0, portal: [], external: [] } },
      error: 'Company slug is required'
    };
  }

  try {
    const response = await apiFetch(`/companies/${encodeURIComponent(slug)}`);
    const payload = await parseJson(response);

    if (!response.ok) {
      return {
        data: { company: null, jobs: { total: 0, portal: [], external: [] } },
        error: payload?.message || `Request failed (${response.status})`
      };
    }

    return {
      data: {
        company: payload?.company || null,
        jobs: payload?.jobs || { total: 0, portal: [], external: [] }
      },
      error: ''
    };
  } catch (error) {
    return {
      data: { company: null, jobs: { total: 0, portal: [], external: [] } },
      error: error.message || 'Unable to load company details'
    };
  }
};
