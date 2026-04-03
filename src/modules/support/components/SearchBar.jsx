const SearchBar = ({ value = '', placeholder = 'Search', onChange }) => {
  return <input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />;
};

export default SearchBar;
