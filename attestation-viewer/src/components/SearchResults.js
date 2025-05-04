import React, { useContext, useState } from 'react';
import ReactJson from 'react-json-view';
import { SearchContext } from '../context/SearchContext';
import WitnessCollectionSummary from './WitnessCollectionSummary';

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
      {searchResults.map(({ gitoid, name, predicate, digestMatch, node }) => (
        <div key={gitoid} className="p-3 mb-4 search-item" onClick={() => handleLoadStatement(gitoid)}>
          <div className="col-12 mb-2">
            <b>Subject match: {name}</b>
            <div className="col-10 xs-text">
              <div>{digestMatch}</div>
            </div>
          </div>

          <div className='col-12 predicate-details'>
            <div class="m-1 p-1">
            {predicate === 'https://witness.testifysec.com/attestation-collection/v0.1' ? (
            <WitnessCollectionSummary witnessCollection={node} />
             ) : (null) }
             </div>
          </div>

          <div className="row align-items-end"> {/* Align content to the bottom */}
            <div className="col-10 xs-text primary-details">
              <div><b>Gitoid</b>: {gitoid}</div>
              <div><b>Predicate:</b> {predicate}</div>
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
                
                <div className="row">
                  <h5 className="modal-title">Statement details</h5>
                  <div className="col-12 xs-text">{modalData.gitoid}</div>
                </div>

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