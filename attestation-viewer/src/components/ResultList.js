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
              <div class="xs-text">
                  <b>Predicate:</b> {nodes[0].predicate}
              </div>
            </div>

            <div>
                <b>Matching subjects:</b>
                <ul>
                {nodes.map((node) => (
                    <li key={node.name}>{node.name}, {node.predicate}</li>
                ))}
                </ul>
            </div>

            <div style="display: none;">
            <div>
                <b>Signatures:</b> {signatures.length}
            </div>
            <div>
                <ReactJson
                    src={signatures}
                    name={false} // Do not show the name of the object
                    collapsed={true}
                    theme="rjv-default" // Use a light theme
                    style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }} // Enable line wrapping
                />
            </div>

            <div>
                <b>Payload:</b>
                <ReactJson
                src={statement}
                name={false} // Do not show the name of the object
                collapsed={true}
                theme="rjv-default" // Use a light theme
                style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }} // Enable line wrapping
              />
            </div>
            <div>
          </div>
        ))
      ) : (
        <p className="text-muted">No result to display.</p>
      )}
    </div>
  );
}

export default ResultList;