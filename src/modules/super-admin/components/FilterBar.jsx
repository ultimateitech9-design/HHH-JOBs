import SearchBar from './SearchBar';

const FilterBar = ({ filters, onChange, fields = [], actions }) => {
  return (
    <div className="student-inline-controls">
      <SearchBar value={filters.search || ''} placeholder="Search by name, email, company, ID, or title" onChange={(value) => onChange('search', value)} />
      {fields.map((field) => (
        <label key={field.key}>
          {field.label}
          <select value={filters[field.key] || ''} onChange={(event) => onChange(field.key, event.target.value)}>
            <option value="">All</option>
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      ))}
      {actions ? <div className="student-job-actions">{actions}</div> : null}
    </div>
  );
};

export default FilterBar;
