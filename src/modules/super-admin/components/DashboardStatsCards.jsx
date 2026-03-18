import StatCard from '../../../shared/components/StatCard';

const DashboardStatsCards = ({ cards = [] }) => {
  return (
    <div className="stats-grid">
      {cards.map((card) => <StatCard key={card.label} {...card} />)}
    </div>
  );
};

export default DashboardStatsCards;
