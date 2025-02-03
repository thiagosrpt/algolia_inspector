chrome.devtools.panels.create(
    "Algolia",            // Tab name
    null,                 // Icon (optional)
    "devtools.html",      // HTML file for the panel
    function (panel) {
      console.log("Algolia DevTools panel created!");
    },
    function (panel) {
        console.log("DevTools script loaded!");
    }
  );
  
  chrome.devtools.network.onRequestFinished.addListener((request) => {
    if (!request.request.url.includes("algolia.net")) {
      return;
    }
  
    request.getContent((content, encoding) => {
      // Attempt to parse JSON
      let parsed = null;
      try {
        parsed = JSON.parse(content);
      } catch (e) {
        // If it’s not valid JSON, parsed remains null
      }
  
      const responseData = {
        url: request.request.url,
        status: request.response.status,
        rawResponseBody: content,      // The unparsed string
        parsedResponseBody: parsed,    // Will be an object if JSON, or null otherwise
        time: new Date().toLocaleTimeString()
      };
  
      chrome.storage.local.get(["responses"], (result) => {
        const existingResponses = result.responses || [];
  
        // Keep only 50 entries as an example
        if (existingResponses.length >= 50) {
          existingResponses.pop();
        }
  
        existingResponses.unshift(responseData);
  
        chrome.storage.local.set({ responses: existingResponses }, () => {
          console.log("Algolia response saved:", responseData);
        });
      });
    });
  });
  