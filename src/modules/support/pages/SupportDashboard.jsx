import { useMemo } from 'react';
import SupportHeader from '../components/SupportHeader';
import SupportStatsCards from '../components/SupportStatsCards';
import TicketCard from '../components/TicketCard';
import useSupportStats from '../hooks/useSupportStats';
import useTickets from '../hooks/useTickets';

const SupportDashboard = () => {
  const { stats, loading, error, isDemo } = useSupportStats();
  const { tickets } = useTickets();

  const cards = useMemo(() => {
    const data = stats || {};
    return [
      { label: 'Total Tickets', value: String(data.totalTickets || 0), helper: `${data.openTickets || 0} open`, tone: 'info' },
      { label: 'Resolved', value: String(data.resolvedTickets || 0), helper: `${data.avgResolutionHours || 0} hrs avg resolution`, tone: 'success' },
      { label: 'Escalations', value: String(data.escalatedTickets || 0), helper: `${data.pendingTickets || 0} pending`, tone: 'warning' },
      { label: 'Live Chat', value: String(data.liveChats || 0), helper: `${data.feedbackItems || 0} feedback items`, tone: 'default' }
    ];
  }, [stats]);

  return (
    <div className="module-page module-page--platform">
      <SupportHeader
        title="Support Dashboard"
        subtitle="Track support queue pressure, escalations, response flow, and customer support workload for the portal."
      />
      {isDemo ? <p className="module-note">Demo support data is shown because backend support endpoints are not connected.</p> : null}
      {error ? <p className="form-error">{error}</p> : null}
      {loading ? <p className="module-note">Loading support dashboard...</p> : null}
      {!loading ? (
        <>
          <SupportStatsCards cards={cards} />
          <div className="split-grid">
            {tickets.slice(0, 4).map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default SupportDashboard;
