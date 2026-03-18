import FAQItem from './FAQItem';
import EmptyState from './EmptyState';

const FAQList = ({ items = [] }) => {
  if (items.length === 0) {
    return <EmptyState title="No FAQ content found." description="Support knowledge content is not available right now." />;
  }

  return (
    <div className="split-grid">
      {items.map((item) => (
        <FAQItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default FAQList;
