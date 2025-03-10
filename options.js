// options.js

// If 'browser' is undefined, use 'chrome' instead (for Edge/Chrome compatibility).
if (typeof browser === 'undefined') {
    var browser = chrome;
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const enableUsdCheckbox = document.getElementById("enableUsd");
    const enableCustomCheckbox = document.getElementById("enableCustom");
    const customSymbolInput = document.getElementById("customSymbol");
    const customRateInput = document.getElementById("customRate");
    const saveBtn = document.getElementById("saveBtn");
    const statusMessage = document.getElementById("statusMessage");
  
    // Default settings if not stored yet
    const defaultPrefs = {
      showUSD: true,
      customCurrencyEnabled: false,
      customCurrencySymbol: "R$",
      customCurrencyRate: 5.85
    };
  
    // Load current settings from storage (returns a Promise in the polyfill)
    browser.storage.sync.get(defaultPrefs, (items) => {
      enableUsdCheckbox.checked = items.showUSD;
      enableCustomCheckbox.checked = items.customCurrencyEnabled;
      customSymbolInput.value = items.customCurrencySymbol;
      customRateInput.value = items.customCurrencyRate;
    });
  
    // Save new settings
    saveBtn.addEventListener("click", () => {
      const showUSD = enableUsdCheckbox.checked;
      const customCurrencyEnabled = enableCustomCheckbox.checked;
      const customCurrencySymbol = customSymbolInput.value;
      const customCurrencyRate = parseFloat(customRateInput.value) || 0;
  
      browser.storage.sync.set(
        {
          showUSD,
          customCurrencyEnabled,
          customCurrencySymbol,
          customCurrencyRate
        },
        () => {
          // Display a status message
          statusMessage.textContent = "Settings saved!";
          setTimeout(() => {
            statusMessage.textContent = "";
          }, 3000);
        }
      );
    });
  });
  