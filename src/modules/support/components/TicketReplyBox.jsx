const TicketReplyBox = ({ value, onChange, onSubmit, sending }) => {
  return (
    <div className="panel-card">
      <div className="dash-card-head">
        <div>
          <h3>Reply to Ticket</h3>
          <p>Send an update to the customer and log the support response.</p>
        </div>
      </div>
      <div className="form-grid">
        <label className="full-row">
          Message
          <textarea rows="5" value={value} onChange={(event) => onChange(event.target.value)} />
        </label>
      </div>
      <div className="student-job-actions">
        <button type="button" className="btn-primary" onClick={onSubmit} disabled={sending || !value.trim()}>
          {sending ? 'Sending...' : 'Send Reply'}
        </button>
      </div>
    </div>
  );
};

export default TicketReplyBox;
