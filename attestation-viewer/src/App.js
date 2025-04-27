import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import SearchAction from './components/SearchAction';
import { SearchContext } from './context/SearchContext';

function App() {
  const { searchResults, loading, setSearchResults } = useContext(SearchContext);

  const handleSearch = async (query) => {
    try {
      const results = await SearchAction(query); // Call SearchAction with the query
      setSearchResults(results); // Update the search results in the context
    } catch (error) {
      console.error('Error performing search:', error);
      setSearchResults(null); // Handle errors gracefully
    }
  };

  useEffect(() => {
    document.title = 'Archivista Attestation Viewer';
  }, []);

  return (
    <div className="App">
      {/* Header Section */}
      <header className="App-header py-3">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 navbar-brand">
              <img
                src="/logo512.png"
                alt="in-toto Logo"
                className="img-fluid"
                style={{ maxHeight: '50px' }}
              />
              Archivista Attestation Viewer
            </div>
            <div className="col-md-6 text-end">
              <SearchBar onSearch={handleSearch} /> {/* Pass handleSearch to SearchBar */}
            </div>
          </div>
        </div>
      </header>

      {/* Body Section */}
      <div className="container mt-4">
        <div className="row">
          <div className="col-12 mb-4">
            <SearchAction /> {/* Use the SearchAction component */}
          </div>

          {/* Use the ResultList component */}
          <SearchResults />
        </div>
      </div>
    </div>
  );
}

export default App;
