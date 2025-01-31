import React, { useEffect, useState } from "react";

function App() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Load stored requests when the component mounts
    chrome.storage.local.get("requests", (result) => {
      setRequests(result.requests || []);
    });

    // Listen for storage changes and update UI dynamically
    const listener = (changes) => {
      if (changes.requests) {
        setRequests(changes.requests.newValue || []);
      }
    };

    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  return (
    <>
      <div style={{ padding: "10px", fontFamily: "Arial" }}>
        <h2>Logged Requests</h2>
        {requests.length === 0 ? (
          <p>No requests captured yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {requests.map((req, index) => (
              <li key={index} style={{ marginBottom: "10px", borderBottom: "1px solid #ccc", paddingBottom: "5px", wordWrap: "break-word" }}>
                <strong>{req.method}</strong> - {req.url} <br />
                <small>{req.time}</small>

                {/* Render the requests array, and display query and indexName */}
                {req.parsedBody.requests && req.parsedBody.requests.length > 0 && (
                  <div>
                    {req.parsedBody.requests.map((request, idx) => (
                      <div key={idx} style={{ marginTop: "10px" }}>
                        {/* Check if query exists directly or within params */}
                        {(request.query || (request.params && new URLSearchParams(request.params).get('query'))) && (
                          <div>
                            <strong>Query:</strong>{" "}
                            {request.query || new URLSearchParams(request.params).get('query')} <br />
                          </div>
                        )}
                        {request.indexName && (
                          <div>
                            <strong>Index Name:</strong> {request.indexName} <br />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default App;
