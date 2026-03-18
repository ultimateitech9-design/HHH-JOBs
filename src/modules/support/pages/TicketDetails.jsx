import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SupportHeader from '../components/SupportHeader';
import TicketReplyBox from '../components/TicketReplyBox';
import TicketStatusBadge from '../components/TicketStatusBadge';
import { formatDateTime } from '../utils/formatDate';
import { getTicketDetails, replyToTicket } from '../services/ticketApi';

const TicketDetails = () => {
  const [searchParams] = useSearchParams();
  const [ticket, setTicket] = useState(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const response = await getTicketDetails(searchParams.get('ticketId') || '');
      setTicket(response.data || null);
      setError(response.error || '');
      setLoading(false);
    };
    load();
  }, [searchParams]);

  const handleReply = async () => {
    if (!ticket?.id || !reply.trim()) return;
    setSending(true);
    const newReply = await replyToTicket(ticket.id, reply);
    setTicket((current) => ({ ...current, replies: [...(current?.replies || []), newReply] }));
    setReply('');
    setSending(false);
  };

  return (
    <div className="module-page module-page--platform">
      <SupportHeader title="Ticket Details" subtitle="Review the full support conversation, status, and response history for one ticket." />
      {error ? <p className="form-error">{error}</p> : null}
      {loading ? <p className="module-note">Loading ticket details...</p> : null}
      {!loading && ticket ? (
        <>
          <section className="panel-card">
            <div className="dash-list">
              <li><strong>Ticket ID</strong><span>{ticket.id}</span></li>
              <li><strong>Title</strong><span>{ticket.title}</span></li>
              <li><strong>Customer</strong><span>{ticket.customer}</span></li>
              <li><strong>Category</strong><span>{ticket.category}</span></li>
              <li><strong>Priority</strong><span><TicketStatusBadge value={ticket.priority} /></span></li>
              <li><strong>Status</strong><span><TicketStatusBadge value={ticket.status} /></span></li>
              <li><strong>Assigned To</strong><span>{ticket.assignedTo}</span></li>
              <li><strong>Updated</strong><span>{formatDateTime(ticket.updatedAt)}</span></li>
            </div>
            <p style={{ marginTop: '1rem' }}>{ticket.description}</p>
          </section>
          <section className="panel-card">
            <div className="dash-card-head">
              <div>
                <h3>Replies</h3>
                <p>Message trail between customer and support.</p>
              </div>
            </div>
            <ul className="dash-feed">
              {(ticket.replies || []).map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.author}</strong>
                    <p>{item.message}</p>
                    <span>{formatDateTime(item.createdAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <TicketReplyBox value={reply} onChange={setReply} onSubmit={handleReply} sending={sending} />
        </>
      ) : null}
    </div>
  );
};

export default TicketDetails;
