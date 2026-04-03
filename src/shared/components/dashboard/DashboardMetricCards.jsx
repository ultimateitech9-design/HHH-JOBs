import { isValidElement } from 'react';

const toneMap = {
  default: {
    border: 'border-slate-200',
    surface: 'bg-slate-100 text-slate-700',
    glow: 'bg-slate-100'
  },
  info: {
    border: 'border-sky-100',
    surface: 'bg-sky-100 text-sky-700',
    glow: 'bg-sky-100'
  },
  success: {
    border: 'border-emerald-100',
    surface: 'bg-emerald-100 text-emerald-700',
    glow: 'bg-emerald-100'
  },
  warning: {
    border: 'border-amber-100',
    surface: 'bg-amber-100 text-amber-700',
    glow: 'bg-amber-100'
  },
  danger: {
    border: 'border-red-100',
    surface: 'bg-red-100 text-red-700',
    glow: 'bg-red-100'
  },
  accent: {
    border: 'border-brand-100',
    surface: 'bg-brand-100 text-brand-700',
    glow: 'bg-brand-100'
  }
};

const renderIcon = (icon) => {
  if (!icon) return null;
  if (isValidElement(icon)) return icon;
  const Icon = icon;
  return <Icon className="h-5 w-5" />;
};

const DashboardMetricCards = ({ cards = [], className = '' }) => {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-4 ${className}`.trim()}>
      {cards.map((card) => {
        const tone = toneMap[card.tone] || toneMap.default;

        return (
          <article
            key={card.label}
            className={`group relative overflow-hidden rounded-[2rem] border bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${tone.border}`}
          >
            <div className={`pointer-events-none absolute -right-7 -top-8 h-24 w-24 rounded-full opacity-60 transition-transform group-hover:scale-125 ${tone.glow}`} />

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-500">{card.label}</p>
                  <p className="mt-3 font-heading text-3xl font-extrabold text-navy">{card.value}</p>
                </div>
                {card.icon ? (
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone.surface}`}>
                    {renderIcon(card.icon)}
                  </div>
                ) : null}
              </div>

              {card.helper ? (
                <p className={`mt-4 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tone.surface}`}>
                  {card.helper}
                </p>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default DashboardMetricCards;
