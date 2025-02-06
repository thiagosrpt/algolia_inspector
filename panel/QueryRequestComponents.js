import React, { useState } from "react";
import ReactJson from "@microlink/react-json-view";
import {
  FaSearch,
  FaUser,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { RiArrowDownDoubleLine, RiArrowUpDoubleLine } from "react-icons/ri";

export const QueryRequestItem = ({ request, response, parseUrl }) => {
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
          {response.status} {request.method}
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

      {request?.parsedBody?.requests &&
        (() => {
          const requests = request.parsedBody.requests;

          // Extract clickAnalytics values from both direct property and query params
          const clickAnalyticsValues = requests.map((req) => {
            const urlParams = new URLSearchParams(req.params);
            return (
              req.clickAnalytics ?? urlParams.get("clickAnalytics") === "true"
            );
          });

          const allClickTrue = clickAnalyticsValues.every(
            (val) => val === true
          );
          const allClickFalse = clickAnalyticsValues.every(
            (val) => val === false
          );

          // Extract userToken values from both direct property and query params
          const userTokens = requests
            .map(
              (req) =>
                req.userToken ||
                new URLSearchParams(req.params).get("userToken")
            )
            .filter(Boolean); // Remove falsy values

          const uniqueUserTokens = [...new Set(userTokens)]; // Get unique userTokens

          // Extract unique queries
          const queryTerms = [
            ...new Set(
              requests
                .map(
                  (req) =>
                    req.query || new URLSearchParams(req.params).get("query")
                )
                .filter(Boolean)
            ),
          ];

          // Extract and normalize analyticsTags
          const analyticsTags = requests
            .flatMap((req) => {
              const tagValue =
                req.analyticsTags ||
                new URLSearchParams(req.params).get("analyticsTags");
              return Array.isArray(tagValue) ? tagValue : tagValue?.split(",");
            })
            .filter(Boolean);

          const uniqueAnalyticsTags = [...new Set(analyticsTags)]; // Remove duplicates

          // Extract and normalize ruleContexts
          const ruleContexts = requests
            .flatMap((req) => {
              const contextValue =
                req.ruleContexts ||
                new URLSearchParams(req.params).get("ruleContexts");
              return Array.isArray(contextValue)
                ? contextValue
                : contextValue?.split(",");
            })
            .filter(Boolean);

          const uniqueRuleContexts = [...new Set(ruleContexts)]; // Remove duplicates

          // Define messages
          const clickAnalyticsMessage = allClickTrue
            ? "true"
            : allClickFalse
            ? "false"
            : "requests contain trackable and untrackable query requests";

          let userTokenMessage;
          if (uniqueUserTokens.length === 1) {
            userTokenMessage = `User Token: ${uniqueUserTokens[0]}`;
          } else if (uniqueUserTokens.length > 1) {
            userTokenMessage = "Multiple user tokens detected";
          } else {
            userTokenMessage = "No user token found";
          }

          return (
            <div
              style={{
                marginTop: "10px",
                background: "#fff",
                borderRadius: 8,
                padding: "10px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                Click Analytics:
              </div>
              <div style={{ color: "#333", marginBottom: "10px" }}>
                {clickAnalyticsMessage}
              </div>

              <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                User Token:
              </div>
              <div style={{ color: "#333", marginBottom: "10px" }}>
                {userTokenMessage}
              </div>

              <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                Query Terms:
              </div>
              <div style={{ color: "#333", marginBottom: "10px" }}>
                {queryTerms.length > 0
                  ? queryTerms.join(", ")
                  : "No query term found"}
              </div>

              <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                Analytics Tags:
              </div>
              <div style={{ color: "#333", marginBottom: "10px" }}>
                {uniqueAnalyticsTags.length > 0
                  ? uniqueAnalyticsTags.join(", ")
                  : "No analytics tags found"}
              </div>

              <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                Rule Contexts:
              </div>
              <div style={{ color: "#333" }}>
                {uniqueRuleContexts.length > 0
                  ? uniqueRuleContexts.join(", ")
                  : "No rule contexts found"}
              </div>
            </div>
          );
        })()}

      {/* Render the JSON request with collapsible UI */}
      {request?.parsedBody && (
        <div
          style={{
            marginTop: "10px",
            background: "white",
            borderRadius: 8,
            padding: 8,
          }}
        >
          <strong>Request Details</strong>
          <ReactJson
            src={request.parsedBody}
            theme="rjv-default"
            collapsed={0}
            enableClipboard={true}
            displayDataTypes={false}
            displayObjectSize={false}
            iconStyle="square"
            name={false}
          />
        </div>
      )}

      {/* Render the JSON response with collapsible UI */}
      {response?.parsedResponseBody ? (
        <div
          style={{
            marginTop: "10px",
            background: "white",
            borderRadius: 8,
            padding: 8,
          }}
        >
          <strong>Response Details</strong>
          <ReactJson
            src={response.parsedResponseBody.requests || response.parsedResponseBody}
            theme="rjv-default"
            collapsed={0}
            enableClipboard={true}
            displayDataTypes={false}
            displayObjectSize={false}
            iconStyle="square"
            name={false}
          />
        </div>
      ) : (
        <div
          style={{
            marginTop: "10px",
            background: "white",
            borderRadius: 8,
            padding: 8,
          }}
        >
          No Response Found.
        </div>
      )}
    </div>
  );
};
