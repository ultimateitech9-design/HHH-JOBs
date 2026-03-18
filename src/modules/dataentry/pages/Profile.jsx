import { useEffect, useMemo, useState } from 'react';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatCard from '../../../shared/components/StatCard';
import DataEntryProfileForm from '../components/DataEntryProfileForm';
import { getAssignedTasks, getDataEntryProfile, updateDataEntryProfile } from '../services/dataentryApi';

const Profile = () => {
  const [draft, setDraft] = useState({});
  const [taskCount, setTaskCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const [profileRes, taskRes] = await Promise.all([getDataEntryProfile(), getAssignedTasks()]);
      if (!mounted) return;

      setDraft(profileRes.data || {});
      setTaskCount((taskRes.data || []).length);
      setError(profileRes.error || taskRes.error || '');
      setLoading(false);
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const cards = useMemo(() => ([
    { label: 'Employee ID', value: draft.employeeId || '-', helper: 'Operator identity', tone: 'info' },
    { label: 'Shift', value: draft.shift || '-', helper: draft.location || 'Assigned location', tone: 'default' },
    { label: 'Daily Target', value: draft.dailyTarget || '-', helper: 'Expected entries per day', tone: 'warning' },
    { label: 'Assigned Tasks', value: String(taskCount), helper: 'Current operator queue', tone: 'success' }
  ]), [draft, taskCount]);

  const setField = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const updated = await updateDataEntryProfile(draft);
      setDraft(updated);
      setMessage('Profile updated successfully.');
    } catch (actionError) {
      setError(actionError.message || 'Unable to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="module-page module-page--dataentry">
      <SectionHeader eyebrow="Data Entry" title="Profile" subtitle="Manage operator identity, shift details, output targets, and working notes." />
      {error ? <p className="form-error">{error}</p> : null}
      {message ? <p className="form-success">{message}</p> : null}
      {loading ? <p className="module-note">Loading profile...</p> : null}

      {!loading ? (
        <>
          <div className="stats-grid">
            {cards.map((card) => (
              <StatCard key={card.label} {...card} />
            ))}
          </div>
          <section className="panel-card">
            <DataEntryProfileForm draft={draft} saving={saving} onChange={setField} onSubmit={handleSubmit} />
          </section>
        </>
      ) : null}
    </div>
  );
};

export default Profile;
