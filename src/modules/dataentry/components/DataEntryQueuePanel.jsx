import SectionHeader from '../../../shared/components/SectionHeader';
import StatCard from '../../../shared/components/StatCard';
import DataEntryEntryTable from './DataEntryEntryTable';

const DataEntryQueuePanel = ({ eyebrow, title, subtitle, stats = [], rows = [], loading }) => {
  return (
    <>
      <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
      {stats.length > 0 ? (
        <div className="stats-grid">
          {stats.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>
      ) : null}
      <section className="panel-card">
        {loading ? <p className="module-note">Loading records...</p> : null}
        <DataEntryEntryTable rows={rows} />
      </section>
    </>
  );
};

export default DataEntryQueuePanel;
