
document.addEventListener("DOMContentLoaded", () => {

  // 1. LANGUAGE SWITCHING
  const languageButtons = document.querySelectorAll("[data-lang]");

  function setLanguage(lang) {
    if (!window.translations) return;

    document.documentElement.lang =
      lang === "CN" ? "zh-CN" :
      lang === "FR" ? "fr" : "en";

    document.querySelectorAll("[data-i18n]").forEach(element => {
      const key = element.dataset.i18n;
      const translation = window.translations[key];

      if (translation && translation[lang]) {
        element.textContent = translation[lang];
      }
    });

    languageButtons.forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.lang === lang
      );
    });

    localStorage.setItem("preferredLanguage", lang);
  }

  languageButtons.forEach(button => {
    button.addEventListener("click", () => {
      setLanguage(button.dataset.lang);
    });
  });

  const savedLanguage =
    localStorage.getItem("preferredLanguage") || "EN";

  setLanguage(savedLanguage);


  // 2. MOBILE NAVIGATION
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", isOpen);
      menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
      });
    });
  }


  // 3. RESEARCH FILTERS
  const filterButtons = document.querySelectorAll(".filter-btn");
  const researchCards = document.querySelectorAll(".research-card");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach(item => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      researchCards.forEach(card => {
        const category = card.dataset.category;

        card.hidden =
          filter !== "all" && category !== filter;
      });
    });
  });


  // 4. FAQ ACCORDION
  document.querySelectorAll(".faq-question").forEach(button => {
    button.addEventListener("click", () => {
      const answer = button.nextElementSibling;
      const isExpanded =
        button.getAttribute("aria-expanded") === "true";

      button.setAttribute("aria-expanded", !isExpanded);

      if (answer) {
        answer.hidden = isExpanded;
      }

      const icon = button.querySelector("span");

      if (icon) {
        icon.textContent = isExpanded ? "＋" : "－";
      }
    });
  });


  // 5. SCROLL REVEAL
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12
    });

    revealElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    revealElements.forEach(element => {
      element.classList.add("visible");
    });
  }


  // 6. AUTOMATIC COPYRIGHT YEAR
  document.querySelectorAll(".current-year").forEach(element => {
    element.textContent = new Date().getFullYear();
  });

});
