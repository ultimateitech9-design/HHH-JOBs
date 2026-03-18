import { useEffect, useState } from 'react';
import FeedbackTable from '../components/FeedbackTable';
import SupportHeader from '../components/SupportHeader';
import { getFeedback } from '../services/feedbackApi';

const Feedback = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const response = await getFeedback();
      setRows(response.data || []);
      setError(response.error || '');
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="module-page module-page--platform">
      <SupportHeader title="Feedback" subtitle="Review customer feedback, rating trends, and sentiment about the HHH Jobs platform." />
      {error ? <p className="form-error">{error}</p> : null}
      <section className="panel-card">
        {loading ? <p className="module-note">Loading feedback...</p> : null}
        <FeedbackTable rows={rows} />
      </section>
    </div>
  );
};

export default Feedback;
