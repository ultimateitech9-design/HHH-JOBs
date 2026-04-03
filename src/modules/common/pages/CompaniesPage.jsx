import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowUpRight,
  FiArrowRight,
  FiBriefcase,
  FiCheckCircle,
  FiGlobe,
  FiMapPin,
  FiSearch,
  FiStar,
  FiTrendingUp
} from 'react-icons/fi';

import SectionHeader from '../../../shared/components/SectionHeader';
import { getPublicCompanies } from '../services/companyDirectoryApi';

const FILTER_OPTIONS = [
  { key: 'all', label: 'All Listed Companies' },
  { key: 'premium', label: 'Premium Picks' },
  { key: 'portal', label: 'Portal Employers' },
  { key: 'live-feed', label: 'Live Fetched' }
];

const formatCount = (value) => Number(value || 0).toLocaleString();

const getInitials = (name = '') =>
  String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'CO';

const statCardsFromSummary = (summary) => ([
  {
    key: 'companies',
    label: 'Listed Companies',
    value: formatCount(summary?.totalCompanies || 0),
    helper: 'Companies that currently have jobs listed.'
  },
  {
    key: 'roles',
    label: 'Open Roles',
    value: formatCount(summary?.totalOpenRoles || 0),
    helper: 'Portal and live-fetched openings combined.'
  },
  {
    key: 'premium',
    label: 'Premium Companies',
    value: formatCount(summary?.premiumCompanies || 0),
    helper: 'Priority employers with stronger hiring presence.'
  },
  {
    key: 'live',
    label: 'Live Feed Companies',
    value: formatCount(summary?.liveFeedCompanies || 0),
    helper: 'Companies verified from official careers feeds.'
  }
]);

