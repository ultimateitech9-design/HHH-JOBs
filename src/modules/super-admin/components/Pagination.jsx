const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="student-job-actions">
      <button type="button" className="btn-secondary" onClick={() => onChange(Math.max(1, page - 1))} disabled={page <= 1}>Previous</button>
      <span className="module-note">Page {page} of {totalPages}</span>
      <button type="button" className="btn-secondary" onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>Next</button>
    </div>
  );
};

export default Pagination;
