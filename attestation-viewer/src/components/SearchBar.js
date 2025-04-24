import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSearch(inputValue);
    }
  };

  const handleButtonClick = () => {
    onSearch(inputValue);
  };

  return (
    <div className="search-bar d-flex">
      <input
        type="text"
        className="form-control me-2"
        placeholder="Enter hash to search"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown} // Trigger search on Enter key press
      />
      <button className="btn btn-primary" onClick={handleButtonClick}>
        Search
      </button>
    </div>
  );
}

export default SearchBar;