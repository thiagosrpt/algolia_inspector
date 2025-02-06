chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      if (!details || !details.requestBody) return;
  
      let requestBody = "";
      let parsedBody = {};
  
      // Handle raw request body (e.g., JSON, text)
      if (details.requestBody.raw) {
        requestBody = details.requestBody.raw.map((part) => {
          return part.bytes ? new TextDecoder("utf-8").decode(new Uint8Array(part.bytes)) : "";
        }).join("");
        try {
          parsedBody = JSON.parse(requestBody);
        } catch (e) {
          parsedBody = { error: "Unable to parse JSON" };
        }
      } 
      // Handle form data (application/x-www-form-urlencoded)
      else if (details.requestBody.formData) {
        requestBody = JSON.stringify(details.requestBody.formData);
        parsedBody = details.requestBody.formData;
      }
  
      // Retrieve existing requests from storage
      chrome.storage.local.get(["requests"], (result) => {
        const requests = result.requests || [];
  
        // Store up to 50 requests for efficiency
        if (requests.length >= 50) {
          requests.pop();
        }
  
        // Save request with parsed body
        requests.unshift({
          url: details.url,
          method: details.method,
          time: new Date().toLocaleTimeString(),
          rawBody: requestBody, // Store raw body for reference
          parsedBody: parsedBody, // Store parsed body for easy access
        });
  
        chrome.storage.local.set({ requests });
      });
    },
    { urls: ["*://*.algolia.net/*"] }, // Capturing only Algolia requests
    ["requestBody"] // Required to capture request payload
  );
  