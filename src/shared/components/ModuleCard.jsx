import { Link } from 'react-router-dom';

const ModuleCard = ({ title, description, route, metrics, tone = 'default' }) => {
  return (
    <article className={`module-card module-card--${tone}`}>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <ul className="module-card-metrics">
        {metrics.map((metric) => (
          <li key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </li>
        ))}
      </ul>

      <Link to={route} className="module-link">
        Open Module
      </Link>
    </article>
  );
};

export default ModuleCard;
