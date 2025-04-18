import React, { useEffect, useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';

function App() {
  const [searchedHash, setSearchedHash] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    document.title = 'Archivista Attestation Viewer';
  }, []);

  const handleSearch = async (hash) => {
    setSearchedHash(hash);

    // Simulate fetching data from the Archivista API
    try {
      console.log(`Fetching data for hash: ${hash}`);
      // Replace this with the actual API call
      const mockResult = {
        predicateType: 'example-predicate',
        data: { key: 'value' },
      };
      setResult(mockResult);
    } catch (error) {
      console.error('Error fetching data:', error);
      setResult(null);
    }
  };

  return (
    <div className="App">
      {/* Header Section */}
      <header className="App-header text-white py-3">
        <div className="container">
          <div className="row align-items-center">
            {/* Title Section */}
            <div className="col-md-6">
              <h1 className="mb-0">Archivista Attestation Viewer</h1>
            </div>

            {/* Search Bar Section */}
            <div className="col-md-6 text-end">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </header>

      {/* Body Section */}
      <div className="container mt-4">
        <div className="row">
          {/* Searched Hash Section */}
          <div className="col-md-6">
            <h4>Searched Hash</h4>
            <div className="border p-3">
              {searchedHash ? (
                <p>{searchedHash}</p>
              ) : (
                <p className="text-muted">No hash searched yet.</p>
              )}
            </div>
          </div>

          {/* Result Section */}
          <div className="col-md-6">
            <h4>Result</h4>
            <div className="border p-3">
              {result ? (
                <pre>{JSON.stringify(result, null, 2)}</pre>
              ) : (
                <p className="text-muted">No result to display.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
