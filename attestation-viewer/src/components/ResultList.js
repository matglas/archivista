import React, { useContext } from 'react';
import ReactJson from 'react-json-view';
import { SearchContext } from '../context/SearchContext';

function ResultList() {
  const { searchResults } = useContext(SearchContext);

  if (!searchResults) {
    return <p>No results found.</p>;
  }

  const result = searchResults;

  return (
    <div className="col-12">
      {result ? (
        result.map(({ gitoid, nodes, statement, signatures }) => (
          <div key={gitoid} className="border p-3 mb-4">
            <div className="mb-2">
              <div>DSSE Gitoid: {gitoid}</div>
              <div className="xs-text">
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

          </div>
        ))
      ) : (
        <p className="text-muted">No result to display.</p>
      )}
    </div>
  );
}

export default ResultList;