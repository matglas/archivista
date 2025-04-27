import React, { createContext, useState } from 'react';
import yaml from 'js-yaml';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchHistory, setSearchHistory] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Add a hash to the search history
  const addToHistory = (hash) => {
    if (!searchHistory.includes(hash)) {
      setSearchHistory((prev) => [...prev, hash]);
    }
  };

  // Clear the search history
  const clearHistory = () => {
    setSearchHistory([]);
  };

  // Load configuration (e.g., endpoint)
  const loadConfig = async () => {
    const response = await fetch('/config.yaml');
    const text = await response.text();
    return yaml.load(text);
  };

  // Fetch the statement for a specific gitoid
  const fetchStatement = async (gitoid) => {
    try {
      const config = await loadConfig();
      const archivistaEndpoint = config.archivistaEndpoint;

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
      const decodedPayload = JSON.parse(atob(statementData.payload));
      const signatures = statementData.signatures;

      return {
        statement: decodedPayload,
        signatures,
      };
    } catch (error) {
      console.error(`Error fetching statement for gitoid ${gitoid}:`, error);
      throw error;
    }
  };

  // Handle the search logic
  const handleSearch = async (hash) => {
    setLoading(true);
    addToHistory(hash);

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
                predicate

                dsse {
                  id
                  gitoidSha256
                }
                subjects {
                  totalCount
                  edges {
                    node {
                      name
                      subjectDigests {
                        algorithm
                        value
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const variables = { digest: hash };

    try {
      const config = await loadConfig();
      const archivistaEndpoint = config.archivistaEndpoint;

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

      const results = [];
      if (subjects.length > 0) {
        const uniqueGitoids = new Map();

        subjects.forEach(({ node }) => {
          const gitoid = node.statement.dsse[0].gitoidSha256;
          if (!uniqueGitoids.has(gitoid)) {
            uniqueGitoids.set(gitoid, new Set());
          }
          uniqueGitoids.get(gitoid).add({
            name: node.name,
            predicate: node.statement.predicate,
          });
        });

        for (const [gitoid, nodes] of uniqueGitoids.entries()) {
          results.push({
            gitoid,
            nodes: Array.from(nodes),
            statement: null, // Statement will be loaded on demand
            signatures: null, // Signatures will be loaded on demand
          });
        }
      }

      setSearchResults(results.length > 0 ? results : null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SearchContext.Provider
      value={{
        searchHistory,
        searchResults,
        loading,
        handleSearch,
        fetchStatement, // Expose the fetchStatement function
        addToHistory,
        clearHistory,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};