
/* =========================================
   YUAN TIAN - MAIN JAVASCRIPT
   Multilingual Website: FR / CN / EN
========================================= */

(function () {
  "use strict";

  /* =========================================
     1. LANGUAGE CONFIGURATION
  ========================================= */

  const STORAGE_KEY = "yuan_tian_language";

  const DEFAULT_LANG = "FR";

  const SUPPORTED_LANGS = ["FR", "CN", "EN"];

  const LANG_CODES = {
    FR: "fr",
    CN: "zh-CN",
    EN: "en"
  };

  /* =========================================
     2. GET TRANSLATION DICTIONARY
  ========================================= */

  function getTranslations() {
    return window.translations || {};
  }

  /* =========================================
     3. GET SAVED LANGUAGE
  ========================================= */

  function getLanguage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (SUPPORTED_LANGS.includes(saved)) {
        return saved;
      }
    } catch (error) {
      console.warn("Cannot access localStorage:", error);
    }

    return DEFAULT_LANG;
  }

  /* =========================================
     4. TRANSLATE PAGE CONTENT
  ========================================= */

  function translatePage(lang) {

    const translations = getTranslations();

    if (!translations[lang]) {
      console.error(
        "Translation dictionary missing for:",
        lang
      );
      return;
    }

    const dictionary = translations[lang];

    // Update HTML language attribute
    document.documentElement.lang = LANG_CODES[lang];

    // Translate normal text
    document.querySelectorAll("[data-i18n]").forEach(element => {

      const key = element.getAttribute("data-i18n");

      if (Object.prototype.hasOwnProperty.call(dictionary, key)) {
        element.textContent = dictionary[key];
      }

    });

    // Translate placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {

      const key = element.getAttribute("data-i18n-placeholder");

      if (Object.prototype.hasOwnProperty.call(dictionary, key)) {
        element.placeholder = dictionary[key];
      }

    });

    // Translate document title if a key is provided
    const titleElement = document.querySelector("[data-i18n-title]");

    if (titleElement) {
      const key = titleElement.getAttribute("data-i18n-title");

      if (dictionary[key]) {
        document.title = dictionary[key];
      }
    }

    // Update language buttons
    document.querySelectorAll("[data-lang]").forEach(button => {

      const active = button.dataset.lang === lang;

      button.classList.toggle("active", active);

      button.setAttribute(
        "aria-pressed",
        String(active)
      );

    });

    // Save current language
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      console.warn("Cannot save language preference:", error);
    }

  }

  /* =========================================
     5. CHANGE LANGUAGE
  ========================================= */

  function setLanguage(lang) {

    if (!SUPPORTED_LANGS.includes(lang)) {
      console.warn("Unsupported language:", lang);
      return;
    }

    translatePage(lang);

  }

  // Make language function globally accessible
  window.setLanguage = setLanguage;

  /* =========================================
     6. LANGUAGE BUTTON EVENTS
  ========================================= */

  function initLanguageButtons() {

    document.querySelectorAll("[data-lang]").forEach(button => {

      button.addEventListener("click", function () {

        const lang = this.dataset.lang;

        setLanguage(lang);

      });

    });

  }

  /* =========================================
     7. MOBILE NAVIGATION
  ========================================= */

  function initMobileMenu() {

    const menu = document.querySelector(".menu-toggle");

    const links = document.querySelector(".nav-links");

    if (!menu || !links) return;

    menu.addEventListener("click", function () {

      const opened = links.classList.toggle("open");

      menu.setAttribute(
        "aria-expanded",
        String(opened)
      );

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
     8. SCROLL REVEAL ANIMATION
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

    const observer = new IntersectionObserver(
      (entries, observer) => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add("active");

            observer.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.12
      }
    );

    elements.forEach(element => {
      observer.observe(element);
    });

  }

  /* =========================================
     9. CURRENT YEAR
  ========================================= */

  function updateCurrentYear() {

    const year = new Date().getFullYear();

    document.querySelectorAll(".current-year").forEach(element => {

      element.textContent = year;

    });

  }

  /* =========================================
     10. RESEARCH FILTERS
  ========================================= */

  function initResearchFilters() {

    const filterButtons = document.querySelectorAll(".filter-btn");

    const cards = document.querySelectorAll(".research-card");

    if (!filterButtons.length || !cards.length) return;

    filterButtons.forEach(button => {

      button.addEventListener("click", function () {

        const filter = this.dataset.filter;

        filterButtons.forEach(item => {
          item.classList.remove("active");
        });

        this.classList.add("active");

        cards.forEach(card => {

          const category = card.dataset.category;

          card.hidden = (
            filter !== "all" &&
            category !== filter
          );

        });

      });

    });

  }

  /* =========================================
     11. FAQ ACCORDION
  ========================================= */

  function initFAQ() {

    const questions = document.querySelectorAll(".faq-question");

    questions.forEach(question => {

      question.addEventListener("click", function () {

        const answer = this.nextElementSibling;

        if (!answer || !answer.classList.contains("faq-answer")) {
          return;
        }

        const isExpanded =
          this.getAttribute("aria-expanded") === "true";

        this.setAttribute(
          "aria-expanded",
          String(!isExpanded)
        );

        answer.hidden = isExpanded;

        const icon = this.querySelector("span");

        if (icon) {
          icon.textContent = isExpanded ? "＋" : "－";
        }

      });

    });

  }

  /* =========================================
     12. INITIALIZE WEBSITE
  ========================================= */

  function initWebsite() {

    // Restore saved language
    setLanguage(getLanguage());

    // Initialize navigation
    initMobileMenu();

    // Initialize animations
    initRevealAnimation();

    // Initialize footer year
    updateCurrentYear();

    // Initialize research filters
    initResearchFilters();

    // Initialize FAQ
    initFAQ();

  }

  /* =========================================
     13. START
  ========================================= */

  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      initWebsite
    );

  } else {

    initWebsite();

  }

})();
