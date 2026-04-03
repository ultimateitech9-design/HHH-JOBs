import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FooterContentPage from '../FooterContentPage';
import { BLOG_ARTICLE_PAGE_KEY_BY_SLUG } from '../footerPages';

const BlogArticlePage = () => {
  const { slug = '' } = useParams();
  const pageKey = BLOG_ARTICLE_PAGE_KEY_BY_SLUG[String(slug).trim().toLowerCase()] || '';

  useEffect(() => {
    if (!pageKey && typeof window !== 'undefined') {
      window.location.replace('https://blog.hhh-jobs.com');
    }
  }, [pageKey]);

  if (!pageKey) return null;

  return <FooterContentPage pageKey={pageKey} />;
};

export default BlogArticlePage;
