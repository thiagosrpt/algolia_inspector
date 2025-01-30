chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      if (!details || !details.requestBody) return;
  
      console.log("Captured Request Body:", details);
  
      let requestBody = "";
  
      // Handle raw request body (e.g., JSON, text)
      if (details.requestBody.raw) {
        requestBody = details.requestBody.raw.map((part) => {
          return part.bytes ? new TextDecoder("utf-8").decode(new Uint8Array(part.bytes)) : "";
        }).join("");
      } 
      
      // Handle form data (application/x-www-form-urlencoded)
      else if (details.requestBody.formData) {
        requestBody = JSON.stringify(details.requestBody.formData);
      }
  
      // Retrieve existing requests from storage
      chrome.storage.local.get(["requests"], (result) => {
        const requests = result.requests || [];
  
        // Store up to 50 requests for efficiency
        if (requests.length >= 50) {
          requests.pop();
        }
  
        // Save request with captured body
        requests.unshift({
          url: details.url,
          method: details.method,
          time: new Date().toLocaleTimeString(),
          body: requestBody || "No body data",
        });
  
        chrome.storage.local.set({ requests });
      });
    },
    { urls: ["*://*.algolia.net/*"] }, // Capturing only Algolia requests
    ["requestBody"] // Required to capture request payload
  );
  