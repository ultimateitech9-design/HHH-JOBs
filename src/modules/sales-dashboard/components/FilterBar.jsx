const FilterBar = ({ filters = [], values = {}, onChange }) => {
  return (
    <div className="student-inline-controls">
      {filters.map((filter) => (
        <label key={filter.key} className={filter.fullWidth ? 'full-width-control' : ''}>
          {filter.label}
          {filter.type === 'select' ? (
            <select value={values[filter.key] || ''} onChange={(event) => onChange(filter.key, event.target.value)}>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          ) : (
            <input
              value={values[filter.key] || ''}
              placeholder={filter.placeholder || ''}
              onChange={(event) => onChange(filter.key, event.target.value)}
            />
          )}
        </label>
      ))}
    </div>
  );
};

export default FilterBar;
