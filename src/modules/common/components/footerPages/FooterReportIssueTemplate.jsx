import PublicCallToAction from '../publicPages/PublicCallToAction';
import PublicPageHero from '../publicPages/PublicPageHero';
import PublicSectionHeader from '../publicPages/PublicSectionHeader';
import FooterInfoSectionCard from './FooterInfoSectionCard';
import FooterPageAside from './FooterPageAside';
import FooterReportIssueForm from './FooterReportIssueForm';

const FooterReportIssueTemplate = ({ pageData, relatedLinks }) => {
  return (
    <div className="pb-20">
      <PublicPageHero
        eyebrow={pageData.eyebrow}
        title={pageData.title}
        description={pageData.summary}
        chips={['Platform issues', 'Content concerns', 'Policy escalation']}
        metrics={[
          { value: '4 Steps', label: 'Review flow', helper: 'Submit, acknowledge, investigate, follow up.' },
          { value: 'Fast', label: 'Escalation path', helper: 'The report form routes directly into support review.' },
          { value: 'Safer', label: 'Community outcome', helper: 'User reports help keep the hiring environment reliable.' }
        ]}
        actions={[
          { label: 'Open Contact Page', to: '/contact-us', variant: 'primary' },
          { label: 'Read Trust & Safety', to: '/trust-and-safety', variant: 'ghost' }
        ]}
      />

      <section className="px-4 py-8 md:py-12">
        <div className="container mx-auto max-w-7xl">
          <PublicSectionHeader
            eyebrow="Issue Handling"
            title="A dedicated reporting module with clearer intake and escalation structure"
            description="This replaces the previous monolithic page with a split layout: guidance on one side, issue intake on the other, and shared sidebar navigation for the rest of the public support stack."
            centered
          />

          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
            <div className="grid gap-6">
              {pageData.sections.map((section, index) => (
                <FooterInfoSectionCard
                  key={`${section.heading}-${index}`}
                  section={section}
                  delay={index * 0.06}
                />
              ))}
            </div>

            <FooterReportIssueForm />
          </div>
        </div>
      </section>

      <section className="px-4 py-4 md:py-8">
        <div className="container mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-rose-600">What to include</p>
            <h3 className="mt-4 font-heading text-2xl font-bold text-navy">High-signal reports get resolved faster</h3>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                'Describe the issue path clearly: page, action, and failure point.',
                'Attach screenshots when the concern is visual or workflow-specific.',
                'Mention whether the issue affects candidates, employers, or both.',
                'If the concern is safety-related, include any relevant usernames or listing links.'
              ].map((item) => (
                <div key={item} className="rounded-[1.5rem] bg-slate-50 px-5 py-4 text-sm leading-7 text-slate-600">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <FooterPageAside
              relatedLinks={relatedLinks}
              title="Need a policy route instead?"
              description="Use the sidebar to move into grievances, trust & safety, or direct support flows depending on the issue type."
            />
          </div>
        </div>
      </section>

      <section className="px-4">
        <div className="container mx-auto max-w-7xl">
          <PublicCallToAction
            eyebrow="Community Quality"
            title="Support, safety, and reporting now share one modular public system"
            description="This keeps HHH Jobs easier to scale page-by-page while matching the reference project’s cleaner module separation."
            chips={['Separate components', 'Shared public layout', 'Cleaner maintenance']}
            actions={[
              { label: 'Open Grievances', to: '/grievances' },
              { label: 'View Help Center', to: '/help-center' }
            ]}
            tone="light"
          />
        </div>
      </section>
    </div>
  );
};

export default FooterReportIssueTemplate;
