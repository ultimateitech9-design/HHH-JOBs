import { Link } from 'react-router-dom';
import { isExternalHref } from '../../../../shared/utils/externalLinks.js';

const PublicSidebarLinks = ({ title = 'Explore More', links = [] }) => {
  if (!links.length) return null;

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="font-heading text-xl font-bold text-navy">{title}</h3>
      <div className="mt-5 flex flex-col gap-3">
        {links.map((link) => {
          const isExternal = isExternalHref(link.to);
          const className =
            'flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-brand-100 hover:bg-brand-50 hover:text-brand-700';

          return isExternal ? (
            <a key={link.key || link.to} href={link.to} className={className}>
              <span>{link.label}</span>
              <span aria-hidden="true">›</span>
            </a>
          ) : (
            <Link
              key={link.key || link.to}
              to={link.to}
              className={className}
            >
              <span>{link.label}</span>
              <span aria-hidden="true">›</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default PublicSidebarLinks;
