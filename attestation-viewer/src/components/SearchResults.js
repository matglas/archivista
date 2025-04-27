import React, { useContext, useState } from 'react';
import ReactJson from 'react-json-view';
import { SearchContext } from '../context/SearchContext';

function SearchResults() {
  const { searchResults, fetchStatement } = useContext(SearchContext);
  const [loadingStatements, setLoadingStatements] = useState({});

  if (!searchResults) {
    return <p>No results found.</p>;
  }

  const handleLoadStatement = async (gitoid) => {
    setLoadingStatements((prev) => ({ ...prev, [gitoid]: true }));
    try {
      const { statement, signatures } = await fetchStatement(gitoid);
      // Update the specific result with the fetched statement and signatures
      searchResults.forEach((result) => {
        if (result.gitoid === gitoid) {
          result.statement = statement;
          result.signatures = signatures;
        }
      });
    } catch (error) {
      console.error(`Failed to load statement for gitoid ${gitoid}:`, error);
    } finally {
      setLoadingStatements((prev) => ({ ...prev, [gitoid]: false }));
    }
  };

  return (
    <div className="col-12">
      {searchResults.map(({ gitoid, nodes, statement, signatures }) => (
        <div key={gitoid} className="border p-3 mb-4 search-item">
          <div className="mb-2">
            <div>DSSE Gitoid: {gitoid}</div>
            <div className="xs-text predicate">
              <b>Predicate:</b> {nodes[0].predicate}
            </div>
          </div>

          <div>
            <b>Matching subjects:</b>
            <ul>
              {nodes.map((node) => (
                <li key={node.name}>{node.name}</li>
              ))}
            </ul>
          </div>

          {statement ? (
            <>
              <div>
                <b>Signatures:</b>
                <ReactJson
                  src={signatures}
                  name={false}
                  collapsed={true}
                  theme="rjv-default"
                  style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                />
              </div>
              <div>
                <b>Payload:</b>
                <ReactJson
                  src={statement}
                  name={false}
                  collapsed={true}
                  theme="rjv-default"
                  style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                />
              </div>
            </>
          ) : (
            <button
              className="btn btn-primary mt-2"
              onClick={() => handleLoadStatement(gitoid)}
              disabled={loadingStatements[gitoid]}
            >
              {loadingStatements[gitoid] ? 'Loading...' : 'Load Statement'}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default SearchResults;