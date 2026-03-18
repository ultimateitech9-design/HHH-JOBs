const ExportButtons = ({ onExportCsv, onExportPdf }) => {
  return (
    <div className="student-job-actions">
      <button type="button" className="btn-secondary" onClick={onExportCsv}>Export CSV</button>
      <button type="button" className="btn-link" onClick={onExportPdf}>Export PDF</button>
    </div>
  );
};

export default ExportButtons;
