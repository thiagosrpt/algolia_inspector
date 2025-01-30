import React, { useEffect, useState } from "react";

function App() {
    const [requests, setRequests] = useState([]);
  
    useEffect(() => {
      chrome.storage.local.get("requests", (result) => {
        setRequests(result.requests || []);
      });
  
      const listener = (changes) => {
        if (changes.requests) {
          setRequests(changes.requests.newValue || []);
        }
      };
  
      chrome.storage.onChanged.addListener(listener);
      return () => chrome.storage.onChanged.removeListener(listener);
    }, []);
  
    return (
      <div style={{ padding: "10px", fontFamily: "Arial" }}>
        <h2>Logged Requests</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {requests.map((req, index) => (
            <li key={index} style={{ marginBottom: "10px", borderBottom: "1px solid #ccc", paddingBottom: "5px" }}>
              <strong>{req.method}</strong> - {req.url} <br />
              <small>{req.time}</small>
              <pre style={{ fontSize: "12px", marginTop: "5px", background: "#f4f4f4", padding: "5px", borderRadius: "4px" }}>
                {req.headers}
              </pre>
            </li>
          ))}
        </ul>
      </div>
    );
  }

export default App;
