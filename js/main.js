
/* =========================================
   YUAN TIAN - MAIN JAVASCRIPT
   FR / CN / EN
========================================= */

(function () {
  "use strict";

  const STORAGE_KEY = "yuan_tian_language";
  const DEFAULT_LANG = "FR";
  const SUPPORTED_LANGS = ["FR", "CN", "EN"];

  const LANG_CODES = {
    FR: "fr",
    CN: "zh-CN",
    EN: "en"
  };

  /* =========================================
     1. GET TRANSLATIONS
  ========================================= */

  function getTranslations() {
    return window.translations || {};
  }

  /* =========================================
     2. GET SAVED LANGUAGE
  ========================================= */

  function getLanguage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (SUPPORTED_LANGS.includes(saved)) {
        return saved;
      }
    } catch (error) {
      console.warn("Language storage unavailable:", error);
    }

    return DEFAULT_LANG;
  }

  /* =========================================
     3. TRANSLATE PAGE
  ========================================= */

  function translatePage(lang) {

    const translations = getTranslations();

    document.documentElement.lang = LANG_CODES[lang];

    // Translate normal text
    document.querySelectorAll("[data-i18n]").forEach(element => {

      const key = element.dataset.i18n;
      const value = translations[key]?.[lang];

      if (value !== undefined) {
        element.textContent = value;
      }

    });

    // Translate placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {

      const key = element.dataset.i18nPlaceholder;
      const value = translations[key]?.[lang];

      if (value !== undefined) {
        element.placeholder = value;
      }

    });

    // Translate document title
    const titleElement = document.querySelector("[data-i18n-title]");

    if (titleElement) {
      const key = titleElement.dataset.i18nTitle;
      const value = translations[key]?.[lang];

      if (value !== undefined) {
        document.title = value;
      }
    }

    // Update active language button
    document.querySelectorAll("[data-lang]").forEach(button => {

      const active = button.dataset.lang === lang;

      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));

    });

    // Save language
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      console.warn("Cannot save language:", error);
    }

  }

  /* =========================================
     4. SET LANGUAGE
  ========================================= */

  function setLanguage(lang) {

    if (!SUPPORTED_LANGS.includes(lang)) {
      return;
    }

    translatePage(lang);
  }

  window.setLanguage = setLanguage;

  /* =========================================
     5. LANGUAGE BUTTONS
  ========================================= */

  function initLanguageButtons() {

    document.querySelectorAll("[data-lang]").forEach(button => {

      button.addEventListener("click", function () {
        setLanguage(this.dataset.lang);
      });

    });

  }

  /* =========================================
     6. MOBILE MENU
  ========================================= */

  function initMobileMenu() {

    const menu = document.querySelector(".menu-toggle");
    const links = document.querySelector(".nav-links");

    if (!menu || !links) return;

    menu.addEventListener("click", function () {

      const opened = links.classList.toggle("open");

      menu.setAttribute("aria-expanded", String(opened));
      menu.textContent = opened ? "✕" : "☰";

    });

    links.querySelectorAll("a").forEach(link => {

      link.addEventListener("click", function () {

        links.classList.remove("open");
        menu.setAttribute("aria-expanded", "false");
        menu.textContent = "☰";

      });

    });

  }

  /* =========================================
     7. SCROLL REVEAL
  ========================================= */

  function initRevealAnimation() {

    const elements = document.querySelectorAll(".reveal");

    if (!elements.length) return;

    if (!("IntersectionObserver" in window)) {
      elements.forEach(element => {
        element.classList.add("active");
      });
      return;
    }

    const observer = new IntersectionObserver((entries, observer) => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }

      });

    }, {
      threshold: 0.12
    });

    elements.forEach(element => observer.observe(element));

  }

  /* =========================================
     8. CURRENT YEAR
  ========================================= */

  function updateCurrentYear() {

    document.querySelectorAll(".current-year").forEach(element => {
      element.textContent = new Date().getFullYear();
    });

  }

  /* =========================================
     9. RESEARCH FILTERS
  ========================================= */

  function initResearchFilters() {

    const buttons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".research-card");

    if (!buttons.length || !cards.length) return;

    buttons.forEach(button => {

      button.addEventListener("click", function () {

        const filter = this.dataset.filter;

        buttons.forEach(item => item.classList.remove("active"));
        this.classList.add("active");

        cards.forEach(card => {

          card.hidden = (
            filter !== "all" &&
            card.dataset.category !== filter
          );

        });

      });

    });

  }

  /* =========================================
     10. FAQ
  ========================================= */

  function initFAQ() {

    document.querySelectorAll(".faq-question").forEach(question => {

      question.addEventListener("click", function () {

        const answer = this.nextElementSibling;

        if (!answer || !answer.classList.contains("faq-answer")) {
          return;
        }

        const expanded = this.getAttribute("aria-expanded") === "true";

        this.setAttribute("aria-expanded", String(!expanded));
        answer.hidden = expanded;

        const icon = this.querySelector("span");

        if (icon) {
          icon.textContent = expanded ? "＋" : "－";
        }

      });

    });

  }

  /* =========================================
     11. INITIALIZE WEBSITE
  ========================================= */

  function initWebsite() {

    // Initialize language buttons FIRST
    initLanguageButtons();

    // Restore saved language
    setLanguage(getLanguage());

    // Other functions
    initMobileMenu();
    initRevealAnimation();
    updateCurrentYear();
    initResearchFilters();
    initFAQ();

  }

  /* =========================================
     12. START
  ========================================= */

  if (document.readyState === "loading") {

    document.addEventListener("DOMContentLoaded", initWebsite);

  } else {

    initWebsite();

  }

})();
