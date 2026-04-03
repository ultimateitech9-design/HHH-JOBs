import { Link } from 'react-router-dom';

const PortalWorkbenchSupportCard = ({ support }) => {
  if (!support?.to) return null;

  return (
    <div className="mx-3 mb-3 rounded-[1.6rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-brand-700">
        {support.title || 'Quick guide'}
      </p>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-900">
        {support.text || 'Use the module shortcuts to stay aligned on daily work.'}
      </p>
      <Link
        to={support.to}
        className="mt-4 inline-flex w-full items-center justify-center rounded-full gradient-gold px-4 py-2.5 text-sm font-semibold text-primary shadow-sm"
      >
        {support.cta || 'Open guide'}
      </Link>
    </div>
  );
};

export default PortalWorkbenchSupportCard;
