import React, { useEffect, useState } from "react";
import { FaSearch, FaUser, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';

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

  const parseUrl = (url) => {
    try {
      const parsedUrl = new URL(url);
      const pathParts = parsedUrl.pathname.split("/");

      const indexName = pathParts[2] || "Unknown Index";
      const applicationId =
        parsedUrl.searchParams.get("x-algolia-application-id") ||
        "Unknown Application ID";

      const queryType = parsedUrl.pathname.includes('/queries')
        ? "/QUERIES"
        : parsedUrl.pathname.includes('/query')
        ? "/QUERY"
        : "No Query Found";

      return { indexName, applicationId, queryType };
    } catch (error) {
      console.error("Error parsing URL:", error);
      return {
        indexName: "Invalid URL",
        applicationId: "Invalid Application ID",
        queryType: "Invalid URL",
      };
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>Logged Requests</h2>
      {requests.length === 0 ? (
        <p style={{ textAlign: "center", color: "#555" }}>No requests captured yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {requests.map((req, index) => (
            <li
              key={index}
              style={{
                marginBottom: "20px",
                borderRadius: "8px",
                padding: "15px",
                background: "#f9f9f9",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.15)"}
              onMouseOut={(e) => e.currentTarget.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)"}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <strong style={{ fontSize: "16px", marginRight: "10px" }}>{req.method}</strong>
                <span style={{ fontSize: "14px", color: "#777" }}>
                  {parseUrl(req.url).queryType}
                </span>
              </div>
              <div style={{ marginTop: "8px", color: "#555", fontSize: "14px" }}>
                <small>{parseUrl(req.url).applicationId}</small>
              </div>
              <div style={{ marginTop: "8px", color: "#999", fontSize: "12px" }}>
                <small>{req.time}</small>
              </div>

              {req.parsedBody.requests && req.parsedBody.requests.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                  {req.parsedBody.requests.map((request, idx) => (
                    <div key={idx} style={{ marginTop: "10px", padding:"8px", borderRadius: "8px", backgroundColor:"white" }}>

                      {(request.query ||
                        (request.params &&
                          new URLSearchParams(request.params).get("query"))) && (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <FaSearch style={{ marginRight: "5px", color: "#007bff" }} />
                          <small>Searching:</small>
                          <span style={{ marginLeft: "5px" }}>
                            {request.query ||
                              new URLSearchParams(request.params).get("query")}
                          </span>
                        </div>
                      )}

                      {request.indexName && (
                        <div style={{ marginTop: "8px", display: "flex", alignItems: "center" }}>
                          <FaInfoCircle style={{ marginRight: "5px", color: "#28a745" }} />
                          <small>Index Name: </small>
                          <span style={{ marginLeft: "5px" }}>{request.indexName}</span>
                        </div>
                      )}

                      <div style={{ marginTop: "8px", display: "flex", alignItems: "center" }}>
                        <FaUser style={{ marginRight: "5px", color: "#f39c12" }} />
                        <small>userToken: </small>
                        <span style={{ marginLeft: "5px" }}>
                          {request.userToken ||
                            new URLSearchParams(request.params).get("userToken") ||
                            <FaExclamationTriangle style={{ marginRight: "5px", color: "red" }} />}
                        </span>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
