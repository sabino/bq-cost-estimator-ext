// content.js

// If 'browser' is undefined, use 'chrome' instead (for Edge/Chrome compatibility).
if (typeof browser === 'undefined') {
    var browser = chrome;
  }
  
  // Ensure we only run once
  if (!window.bqCostObserverInitiated) {
    window.bqCostObserverInitiated = true;
  
    // Constants for BigQuery size calculations
    const TB_TO_BYTES = 1e12;
    const GB_TO_BYTES = 1e9;
    const MB_TO_BYTES = 1e6;
    const KB_TO_BYTES = 1e3;
  
    // The official cost is ~$6.25 per TB for BigQuery on-demand (base in USD).
    const COST_PER_TB_USD = 6.25;
  
    /**
     * Safely parse numeric strings with commas/dots in different locales.
     */
    function parseNumberLocaleAware(str) {
      let s = str.trim();
      const hasDot = s.includes(".");
      const hasComma = s.includes(",");
  
      if (hasDot && hasComma) {
        // Example: "3.141,59" => "." is thousands, "," is decimal
        s = s.replace(/\./g, "");
        s = s.replace(",", ".");
      } else if (!hasDot && hasComma) {
        // Example: "31,41" => only comma => decimal
        s = s.replace(",", ".");
      } else {
        // only dot or no separator => remove commas as thousands
        s = s.replace(",", "");
      }
      return parseFloat(s);
    }
  
    /**
     * Compute cost in USD given size & unit (e.g. "32.5 GB").
     */
    function computeCostUSD(size, unit) {
      let bytes;
      switch (unit) {
        case "KB":
          bytes = size * KB_TO_BYTES;
          break;
        case "MB":
          bytes = size * MB_TO_BYTES;
          break;
        case "GB":
          bytes = size * GB_TO_BYTES;
          break;
        case "TB":
          bytes = size * TB_TO_BYTES;
          break;
        default:
          return 0; // If unit is not recognized
      }
      const tb = bytes / TB_TO_BYTES;
      return tb * COST_PER_TB_USD;
    }
  
    /**
     * Build cost display string based on user preferences (USD + custom).
     * e.g. "$ 3.25 / R$ 19.02" if both are enabled.
     */
    function generateCostDisplay(costUSD, prefs) {
      const costParts = [];
  
      // Show USD if enabled
      if (prefs.showUSD) {
        costParts.push(`$${costUSD.toFixed(2)}`);
      }
  
      // Show custom currency if enabled
      if (prefs.customCurrencyEnabled) {
        const customCost = costUSD * prefs.customCurrencyRate;
        const symbol = prefs.customCurrencySymbol || "";
        costParts.push(`${symbol} ${customCost.toFixed(2)}`);
      }
  
      // Join them with " / "
      return costParts.join(" / ");
    }
  
    /**
     * Takes the text node with "This query will process X [KMGTP]?B when run."
     * and appends the cost in user-chosen currencies.
     */
    function processAndUpdateText(node, prefs) {
      const regex = /This query will process ([\d.,]+)\s+([KMGTP]?B) when run\./;
      const match = node.nodeValue.match(regex);
      if (!match) return;
  
      const size = parseNumberLocaleAware(match[1]);
      const unit = match[2];
  
      // Calculate cost in USD
      const costInUSD = computeCostUSD(size, unit);
  
      // Build final display text
      const displayStr = generateCostDisplay(costInUSD, prefs);
  
      // If there's something to show, inject it
      if (displayStr) {
        node.nodeValue = `This query will process ${size} ${unit} when run (${displayStr})`;
      }
    }
  
    /**
     * Initiate the MutationObserver once preferences are loaded.
     */
    function startObserver(prefs) {
      // Also do an initial pass on page load
      function scanAllTextNodes() {
        const allTextNodes = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT
        );
        let currentNode;
        while ((currentNode = allTextNodes.nextNode())) {
          if (
            currentNode.nodeValue &&
            currentNode.nodeValue.includes("This query will process")
          ) {
            processAndUpdateText(currentNode, prefs);
          }
        }
      }
  
      // Observe changes in the DOM
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === "characterData") {
            if (
              mutation.target.nodeValue &&
              mutation.target.nodeValue.includes("This query will process")
            ) {
              processAndUpdateText(mutation.target, prefs);
            }
          } else if (mutation.type === "childList") {
            for (const node of mutation.addedNodes) {
              if (
                node.nodeType === 3 &&
                node.nodeValue.includes("This query will process")
              ) {
                processAndUpdateText(node, prefs);
              }
            }
          }
        }
      });
  
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
      });
  
      // Run an immediate scan in case the text is already there
      scanAllTextNodes();
    }
  
    /**
     * Fetch user preferences from storage, then start the observer.
     */
      const defaultPrefs = {
        showUSD: true,
        customCurrencyEnabled: false,
        customCurrencyCode: "BRL",
        customCurrencySymbol: "R$",
        customCurrencyRate: 4.9
      };
  
    browser.storage.sync.get(defaultPrefs, (prefs) => {
      startObserver(prefs);
    });
  }
  