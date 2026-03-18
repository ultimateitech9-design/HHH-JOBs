import StatCard from '../../../shared/components/StatCard';

const SalesStatCards = ({ cards = [] }) => (
  <div className="stats-grid">
    {cards.map((card) => (
      <StatCard key={card.label} {...card} />
    ))}
  </div>
);

export default SalesStatCards;
