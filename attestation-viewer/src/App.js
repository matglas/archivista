import React, { useContext, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import SearchAction from './components/SearchAction';
import { SearchContext } from './context/SearchContext';

function App() {
  const { setSearchResults } = useContext(SearchContext);

  const handleSearch = async (query) => {
    try {
      const results = await SearchAction(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error performing search:', error);
      setSearchResults(null);
    }
  };

  useEffect(() => {
    document.title = 'Archivista Attestation Viewer';
  }, []);

  return (
    <div className="App">
      <header className="App-header py-3">
        <div className="container">
          <div className="row align-items-center g-3">
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
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </header>

      {/* Body Section */}
      <div className="container mt-4">
        <div className="row g-3">
          <div className="col-12">
            <SearchAction />
          </div>
          <SearchResults />
        </div>
      </div>
    </div>
  );
}

export default App;
