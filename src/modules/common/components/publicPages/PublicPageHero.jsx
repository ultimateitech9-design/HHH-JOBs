import { Link } from 'react-router-dom';
import AnimatedSection from '../../../../shared/components/AnimatedSection';

const buttonClassByVariant = {
  primary: 'gradient-gold text-primary shadow-lg shadow-gold/20',
  secondary: 'border border-white/18 bg-white/10 text-white backdrop-blur-sm hover:bg-white/16',
  ghost: 'border border-slate-200 bg-white text-navy hover:bg-slate-50'
};

const PublicPageHero = ({
  eyebrow,
  title,
  description,
  actions = [],
  chips = [],
  metrics = [],
  media,
  aside,
  className = ''
}) => {
  return (
    <section className={`relative overflow-hidden px-4 py-16 md:py-24 ${className}`.trim()}>
      <div className="absolute left-8 top-10 h-72 w-72 rounded-full bg-gold/8 blur-3xl" />
      <div className="absolute bottom-0 right-8 h-80 w-80 rounded-full bg-brand-500/10 blur-3xl" />

      <div className="container relative z-10 mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <AnimatedSection>
            <div className="max-w-3xl">
              {eyebrow ? (
                <span className="inline-flex items-center rounded-full border border-gold/20 bg-gold/10 px-4 py-1.5 text-sm font-semibold text-gold-dark">
                  {eyebrow}
                </span>
              ) : null}

              <div className="mt-6">
                <h1 className="font-heading text-4xl font-extrabold leading-tight text-navy md:text-5xl">
                  {title}
                </h1>
                {description ? (
                  <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                    {description}
                  </p>
                ) : null}
              </div>

              {chips.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-slate-200 bg-white/85 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              ) : null}

              {actions.length > 0 ? (
                <div className="mt-8 flex flex-wrap gap-3">
                  {actions.map((action) => (
                    <Link
                      key={`${action.label}-${action.to || action.href}`}
                      to={action.to}
                      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                        buttonClassByVariant[action.variant || 'primary']
                      }`}
                    >
                      {action.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.12}>
            {aside ? (
              aside
            ) : media ? (
              <div className="relative">
                <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-br from-gold/20 via-brand-500/10 to-transparent blur-xl" />
                <img
                  src={media.src}
                  alt={media.alt}
                  className="relative z-10 w-full rounded-[2rem] border border-white/60 object-cover shadow-2xl"
                />
              </div>
            ) : null}
          </AnimatedSection>
        </div>

        {metrics.length > 0 ? (
          <AnimatedSection delay={0.18} className="mt-10">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => (
                <article
                  key={metric.label}
                  className="rounded-[1.6rem] border border-slate-200 bg-white/88 p-5 shadow-sm backdrop-blur-sm"
                >
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    {metric.label}
                  </p>
                  <p className="mt-3 font-heading text-3xl font-extrabold text-navy">
                    {metric.value}
                  </p>
                  {metric.helper ? (
                    <p className="mt-2 text-sm leading-6 text-slate-500">{metric.helper}</p>
                  ) : null}
                </article>
              ))}
            </div>
          </AnimatedSection>
        ) : null}
      </div>
    </section>
  );
};

export default PublicPageHero;
