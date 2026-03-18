import { useEffect, useState } from 'react';
import { getFaqs, getKnowledgeBase } from '../services/faqApi';

const useFaqs = () => {
  const [faqs, setFaqs] = useState([]);
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const [faqRes, kbRes] = await Promise.all([getFaqs(), getKnowledgeBase()]);
      setFaqs(faqRes.data || []);
      setKnowledgeBase(kbRes.data || []);
      setError(faqRes.error || kbRes.error || '');
      setLoading(false);
    };

    load();
  }, []);

  return { faqs, knowledgeBase, loading, error };
};

export default useFaqs;
