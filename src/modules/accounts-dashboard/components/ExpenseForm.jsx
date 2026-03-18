const ExpenseForm = ({ draft, saving, onChange, onSubmit, onReset }) => {
  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <label>
        Expense Title
        <input value={draft.title} onChange={(event) => onChange('title', event.target.value)} />
      </label>

      <label>
        Category
        <select value={draft.category} onChange={(event) => onChange('category', event.target.value)}>
          <option value="">Select</option>
          <option value="Marketing">Marketing</option>
          <option value="Infrastructure">Infrastructure</option>
          <option value="Operations">Operations</option>
          <option value="Support">Support</option>
        </select>
      </label>

      <label>
        Department
        <input value={draft.department} onChange={(event) => onChange('department', event.target.value)} />
      </label>

      <label>
        Amount
        <input type="number" value={draft.amount} onChange={(event) => onChange('amount', event.target.value)} />
      </label>

      <label>
        Spent On
        <input type="date" value={draft.spentOn} onChange={(event) => onChange('spentOn', event.target.value)} />
      </label>

      <label>
        Status
        <select value={draft.status} onChange={(event) => onChange('status', event.target.value)}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </label>

      <label className="full-row">
        Note
        <textarea rows="4" value={draft.note} onChange={(event) => onChange('note', event.target.value)} />
      </label>

      <div className="student-job-actions full-row">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Add Expense'}</button>
        <button type="button" className="btn-link" onClick={onReset}>Reset</button>
      </div>
    </form>
  );
};

export default ExpenseForm;
