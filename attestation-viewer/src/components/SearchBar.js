import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [hash, setHash] = useState('');

  const handleSearch = () => {
    if (hash.trim()) {
      onSearch(hash);
    }
  };

  return (
    <div className="container mt-4">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Enter Git SHA hash"
          value={hash}
          onChange={(e) => setHash(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;