import { useState } from 'react';
import SectionHeader from '../../../shared/components/SectionHeader';
import { createJobEntry, defaultJobEntryDraft } from '../services/dataentryApi';

const AddJob = () => {
  const [draft, setDraft] = useState(defaultJobEntryDraft);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const setField = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!draft.title || !draft.companyName || !draft.location) {
      setError('Title, company name, and location are required.');
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const saved = await createJobEntry(draft);
      setMessage(`Job entry ${saved.id || draft.title} saved successfully.`);
      setDraft(defaultJobEntryDraft);
    } catch (actionError) {
      setError(actionError.message || 'Unable to create job entry.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="module-page module-page--dataentry">
      <SectionHeader
        eyebrow="Data Entry"
        title="Add Job"
        subtitle="Create job records for HHH Jobs employers with location, salary, skill, and employment details."
      />

      {error ? <p className="form-error">{error}</p> : null}
      {message ? <p className="form-success">{message}</p> : null}

      <section className="panel-card">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Job Title
            <input value={draft.title} onChange={(event) => setField('title', event.target.value)} />
          </label>
          <label>
            Company Name
            <input value={draft.companyName} onChange={(event) => setField('companyName', event.target.value)} />
          </label>
          <label>
            Location
            <input value={draft.location} onChange={(event) => setField('location', event.target.value)} />
          </label>
          <label>
            Employment Type
            <select value={draft.employmentType} onChange={(event) => setField('employmentType', event.target.value)}>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </label>
          <label>
            Experience Level
            <select value={draft.experienceLevel} onChange={(event) => setField('experienceLevel', event.target.value)}>
              <option value="Entry">Entry</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
            </select>
          </label>
          <label>
            Min Salary
            <input type="number" value={draft.salaryMin} onChange={(event) => setField('salaryMin', event.target.value)} />
          </label>
          <label>
            Max Salary
            <input type="number" value={draft.salaryMax} onChange={(event) => setField('salaryMax', event.target.value)} />
          </label>
          <label className="full-row">
            Skills
            <input value={draft.skillsInput} placeholder="Sales, CRM, Field Work" onChange={(event) => setField('skillsInput', event.target.value)} />
          </label>
          <label className="full-row">
            Description
            <textarea rows="6" value={draft.description} onChange={(event) => setField('description', event.target.value)} />
          </label>
          <div className="student-job-actions full-row">
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Job Entry'}</button>
            <button type="button" className="btn-link" onClick={() => setDraft(defaultJobEntryDraft)}>Reset</button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AddJob;
