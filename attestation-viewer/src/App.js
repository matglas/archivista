import React, { useEffect, useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import ResultList from './components/ResultList';
import { handleSearch } from './utils/searchUtils'; // Import the extracted function

function App() {
  const [searchedHash, setSearchedHash] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    document.title = 'Archivista Attestation Viewer';
  }, []);

  const handleSearchWithLoading = async (hash) => {
    setLoading(true); // Set loading to true
    await handleSearch(hash, setSearchedHash, setResult);
    setLoading(false); // Set loading to false after search completes
  };

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
              <SearchBar onSearch={handleSearchWithLoading} />
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
              ) : searchedHash ? (
                <div><span><strong>Search hash:</strong></span> {searchedHash}</div>
              ) : (
                <div className="text-muted">No hash searched yet.</div>
              )}
            </div>
          </div>

          {/* Use the ResultList component */}
          <ResultList result={result} />
        </div>
      </div>
    </div>
  );
}

export default App;
