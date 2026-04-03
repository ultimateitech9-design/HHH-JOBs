import PublicCallToAction from '../publicPages/PublicCallToAction';
import PublicPageHero from '../publicPages/PublicPageHero';
import PublicSectionHeader from '../publicPages/PublicSectionHeader';
import FooterArticleCard from './FooterArticleCard';
import FooterInfoSectionCard from './FooterInfoSectionCard';
import FooterPageAside from './FooterPageAside';

const getSectionMode = (pageKey, pageData) => {
  if (pageKey === 'blog') return 'article';
  if (Array.isArray(pageData.sections) && pageData.sections.some((section) => section.to)) return 'article';
  return 'info';
};

const FooterGenericTemplate = ({ pageKey, pageData, relatedLinks }) => {
  const sectionMode = getSectionMode(pageKey, pageData);
  const chips = (pageData.sections || []).slice(0, 3).map((section) => section.heading);
  const ctaActions = pageKey === 'employer-home'
    ? [
      { label: 'Explore Services', to: '/services' },
      { label: 'Create Account', to: '/sign-up' }
    ]
    : [
      { label: 'Contact Support', to: '/contact-us' },
      { label: 'Explore Services', to: '/services' }
    ];

  return (
    <div className="pb-20">
      <PublicPageHero
        eyebrow={pageData.eyebrow}
        title={pageData.title}
        description={pageData.summary}
        chips={chips}
        metrics={[
          { value: `${pageData.sections?.length || 0}`, label: 'Content blocks', helper: 'Structured modules used to cover the full topic.' },
          { value: pageData.eyebrow || 'Info', label: 'Page type', helper: 'Aligned to the shared footer/public content system.' },
          { value: `${relatedLinks.length}`, label: 'Related links', helper: 'Cross-navigation across support, policy, and public pages.' }
        ]}
        actions={[
          { label: ctaActions[0].label, to: ctaActions[0].to, variant: 'primary' },
          { label: ctaActions[1].label, to: ctaActions[1].to, variant: 'ghost' }
        ]}
      />

      <section className="px-4 py-8 md:py-12">
        <div className="container mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <PublicSectionHeader
              eyebrow={pageData.eyebrow}
              title={sectionMode === 'article' ? 'Featured content modules' : 'Detailed page modules'}
              description={
                sectionMode === 'article'
                  ? 'Article previews and long-form resources now follow the same card system used across the rest of the public experience.'
                  : 'Informational, legal, and support pages now render through the same shared module system for consistent scaling.'
              }
            />

            <div className={`mt-10 grid gap-6 ${sectionMode === 'article' ? 'xl:grid-cols-2' : ''}`}>
              {(pageData.sections || []).map((section, index) =>
                sectionMode === 'article' && section.to ? (
                  <FooterArticleCard
                    key={`${section.heading}-${index}`}
                    section={section}
                    delay={index * 0.06}
                  />
                ) : (
                  <FooterInfoSectionCard
                    key={`${section.heading}-${index}`}
                    section={section}
                    delay={index * 0.06}
                  />
                )
              )}
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <FooterPageAside
              relatedLinks={relatedLinks}
              title={pageKey === 'blog' ? 'Need platform guidance?' : 'Explore adjacent modules'}
              description={
                pageKey === 'blog'
                  ? 'Move from learning content into support pages, service plans, or direct contact when you are ready to act.'
                  : 'Use sidebar navigation to move across related policy, support, and discovery pages without leaving the shared public shell.'
              }
            />
          </div>
        </div>
      </section>

      <section className="px-4">
        <div className="container mx-auto max-w-7xl">
          <PublicCallToAction
            eyebrow="Shared Public Pattern"
            title="Every footer-driven page now follows the same component-based page system"
            description="That keeps the public product closer to the reference dashboard/page style while preserving HHH Jobs-specific content and routes."
            chips={['Reusable hero', 'Shared section cards', 'Enterprise file structure']}
            actions={ctaActions}
            tone={pageKey === 'privacy-policy' || pageKey === 'terms-and-conditions' ? 'light' : 'dark'}
          />
        </div>
      </section>
    </div>
  );
};

export default FooterGenericTemplate;
