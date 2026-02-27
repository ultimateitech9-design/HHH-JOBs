import { Navigate, useParams } from 'react-router-dom';
import FooterContentPage from '../FooterContentPage';
import { BLOG_ARTICLE_PAGE_KEY_BY_SLUG } from '../footerPages';

const BlogArticlePage = () => {
  const { slug = '' } = useParams();
  const pageKey = BLOG_ARTICLE_PAGE_KEY_BY_SLUG[String(slug).trim().toLowerCase()] || '';

  if (!pageKey) {
    return <Navigate to="/blog" replace />;
  }

  return <FooterContentPage pageKey={pageKey} />;
};

export default BlogArticlePage;
