import TicketStatusBadge from './TicketStatusBadge';

const TicketCard = ({ ticket }) => {
  return (
    <article className="panel-card">
      <div className="dash-card-head">
        <div>
          <h3>{ticket.title}</h3>
          <p>{ticket.customer} | {ticket.id}</p>
        </div>
        <TicketStatusBadge value={ticket.status} />
      </div>
      <p className="module-note">{ticket.description}</p>
      <div className="student-job-actions">
        <TicketStatusBadge value={ticket.priority} />
      </div>
    </article>
  );
};

export default TicketCard;
