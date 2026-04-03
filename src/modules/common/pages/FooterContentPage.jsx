import { FOOTER_LINK_COLUMNS, FOOTER_PAGE_CONTENT } from './footerPages';
import FooterAboutTemplate from '../components/footerPages/FooterAboutTemplate';
import FooterContactTemplate from '../components/footerPages/FooterContactTemplate';
import FooterGenericTemplate from '../components/footerPages/FooterGenericTemplate';
import FooterReportIssueTemplate from '../components/footerPages/FooterReportIssueTemplate';

const FALLBACK_PAGE = {
  title: 'Information Page',
  eyebrow: 'Footer',
  summary: 'The requested content is not available right now.',
  sections: [
    {
      heading: 'Need assistance?',
      body:
        'Please explore related footer links below or contact support@hhh-jobs.com if you need immediate help.'
    }
  ]
};

const getRelatedLinks = (pageKey) =>
  FOOTER_LINK_COLUMNS.flatMap((column) => column.links)
    .filter((link) => link.key !== pageKey)
    .slice(0, 8);

const FooterContentPage = ({ pageKey }) => {
  const pageData = FOOTER_PAGE_CONTENT[pageKey] || FALLBACK_PAGE;
  const relatedLinks = getRelatedLinks(pageKey);

  if (pageKey === 'about-us') {
    return <FooterAboutTemplate pageData={pageData} relatedLinks={relatedLinks} />;
  }

  if (pageKey === 'contact-us') {
    return <FooterContactTemplate pageData={pageData} relatedLinks={relatedLinks} />;
  }

  if (pageKey === 'report-issue') {
    return <FooterReportIssueTemplate pageData={pageData} relatedLinks={relatedLinks} />;
  }

  return <FooterGenericTemplate pageKey={pageKey} pageData={pageData} relatedLinks={relatedLinks} />;
};

export default FooterContentPage;
