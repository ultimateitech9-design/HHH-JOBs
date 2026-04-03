const SectionHeader = ({ eyebrow, title, subtitle, action }) => {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em] text-brand-700">{eyebrow}</p>
        ) : null}
        <h2 className="font-heading text-2xl font-extrabold text-navy md:text-3xl">{title}</h2>
        {subtitle ? <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
};

export default SectionHeader;
