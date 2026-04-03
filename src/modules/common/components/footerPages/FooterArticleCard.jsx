import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import AnimatedSection from '../../../../shared/components/AnimatedSection';

const FooterArticleCard = ({ section, delay = 0 }) => {
  return (
    <AnimatedSection delay={delay}>
      <Link
        to={section.to}
        className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-gold/25 hover:shadow-xl"
      >
        {section.image ? (
          <div className="relative overflow-hidden">
            <img
              src={section.image}
              alt={section.imageAlt || section.heading || 'Article cover'}
              className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {section.tag || section.readTime ? (
              <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                {section.tag ? (
                  <span className="rounded-full bg-white/92 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-navy shadow-sm">
                    {section.tag}
                  </span>
                ) : null}
                {section.readTime ? (
                  <span className="rounded-full bg-slate-950/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                    {section.readTime}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
        <div className="flex flex-1 flex-col p-7">
          <h3 className="font-heading text-2xl font-bold text-navy">{section.heading}</h3>
          {section.body ? <p className="mt-4 text-sm leading-7 text-slate-600">{section.body}</p> : null}
          {Array.isArray(section.items) && section.items.length > 0 ? (
            <div className="mt-6 grid gap-3">
              {section.items.slice(0, 3).map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <FiCheckCircle className="mt-1 shrink-0 text-brand-600" size={16} />
                  <p className="text-sm leading-6 text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          ) : null}
          <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition-all group-hover:gap-3">
            Read full article
            <FiArrowRight size={16} />
          </span>
        </div>
      </Link>
    </AnimatedSection>
  );
};

export default FooterArticleCard;
