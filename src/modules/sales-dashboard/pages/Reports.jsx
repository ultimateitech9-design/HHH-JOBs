import { useEffect, useMemo, useState } from 'react';
import DataTable from '../../../shared/components/DataTable';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatusPill from '../../../shared/components/StatusPill';
import RevenueChart from '../components/RevenueChart';
import SalesChart from '../components/SalesChart';
import SalesStatCards from '../components/SalesStatCards';
import { getSalesReports } from '../services/reportApi';

const Reports = () => {
  const [report, setReport] = useState({ topSources: [], conversion: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const response = await getSalesReports();
      setReport(response.data || { topSources: [], conversion: [] });
      setError(response.error || '');
      setLoading(false);
    };
    load();
  }, []);

  const cards = useMemo(() => [
    { label: 'Top Sources', value: String((report.topSources || []).length), helper: 'Lead acquisition channels', tone: 'info' },
    { label: 'Conversion Stages', value: String((report.conversion || []).length), helper: 'Pipeline checkpoints', tone: 'success' },
    { label: 'Best Source', value: report.topSources?.[0]?.label || '-', helper: 'Current top performer', tone: 'default' },
    { label: 'Won Stage Count', value: String(report.conversion?.find((item) => item.stage === 'Won')?.count || 0), helper: 'Deals won', tone: 'warning' }
  ], [report]);

  const sourceColumns = [
    { key: 'label', label: 'Source' },
    { key: 'value', label: 'Volume' },
    {
      key: 'status',
      label: 'Health',
      render: (value) => <StatusPill value={value || 'healthy'} />
    }
  ];

  return (
    <div className="module-page module-page--platform">
      <SectionHeader eyebrow="Sales" title="Reports" subtitle="Review source performance, conversion stages, and monthly revenue direction." />
      {error ? <p className="form-error">{error}</p> : null}
      <SalesStatCards cards={cards} />
      <div className="split-grid">
        <SalesChart points={(report.conversion || []).map((item) => ({ month: item.stage, value: item.count, target: item.count + 4 }))} />
        <RevenueChart points={[{ month: 'Revenue', revenue: 182000, refunds: 4200 }, { month: 'Pipeline', revenue: 163000, refunds: 7800 }]} />
      </div>
      <section className="panel-card">
        {loading ? <p className="module-note">Loading reports...</p> : null}
        <DataTable columns={sourceColumns} rows={report.topSources || []} />
      </section>
    </div>
  );
};

export default Reports;
