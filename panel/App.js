import React, { useEffect, useState } from "react";
import { QueryRequestItem } from "./QueryRequestComponents";
import { RxUpdate } from "react-icons/rx";
import { FaTrashAlt } from "react-icons/fa";

function App() {
  const [requests, setRequests] = useState([]);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    // Fetch stored requests
    chrome.storage.local.get(["requests", "responses"], (result) => {
      setRequests(result.requests || []);
      setResponses(result.responses || []);
    });

    // Listen for changes to the stored requests
    const listener = (changes) => {
      if (changes.requests) {
        setRequests(changes.requests.newValue || []);
      }
      if (changes.responses) {
        setResponses(changes.responses.newValue || []);
      }
    };
    chrome.storage.onChanged.addListener(listener);

    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  // Parse URL to extract useful data
  const parseUrl = (url) => {
    try {
      const parsedUrl = new URL(url);
      const pathParts = parsedUrl.pathname.split("/");

      const indexName = pathParts[2] || "Unknown Index";
      const applicationId =
        parsedUrl.searchParams.get("x-algolia-application-id") ||
        "Unknown Application ID";

      const queryType = parsedUrl.pathname.includes("/queries")
        ? "/QUERIES"
        : parsedUrl.pathname.includes("/query")
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

  // Handle the "Clear" button click to clear all stored requests
  const handleClear = () => {
    chrome.storage.local.set({ requests: [] }, () => {
      setRequests([]); // Update state to reflect the changes in the UI
    });
  };

  // Handle the "Refresh" button click to reload the Chrome extension frame
  const handleRefresh = () => {
    window.location.reload(); // This will refresh the page (or the extension's frame)
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
          gap: "8px",
        }}
      >
        <button
          onClick={handleClear}
          style={{
            padding: "8px 16px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          <FaTrashAlt style={{ marginRight: "5px" }} />
          Clear
        </button>

        <button
          onClick={handleRefresh}
          style={{
            padding: "8px 16px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          <RxUpdate style={{ marginRight: "5px" }} />
          Refresh
        </button>
      </div>

      {requests.length === 0 ? (
        <p style={{ textAlign: "center", color: "#555" }}>
          No requests captured yet.
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {requests.map((req, index) => (
            <QueryRequestItem key={index} request={req} parseUrl={parseUrl} />
          ))}
        </ul>
      )}

      <div>
        {responses.length === 0 ? (
          <p>No responses captured yet.</p>
        ) : (
          <ul>
            {responses.map((res, index) => (
              <li key={index}>
                <p>URL: {res.url}</p>
                <p>Status: {res.status}</p>
                <p>Time: {res.time}</p>

                {/* If parsedResponseBody is not null, show it nicely */}
                {res.parsedResponseBody ? (
                  <pre style={{ background: "#f8f8f8", padding: "10px" }}>
                    {JSON.stringify(res.parsedResponseBody, null, 2)}
                  </pre>
                ) : (
                  <pre style={{ background: "#f8f8f8", padding: "10px" }}>
                    {res.rawResponseBody}
                  </pre>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
