import React, { useState, useContext } from 'react';
import { SearchContext } from '../context/SearchContext';

function SearchBar() {
  const [inputValue, setInputValue] = useState('');
  const { handleSearch } = useContext(SearchContext);

  const onSearch = () => {
    if (inputValue.trim()) {
      handleSearch(inputValue);
    }
  };

  return (
    <div className="search-bar d-flex">
      <input
        type="text"
        className="form-control me-2"
        placeholder="Enter digest to search"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
      />
      <button className="btn btn-primary" onClick={onSearch}>
        Search
      </button>
    </div>
  );
}

export default SearchBar;