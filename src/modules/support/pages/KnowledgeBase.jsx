import FAQList from '../components/FAQList';
import SupportHeader from '../components/SupportHeader';
import useFaqs from '../hooks/useFaqs';

const KnowledgeBase = () => {
  const { knowledgeBase, loading, error } = useFaqs();

  return (
    <div className="module-page module-page--platform">
      <SupportHeader title="Knowledge Base" subtitle="Support documentation and operational guides for billing, job posting, account recovery, and troubleshooting." />
      {error ? <p className="form-error">{error}</p> : null}
      {loading ? <p className="module-note">Loading knowledge base...</p> : null}
      {!loading ? <FAQList items={knowledgeBase} /> : null}
    </div>
  );
};

export default KnowledgeBase;
