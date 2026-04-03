import { Link } from 'react-router-dom';
import AnimatedSection from '../../../../shared/components/AnimatedSection';

const PublicFeatureCard = ({
  icon: Icon,
  title,
  description,
  badge,
  meta,
  to,
  ctaLabel,
  delay = 0
}) => {
  const content = (
    <div className="group rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-gold/25 hover:shadow-xl">
      {Icon ? (
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold-dark transition-all group-hover:gradient-gold group-hover:text-primary">
          <Icon size={22} />
        </div>
      ) : null}

      {badge ? (
        <span className="inline-flex rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">
          {badge}
        </span>
      ) : null}

      <h3 className="mt-4 font-heading text-xl font-bold text-navy">{title}</h3>
      {description ? (
        <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
      ) : null}
      {meta ? <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{meta}</p> : null}
      {ctaLabel ? (
        <span className="mt-6 inline-flex items-center text-sm font-semibold text-brand-700">
          {ctaLabel}
        </span>
      ) : null}
    </div>
  );

  return (
    <AnimatedSection delay={delay}>
      {to ? <Link to={to}>{content}</Link> : content}
    </AnimatedSection>
  );
};

export default PublicFeatureCard;
