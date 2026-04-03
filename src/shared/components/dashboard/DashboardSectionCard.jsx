const DashboardSectionCard = ({
  eyebrow,
  title,
  subtitle,
  action,
  className = '',
  bodyClassName = '',
  children
}) => {
  return (
    <section className={`rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-7 ${className}`.trim()}>
      {(eyebrow || title || subtitle || action) ? (
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            {eyebrow ? (
              <p className="mb-2 text-xs font-black uppercase tracking-[0.24em] text-brand-700">{eyebrow}</p>
            ) : null}
            {title ? <h2 className="font-heading text-2xl font-extrabold text-navy">{title}</h2> : null}
            {subtitle ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{subtitle}</p> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}

      <div className={bodyClassName}>{children}</div>
    </section>
  );
};

export default DashboardSectionCard;
