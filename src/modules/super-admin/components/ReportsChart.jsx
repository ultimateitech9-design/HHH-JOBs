import { formatCurrency } from '../utils/currencyFormat';

const ReportsChart = ({ rows = [] }) => {
  const maxValue = Math.max(...rows.map((row) => row.revenue || row.value || 0), 1);

  return (
    <div className="chart-stack">
      {rows.map((row) => {
        const value = row.revenue || row.value || 0;
        return (
          <div key={row.period || row.label} className="chart-row">
            <div className="chart-row-meta">
              <strong>{row.period || row.label}</strong>
              <span>{row.revenue ? formatCurrency(row.revenue) : value}</span>
            </div>
            <div className="chart-bar-track">
              <span className="chart-bar-fill" style={{ width: `${Math.max(10, (value / maxValue) * 100)}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReportsChart;
