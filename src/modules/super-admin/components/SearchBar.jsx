const SearchBar = ({ value, onChange, placeholder = 'Search records...' }) => {
  return (
    <label className="full-width-control">
      Search
      <input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
};

export default SearchBar;
