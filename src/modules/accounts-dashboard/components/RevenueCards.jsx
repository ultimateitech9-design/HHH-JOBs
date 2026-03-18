import StatCard from '../../../shared/components/StatCard';

const RevenueCards = ({ cards = [] }) => {
  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
};

export default RevenueCards;
