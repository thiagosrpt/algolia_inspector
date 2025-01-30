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
  