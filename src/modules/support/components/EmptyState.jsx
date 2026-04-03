const EmptyState = ({ title = 'No records found.', description = 'Nothing to show right now.' }) => {
  return (
    <div className="dash-list-empty">
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
};

export default EmptyState;
