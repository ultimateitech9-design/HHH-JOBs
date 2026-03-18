const DataEntryImageUploader = ({ entryId, files = [], onChange, onSubmit, uploading }) => {
  return (
    <section className="panel-card">
      <div className="dash-card-head">
        <div>
          <h3>Upload Entry Images</h3>
          <p>{entryId ? `Entry ${entryId}` : 'Select or open an entry to attach images.'}</p>
        </div>
      </div>

      <div className="form-grid">
        <label className="full-row">
          Images
          <input type="file" accept="image/*" multiple onChange={onChange} />
        </label>
      </div>

      {files.length > 0 ? (
        <ul className="dash-list" style={{ marginTop: '1rem' }}>
          {files.map((file) => (
            <li key={file.name}>
              <div>
                <strong>{file.name}</strong>
                <span>{Math.round((file.size || 0) / 1024)} KB</span>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="student-job-actions" style={{ marginTop: '1rem' }}>
        <button type="button" className="btn-primary" onClick={onSubmit} disabled={uploading || !entryId || files.length === 0}>
          {uploading ? 'Uploading...' : 'Upload Images'}
        </button>
      </div>
    </section>
  );
};

export default DataEntryImageUploader;
