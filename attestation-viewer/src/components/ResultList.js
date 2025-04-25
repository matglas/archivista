import React from 'react';
import ReactJson from 'react-json-view';

function ResultList({ result }) {
  return (
    <div className="col-12">
      {result ? (
        result.map(({ gitoid, names, statement, signatures }) => (
          <div key={gitoid} className="border p-3 mb-4">
            <h5>Statement Gitoid: {gitoid}</h5>
            
            <div>
                <b>Matching subjects:</b>
                <ul>
                {names.map((name) => (
                    <li key={name}>{name}</li>
                ))}
                </ul>
            </div>
            
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
          </div>
        ))
      ) : (
        <p className="text-muted">No result to display.</p>
      )}
    </div>
  );
}

export default ResultList;