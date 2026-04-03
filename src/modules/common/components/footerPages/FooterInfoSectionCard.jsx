import { FiCheckCircle } from 'react-icons/fi';
import AnimatedSection from '../../../../shared/components/AnimatedSection';

const FooterInfoSectionCard = ({ section, delay = 0 }) => {
  return (
    <AnimatedSection delay={delay}>
      <article className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
        {section.image ? (
          <div className="mb-6 overflow-hidden rounded-[1.5rem] border border-slate-100">
            <img
              src={section.image}
              alt={section.imageAlt || section.heading || 'Section cover'}
              className="h-56 w-full object-cover"
              loading="lazy"
            />
          </div>
        ) : null}
        {section.tag || section.readTime ? (
          <div className="mb-4 flex flex-wrap gap-2">
            {section.tag ? (
              <span className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">
                {section.tag}
              </span>
            ) : null}
            {section.readTime ? (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                {section.readTime}
              </span>
            ) : null}
          </div>
        ) : null}
        <h3 className="font-heading text-2xl font-bold text-navy">{section.heading}</h3>
        {section.body ? <p className="mt-4 text-sm leading-7 text-slate-600">{section.body}</p> : null}
        {Array.isArray(section.items) && section.items.length > 0 ? (
          <div className="mt-6 grid gap-3">
            {section.items.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                <FiCheckCircle className="mt-1 shrink-0 text-brand-600" size={16} />
                <p className="text-sm leading-6 text-slate-600">{item}</p>
              </div>
            ))}
          </div>
        ) : null}
      </article>
    </AnimatedSection>
  );
};

export default FooterInfoSectionCard;
