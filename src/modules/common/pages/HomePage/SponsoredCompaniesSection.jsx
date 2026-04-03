import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiCheckCircle,
  FiLock,
  FiMapPin,
  FiShield,
  FiStar
} from 'react-icons/fi';

import useAuthStore from '../../../../core/auth/authStore';
import { getCompanyEntryIntent } from '../../utils/publicAccess';
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

const CompanyCard = ({ company, isAuthenticated }) => {
  const [logoError, setLogoError] = useState(false);
  const tags = Array.isArray(company.categories) ? company.categories.slice(0, 2) : [];
  const hasJobs = Number(company.totalJobs || 0) > 0;
  const metaLine = company.location || 'Approved partner on HHH Jobs';
  const entryIntent = getCompanyEntryIntent({
    companySlug: company.slug,
    isAuthenticated,
    totalJobs: company.totalJobs
  });

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[34px] border border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.9))] p-2 shadow-[0_22px_70px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_90px_rgba(15,23,42,0.14)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.2),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.12),transparent_24%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10 flex h-full flex-col overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/95">
        <div className="relative overflow-hidden bg-[linear-gradient(145deg,rgba(15,23,42,1)_0%,rgba(30,41,59,0.98)_54%,rgba(217,119,6,0.92)_100%)] px-4 pb-4 pt-3.5 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(56,189,248,0.18),transparent_24%)] opacity-90" />

          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/88 backdrop-blur">
                <FiStar size={11} />
                Sponsor
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/45 bg-emerald-100/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-50 backdrop-blur">
                <FiCheckCircle size={11} />
                Approved
              </span>
            </div>

            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] backdrop-blur ${
                isAuthenticated
                  ? 'border-amber-200/60 bg-amber-100/15 text-amber-50'
                  : 'border-white/15 bg-white/10 text-white/80'
              }`}
            >
              {isAuthenticated ? <FiShield size={11} /> : <FiLock size={11} />}
              {isAuthenticated ? entryIntent.accessLabel : 'Members only'}
            </span>
          </div>

          <div className="relative z-10 mt-3.5 flex items-center gap-3">
            <div className="flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-[20px] border border-white/15 bg-white/95 p-2 shadow-lg shadow-black/10">
              {company.logoUrl && !logoError ? (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="max-h-[46px] max-w-[46px] object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span className="font-heading text-sm font-black text-navy">{getInitials(company.name)}</span>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="line-clamp-2 font-heading text-[1.38rem] font-black leading-tight text-white">
                {company.name}
              </h3>

              <div className="mt-1.5 flex items-center gap-2 text-[12px] font-semibold text-white/80">
                {company.sponsorRating ? (
                  <>
                    <span className="inline-flex items-center gap-1 text-amber-200">
                      <FiStar size={14} className="fill-current" />
                      {formatRating(company.sponsorRating)}
                    </span>
                    <span className="text-white/25">|</span>
                  </>
                ) : null}
                <span className="line-clamp-1">{company.sponsorReviewsLabel || 'Premium sponsor'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col px-4 pb-3.5 pt-3">
          <p className="line-clamp-2 min-h-[34px] text-[13px] leading-5 text-slate-500">{metaLine}</p>

          {tags.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.map((item) => (
                <span
                  key={`${company.id}-${item}`}
                  className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-600"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-3 rounded-[22px] border border-slate-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.94))] px-3.5 py-3 shadow-[0_16px_35px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Access Layer</p>
                <p className="mt-1.5 text-[13px] font-semibold text-slate-700">{entryIntent.accessLabel}</p>
              </div>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-[18px] ${
                  isAuthenticated ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {isAuthenticated ? <FiShield size={15} /> : <FiLock size={15} />}
              </div>
            </div>

            <div
              className={`mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold ${
                isAuthenticated && hasJobs
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 bg-slate-50 text-slate-500'
              }`}
            >
              <FiMapPin
                size={13}
                className={isAuthenticated && hasJobs ? 'text-emerald-600' : 'text-slate-400'}
              />
              <span>
                {isAuthenticated && hasJobs
                  ? `${formatCount(company.totalJobs)} curated roles ready`
                  : 'Role board unlocks after login'}
              </span>
            </div>

            <p className="mt-2 text-[12px] leading-5 text-slate-500">{entryIntent.helperText}</p>
          </div>

          <Link
            to={entryIntent.to}
            state={entryIntent.state}
            className={`mt-auto inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[13px] font-black shadow-[0_18px_36px_rgba(15,23,42,0.14)] transition hover:-translate-y-0.5 ${
              isAuthenticated
                ? 'bg-[linear-gradient(135deg,rgba(15,23,42,1),rgba(30,64,175,0.94))] text-white hover:shadow-[0_22px_44px_rgba(15,23,42,0.22)]'
                : 'bg-[linear-gradient(135deg,rgba(15,23,42,1),rgba(51,65,85,0.94))] text-white hover:shadow-[0_22px_44px_rgba(15,23,42,0.2)]'
            }`}
          >
            {isAuthenticated ? 'Open Hiring Lounge' : 'Login to Unlock'}
            <FiArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
};

const LoadingCard = () => (
  <div className="flex h-full flex-col rounded-[34px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,250,252,0.9))] p-2 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
    <div className="overflow-hidden rounded-[30px] border border-slate-200/80 bg-white">
      <div className="rounded-[28px] bg-slate-100 px-4 pb-4 pt-3.5">
        <div className="flex justify-between gap-3">
          <div className="h-6 w-24 rounded-full bg-slate-200" />
          <div className="h-6 w-24 rounded-full bg-slate-200" />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="h-[64px] w-[64px] rounded-[20px] bg-slate-200" />
          <div className="min-w-0 flex-1">
            <div className="h-7 rounded-full bg-slate-200" />
            <div className="mt-2 h-4 rounded-full bg-slate-200" />
          </div>
        </div>
      </div>
      <div className="px-4 pb-3.5 pt-3">
        <div className="h-8 rounded-2xl bg-slate-100" />
        <div className="mt-3 h-16 rounded-[22px] bg-slate-100" />
        <div className="mt-3 h-10 rounded-full bg-slate-100" />
      </div>
    </div>
  </div>
);

export function SponsoredCompaniesSection() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = Boolean(user);
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
    const sponsors = formatCount(summary.totalSponsors || sectionState.companies.length);
    const activeSponsors = formatCount(
      summary.sponsorsWithJobs ||
        sectionState.companies.filter((company) => Number(company.totalJobs || 0) > 0).length
    );
    const openRoles = formatCount(
      summary.totalOpenRoles ||
        sectionState.companies.reduce((sum, company) => sum + Number(company.totalJobs || 0), 0)
    );

    if (!isAuthenticated) {
      return [
        `${sponsors} approved sponsors`,
        `${activeSponsors} curated hiring brands`,
        `${openRoles} roles unlock after login`
      ];
    }

    return [
      `${sponsors} approved sponsors`,
      `${activeSponsors} sponsors hiring now`,
      `${openRoles} listed roles`
    ];
  }, [isAuthenticated, sectionState.companies, sectionState.summary]);

  return (
    <section className="px-4 py-16 md:py-20">
      <div className="container mx-auto max-w-[1540px]">
        <div className="relative overflow-hidden rounded-[42px] border border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,248,252,0.96))] px-5 py-8 shadow-[0_28px_90px_rgba(15,23,42,0.1)] md:px-8 md:py-10 xl:px-10 xl:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.14),transparent_26%),radial-gradient(circle_at_82%_10%,rgba(56,189,248,0.1),transparent_20%),linear-gradient(180deg,transparent,rgba(255,255,255,0.25))]" />

          <div className="relative z-10">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_420px] xl:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-700">
                  Partner Spotlight
                </p>
                <h2 className="mt-4 max-w-4xl font-heading text-4xl font-black leading-tight text-navy md:text-5xl">
                  Sponsor brands in a more premium <span className="text-brand-700">private hiring
                  showcase</span>
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-slate-500 md:text-lg">
                  Curated sponsor companies stay visible, but job boards unlock only after login. Public
                  view now works like a premium preview instead of exposing every company action upfront.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
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
                    Explore Company Preview
                    <FiArrowRight size={15} />
                  </Link>
                </div>
              </div>

              <div className="rounded-[30px] border border-slate-200/80 bg-[linear-gradient(145deg,rgba(15,23,42,0.97),rgba(30,41,59,0.95))] p-5 text-white shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/55">
                  Access Mode
                </p>
                <h3 className="mt-3 font-heading text-2xl font-black">
                  {isAuthenticated ? 'Hiring lounge unlocked' : 'Private role board locked'}
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/72">
                  {isAuthenticated
                    ? 'You can now open company hiring lounges directly from every sponsor card.'
                    : 'Company sites are hidden and role boards stay behind login, while the visual preview still feels premium.'}
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[22px] border border-white/10 bg-white/8 p-4 backdrop-blur">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Company Links</p>
                    <p className="mt-2 text-sm font-semibold text-white">Hidden from public cards</p>
                  </div>
                  <div className="rounded-[22px] border border-white/10 bg-white/8 p-4 backdrop-blur">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Job Access</p>
                    <p className="mt-2 text-sm font-semibold text-white">
                      {isAuthenticated ? 'Unlocked after login' : 'Login required first'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {sectionState.error ? (
              <div className="mx-auto mt-8 max-w-2xl rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-center text-sm text-red-700">
                {sectionState.error}
              </div>
            ) : null}

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4">
              {sectionState.loading
                ? Array.from({ length: 5 }).map((_, index) => <LoadingCard key={index} />)
                : sectionState.companies.map((company) => (
                    <CompanyCard
                      key={company.id}
                      company={company}
                      isAuthenticated={isAuthenticated}
                    />
                  ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
