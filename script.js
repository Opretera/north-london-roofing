/* ==========================================================
   NORTH LONDON ROOFING LTD — SHARED JAVASCRIPT
   No libraries are required.
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const dropdownToggle = document.querySelector(".nav-dropdown__toggle");
  const dropdownMenu = document.querySelector(".nav-dropdown__menu");

  // Mobile navigation
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      navLinks.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        navLinks.classList.remove("is-open");
        document.body.classList.remove("menu-open");
      });
    });
  }

  // Services dropdown
  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener("click", () => {
      const isOpen = dropdownToggle.getAttribute("aria-expanded") === "true";
      dropdownToggle.setAttribute("aria-expanded", String(!isOpen));
      dropdownMenu.classList.toggle("is-open", !isOpen);
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".nav-dropdown")) {
        dropdownToggle.setAttribute("aria-expanded", "false");
        dropdownMenu.classList.remove("is-open");
      }
    });
  }

  // FAQ accordions
  document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const isOpen = button.getAttribute("aria-expanded") === "true";

      button.setAttribute("aria-expanded", String(!isOpen));
      item.classList.toggle("is-open", !isOpen);
    });
  });

  // Subtle scroll-in animations
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, revealObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Demo quote form validation.
  // Replace this with Formspree, Netlify Forms or your own backend when publishing.
  document.querySelectorAll(".quote-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const status = form.querySelector(".form-status");
      const requiredFields = [...form.querySelectorAll("[required]")];
      const firstInvalid = requiredFields.find((field) => !field.value.trim());

      if (firstInvalid) {
        status.textContent = "Please complete all required fields before sending.";
        status.className = "form-status is-error";
        firstInvalid.focus();
        return;
      }

      const email = form.querySelector('input[type="email"]');
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        status.textContent = "Please enter a valid email address.";
        status.className = "form-status is-error";
        email.focus();
        return;
      }

      status.textContent = "Sending your roofing enquiry...";
      status.className = "form-status is-success";

      // Submit the validated form to FormSubmit.
      // The first enquiry requires confirmation from bootalr4@gmail.com.
      form.submit();
    });
  });

  // Automatically update copyright year
  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  // Interactive area coverage checker
  document.querySelectorAll(".area-panel").forEach((panel) => {
    const chips = panel.querySelectorAll(".area-chip");
    const status = panel.querySelector(".area-status");

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((item) => item.classList.remove("is-selected"));
        chip.classList.add("is-selected");

        if (status) {
          const area = chip.dataset.area;
          status.textContent = `Yes — North London Roofing Ltd is available in ${area}. Click “Check your area” or request a quote to arrange an assessment.`;
          status.classList.add("is-visible");
        }
      });
    });
  });


  // Roofing guide-price estimator
  const estimator = document.querySelector("#roof-estimator");
  if (estimator) {
    const serviceNames = {
      repair: "roof repair",
      flat: "flat roofing work",
      replacement: "roof replacement",
      gutter: "gutter repair",
      emergency: "emergency roof repair"
    };

    const baseRanges = {
      repair: { small: [180, 450], medium: [350, 900], large: [650, 1600] },
      flat: { small: [900, 1800], medium: [1800, 4200], large: [3500, 8500] },
      replacement: { small: [4500, 7500], medium: [7000, 12500], large: [11000, 22000] },
      gutter: { small: [120, 300], medium: [250, 650], large: [500, 1300] },
      emergency: { small: [220, 550], medium: [400, 1100], large: [750, 1900] }
    };

    const conditionMultipliers = { minor: 0.85, moderate: 1, major: 1.45 };
    const urgencyMultipliers = { standard: 1, urgent: 1.25 };

    estimator.addEventListener("submit", (event) => {
      event.preventDefault();

      const service = document.querySelector("#estimate-service").value;
      const size = document.querySelector("#estimate-size").value;
      const condition = document.querySelector("#estimate-condition").value;
      const urgency = document.querySelector("#estimate-urgency").value;
      const workers = Math.max(1, Number(document.querySelector("#estimate-workers").value));
      const hours = Math.max(1, Number(document.querySelector("#estimate-hours").value));

      const [baseLow, baseHigh] = baseRanges[service][size];
      const multiplier = conditionMultipliers[condition] * urgencyMultipliers[urgency];

      // Requested discounted guide rates:
      // standard £40–£70 per roofer/hour; emergency £70–£110.
      const hourlyLow = service === "emergency" || urgency === "urgent" ? 70 : 40;
      const hourlyHigh = service === "emergency" || urgency === "urgent" ? 110 : 70;
      const labourLow = workers * hours * hourlyLow;
      const labourHigh = workers * hours * hourlyHigh;

      const low = Math.round(Math.max(baseLow * multiplier, labourLow) / 50) * 50;
      const high = Math.round(Math.max(baseHigh * multiplier, labourHigh) / 50) * 50;

      document.querySelector("#estimate-price").textContent =
        `£${low.toLocaleString("en-GB")}–£${high.toLocaleString("en-GB")}`;

      document.querySelector("#estimate-summary").textContent =
        `Typical guide range for ${size} ${serviceNames[service]} with ${condition} conditions.`;

      document.querySelector("#estimate-breakdown").innerHTML =
        `Labour guide: ${workers} roofer${workers > 1 ? "s" : ""} × ${hours} hour${hours > 1 ? "s" : ""}<br>` +
        `${urgency === "urgent" || service === "emergency" ? "Emergency" : "Standard"} labour rate: approximately £${hourlyLow}–£${hourlyHigh} per roofer, per hour`;
    });
  }

});
