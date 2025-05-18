// options.js

// If 'browser' is undefined, use 'chrome' instead (for Edge/Chrome compatibility).
if (typeof browser === 'undefined') {
  var browser = chrome;
}

document.addEventListener("DOMContentLoaded", () => {
  const enableUsdCheckbox = document.getElementById("enableUsd");
  const enableCustomCheckbox = document.getElementById("enableCustom");
  const customCodeInput = document.getElementById("customCode");
  const customSymbolInput = document.getElementById("customSymbol");
  const customRateInput = document.getElementById("customRate");
  const updateRateBtn = document.getElementById("updateRateBtn");
  const saveBtn = document.getElementById("saveBtn");
  const statusMessage = document.getElementById("statusMessage");

  const translations = {
    en: {
      title: "BigQuery Cost Estimator Options",
      showUSD: "Show USD (Base)",
      customHeading: "Custom Currency",
      enableCustom: "Enable Custom Currency",
      code: "Currency Code:",
      symbol: "Symbol:",
      rate: "Rate (relative to 1 USD):",
      updateRate: "Update Rate",
      save: "Save",
      saved: "Settings saved!",
      updated: "Rate updated!",
      updateFailed: "Failed to fetch rate"
    },
    pt: {
      title: "Opções do Estimador de Custos do BigQuery",
      showUSD: "Mostrar USD (Base)",
      customHeading: "Moeda Personalizada",
      enableCustom: "Ativar Moeda Personalizada",
      code: "Código da Moeda:",
      symbol: "Símbolo:",
      rate: "Taxa (relativa a 1 USD):",
      updateRate: "Atualizar Taxa",
      save: "Salvar",
      saved: "Configurações salvas!",
      updated: "Taxa atualizada!",
      updateFailed: "Falha ao obter taxa"
    },
    es: {
      title: "Opciones del Estimador de Costos de BigQuery",
      showUSD: "Mostrar USD (Base)",
      customHeading: "Moneda Personalizada",
      enableCustom: "Habilitar Moneda Personalizada",
      code: "Código de Moneda:",
      symbol: "Símbolo:",
      rate: "Tasa (relativa a 1 USD):",
      updateRate: "Actualizar Tasa",
      save: "Guardar",
      saved: "¡Configuraciones guardadas!",
      updated: "¡Tasa actualizada!",
      updateFailed: "Error al obtener la tasa"
    }
  };

  let messages = translations.en;
  function applyTranslations() {
    const lang = (navigator.language || "en").slice(0, 2);
    messages = translations[lang] || translations.en;
    document.getElementById("title").textContent = messages.title;
    document.getElementById("labelShowUsd").textContent = messages.showUSD;
    document.getElementById("customCurrencyHeading").textContent = messages.customHeading;
    document.getElementById("labelEnableCustom").textContent = messages.enableCustom;
    document.getElementById("labelCode").textContent = messages.code;
    document.getElementById("labelSymbol").textContent = messages.symbol;
    document.getElementById("labelRate").textContent = messages.rate;
    updateRateBtn.textContent = messages.updateRate;
    saveBtn.textContent = messages.save;
  }

  applyTranslations();

  // Default settings if not stored yet
  const defaultPrefs = {
    showUSD: true,
    customCurrencyEnabled: false,
    customCurrencyCode: "BRL",
    customCurrencySymbol: "R$",
    customCurrencyRate: 5.85
  };

  // Load current settings from storage
  browser.storage.sync.get(defaultPrefs, (items) => {
    enableUsdCheckbox.checked = items.showUSD;
    enableCustomCheckbox.checked = items.customCurrencyEnabled;
    customCodeInput.value = items.customCurrencyCode;
    customSymbolInput.value = items.customCurrencySymbol;
    customRateInput.value = items.customCurrencyRate;
  });

  async function getRate(code) {
    const c = code.toLowerCase();
    const primary = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd/${c}.json`;
    const fallback = `https://latest.currency-api.pages.dev/v1/currencies/usd/${c}.json`;
    try {
      const r = await fetch(primary);
      if (!r.ok) throw new Error("primary failed");
      const d = await r.json();
      if (d && d.usd && d.usd[c]) return d.usd[c];
      throw new Error("missing rate");
    } catch (err) {
      try {
        const r2 = await fetch(fallback);
        if (!r2.ok) throw new Error("fallback failed");
        const d2 = await r2.json();
        if (d2 && d2.usd && d2.usd[c]) return d2.usd[c];
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  // Fetch latest rate for the selected currency
  updateRateBtn.addEventListener("click", async () => {
    const code = customCodeInput.value.trim().toUpperCase();
    if (!code) return;
    const rate = await getRate(code);
    if (rate) {
      customRateInput.value = rate.toFixed(2);
      statusMessage.textContent = messages.updated;
    } else {
      statusMessage.textContent = messages.updateFailed;
    }
    setTimeout(() => {
      statusMessage.textContent = "";
    }, 3000);
  });

  // Save new settings
  saveBtn.addEventListener("click", () => {
    const showUSD = enableUsdCheckbox.checked;
    const customCurrencyEnabled = enableCustomCheckbox.checked;
    const customCurrencyCode = customCodeInput.value.trim().toUpperCase();
    const customCurrencySymbol = customSymbolInput.value;
    const customCurrencyRate = parseFloat(customRateInput.value) || 0;

    browser.storage.sync.set(
      {
        showUSD,
        customCurrencyEnabled,
        customCurrencyCode,
        customCurrencySymbol,
        customCurrencyRate
      },
      () => {
        statusMessage.textContent = messages.saved;
        setTimeout(() => {
          statusMessage.textContent = "";
        }, 3000);
      }
    );
  });
});
