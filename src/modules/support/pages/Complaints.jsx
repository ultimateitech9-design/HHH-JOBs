import { useEffect, useState } from 'react';
import ComplaintTable from '../components/ComplaintTable';
import SupportHeader from '../components/SupportHeader';
import { getComplaints } from '../services/complaintApi';

const Complaints = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const response = await getComplaints();
      setRows(response.data || []);
      setError(response.error || '');
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="module-page module-page--platform">
      <SupportHeader title="Complaints" subtitle="Track customer complaints, severity, ownership, and complaint escalation status." />
      {error ? <p className="form-error">{error}</p> : null}
      <section className="panel-card">
        {loading ? <p className="module-note">Loading complaints...</p> : null}
        <ComplaintTable rows={rows} />
      </section>
    </div>
  );
};

export default Complaints;
