import { Link } from 'react-router-dom';
import AnimatedSection from '../../../../shared/components/AnimatedSection';

const wrapperToneClass = {
  dark: 'bg-gradient-to-br from-slate-950 via-brand-700 to-indigo-700 text-white',
  light: 'border border-gold/15 bg-gold/5 text-navy'
};

const PublicCallToAction = ({
  eyebrow,
  title,
  description,
  actions = [],
  chips = [],
  tone = 'dark'
}) => {
  const isDark = tone === 'dark';

  return (
    <AnimatedSection>
      <section className={`relative overflow-hidden rounded-[2.4rem] px-8 py-10 shadow-xl md:px-12 md:py-14 ${wrapperToneClass[tone]}`}>
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-gold/15 blur-3xl" />

        <div className="relative z-10 text-center">
          {eyebrow ? (
            <p className={`text-xs font-black uppercase tracking-[0.24em] ${isDark ? 'text-white/65' : 'text-brand-700'}`}>
              {eyebrow}
            </p>
          ) : null}

          <h2 className={`mt-4 font-heading text-3xl font-extrabold md:text-4xl ${isDark ? 'text-white' : 'text-navy'}`}>
            {title}
          </h2>
          {description ? (
            <p className={`mx-auto mt-4 max-w-2xl text-base leading-8 ${isDark ? 'text-white/74' : 'text-slate-600'}`}>
              {description}
            </p>
          ) : null}

          {chips.length > 0 ? (
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    isDark
                      ? 'border border-white/15 bg-white/10 text-white/86'
                      : 'border border-brand-100 bg-white text-slate-600'
                  }`}
                >
                  {chip}
                </span>
              ))}
            </div>
          ) : null}

          {actions.length > 0 ? (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {actions.map((action, index) => (
                <Link
                  key={`${action.label}-${action.to}`}
                  to={action.to}
                  className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                    index === 0
                      ? isDark
                        ? 'gradient-gold text-primary shadow-lg shadow-gold/20'
                        : 'bg-navy text-white'
                      : isDark
                        ? 'border border-white/18 bg-white/10 text-white'
                        : 'border border-slate-200 bg-white text-navy'
                  }`}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </AnimatedSection>
  );
};

export default PublicCallToAction;
