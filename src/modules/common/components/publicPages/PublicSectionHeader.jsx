import AnimatedSection from '../../../../shared/components/AnimatedSection';

const PublicSectionHeader = ({ eyebrow, title, description, centered = false, className = '' }) => {
  return (
    <AnimatedSection className={className}>
      <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
        {eyebrow ? (
          <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-700">{eyebrow}</p>
        ) : null}
        <h2 className="mt-3 font-heading text-3xl font-extrabold text-navy md:text-4xl">{title}</h2>
        {description ? (
          <p className="mt-4 text-base leading-8 text-slate-600">{description}</p>
        ) : null}
      </div>
    </AnimatedSection>
  );
};

export default PublicSectionHeader;
