import React, { useContext } from 'react';
import { SearchContext } from '../context/SearchContext';

function SearchAction() {
  const { searchResults, loading, searchHistory } = useContext(SearchContext);

  const latestHash = searchHistory.length > 0 ? searchHistory[searchHistory.length - 1] : null;

  return (
    <div className="border p-3">
      {loading ? (
        <div className="text-muted">Loading...</div> // Show loading message
      ) : searchResults ? (
        <div>
          <span>
            <strong>Search results for digest:</strong> {latestHash}
          </span>
        </div>
      ) : (
        <div className="text-muted">No results found.</div>
      )}
    </div>
  );
}

export default SearchAction;