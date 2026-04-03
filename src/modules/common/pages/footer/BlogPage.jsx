import { useEffect } from 'react';
import { BLOG_BASE_URL } from '../../../../shared/utils/externalLinks.js';

const BlogPage = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.replace(BLOG_BASE_URL);
    }
  }, []);

  return (
    <div className="mx-auto flex min-h-[320px] max-w-3xl items-center justify-center px-4 py-16 text-center">
      <a
        href={BLOG_BASE_URL}
        className="inline-flex rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white"
      >
        Continue to HHH Jobs Blog
      </a>
    </div>
  );
};

export default BlogPage;
