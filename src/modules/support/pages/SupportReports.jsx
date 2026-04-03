import { useEffect, useMemo, useState } from 'react';
import DataTable from '../../../shared/components/DataTable';
import StatusPill from '../../../shared/components/StatusPill';
import SupportHeader from '../components/SupportHeader';
import SupportStatsCards from '../components/SupportStatsCards';
import { getSupportReports } from '../services/reportApi';

const SupportReports = () => {
  const [report, setReport] = useState({ byCategory: [], resolutionTrend: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const response = await getSupportReports();
      setReport(response.data || { byCategory: [], resolutionTrend: [] });
      setError(response.error || '');
      setLoading(false);
    };
    load();
  }, []);

  const cards = useMemo(() => [
    { label: 'Categories', value: String((report.byCategory || []).length), helper: 'Issue distribution', tone: 'info' },
    { label: 'Resolution Periods', value: String((report.resolutionTrend || []).length), helper: 'Trend samples', tone: 'success' },
    { label: 'Highest Volume', value: report.byCategory?.[0]?.label || '-', helper: 'Current top issue type', tone: 'warning' },
    { label: 'Best Resolution Day', value: report.resolutionTrend?.reduce((best, item) => (!best || item.resolved > best.resolved ? item : best), null)?.period || '-', helper: 'Most resolved cases', tone: 'default' }
  ], [report]);

  const categoryColumns = [
    { key: 'label', label: 'Category' },
    { key: 'value', label: 'Volume' },
    {
      key: 'status',
      label: 'Health',
      render: (value) => <StatusPill value={value || 'healthy'} />
    }
  ];

  const trendColumns = [
    { key: 'period', label: 'Period' },
    { key: 'opened', label: 'Opened' },
    { key: 'resolved', label: 'Resolved' }
  ];

  return (
    <div className="module-page module-page--platform">
      <SupportHeader title="Support Reports" subtitle="Review support load by category and understand resolution performance over time." />
      {error ? <p className="form-error">{error}</p> : null}
      <SupportStatsCards cards={cards} />
      <div className="split-grid">
        <section className="panel-card">
          {loading ? <p className="module-note">Loading category report...</p> : null}
          <DataTable columns={categoryColumns} rows={report.byCategory || []} />
        </section>
        <section className="panel-card">
          {loading ? <p className="module-note">Loading resolution trend...</p> : null}
          <DataTable columns={trendColumns} rows={report.resolutionTrend || []} />
        </section>
      </div>
    </div>
  );
};

export default SupportReports;
