import { useEffect, useMemo, useState } from 'react';
import SectionHeader from '../../../shared/components/SectionHeader';
import StatCard from '../../../shared/components/StatCard';
import DataEntryTaskTable from '../components/DataEntryTaskTable';
import { getAssignedTasks } from '../services/dataentryApi';

const AssignedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const response = await getAssignedTasks();
      setTasks(response.data || []);
      setError(response.error || '');
      setLoading(false);
    };
    load();
  }, []);

  const stats = useMemo(() => ([
    { label: 'Assigned Tasks', value: String(tasks.length), helper: 'Current operator queue', tone: 'info' },
    { label: 'High / Critical', value: String(tasks.filter((item) => ['high', 'critical'].includes(String(item.priority || '').toLowerCase())).length), helper: 'Priority handling', tone: 'danger' },
    { label: 'Pending', value: String(tasks.filter((item) => item.status === 'pending').length), helper: 'Action needed now', tone: 'warning' }
  ]), [tasks]);

  return (
    <div className="module-page module-page--dataentry">
      <SectionHeader eyebrow="Data Entry" title="Assigned Tasks" subtitle="Monitor operator task queues, due times, and queue priority across data correction and upload work." />
      {error ? <p className="form-error">{error}</p> : null}
      <div className="stats-grid">
        {stats.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
      <section className="panel-card">
        {loading ? <p className="module-note">Loading tasks...</p> : null}
        <DataEntryTaskTable rows={tasks} />
      </section>
    </div>
  );
};

export default AssignedTasks;