const CompanyCard = ({ company, onOpenCompany }) => {
  const companyPath = `/companies/${company.slug}`;
  const headline = company.headline || 'Hiring on HHH Jobs';
  const summaryLine = [company.industry, company.companySize].filter(Boolean).join(' • ') || 'Active hiring through HHH Jobs';
  const statusBadges = [
    company.premium
      ? 'border-amber-200/70 bg-amber-100/15 text-amber-100'
      : null,
    company.verifiedEmployer
      ? 'border-emerald-200/70 bg-emerald-100/15 text-emerald-100'
      : null,
    company.liveFeed
      ? 'border-sky-200/70 bg-sky-100/15 text-sky-100'
      : null
  ].filter(Boolean);
  const statusLabels = [
    company.premium ? 'Premium' : null,
    company.verifiedEmployer ? 'Verified' : null,
    company.liveFeed ? 'Live Feed' : null
  ].filter(Boolean);
  const handleOpen = () => onOpenCompany(companyPath);
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOpen();
    }
  };

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[32px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(249,250,251,0.88))] p-2.5 shadow-[0_20px_60px_rgba(15,23,42,0.09)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(15,23,42,0.14)] focus:outline-none focus:ring-4 focus:ring-brand-100"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(234,179,8,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_28%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10 flex h-full flex-col rounded-[28px] bg-white/82 p-1">
        <div className="relative overflow-hidden rounded-[26px] bg-[linear-gradient(155deg,rgba(15,23,42,1)_0%,rgba(30,41,59,0.98)_52%,rgba(217,119,6,0.9)_100%)] px-3.5 py-3.5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(56,189,248,0.18),transparent_24%)] opacity-90" />

          <div className="relative z-10">
            <div className="flex items-start justify-between gap-2.5">
              <div className="flex min-w-0 flex-wrap gap-1.5">
                {statusLabels.map((label, index) => (
                  <span
                    key={`${company.id}-${label}`}
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] backdrop-blur ${statusBadges[index]}`}
                  >
                    {label === 'Premium' ? <FiStar size={11} /> : null}
                    {label === 'Verified' ? <FiCheckCircle size={11} /> : null}
                    {label === 'Live Feed' ? <FiTrendingUp size={11} /> : null}
                    {label}
                  </span>
                ))}
              </div>

              <div className="shrink-0 rounded-[20px] border border-white/15 bg-white/10 px-3 py-2.5 text-right shadow-lg shadow-black/10 backdrop-blur">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/65">Open Roles</p>
                <p className="mt-1 text-[1.9rem] font-black leading-none text-white">{formatCount(company.totalJobs)}</p>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-3">
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-12 w-12 rounded-[18px] border border-white/20 bg-white object-contain p-2 shadow-lg shadow-black/10"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-white/20 bg-white/95 text-sm font-extrabold text-navy shadow-lg shadow-black/10">
                  {getInitials(company.name)}
                </div>
              )}

              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/55">Hiring Hub</p>
                <h3 className="mt-1.5 line-clamp-2 font-heading text-[1.28rem] font-black leading-tight text-white">
                  {company.name}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-[13px] leading-5 text-white/78">{headline}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              <div className="flex items-center gap-2 rounded-2xl border border-white/12 bg-white/10 px-3 py-2 text-[11px] text-white/82 backdrop-blur">
                <FiMapPin size={13} className="shrink-0 text-white/70" />
                <span className="line-clamp-1">{company.location || 'Global hiring'}</span>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-white/12 bg-white/10 px-3 py-2 text-[11px] text-white/82 backdrop-blur">
                <FiGlobe size={13} className="shrink-0 text-white/70" />
                <span className="line-clamp-1">{company.websiteHost || 'hhh-jobs.com'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-1 pt-3">
          <div className="rounded-[22px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.94))] p-3.5 shadow-[0_14px_32px_rgba(15,23,42,0.05)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">Hiring Snapshot</p>
                <p className="mt-1.5 text-[13px] font-semibold leading-5 text-slate-700">{summaryLine}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <FiBriefcase size={16} />
              </div>
            </div>

            <p className="mt-3 line-clamp-2 text-[13px] leading-5 text-slate-600">
              {company.description || 'Explore the employer profile, hiring footprint, and all currently listed jobs from one place.'}
            </p>

            {company.categories?.length ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {company.categories.slice(0, 3).map((category) => (
                  <span
                    key={`${company.id}-${category}`}
                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-600"
                  >
                    {category}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2.5 px-1 pb-1 pt-3">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              handleOpen();
            }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,rgba(15,23,42,1),rgba(30,64,175,0.94))] px-5 py-3 text-[13px] font-bold text-white shadow-[0_16px_32px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_38px_rgba(15,23,42,0.24)]"
          >
            Open Hiring Hub
            <FiArrowRight size={15} />
          </button>

          {company.websiteUrl ? (
            <a
              href={company.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-[13px] font-bold text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
            >
              Visit Website
              <FiArrowUpRight size={15} />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
};

const CompaniesPage = () => {
  const navigate = useNavigate();
  const [directoryState, setDirectoryState] = useState({
    companies: [],
    summary: null,
    loading: true,
    error: ''
  });
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    let mounted = true;

    const loadCompanies = async () => {
      setDirectoryState((current) => ({ ...current, loading: true, error: '' }));
      const response = await getPublicCompanies();
      if (!mounted) return;

      setDirectoryState({
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

  const filteredCompanies = useMemo(() => {
    return directoryState.companies.filter((company) => {
      const haystack = [
        company.name,
        company.location,
        company.websiteHost,
        company.industry,
        ...(company.categories || [])
      ].join(' ').toLowerCase();

      const matchesSearch = !search.trim() || haystack.includes(search.trim().toLowerCase());

      if (!matchesSearch) return false;
      if (activeFilter === 'premium') return company.premium;
      if (activeFilter === 'portal') return company.portalProfile || company.portalJobs > 0;
      if (activeFilter === 'live-feed') return company.liveFeed;
      return true;
    });
  }, [activeFilter, directoryState.companies, search]);

  const featuredCompanies = useMemo(
    () => filteredCompanies.filter((company) => company.premium).slice(0, 4),
    [filteredCompanies]
  );

  const statCards = useMemo(
    () => statCardsFromSummary(directoryState.summary),
    [directoryState.summary]
  );

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.24),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.14),transparent_24%),linear-gradient(180deg,rgba(255,248,235,0.95),rgba(248,250,252,0.7))]" />

      <div className="mx-auto flex w-full max-w-[1560px] flex-col gap-10 px-4 py-12 md:px-6 lg:px-8">
        <section className="rounded-[36px] border border-white/70 bg-white/80 px-6 py-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:px-10 md:py-10">
          <SectionHeader
            eyebrow="Company Directory"
            title="Companies With Jobs Listed Right Now"
            subtitle="Only companies with active listed jobs are shown here. This directory combines HHH Jobs portal employers and live-fetched companies from official career pages."
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {statCards.map((item) => (
              <div
                key={item.key}
                className="rounded-[28px] border border-slate-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.92))] p-5 shadow-sm"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                <p className="mt-3 font-heading text-4xl font-black text-navy">{item.value}</p>
                <p className="mt-3 text-sm leading-6 text-slate-500">{item.helper}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-xl">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search listed companies, categories, industry, location..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setActiveFilter(option.key)}
                  className={`rounded-full px-4 py-2.5 text-sm font-bold transition ${
                    activeFilter === option.key
                      ? 'bg-navy text-white shadow-lg shadow-slate-900/10'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-emerald-200 bg-emerald-50/90 px-5 py-4 text-sm text-emerald-800 shadow-sm">
          <div className="flex items-start gap-3">
            <FiCheckCircle size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">Click any company card to open its hiring hub.</p>
              <p className="mt-1 leading-6 text-emerald-700">
                Each company page shows all listed jobs for that employer in one place, while job actions stay login-gated.
              </p>
            </div>
          </div>
        </section>

        {directoryState.error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {directoryState.error}
          </div>
        ) : null}

        {directoryState.loading ? (
          <div className="flex min-h-[280px] items-center justify-center rounded-[32px] border border-slate-200 bg-white/80">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500" />
          </div>
        ) : (
          <>
            {featuredCompanies.length > 0 ? (
              <section className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700">Premium Spotlight</p>
                    <h2 className="mt-2 font-heading text-3xl font-black text-navy">Top hiring companies</h2>
                  </div>
                  <div className="hidden rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 md:inline-flex">
                    {featuredCompanies.length} premium listings
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {featuredCompanies.map((company) => (
                    <CompanyCard
                      key={`featured-${company.id}`}
                      company={company}
                      onOpenCompany={(nextPath) => navigate(nextPath)}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            <section className="space-y-5">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700">All Listed Companies</p>
                  <h2 className="mt-2 font-heading text-3xl font-black text-navy">
                    {formatCount(filteredCompanies.length)} companies found
                  </h2>
                </div>
                <p className="max-w-2xl text-sm leading-6 text-slate-500">
                  This page only shows companies that currently have listed jobs. Cards below are powered by live HHH Jobs data and official company hiring feeds.
                </p>
              </div>

              {filteredCompanies.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {filteredCompanies.map((company) => (
                    <CompanyCard
                      key={company.id}
                      company={company}
                      onOpenCompany={(nextPath) => navigate(nextPath)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-[32px] border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <FiSearch size={28} />
                  </div>
                  <h3 className="mt-5 font-heading text-2xl font-black text-navy">No listed companies match this filter</h3>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
                    Search by company name, city, industry, or category. Only companies with listed jobs are included here.
                  </p>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default CompaniesPage;
