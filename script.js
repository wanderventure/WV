const WANDER_VENTURE_PHONE = "917007051245";

function sendWhatsApp(packageName) {
  const message = `Hi, I am interested in ${packageName}. Please share full details.`;
  window.open(`https://wa.me/${WANDER_VENTURE_PHONE}?text=${encodeURIComponent(message)}`, "_blank");
}

function openHotelForm() {
  const popup = document.getElementById("hotelPopup");
  if (popup) {
    popup.style.display = "flex";
  }
}

function closeHotelForm() {
  const popup = document.getElementById("hotelPopup");
  if (popup) {
    popup.style.display = "none";
  }
}

function initNavigation() {
  document.querySelectorAll(".navbar").forEach((nav) => {
    const links = nav.querySelector(".nav-links, .menu");
    if (!links) {
      return;
    }

    let toggle = nav.querySelector(".nav-toggle");
    if (!toggle) {
      toggle = document.createElement("button");
      toggle.className = "nav-toggle";
      toggle.type = "button";
      toggle.setAttribute("aria-label", "Open navigation menu");
      toggle.setAttribute("aria-expanded", "false");
      toggle.innerHTML = "<span></span>";
      nav.appendChild(toggle);
    }

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
      document.body.classList.toggle("nav-locked", isOpen);
    });

    links.querySelectorAll("a").forEach((link) => {
      const linkPath = link.getAttribute("href")?.split("#")[0] || "";
      const currentPath = window.location.pathname.split("/").pop() || "index.html";

      if (linkPath === currentPath || (currentPath === "" && linkPath === "index.html")) {
        link.classList.add("active");
      }

      link.addEventListener("click", () => {
        nav.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open navigation menu");
        document.body.classList.remove("nav-locked");
      });
    });
  });
}

function initPackageSearch() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) {
    return;
  }

  const cards = Array.from(document.querySelectorAll(".package-card"));
  let noResults = document.querySelector(".no-results");

  if (!noResults) {
    noResults = document.createElement("p");
    noResults.className = "no-results";
    noResults.textContent = "No matching trips found. Try Dubai, Bali, Kerala, Rishikesh, or Events.";
    searchInput.closest(".search-container")?.insertAdjacentElement("afterend", noResults);
  }

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const haystack = card.textContent.toLowerCase();
      const isVisible = haystack.includes(query);
      card.style.display = isVisible ? "" : "none";
      if (isVisible) {
        visibleCount += 1;
      }
    });

    noResults.classList.toggle("is-visible", visibleCount === 0);
  });
}

function initScrollReveals() {
  const targets = document.querySelectorAll(
    ".package-card, .blog-card, .floating-item, .service-card, .intl-item, .feature-card, .coverage-card, .benefit-card, .visa-card, .timeline-item, .step-item, .destination-card, .destination-card-lite, .testimonial-card, .document-item, .faq-item"
  );

  if (!("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((target, index) => {
    target.classList.add("reveal");
    target.style.transitionDelay = `${Math.min(index % 6, 5) * 55}ms`;
    observer.observe(target);
  });
}

function initFormUx() {
  document.querySelectorAll("form").forEach((form) => {
    const submitButton = form.querySelector("button[type='submit'], .form-submit");

    form.addEventListener("submit", (event) => {
      const requiredFields = Array.from(form.querySelectorAll("[required]"));
      let isValid = true;

      requiredFields.forEach((field) => {
        const valid = field.type === "checkbox" ? field.checked : Boolean(field.value.trim());
        field.classList.toggle("is-invalid", !valid);
        if (!valid) {
          isValid = false;
        }
      });

      if (!isValid) {
        event.preventDefault();
        requiredFields.find((field) => field.classList.contains("is-invalid"))?.focus();
        return;
      }

      if (form.dataset.localSuccess === "true") {
        event.preventDefault();
        let message = form.querySelector(".form-message");

        if (!message) {
          message = document.createElement("div");
          message.className = "form-message";
          form.prepend(message);
        }

        message.textContent = "Thank you. Wander Venture will contact you shortly with the next steps.";
        message.classList.add("is-visible");
        submitButton?.setAttribute("disabled", "disabled");

        setTimeout(() => {
          submitButton?.removeAttribute("disabled");
          form.reset();
        }, 1200);
      }
    });

    form.querySelectorAll("input, select, textarea").forEach((field) => {
      field.addEventListener("input", () => field.classList.remove("is-invalid"));
      field.addEventListener("change", () => field.classList.remove("is-invalid"));
    });
  });
}

function initForexConverter() {
  const converter = document.querySelector("[data-converter]");
  if (!converter) {
    return;
  }

  const rates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.78,
    AED: 3.67,
    THB: 36.4,
    SGD: 1.35,
    AUD: 1.51,
    CAD: 1.37,
    INR: 83.2
  };

  const amount = converter.querySelector("[data-amount]");
  const from = converter.querySelector("[data-from]");
  const to = converter.querySelector("[data-to]");
  const output = converter.querySelector("[data-output]");
  const stamp = converter.querySelector("[data-rate-stamp]");

  function formatCurrency(value, currency) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2
    }).format(value);
  }

  function update() {
    const input = Number(amount.value || 0);
    const fromRate = rates[from.value] || 1;
    const toRate = rates[to.value] || 1;
    const converted = (input / fromRate) * toRate;
    output.textContent = formatCurrency(converted, to.value);
  }

  [amount, from, to].forEach((field) => field.addEventListener("input", update));
  [from, to].forEach((field) => field.addEventListener("change", update));

  if (stamp) {
    stamp.textContent = `Indicative rate check updated ${new Date().toLocaleDateString("en-IN")}`;
  }

  update();
}

window.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initPackageSearch();
  initScrollReveals();
  initFormUx();
  initForexConverter();

  const track = document.querySelector(".testimonial-track");
  const slides = document.querySelectorAll(".testimonial-track .testimonial-card");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  if (track && slides.length > 0) {
    const slideArray = Array.from(slides);
    let index = 0;

    function goToSlide(i) {
      index = (i + slideArray.length) % slideArray.length;
      const slideWidth = track.parentElement.offsetWidth;
      track.style.transform = `translateX(-${index * slideWidth}px)`;
    }

    prevBtn?.addEventListener("click", () => goToSlide(index - 1));
    nextBtn?.addEventListener("click", () => goToSlide(index + 1));
    setInterval(() => goToSlide(index + 1), 5000);
    window.addEventListener("resize", () => goToSlide(index));
    goToSlide(0);
  }
});
