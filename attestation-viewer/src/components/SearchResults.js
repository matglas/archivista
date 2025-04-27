import React, { useContext, useState } from 'react';
import ReactJson from 'react-json-view';
import { SearchContext } from '../context/SearchContext';

function SearchResults() {
  const { searchResults, fetchStatement } = useContext(SearchContext);
  const [loadingStatements, setLoadingStatements] = useState({});
  const [modalData, setModalData] = useState(null); // State to manage modal data

  if (!searchResults) {
    return <p>No results found.</p>;
  }

  const handleLoadStatement = async (gitoid) => {
    setLoadingStatements((prev) => ({ ...prev, [gitoid]: true }));
    try {
      const { statement, signatures } = await fetchStatement(gitoid);
      setModalData({ gitoid, statement, signatures }); // Set modal data after loading
    } catch (error) {
      console.error(`Failed to load statement for gitoid ${gitoid}:`, error);
    } finally {
      setLoadingStatements((prev) => ({ ...prev, [gitoid]: false }));
    }
  };

  const closeModal = () => {
    setModalData(null); // Close the modal by clearing modal data
  };

  return (
    <div className="col-12">
      {searchResults.map(({ gitoid, nodes }) => (
        <div key={gitoid} className="border p-3 mb-4 search-item">
          <div className="mb-2">
            <div>DSSE Gitoid: {gitoid}</div>
            <div className="xs-text predicate">
              <b>Predicate:</b> {nodes[0].predicate}
            </div>
          </div>

          <div className='row align-items-end'> {/* Align content to the bottom */}
            <div className="col-10 mb-2">
              <b>Matching subjects:</b>
              <ul>
                {nodes.map((node) => (
                  <li key={node.name}>{node.name}</li>
                ))}
              </ul>
            </div>

            <div className="col-2 text-end">
              <button
                className="btn btn-primary mt-2"
                onClick={() => handleLoadStatement(gitoid)}
                disabled={loadingStatements[gitoid]}
              >
                {loadingStatements[gitoid] ? 'Loading...' : 'View Statement'}
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Bootstrap Modal */}
      {modalData && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} // Faded background
        >
          <div className="modal-dialog modal-lg" role="document"> {/* Large modal */}
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Statement Details for {modalData.gitoid}</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <div>
                  <b>Signatures:</b>
                  <ReactJson
                    src={modalData.signatures}
                    name={false}
                    collapsed={true}
                    theme="rjv-default"
                    style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                  />
                </div>
                <div className="mt-3">
                  <b>Payload:</b>
                  <ReactJson
                    src={modalData.statement}
                    name={false}
                    collapsed={true}
                    theme="rjv-default"
                    style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchResults;