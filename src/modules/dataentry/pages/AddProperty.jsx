import { useState } from 'react';
import SectionHeader from '../../../shared/components/SectionHeader';
import { createPropertyEntry, defaultPropertyEntryDraft } from '../services/dataentryApi';

const AddProperty = () => {
  const [draft, setDraft] = useState(defaultPropertyEntryDraft);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const setField = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!draft.title || !draft.location) {
      setError('Property title and location are required.');
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const saved = await createPropertyEntry(draft);
      setMessage(`Property entry ${saved.id || draft.title} saved successfully.`);
      setDraft(defaultPropertyEntryDraft);
    } catch (actionError) {
      setError(actionError.message || 'Unable to create property entry.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="module-page module-page--dataentry">
      <SectionHeader
        eyebrow="Data Entry"
        title="Add Property"
        subtitle="Record commercial and office property entries used in employer onboarding and business operations."
      />

      {error ? <p className="form-error">{error}</p> : null}
      {message ? <p className="form-success">{message}</p> : null}

      <section className="panel-card">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Property Title
            <input value={draft.title} onChange={(event) => setField('title', event.target.value)} />
          </label>
          <label>
            Property Type
            <select value={draft.propertyType} onChange={(event) => setField('propertyType', event.target.value)}>
              <option value="Office">Office</option>
              <option value="Warehouse">Warehouse</option>
              <option value="Retail">Retail</option>
              <option value="Industrial">Industrial</option>
            </select>
          </label>
          <label>
            Location
            <input value={draft.location} onChange={(event) => setField('location', event.target.value)} />
          </label>
          <label>
            Price
            <input type="number" value={draft.price} onChange={(event) => setField('price', event.target.value)} />
          </label>
          <label>
            Area (sq ft)
            <input type="number" value={draft.area} onChange={(event) => setField('area', event.target.value)} />
          </label>
          <label>
            Bedrooms
            <input type="number" value={draft.bedrooms} onChange={(event) => setField('bedrooms', event.target.value)} />
          </label>
          <label>
            Bathrooms
            <input type="number" value={draft.bathrooms} onChange={(event) => setField('bathrooms', event.target.value)} />
          </label>
          <label className="full-row">
            Description
            <textarea rows="6" value={draft.description} onChange={(event) => setField('description', event.target.value)} />
          </label>
          <div className="student-job-actions full-row">
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Property Entry'}</button>
            <button type="button" className="btn-link" onClick={() => setDraft(defaultPropertyEntryDraft)}>Reset</button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AddProperty;
