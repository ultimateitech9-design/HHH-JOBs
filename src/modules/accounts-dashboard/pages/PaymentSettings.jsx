import { useEffect, useState } from 'react';
import SectionHeader from '../../../shared/components/SectionHeader';
import PaymentMethodCard from '../components/PaymentMethodCard';
import { getPaymentSettings, savePaymentSettings } from '../services/paymentApi';

const initialProfile = {
  companyName: '',
  settlementAccount: '',
  settlementIfsc: '',
  settlementContact: '',
  gstNumber: '',
  autoPayouts: false
};

const PaymentSettings = () => {
  const [methods, setMethods] = useState([]);
  const [profile, setProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      const response = await getPaymentSettings();
      setMethods(response.data?.methods || []);
      setProfile({ ...initialProfile, ...(response.data?.settlementProfile || {}) });
      setError(response.error || '');
      setLoading(false);
    };

    load();
  }, []);

  const setField = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      await savePaymentSettings({
        methods,
        settlementProfile: profile
      });
      setMessage('Payment settings saved.');
    } catch (actionError) {
      setError(actionError.message || 'Unable to save payment settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="module-page module-page--platform">
      <SectionHeader
        eyebrow="Accounts"
        title="Payment Settings"
        subtitle="Configure settlement details, payout behavior, and active collection methods for HHH Jobs."
      />

      {error ? <p className="form-error">{error}</p> : null}
      {message ? <p className="form-success">{message}</p> : null}

      <div className="split-grid">
        <section className="panel-card">
          <SectionHeader eyebrow="Settlement Profile" title="Finance Configuration" />
          {loading ? <p className="module-note">Loading payment settings...</p> : null}

          {!loading ? (
            <form className="form-grid" onSubmit={handleSubmit}>
              <label>
                Company Name
                <input value={profile.companyName} onChange={(event) => setField('companyName', event.target.value)} />
              </label>
              <label>
                Settlement Account
                <input value={profile.settlementAccount} onChange={(event) => setField('settlementAccount', event.target.value)} />
              </label>
              <label>
                IFSC
                <input value={profile.settlementIfsc} onChange={(event) => setField('settlementIfsc', event.target.value)} />
              </label>
              <label>
                Contact Email
                <input value={profile.settlementContact} onChange={(event) => setField('settlementContact', event.target.value)} />
              </label>
              <label>
                GST Number
                <input value={profile.gstNumber} onChange={(event) => setField('gstNumber', event.target.value)} />
              </label>
              <label>
                Auto Payouts
                <select
                  value={profile.autoPayouts ? 'true' : 'false'}
                  onChange={(event) => setField('autoPayouts', event.target.value === 'true')}
                >
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
              </label>
              <div className="student-job-actions full-row">
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</button>
              </div>
            </form>
          ) : null}
        </section>

        <section className="panel-card">
          <SectionHeader eyebrow="Collection Methods" title="Configured Payment Methods" />
          <div className="split-grid">
            {methods.map((method) => (
              <PaymentMethodCard key={method.id} method={method} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PaymentSettings;
