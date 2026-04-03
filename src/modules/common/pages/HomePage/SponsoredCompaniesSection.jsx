import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiMapPin, FiStar } from 'react-icons/fi';

import { getSponsoredCompanies } from '../../services/companyDirectoryApi';

const formatCount = (value) => Number(value || 0).toLocaleString();

const getInitials = (name = '') =>
  String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'CO';

const formatRating = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric.toFixed(1) : '';
};

const CompanyCard = ({ company }) => {
  const [logoError, setLogoError] = useState(false);
  const tags = Array.isArray(company.categories) ? company.categories.slice(0, 2) : [];
  const hasJobs = Number(company.totalJobs || 0) > 0;
  const metaLine = company.location || 'Approved partner on HHH Jobs';

  return (
    <article className="group flex h-full flex-col rounded-[32px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,250,252,0.9))] p-2 shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_68px_rgba(15,23,42,0.1)]">
      <div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white">
        <div className="relative overflow-hidden rounded-[26px] bg-[linear-gradient(155deg,rgba(15,23,42,1)_0%,rgba(30,41,59,0.98)_55%,rgba(217,119,6,0.88)_100%)] px-4 pb-4 pt-3.5 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(56,189,248,0.14),transparent_24%)] opacity-90" />

          <div className="relative z-10 flex items-start justify-between gap-3">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/88 backdrop-blur">
              <FiStar size={11} />
              Sponsor
            </span>
            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] backdrop-blur ${hasJobs ? 'border-emerald-200/60 bg-emerald-100/15 text-emerald-50' : 'border-white/15 bg-white/10 text-white/75'}`}>
              <FiCheckCircle size={11} />
              {hasJobs ? `${formatCount(company.totalJobs)} Roles` : 'Approved'}
            </span>
          </div>

          <div className="relative z-10 mt-4 flex items-center gap-3.5">
            <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[22px] border border-white/15 bg-white/95 p-2.5 shadow-lg shadow-black/10">
              {company.logoUrl && !logoError ? (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="max-h-[52px] max-w-[52px] object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span className="font-heading text-sm font-black text-navy">{getInitials(company.name)}</span>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="line-clamp-2 font-heading text-[1.48rem] font-black leading-tight text-white">
                {company.name}
              </h3>

              <div className="mt-2 flex items-center gap-2 text-[13px] font-semibold text-white/80">
                {company.sponsorRating ? (
                  <>
                    <span className="inline-flex items-center gap-1 text-amber-200">
                      <FiStar size={14} className="fill-current" />
                      {formatRating(company.sponsorRating)}
                    </span>
                    <span className="text-white/25">|</span>
                  </>
                ) : null}
                <span className="line-clamp-1">{company.sponsorReviewsLabel || 'Approved sponsor'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col px-4 pb-4 pt-3.5">
          <p className="line-clamp-2 min-h-[40px] text-center text-[13px] leading-5 text-slate-500">
            {metaLine}
          </p>

          {tags.length > 0 ? (
            <div className="mt-3 flex flex-col gap-2">
              {tags.map((item) => (
                <span
                  key={`${company.id}-${item}`}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-center text-[12px] font-semibold text-slate-600"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-3 flex justify-center">
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-semibold ${hasJobs ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
              <FiMapPin size={13} className={hasJobs ? 'text-emerald-600' : 'text-slate-400'} />
              <span>{hasJobs ? `${formatCount(company.totalJobs)} jobs listed` : 'No active jobs yet'}</span>
            </div>
          </div>

          <Link
            to={`/companies/${company.slug}`}
            className="mt-auto inline-flex items-center justify-center gap-2 pt-5 text-sm font-bold text-brand-700 transition hover:text-brand-800"
          >
            Visit Company
            <FiArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
};

const LoadingCard = () => (
  <div className="flex h-full flex-col rounded-[32px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,250,252,0.9))] p-2 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
    <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white">
      <div className="rounded-[26px] bg-slate-100 px-4 pb-4 pt-3.5">
        <div className="flex justify-between gap-3">
          <div className="h-6 w-24 rounded-full bg-slate-200" />
          <div className="h-6 w-20 rounded-full bg-slate-200" />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="h-14 w-14 rounded-[18px] bg-slate-200" />
          <div className="min-w-0 flex-1">
            <div className="h-7 rounded-full bg-slate-200" />
            <div className="mt-2 h-4 rounded-full bg-slate-200" />
          </div>
        </div>
      </div>
      <div className="px-4 pb-4 pt-3.5">
        <div className="h-10 rounded-2xl bg-slate-100" />
        <div className="mt-3 h-8 rounded-full bg-slate-100" />
        <div className="mt-2 h-8 rounded-full bg-slate-100" />
        <div className="mt-3 flex justify-center">
          <div className="h-8 w-36 rounded-full bg-slate-100" />
        </div>
        <div className="mt-5 h-5 rounded-full bg-slate-100" />
      </div>
    </div>
  </div>
);

export function SponsoredCompaniesSection() {
  const [sectionState, setSectionState] = useState({
    companies: [],
    summary: null,
    loading: true,
    error: ''
  });

  useEffect(() => {
    let mounted = true;

    const loadCompanies = async () => {
      setSectionState((current) => ({ ...current, loading: true, error: '' }));
      const response = await getSponsoredCompanies();
      if (!mounted) return;

      setSectionState({
        companies: response.data?.companies || [],
        summary: response.data?.summary || null,
        loading: false,
        error: response.error || ''
      });
    };

    loadCompanies();

    return () => {
      mounted = false;
    };
  }, []);

  const helperStats = useMemo(() => {
    const summary = sectionState.summary || {};
    return [
      `${formatCount(summary.totalSponsors || sectionState.companies.length)} approved sponsors`,
      `${formatCount(summary.sponsorsWithJobs || sectionState.companies.filter((company) => Number(company.totalJobs || 0) > 0).length)} sponsors with jobs`,
      `${formatCount(summary.totalOpenRoles || sectionState.companies.reduce((sum, company) => sum + Number(company.totalJobs || 0), 0))} listed roles`
    ];
  }, [sectionState.companies, sectionState.summary]);

  return (
    <section className="px-4 py-16 md:py-20">
      <div className="container mx-auto max-w-[1500px]">
        <div className="relative overflow-hidden rounded-[40px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.96))] px-5 py-10 shadow-[0_24px_80px_rgba(15,23,42,0.08)] md:px-8 md:py-12 xl:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.12),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(56,189,248,0.08),transparent_22%)]" />

          <div className="relative z-10">
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-700">Partner Spotlight</p>
              <h2 className="mt-4 font-heading text-4xl font-black leading-tight text-navy md:text-5xl">
                Sponsored <span className="text-brand-700">Companies</span>
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-slate-500 md:text-lg">
                This block is loaded from the sponsor companies table. If any sponsor posts jobs, clicking its card opens the same company hiring hub with all listed jobs.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {helperStats.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm"
                  >
                    {item}
                  </span>
                ))}
                <Link
                  to="/companies"
                  className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  Browse All Companies
                  <FiArrowRight size={15} />
                </Link>
              </div>
            </div>

            {sectionState.error ? (
              <div className="mx-auto mt-8 max-w-2xl rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-center text-sm text-red-700">
                {sectionState.error}
              </div>
            ) : null}

            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
              {sectionState.loading
                ? Array.from({ length: 5 }).map((_, index) => <LoadingCard key={index} />)
                : sectionState.companies.map((company) => (
                    <CompanyCard key={company.id} company={company} />
                  ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
