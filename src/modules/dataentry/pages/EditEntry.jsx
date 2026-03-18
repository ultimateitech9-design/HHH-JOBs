import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SectionHeader from '../../../shared/components/SectionHeader';
import { getDataEntryEntries, getDataEntryEntryById, updateDataEntry } from '../services/dataentryApi';

const EditEntry = () => {
  const [searchParams] = useSearchParams();
  const [entry, setEntry] = useState(null);
  const [entryList, setEntryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [draft, setDraft] = useState({});

  const entryId = searchParams.get('entryId') || '';

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const [entryRes, listRes] = await Promise.all([
        entryId ? getDataEntryEntryById(entryId) : getDataEntryEntryById(''),
        getDataEntryEntries()
      ]);

      if (!mounted) return;

      const resolvedEntry = entryRes.data || null;
      setEntry(resolvedEntry);
      setDraft(resolvedEntry || {});
      setEntryList(listRes.data || []);
      setError(entryRes.error || listRes.error || '');
      setLoading(false);
    };

    load();

    return () => {
      mounted = false;
    };
  }, [entryId]);

  const setField = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const helperText = useMemo(() => {
    if (!entry) return 'Open an entry from Manage Entries to edit a specific record.';
    return `${entry.type || 'entry'} record assigned to ${entry.assignedTo || 'operator'}.`;
  }, [entry]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!entry?.id) return;

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const updated = await updateDataEntry(entry.id, draft);
      setEntry(updated);
      setDraft(updated);
      setMessage(`Entry ${updated.id} updated successfully.`);
    } catch (actionError) {
      setError(actionError.message || 'Unable to update entry.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="module-page module-page--dataentry">
      <SectionHeader
        eyebrow="Data Entry"
        title="Edit Entry"
        subtitle="Update an existing record, correct validation issues, and push it back into review."
      />

      {error ? <p className="form-error">{error}</p> : null}
      {message ? <p className="form-success">{message}</p> : null}

      <section className="panel-card">
        <div className="dash-card-head">
          <div>
            <h3>{entry?.title || 'Select Entry'}</h3>
            <p>{helperText}</p>
          </div>
        </div>

        {loading ? <p className="module-note">Loading entry...</p> : null}

        {!loading ? (
          <form className="form-grid" onSubmit={handleSubmit}>
            <label>
              Entry ID
              <input value={draft.id || ''} disabled />
            </label>
            <label>
              Type
              <input value={draft.type || ''} disabled />
            </label>
            <label>
              Title
              <input value={draft.title || ''} onChange={(event) => setField('title', event.target.value)} />
            </label>
            <label>
              Company
              <input value={draft.companyName || ''} onChange={(event) => setField('companyName', event.target.value)} />
            </label>
            <label>
              Location
              <input value={draft.location || ''} onChange={(event) => setField('location', event.target.value)} />
            </label>
            <label>
              Status
              <select value={draft.status || 'draft'} onChange={(event) => setField('status', event.target.value)}>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </label>
            <label>
              Assigned To
              <input value={draft.assignedTo || ''} onChange={(event) => setField('assignedTo', event.target.value)} />
            </label>
            <label>
              Candidate Name
              <input value={draft.candidateName || ''} onChange={(event) => setField('candidateName', event.target.value)} />
            </label>
            <label>
              Candidate ID
              <input value={draft.candidateId || ''} onChange={(event) => setField('candidateId', event.target.value)} />
            </label>
            <label className="full-row">
              Description
              <textarea rows="6" value={draft.description || ''} onChange={(event) => setField('description', event.target.value)} />
            </label>
            <div className="student-job-actions full-row">
              <button type="submit" className="btn-primary" disabled={saving || !entry?.id}>{saving ? 'Saving...' : 'Update Entry'}</button>
            </div>
          </form>
        ) : null}
      </section>

      {!loading && entryList.length > 0 ? (
        <section className="panel-card">
          <SectionHeader eyebrow="Available Entries" title="Quick Edit Targets" subtitle="Use Manage Entries for full filtering. Current module exposes recently loaded entries." />
          <ul className="dash-list">
            {entryList.slice(0, 5).map((item) => (
              <li key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.id} • {item.companyName}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
};

export default EditEntry;
