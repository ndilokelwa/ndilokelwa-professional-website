/**
 * Site-wide cookie consent + Google Analytics (loads only after accept).
 * Consent is stored once in localStorage and reused on every page.
 */
(function () {
  const CONSENT_KEY = "cookies-consent";
  const GA_MEASUREMENT_ID = "G-FJKVNTF79P";

  function isPortuguese() {
    const switchEl = document.getElementById("languageSwitch");
    if (switchEl) return switchEl.checked;
    const pt = document.querySelector(".lang-pt:not(.d-none)");
    return Boolean(pt);
  }

  function syncBannerLanguage() {
    const banner = document.getElementById("cookie-banner");
    if (!banner) return;
    const usePt = isPortuguese();
    banner.querySelectorAll(".lang-en").forEach((el) => {
      el.classList.toggle("d-none", usePt);
    });
    banner.querySelectorAll(".lang-pt").forEach((el) => {
      el.classList.toggle("d-none", !usePt);
    });
  }

  function injectBanner() {
    if (document.getElementById("cookie-banner")) return;

    const banner = document.createElement("div");
    banner.id = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-label", "Cookie consent");
    banner.innerHTML = `
      <div class="cookie-banner-inner">
        <p class="cookie-banner-text">
          <span class="lang-en">This site uses cookies to analyse visit traffic anonymously.</span>
          <span class="lang-pt d-none">Este site utiliza cookies para analisar o tráfego de visitas de forma anónima.</span>
        </p>
        <div class="cookie-banner-actions">
          <button type="button" id="btn-aceitar" class="cookie-btn cookie-btn-accept">
            <span class="lang-en">Accept</span>
            <span class="lang-pt d-none">Aceitar</span>
          </button>
          <button type="button" id="btn-rejeitar" class="cookie-btn cookie-btn-reject">
            <span class="lang-en">Reject</span>
            <span class="lang-pt d-none">Rejeitar</span>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);
  }

  function hideBanner() {
    const banner = document.getElementById("cookie-banner");
    if (banner) banner.classList.remove("is-visible");
  }

  function showBanner() {
    const banner = document.getElementById("cookie-banner");
    if (!banner) return;
    syncBannerLanguage();
    banner.classList.add("is-visible");
  }

  function ativarAnalytics() {
    if (window.__gaLoaded || !GA_MEASUREMENT_ID) return;
    window.__gaLoaded = true;

    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true });
  }

  function bindLanguageSwitch() {
    const switchEl = document.getElementById("languageSwitch");
    if (!switchEl) return;
    switchEl.addEventListener("change", syncBannerLanguage);
  }

  document.addEventListener("DOMContentLoaded", function () {
    injectBanner();
    bindLanguageSwitch();

    const banner = document.getElementById("cookie-banner");
    const btnAceitar = document.getElementById("btn-aceitar");
    const btnRejeitar = document.getElementById("btn-rejeitar");
    const consent = localStorage.getItem(CONSENT_KEY);

    if (!consent) {
      showBanner();
    } else if (consent === "aceite") {
      ativarAnalytics();
    }

    btnAceitar.addEventListener("click", function () {
      localStorage.setItem(CONSENT_KEY, "aceite");
      hideBanner();
      ativarAnalytics();
    });

    btnRejeitar.addEventListener("click", function () {
      localStorage.setItem(CONSENT_KEY, "rejeitado");
      hideBanner();
    });

    // Keep reference for debugging / future settings link
    window.__cookieBanner = banner;
  });
})();
