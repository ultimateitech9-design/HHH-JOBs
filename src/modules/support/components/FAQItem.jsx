const FAQItem = ({ item }) => {
  return (
    <article className="panel-card">
      <div className="dash-card-head">
        <div>
          <h3>{item.question || item.title}</h3>
          <p>{item.category}</p>
        </div>
      </div>
      <p>{item.answer || item.summary}</p>
    </article>
  );
};

export default FAQItem;
