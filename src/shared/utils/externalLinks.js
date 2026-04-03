export const BLOG_BASE_URL = 'https://blog.hhh-jobs.com';

export const isExternalHref = (value = '') =>
  /^(?:https?:)?\/\//i.test(String(value || '').trim());

const normalizePathSegment = (value = '') =>
  String(value || '')
    .trim()
    .replace(/^\/+|\/+$/g, '');

export const buildBlogUrl = ({ slug = '', search = '', hash = '' } = {}) => {
  const normalizedSlug = normalizePathSegment(slug);
  const normalizedSearch = String(search || '').trim();
  const normalizedHash = String(hash || '').trim();

  return `${BLOG_BASE_URL}${normalizedSlug ? `/${normalizedSlug}` : ''}${normalizedSearch}${normalizedHash}`;
};
