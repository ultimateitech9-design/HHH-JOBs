import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatusPill from '../../../shared/components/StatusPill';
import { getLeadDetails } from '../services/leadApi';
import { formatCurrency } from '../utils/currencyFormat';
import { formatDateTime } from '../utils/dateFormat';

const LeadDetails = () => {
  const { leadId: leadIdParam } = useParams();
  const [searchParams] = useSearchParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const leadId = leadIdParam || searchParams.get('leadId') || searchParams.get('id') || '';

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const response = await getLeadDetails(leadId);
      setLead(response.data || null);
      setError(response.error || '');
      setLoading(false);
    };
    load();
  }, [leadId]);

  return (
    <div className="module-page module-page--platform">
      <SectionHeader eyebrow="Sales" title="Lead Details" subtitle="Inspect lead ownership, source, expected deal value, and commercial stage." />
      {error ? <p className="form-error">{error}</p> : null}
      {!loading && !leadId ? (
        <p className="module-note">No lead ID was provided. Showing the first available lead from the queue.</p>
      ) : null}
      {loading ? <p className="module-note">Loading lead details...</p> : null}
      {!loading && lead ? (
        <section className="panel-card">
          <div className="dash-list">
            <li><strong>Lead ID</strong><span>{lead.id}</span></li>
            <li><strong>Company</strong><span>{lead.company}</span></li>
            <li><strong>Contact</strong><span>{lead.contactName}</span></li>
            <li><strong>Email</strong><span>{lead.email}</span></li>
            <li><strong>Phone</strong><span>{lead.phone}</span></li>
            <li><strong>Source</strong><span>{lead.source}</span></li>
            <li><strong>Owner</strong><span>{lead.assignedTo}</span></li>
            <li><strong>Expected Value</strong><span>{formatCurrency(lead.expectedValue)}</span></li>
            <li><strong>Stage</strong><span><StatusPill value={lead.stage} /></span></li>
            <li><strong>Created</strong><span>{formatDateTime(lead.createdAt)}</span></li>
          </div>
        </section>
      ) : !loading ? (
        <section className="panel-card">
          <p className="text-sm text-slate-500">No lead details are available for the selected lead.</p>
        </section>
      ) : null}
    </div>
  );
};

export default LeadDetails;
