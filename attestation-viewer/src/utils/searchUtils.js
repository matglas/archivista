import yaml from 'js-yaml';

// Helper function to get the search history from cookies
const getSearchHistory = () => {
  const history = document.cookie
    .split('; ')
    .find(row => row.startsWith('searchHistory='));
  return history ? JSON.parse(decodeURIComponent(history.split('=')[1])) : [];
};

// Helper function to update the search history in cookies
const updateSearchHistory = (hash) => {
  const history = getSearchHistory();
  if (!history.includes(hash)) {
    history.push(hash);
    document.cookie = `searchHistory=${encodeURIComponent(
      JSON.stringify(history)
    )}; path=/; max-age=31536000`; // 1 year expiration
  }
};

// Helper function to clear the search history
export const clearSearchHistory = (setSearchedHash, setResult) => {
  document.cookie = 'searchHistory=; path=/; max-age=0'; // Clear the cookie
  setSearchedHash(null);
  setResult(null);
};

export const loadConfig = async () => {
  const response = await fetch('/config.yaml');
  const text = await response.text();
  return yaml.load(text);
};

export const handleSearch = async (hash, setSearchedHash, setResult) => {
  setSearchedHash(hash);
  updateSearchHistory(hash); // Add the hash to the search history

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

    const results = []; // Use the current results as the base

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

      setResult(results); // Update the state with the new results
    } else {
      setResult(null); // Clear results if no subjects are found
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    setResult(null);
  }
};
