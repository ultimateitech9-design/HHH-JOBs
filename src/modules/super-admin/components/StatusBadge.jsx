import StatusPill from '../../../shared/components/StatusPill';

const StatusBadge = ({ value }) => <StatusPill value={value || 'default'} />;

export default StatusBadge;
