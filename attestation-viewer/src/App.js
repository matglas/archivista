import React, { useEffect, useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import ReactJson from 'react-json-view';
import yaml from 'js-yaml';

export const loadConfig = async () => {
  const response = await fetch('/config.yaml');
  const text = await response.text();
  return yaml.load(text);
};

function App() {
  const [searchedHash, setSearchedHash] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    document.title = 'Archivista Attestation Viewer';
  }, []);

  const handleSearch = async (hash) => {
    setSearchedHash(hash);

    const query = `
      query($digest: String!) {
        subjects(where: { hasSubjectDigestsWith: { value: $digest } }) {
          edges {
            node {
              name
              subjectDigests {
                algorithm
                value
              }
              statement {
                id
                dsse {
                  id
                  gitoidSha256
                }
              }
            }
          }
        }
      }
    `;

    const variables = { digest: hash };

    try {
      console.log(`Fetching data for digest: ${hash}`);

      const config = await loadConfig();
      const archivistaEndpoint = config.archivistaEndpoint;
      console.log("Archivista Endpoint:", archivistaEndpoint);

      const response = await fetch(archivistaEndpoint + "v1/query", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const resultData = await response.json();
      const subjects = resultData.data.subjects.edges;

      if (subjects.length > 0) {
        const gitoid = subjects[0].node.statement.dsse[0].gitoidSha256;

        // Fetch the full statement using the gitoid with the correct endpoint
        const statementResponse = await fetch(`${archivistaEndpoint}/download/${gitoid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!statementResponse.ok) {
          throw new Error(`HTTP error! status: ${statementResponse.status}`);
        }

        const statementData = await statementResponse.json();
        setResult(statementData);
      } else {
        setResult(null);
      }
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
          <div className="col-12 mb-4">
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
          <div className="col-12">
            <h4>Result</h4>
            <div className="border p-3">
              {result ? (
                <ReactJson src={result} theme="monokai" />
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
