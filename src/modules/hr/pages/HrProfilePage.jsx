import { useEffect, useState } from 'react';
import SectionHeader from '../../../shared/components/SectionHeader';
import { getHrProfile, updateHrProfile } from '../services/hrApi';

const HrProfilePage = () => {
  const [form, setForm] = useState({
    companyName: '',
    companyWebsite: '',
    companySize: '',
    industryType: '',
    foundedYear: '',
    companyType: '',
    location: '',
    about: '',
    logoUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      const response = await getHrProfile();
      if (!mounted) return;

      setForm(response.data);
      setIsDemo(response.isDemo);
      setError(response.error && !response.isDemo ? response.error : '');
      setLoading(false);
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updated = await updateHrProfile(form);
      setForm(updated);
      setSuccess('Profile updated successfully.');
    } catch (saveError) {
      setError(saveError.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="module-page module-page--hr">
      <SectionHeader
        eyebrow="Company Profile"
        title="Manage Recruiter Organization Details"
        subtitle="Admin uses these details during HR verification and approval."
      />

      {isDemo ? <p className="module-note">Backend data is unavailable because backend is unavailable.</p> : null}
      {loading ? <p className="module-note">Loading profile...</p> : null}

      <section className="panel-card">
        <form className="form-grid" onSubmit={handleSave}>
          <label className="full-row">
            Company Name
            <input
              value={form.companyName}
              onChange={(event) => updateField('companyName', event.target.value)}
              placeholder="NovaStack Labs"
            />
          </label>

          <label className="full-row">
            Company Website
            <input
              value={form.companyWebsite}
              onChange={(event) => updateField('companyWebsite', event.target.value)}
              placeholder="https://novastack.example"
            />
          </label>

          <label className="full-row">
            Company Size
            <input
              value={form.companySize}
              onChange={(event) => updateField('companySize', event.target.value)}
              placeholder="51-200"
            />
          </label>

          <label className="full-row">
            Industry Type
            <input
              value={form.industryType}
              onChange={(event) => updateField('industryType', event.target.value)}
              placeholder="IT / Healthcare / Finance"
            />
          </label>

          <label className="full-row">
            Founded Year
            <input
              value={form.foundedYear}
              onChange={(event) => updateField('foundedYear', event.target.value)}
              placeholder="2018"
            />
          </label>

          <label className="full-row">
            Company Type
            <input
              value={form.companyType}
              onChange={(event) => updateField('companyType', event.target.value)}
              placeholder="Startup / Private / MNC / Government"
            />
          </label>

          <label className="full-row">
            Location
            <input
              value={form.location}
              onChange={(event) => updateField('location', event.target.value)}
              placeholder="Bengaluru"
            />
          </label>

          <label className="full-row">
            Logo URL
            <input
              value={form.logoUrl}
              onChange={(event) => updateField('logoUrl', event.target.value)}
              placeholder="https://cdn.example/logo.png"
            />
          </label>

          <label className="full-row">
            About Company
            <textarea
              rows={6}
              value={form.about}
              onChange={(event) => updateField('about', event.target.value)}
              placeholder="Describe your company, hiring goals, and culture."
            />
          </label>

          {error ? <p className="form-error full-row">{error}</p> : null}
          {success ? <p className="form-success full-row">{success}</p> : null}

          <button type="submit" className="btn-primary full-row" disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default HrProfilePage;

