import { Link } from 'react-router-dom';

const toneClasses = {
  brand: 'from-slate-950 via-brand-700 to-indigo-700',
  student: 'from-slate-950 via-brand-700 to-sky-700',
  hr: 'from-stone-950 via-amber-700 to-sky-700',
  admin: 'from-slate-950 via-brand-700 to-cyan-700',
  superAdmin: 'from-slate-950 via-brand-700 to-blue-700',
  dataentry: 'from-slate-950 via-brand-700 to-orange-600',
  accounts: 'from-slate-950 via-emerald-700 to-brand-700',
  sales: 'from-slate-950 via-brand-700 to-rose-700',
  support: 'from-slate-950 via-violet-700 to-brand-700',
  platform: 'from-slate-950 via-sky-800 to-teal-700',
  audit: 'from-slate-950 via-orange-700 to-sky-800'
};

const PortalDashboardHero = ({
  tone = 'brand',
  eyebrow,
  badge,
  title,
  description,
  chips = [],
  primaryAction,
  secondaryAction,
  metrics = [],
  aside
}) => {
  const gradientClass = toneClasses[tone] || toneClasses.brand;

  return (
    <section className={`relative overflow-hidden rounded-[2.25rem] bg-gradient-to-br px-6 py-7 text-white shadow-xl md:px-8 md:py-9 ${gradientClass}`}>
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/12 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 left-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

      <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_360px] xl:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            {eyebrow ? (
              <p className="text-xs font-black uppercase tracking-[0.28em] text-white/70">{eyebrow}</p>
            ) : null}
            {badge ? (
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white/85 backdrop-blur-sm">
                {badge}
              </span>
            ) : null}
          </div>

          <h1 className="mt-4 max-w-3xl font-heading text-3xl font-extrabold leading-tight md:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/78 md:text-base">
              {description}
            </p>
          ) : null}

          {chips.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex rounded-full border border-white/18 bg-white/8 px-3 py-1 text-xs font-semibold text-white/88"
                >
                  {chip}
                </span>
              ))}
            </div>
          ) : null}

          {(primaryAction || secondaryAction) ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {primaryAction ? (
                <Link
                  to={primaryAction.to}
                  className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-900 transition-transform hover:-translate-y-0.5"
                >
                  {primaryAction.label}
                </Link>
              ) : null}
              {secondaryAction ? (
                <Link
                  to={secondaryAction.to}
                  className="inline-flex items-center justify-center rounded-full border border-white/18 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/16"
                >
                  {secondaryAction.label}
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="grid gap-3">
          {aside ||
            metrics.map((metric) => (
              <article
                key={metric.label}
                className="rounded-[1.4rem] border border-white/15 bg-slate-950/18 px-4 py-4 backdrop-blur-md"
              >
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/58">{metric.label}</p>
                <p className="mt-2 text-3xl font-black text-white">{metric.value}</p>
                {metric.helper ? <p className="mt-2 text-sm text-white/74">{metric.helper}</p> : null}
              </article>
            ))}
        </div>
      </div>
    </section>
  );
};

export default PortalDashboardHero;
