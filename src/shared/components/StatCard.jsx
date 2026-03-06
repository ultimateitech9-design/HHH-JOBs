const toneClassMap = {
  default: 'stat-card--default',
  success: 'stat-card--success',
  warning: 'stat-card--warning',
  danger: 'stat-card--danger',
  info: 'stat-card--info'
};

const StatCard = ({ label, value, helper, tone = 'default' }) => {
  return (
    <article className={`stat-card ${toneClassMap[tone] || toneClassMap.default}`}>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      {helper ? <p className="stat-helper">{helper}</p> : null}
    </article>
  );
};

export default StatCard;
