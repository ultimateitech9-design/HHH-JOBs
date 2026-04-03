import { useEffect, useMemo, useState } from 'react';
import DataTable from '../../../shared/components/DataTable';
import AdminHeader from '../components/AdminHeader';
import DashboardStatsCards from '../components/DashboardStatsCards';
import FilterBar from '../components/FilterBar';
import StatusBadge from '../components/StatusBadge';
import { getSystemLogs } from '../services/reportsApi';
import { formatDateTime } from '../utils/formatDate';

const SystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({ search: '', level: '', actorRole: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const load = async () => {
      const response = await getSystemLogs();
      setLogs(response.data || []);
      setError(response.error || '');
      setIsDemo(Boolean(response.isDemo));
      setLoading(false);
    };
    load();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((item) => {
      const search = String(filters.search || '').toLowerCase();
      const matchesSearch = !search || [
        item.id,
        item.module,
        item.actor,
        item.actorId,
        item.action,
        item.details
      ].some((value) => String(value || '').toLowerCase().includes(search));
      const matchesLevel = !filters.level || item.level === filters.level;
      const normalizedActorRole = String(item.actorRole || (String(item.actor || '').includes('admin') ? 'admin' : 'system')).toLowerCase();
      const matchesActorRole = !filters.actorRole || normalizedActorRole === filters.actorRole;
      return matchesSearch && matchesLevel && matchesActorRole;
    });
  }, [filters, logs]);

  const adminLogs = useMemo(() => {
    return logs.filter((item) => String(item.actorRole || '').toLowerCase() === 'admin' || String(item.actor || '').toLowerCase().includes('admin'));
  }, [logs]);

  const cards = useMemo(() => [
    { label: 'Admin Actions', value: String(adminLogs.length), helper: 'Admin account activity visible to super admin', tone: 'info' },
    { label: 'Critical Events', value: String(logs.filter((item) => item.level === 'critical').length), helper: 'Immediate action required', tone: 'danger' },
    { label: 'Warnings', value: String(logs.filter((item) => item.level === 'warning').length), helper: 'Needs follow-up review', tone: 'warning' },
    { label: 'Operational Events', value: String(logs.length), helper: 'Recent logged activity', tone: 'default' }
  ], [adminLogs.length, logs]);

  const columns = [
    { key: 'id', label: 'Log ID' },
    { key: 'actorId', label: 'Actor ID' },
    { key: 'module', label: 'Module' },
    { key: 'actor', label: 'Actor' },
    { key: 'actorRole', label: 'Actor Role', render: (value) => <StatusBadge value={value || 'system'} /> },
    { key: 'action', label: 'Action' },
    { key: 'level', label: 'Level', render: (value) => <StatusBadge value={value} /> },
    { key: 'createdAt', label: 'Time', render: (value) => formatDateTime(value) },
    { key: 'details', label: 'Details' }
  ];

  return (
    <div className="module-page module-page--admin">
      <AdminHeader title="System Logs" subtitle="Review system incidents, policy signals, webhook failures, and trust-related platform activity." />
      {isDemo ? <p className="module-note">Demo log data is shown because super admin log endpoints are not connected yet.</p> : null}
      {error ? <p className="form-error">{error}</p> : null}
      <DashboardStatsCards cards={cards} />
      <section className="panel-card">
        <FilterBar
          filters={filters}
          onChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
          fields={[
            {
              key: 'actorRole',
              label: 'Actor Role',
              options: [
                { value: 'admin', label: 'Admin' },
                { value: 'system', label: 'System' }
              ]
            },
            {
              key: 'level',
              label: 'Level',
              options: [
                { value: 'critical', label: 'Critical' },
                { value: 'warning', label: 'Warning' },
                { value: 'info', label: 'Info' }
              ]
            }
          ]}
          actions={(
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setFilters((current) => ({ ...current, actorRole: current.actorRole === 'admin' ? '' : 'admin' }))}
            >
              {filters.actorRole === 'admin' ? 'Show All Logs' : 'Show Admin Logs Only'}
            </button>
          )}
        />
        {loading ? <p className="module-note">Loading system logs...</p> : null}
        <DataTable columns={columns} rows={filteredLogs} />
      </section>
    </div>
  );
};

export default SystemLogs;
