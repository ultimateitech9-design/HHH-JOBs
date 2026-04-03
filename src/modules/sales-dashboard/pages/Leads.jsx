import { useEffect, useMemo, useState } from 'react';
import SectionHeader from '../../../shared/components/SectionHeader';
import FilterBar from '../components/FilterBar';
import LeadTable from '../components/LeadTable';
import SalesStatCards from '../components/SalesStatCards';
import { getLeads } from '../services/leadApi';
import { formatCompactCurrency } from '../utils/currencyFormat';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [filters, setFilters] = useState({ stage: '', search: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const response = await getLeads();
      setLeads(response.data || []);
      setError(response.error || '');
      setLoading(false);
    };
    load();
  }, []);

  const rows = useMemo(() => {
    const search = String(filters.search || '').toLowerCase();
    return leads.filter((item) => {
      const matchesStage = !filters.stage || String(item.stage || '').toLowerCase() === filters.stage;
      const matchesSearch = !search || `${item.company} ${item.contactName} ${item.email}`.toLowerCase().includes(search);
      return matchesStage && matchesSearch;
    });
  }, [leads, filters]);

  const cards = useMemo(() => [
    { label: 'Visible Leads', value: String(rows.length), helper: 'Current lead queue', tone: 'info' },
    { label: 'Qualified', value: String(rows.filter((item) => item.stage === 'qualified').length), helper: 'Ready for proposal', tone: 'success' },
    { label: 'Proposals', value: String(rows.filter((item) => item.stage === 'proposal').length), helper: 'Commercial follow-up', tone: 'warning' },
    { label: 'Expected Value', value: formatCompactCurrency(rows.reduce((sum, item) => sum + Number(item.expectedValue || 0), 0)), helper: 'Potential pipeline value', tone: 'default' }
  ], [rows]);

  return (
    <div className="module-page module-page--platform">
      <SectionHeader eyebrow="Sales" title="Leads" subtitle="Manage inbound sales opportunities, stage progression, and expected revenue potential." />
      {error ? <p className="form-error">{error}</p> : null}
      <SalesStatCards cards={cards} />
      <section className="panel-card">
        <FilterBar
          filters={[
            { key: 'stage', label: 'Stage', type: 'select', options: [{ value: '', label: 'All' }, { value: 'new', label: 'New' }, { value: 'qualified', label: 'Qualified' }, { value: 'proposal', label: 'Proposal' }] },
            { key: 'search', label: 'Search', type: 'text', placeholder: 'Company, contact, email', fullWidth: true }
          ]}
          values={filters}
          onChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
        />
        {loading ? <p className="module-note">Loading leads...</p> : null}
        <LeadTable rows={rows} />
      </section>
    </div>
  );
};

export default Leads;
