import React, { useState } from "react";
import {
  FaSearch,
  FaUser,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { RiArrowDownDoubleLine, RiArrowUpDoubleLine } from "react-icons/ri";

export const QueryRequestItem = ({ request, response, parseUrl }) => {
  // Now `request.parsedRequestBody` is the full top-level object

  return (
    <div
      style={{
        marginBottom: "8px",
        borderRadius: "8px",
        padding: "15px",
        background: "#f9f9f9",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
      }}
      onMouseOver={(e) =>
        (e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.15)")
      }
      onMouseOut={(e) =>
        (e.currentTarget.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)")
      }
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <strong style={{ fontSize: "16px", marginRight: "10px" }}>
          {request.method}
        </strong>
        <span style={{ fontSize: "14px", color: "#777" }}>
          {parseUrl(request.url).queryType}
        </span>
      </div>
      <div style={{ marginTop: "8px", color: "#555", fontSize: "14px" }}>
        <small>{parseUrl(request.url).applicationId}</small>
      </div>
      <div style={{ marginTop: "8px", color: "#999", fontSize: "12px" }}>
        <small>{request.time}</small>
      </div>

      {request.parsedBody.requests &&
        request.parsedBody.requests.length > 0 && (
          <QueryRequestBody requests={request.parsedBody.requests} />
        )}

      {/* Render the entire response or parsedResponseBody in a <pre> */}
      {response?.parsedResponseBody && (
        <div style={{ marginTop: "10px" }}>
          <strong>Response:</strong>
          <pre
            style={{
              backgroundColor: "#eee",
              padding: "10px",
              borderRadius: "5px",
              overflowX: "auto",
              maxHeight: "200px",
            }}
          >
            {JSON.stringify(response.parsedResponseBody, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export const QueryRequestBody = ({ requests }) => {
  return (
    <div style={{ marginTop: "10px" }}>
      {requests.map((request, idx) => (
        <QueryRequestDetails key={idx} request={request} />
      ))}
    </div>
  );
};

export const QueryRequestDetails = ({ request }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to parse the analyticsTags string and return an array
  const parseTags = (tags) => {
    if (Array.isArray(tags)) {
      return tags; // If it's already an array, return as is
    } else if (typeof tags === "string") {
      try {
        // Check if it's a stringified array (e.g., '["tag1", "tag2"]')
        const parsedArray = JSON.parse(tags);
        if (Array.isArray(parsedArray)) {
          return parsedArray;
        }
      } catch (error) {
        console.error("Error parsing analyticsTags:", error);
      }
      // If it's not a stringified array, assume it's a comma-separated string
      return tags.split(",").map((tag) => tag.trim());
    }
    return [];
  };

  // Function to render each tag as a bubble
  const renderArrayTags = (tags) => {
    return tags.map((tag, idx) => (
      <div
        key={idx}
        style={{
          margin: "5px",
          padding: "4px 8px",
          borderRadius: "20px",
          backgroundColor: "#007bff",
          color: "white",
          fontSize: "10px",
          display: "inline-block",
          whiteSpace: "nowrap",
        }}
      >
        {tag}
      </div>
    ));
  };

  // Retrieve analyticsTags, either from the object or URLSearchParams
  const analyticsTags =
    request.analyticsTags ||
    new URLSearchParams(request.params).get("analyticsTags");
  const ruleContexts =
    request.ruleContexts ||
    new URLSearchParams(request.params).get("ruleContexts");
  const clickAnalytics =
    request.clickAnalytics ||
    new URLSearchParams(request.params).get("clickAnalytics");
  const hitsPerPage =
    request.hitsPerPage ||
    new URLSearchParams(request.params).get("hitsPerPage");

  return (
    <div
      style={{
        marginTop: "10px",
        padding: "8px",
        borderRadius: "8px",
        backgroundColor: "white",
      }}
    >
      {(request.query ||
        (request.params &&
          new URLSearchParams(request.params).get("query"))) && (
        <div style={{ display: "flex", alignItems: "center" }}>
          <FaSearch style={{ marginRight: "5px", color: "#007bff" }} />
          <small>Searching:</small>
          <span style={{ marginLeft: "5px" }}>
            {request.query || new URLSearchParams(request.params).get("query")}
          </span>
        </div>
      )}

      {request.indexName && (
        <div
          style={{ marginTop: "8px", display: "flex", alignItems: "center" }}
        >
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
            new URLSearchParams(request.params).get("userToken") || (
              <FaExclamationTriangle
                style={{ marginRight: "5px", color: "red" }}
              />
            )}
        </span>
      </div>

      {/* Toggle Button for Additional Details */}
      <div
        style={{
          marginTop: "10px",
          cursor: "pointer",
          fontSize: "10px",
          color: "#007bff",
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? <RiArrowUpDoubleLine /> : <RiArrowDownDoubleLine />}{" "}
        Additional Details
      </div>

      {/* Conditionally render the expanded details */}
      {isExpanded && (
        <>
          <hr></hr>
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {hitsPerPage && (
              <div>
                <small>hitsPerPage</small> {hitsPerPage}
              </div>
            )}
            <div>
              <small>clickAnalytics</small> {clickAnalytics ? "true" : "false"}
            </div>
            {analyticsTags && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  flexDirection: "column",
                }}
              >
                <small style={{ marginRight: "5px" }}>analyticsTags</small>
                <div>{renderArrayTags(parseTags(analyticsTags))}</div>
              </div>
            )}
            {ruleContexts && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  flexDirection: "column",
                }}
              >
                <small style={{ marginRight: "5px" }}>ruleContexts</small>
                <div>{renderArrayTags(parseTags(ruleContexts))}</div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
