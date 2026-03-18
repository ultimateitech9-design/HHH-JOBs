const Pagination = ({ page = 1, totalPages = 1 }) => {
  return (
    <div className="student-job-actions">
      <span className="module-note">Page {page} of {totalPages}</span>
    </div>
  );
};

export default Pagination;
