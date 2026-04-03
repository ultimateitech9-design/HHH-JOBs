import { Link } from 'react-router-dom';
import PublicSidebarLinks from '../publicPages/PublicSidebarLinks';

const FooterPageAside = ({
  relatedLinks = [],
  title = 'Need direct help?',
  description = 'Connect with the HHH Jobs team for platform support, hiring guidance, or account questions.',
  primaryAction = { label: 'Contact support', to: '/contact-us' },
  secondaryAction = { label: 'Explore services', to: '/services' }
}) => {
  return (
    <div className="space-y-6">
      <PublicSidebarLinks title="Explore More" links={relatedLinks} />
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-brand-700 to-indigo-700 p-6 text-white shadow-xl">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-white/65">Support</p>
        <h3 className="mt-4 font-heading text-2xl font-bold">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-white/72">{description}</p>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            to={primaryAction.to}
            className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-navy transition-all hover:-translate-y-0.5"
          >
            {primaryAction.label}
          </Link>
          <Link
            to={secondaryAction.to}
            className="inline-flex items-center justify-center rounded-full border border-white/18 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/16"
          >
            {secondaryAction.label}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FooterPageAside;
