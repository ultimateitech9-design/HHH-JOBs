import StatusPill from '../../../shared/components/StatusPill';

const TicketStatusBadge = ({ value }) => <StatusPill value={value || 'open'} />;

export default TicketStatusBadge;
