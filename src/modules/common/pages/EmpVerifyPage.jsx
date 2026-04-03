import { FiArrowUpRight, FiCheckCircle, FiClock, FiGlobe, FiLock, FiShield } from 'react-icons/fi';
import PublicCallToAction from '../components/publicPages/PublicCallToAction';
import PublicFeatureCard from '../components/publicPages/PublicFeatureCard';
import PublicPageHero from '../components/publicPages/PublicPageHero';
import PublicSectionHeader from '../components/publicPages/PublicSectionHeader';

const highlights = [
  {
    title: 'Automated Verification Flow',
    description: 'Employee and employer checks run through a structured digital workflow for faster decisions.',
    icon: FiCheckCircle
  },
  {
    title: 'Fast Turnaround',
    description: 'Verification responses are designed to reduce waiting time in active hiring cycles.',
    icon: FiClock
  },
  {
    title: 'Security-First Handling',
    description: 'Sensitive verification data is framed around secure processing and trust-led operations.',
    icon: FiLock
  },
  {
    title: 'Multi-Industry Reach',
    description: 'The platform supports use cases across technology, finance, healthcare, logistics, and more.',
    icon: FiGlobe
  }
];

const processSteps = [
  'Create organization account and submit candidate details.',
  'Run automated background checks and document validation.',
  'Review generated verification reports and flags.',
  'Proceed with hiring decisions using verified records.'
];

const industries = [
  'IT & Tech',
  'Finance & Banking',
  'Healthcare',
  'Education',
  'Retail & Lifestyle',
  'Hospitality',
  'BPO',
  'Logistics',
  'Manufacturing',
  'Aviation'
];

const EmpVerifyPage = () => {
  return (
    <div className="pb-16 md:pb-24">
      <PublicPageHero
        eyebrow="Emp Verify"
        title={<>Employee Verification With <span className="gradient-text">Eimager</span></>}
        description="Understand the Eimager verification flow quickly, compare the core trust signals, and move from employer due diligence to hiring decisions with less friction."
        chips={['Verification-first', 'Employer ready', 'Multi-industry support']}
        metrics={[
          { label: 'Focus', value: 'Background Checks', helper: 'Employer-led employee verification' },
          { label: 'Promise', value: 'Fast Reviews', helper: 'Built for lower hiring delays' },
          { label: 'Coverage', value: '10+ Sectors', helper: 'Across modern hiring categories' }
        ]}
        aside={
          <div className="rounded-[2rem] border border-slate-200 bg-white/92 p-6 shadow-xl backdrop-blur-sm">
            <img
              src="/images/emiger.png"
              alt="Eimager brand visual"
              className="w-full rounded-[1.5rem] border border-slate-100 bg-slate-50 object-cover"
            />
            <div className="mt-6 space-y-3">
              <a
                href="https://www.eimager.com/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-brand-100 hover:bg-brand-50 hover:text-brand-700"
              >
                <span>Visit Eimager</span>
                <FiArrowUpRight />
              </a>
              <a
                href="https://eimager.com/about"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-brand-100 hover:bg-brand-50 hover:text-brand-700"
              >
                <span>Read Brand Story</span>
                <FiArrowUpRight />
              </a>
            </div>
          </div>
        }
      />

      <section className="container mx-auto max-w-7xl px-4">
        <PublicSectionHeader
          centered
          eyebrow="Verification Signals"
          title="What employers evaluate before they trust the process"
          description="These are the core points surfaced from the Eimager experience and why Emp Verify matters inside a serious hiring workflow."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {highlights.map((item, index) => (
            <PublicFeatureCard
              key={item.title}
              delay={index * 0.05}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </section>

      <section className="container mx-auto mt-16 max-w-7xl px-4">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <PublicSectionHeader
              eyebrow="Process"
              title="How the verification flow works"
              description="A simple four-step workflow gives employers a clearer route from data submission to verified decision-making."
            />

            <div className="mt-8 grid gap-4">
              {processSteps.map((step, index) => (
                <article
                  key={step}
                  className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-sm font-black text-brand-700">
                      {index + 1}
                    </span>
                    <p className="text-sm font-semibold leading-7 text-slate-700">{step}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <PublicSectionHeader
              eyebrow="Industry Fit"
              title="Sectors where verification support matters most"
              description="Emp Verify messaging is positioned for operational hiring needs across regulated and volume-driven industries."
            />

            <div className="mt-8 flex flex-wrap gap-3">
              {industries.map((industry) => (
                <span
                  key={industry}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600"
                >
                  {industry}
                </span>
              ))}
            </div>

            <div className="mt-8 rounded-[1.6rem] border border-brand-100 bg-brand-50 p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-brand-700 shadow-sm">
                  <FiShield size={20} />
                </span>
                <div>
                  <p className="font-heading text-lg font-bold text-navy">Why it fits HHH Jobs</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Verification adds credibility to employer workflows and supports more trustworthy hiring conversations across the platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto mt-16 max-w-7xl px-4">
        <PublicCallToAction
          eyebrow="Next Step"
          title="Need verification support inside your hiring flow?"
          description="Connect your employer workflow with clear trust signals, better candidate screening, and faster verification-led decisions."
          actions={[
            { label: 'Contact HHH Jobs', to: '/contact-us' },
            { label: 'Open Employer Home', to: '/employer-home' }
          ]}
          chips={['Employer support', 'Verification workflow', 'Faster trust checks']}
        />
      </div>
    </div>
  );
};

export default EmpVerifyPage;
