import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import ResultList from './components/ResultList';
import { SearchContext } from './context/SearchContext';

function App() {
  const { searchResults, loading } = useContext(SearchContext);

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
              <SearchBar />
            </div>
          </div>
        </div>
      </header>

      {/* Body Section */}
      <div className="container mt-4">
        <div className="row">
          <div className="col-12 mb-4">
            <div className="border p-3">
              {loading ? (
                <div className="text-muted">Loading...</div> // Show loading message
              ) : searchResults ? (
                <div><span><strong>Search results loaded.</strong></span></div>
              ) : (
                <div className="text-muted">No results found.</div>
              )}
            </div>
          </div>

          {/* Use the ResultList component */}
          <ResultList />
        </div>
      </div>
    </div>
  );
}

export default App;
