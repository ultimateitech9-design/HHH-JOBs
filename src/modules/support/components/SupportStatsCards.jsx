import StatCard from '../../../shared/components/StatCard';

const SupportStatsCards = ({ cards = [] }) => (
  <div className="stats-grid">
    {cards.map((card) => (
      <StatCard key={card.label} {...card} />
    ))}
  </div>
);

export default SupportStatsCards;
