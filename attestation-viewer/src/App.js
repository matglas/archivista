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
        const uniqueGitoids = new Map();

        // Collect unique gitoidSha256 values and their associated node names
        subjects.forEach(({ node }) => {
          const gitoid = node.statement.dsse[0].gitoidSha256;
          if (!uniqueGitoids.has(gitoid)) {
            uniqueGitoids.set(gitoid, new Set());
          }
          uniqueGitoids.get(gitoid).add(node.name);
        });

        const results = [];

        // Fetch statements for each unique gitoidSha256
        for (const [gitoid, names] of uniqueGitoids.entries()) {
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

          // Decode the payload and separate signatures
          const decodedPayload = JSON.parse(atob(statementData.payload)); // Decode Base64 payload
          const signatures = statementData.signatures; // Extract signatures

          results.push({
            gitoid,
            names: Array.from(names),
            statement: decodedPayload, // Use the decoded payload
            signatures, // Store signatures separately
          });
        }

        setResult(results);
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
      <header className="App-header py-3">
        <div className="container">
          <div className="row align-items-center">
            {/* Logo Section */}
            <div className="col-md-6 navbar-brand">
              <img
                src="/logo512.png"
                alt="in-toto Logo"
                className="img-fluid"
                style={{ maxHeight: '50px' }}
              />
              Archivista Attestation Viewer
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
            <h4>Results</h4>
              {result ? (
                result.map(({ gitoid, names, statement, signatures }) => (
                  <div key={gitoid} className="border p-3 mb-4">
                    <h5>Statement Gitoid: {gitoid}</h5>
                    <b>Subjects:</b>
                    <ul>
                      {names.map((name) => (
                        <li key={name}>{name}</li>
                      ))}
                    </ul>
                    <b>Signatures:</b> {signatures.length}
                    <ReactJson
                      src={statement}
                      theme="rjv-default" // Use a light theme
                      style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }} // Enable line wrapping
                    />
                  </div>
                ))
              ) : (
                <p className="text-muted">No result to display.</p>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
