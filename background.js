chrome.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
      if (!details || !details.requestHeaders) return;
  
      console.log("Captured Request:", details);
  
      // Retrieve existing requests from storage
      chrome.storage.local.get(["requests"], (result) => {
        const requests = result.requests || [];
  
        // Store up to 50 requests for efficiency
        if (requests.length >= 50) {
          requests.pop();
        }
  
        requests.unshift({
          url: details.url,
          method: details.method,
          time: new Date().toLocaleTimeString(),
          headers: details.requestHeaders.map(header => `${header.name}: ${header.value}`).join("\n"),
        });
  
        chrome.storage.local.set({ requests });
      });
    },
    { urls: ["*://*.algolia.net/*", "*://insights.algolia.io/*"] },
    ["requestHeaders"] // Capture request headers
  );
  