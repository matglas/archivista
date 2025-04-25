import yaml from 'js-yaml';

export const loadConfig = async () => {
  const response = await fetch('/config.yaml');
  const text = await response.text();
  return yaml.load(text);
};

export const handleSearch = async (hash, setSearchedHash, setResult) => {
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