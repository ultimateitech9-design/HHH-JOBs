import FAQList from '../components/FAQList';
import SupportHeader from '../components/SupportHeader';
import useFaqs from '../hooks/useFaqs';

const FAQ = () => {
  const { faqs, loading, error } = useFaqs();

  return (
    <div className="module-page module-page--platform">
      <SupportHeader title="FAQ" subtitle="Common support answers for billing, job posting, account, and platform usage." />
      {error ? <p className="form-error">{error}</p> : null}
      {loading ? <p className="module-note">Loading FAQs...</p> : null}
      {!loading ? <FAQList items={faqs} /> : null}
    </div>
  );
};

export default FAQ;
