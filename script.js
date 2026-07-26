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


// Premium smooth scrolling and reveal effects
(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const header =
    document.querySelector('.site-header') ||
    document.querySelector('header');

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 18);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();

      const headerOffset = header ? header.offsetHeight + 14 : 84;
      const targetTop =
        target.getBoundingClientRect().top +
        window.pageYOffset -
        headerOffset;

      window.scrollTo({
        top: targetTop,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });

      history.replaceState(null, '', href);
    });
  });

  const revealItems = [...document.querySelectorAll('.reveal')];

  revealItems.forEach((item, index) => {
    if (
      !item.classList.contains('reveal-delay-1') &&
      !item.classList.contains('reveal-delay-2') &&
      !item.classList.contains('reveal-delay-3') &&
      !item.classList.contains('reveal-delay-4')
    ) {
      item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    }
  });

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(
      (entries, revealObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px'
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  const hero =
    document.querySelector('.hero') ||
    document.querySelector('.hero-section');

  if (hero && !prefersReducedMotion) {
    let ticking = false;

    const updateHeroMotion = () => {
      const rect = hero.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, -rect.top / Math.max(rect.height, 1)));
      hero.style.setProperty('--hero-shift', `${progress * 18}px`);
      ticking = false;
    };

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(updateHeroMotion);
          ticking = true;
        }
      },
      { passive: true }
    );
  }
})();

// Interactive before-and-after comparison sliders
document.querySelectorAll('[data-comparison]').forEach((comparison)=>{const range=comparison.querySelector('.comparison-range');const before=comparison.querySelector('.comparison-before');const handle=comparison.querySelector('.comparison-handle');const update=()=>{const value=Number(range.value);before.style.width=value+'%';handle.style.left=value+'%';comparison.style.setProperty('--comparison-full-width',comparison.clientWidth+'px')};range.addEventListener('input',update);window.addEventListener('resize',update,{passive:true});update()});

// Live animated estimator updates
(()=>{const form=document.querySelector('#roof-estimator');if(!form)return;const price=document.querySelector('#estimate-price'),summary=document.querySelector('#estimate-summary'),breakdown=document.querySelector('#estimate-breakdown'),workers=document.querySelector('#estimate-workers'),hours=document.querySelector('#estimate-hours'),wo=document.querySelector('#estimate-workers-value'),ho=document.querySelector('#estimate-hours-value');const names={repair:'roof repair',flat:'flat roofing work',replacement:'roof replacement',gutter:'gutter repair',emergency:'emergency roof repair'};const ranges={repair:{small:[180,450],medium:[350,900],large:[650,1600]},flat:{small:[900,1800],medium:[1800,4200],large:[3500,8500]},replacement:{small:[4500,7500],medium:[7000,12500],large:[11000,22000]},gutter:{small:[120,300],medium:[250,650],large:[500,1300]},emergency:{small:[220,550],medium:[400,1100],large:[750,1900]}};const cm={minor:.85,moderate:1,major:1.45},um={standard:1,urgent:1.25};let dl=800,dh=1300,frame;const fmt=v=>'£'+Math.round(v).toLocaleString('en-GB');const animate=(tl,th)=>{if(frame)cancelAnimationFrame(frame);const sl=dl,sh=dh,st=performance.now(),dur=520;price.classList.add('is-changing');const step=now=>{const p=Math.min((now-st)/dur,1),e=1-Math.pow(1-p,4);dl=sl+(tl-sl)*e;dh=sh+(th-sh)*e;price.textContent=fmt(dl)+'–'+fmt(dh);if(p<1)frame=requestAnimationFrame(step);else{dl=tl;dh=th;price.textContent=fmt(tl)+'–'+fmt(th);price.classList.remove('is-changing')}};frame=requestAnimationFrame(step)};const calc=()=>{const s=document.querySelector('#estimate-service').value,z=document.querySelector('#estimate-size').value,c=document.querySelector('#estimate-condition').value,u=document.querySelector('#estimate-urgency').value,w=Math.max(1,+workers.value),h=Math.max(1,+hours.value);wo.textContent=w+' roofer'+(w>1?'s':'');ho.textContent=h+' hour'+(h>1?'s':'');const [bl,bh]=ranges[s][z],m=cm[c]*um[u],em=s==='emergency'||u==='urgent',hl=em?70:40,hh=em?110:70,ll=w*h*hl,lh=w*h*hh,low=Math.round(Math.max(bl*m,ll)/50)*50,high=Math.round(Math.max(bh*m,lh)/50)*50;animate(low,high);summary.textContent='Typical guide range for '+z+' '+names[s]+' with '+c+' conditions.';breakdown.innerHTML='Labour guide: '+w+' roofer'+(w>1?'s':'')+' × '+h+' hour'+(h>1?'s':'')+'<br>'+(em?'Emergency':'Standard')+' labour rate: approximately £'+hl+'–£'+hh+' per roofer, per hour'};form.querySelectorAll('select,input').forEach(el=>{el.addEventListener('input',calc);el.addEventListener('change',calc)});form.addEventListener('submit',e=>{e.preventDefault();calc()});calc()})();


// Smooth internal page transitions
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  document.body.classList.add('page-is-entering');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => document.body.classList.remove('page-is-entering'));
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      link.target === '_blank' ||
      link.hasAttribute('download') ||
      event.ctrlKey || event.metaKey || event.shiftKey || event.altKey
    ) return;

    const targetUrl = new URL(link.href, window.location.href);
    const currentUrl = new URL(window.location.href);

    if (targetUrl.origin !== currentUrl.origin) return;
    if (targetUrl.pathname === currentUrl.pathname && targetUrl.hash) return;

    event.preventDefault();
    document.body.classList.add('page-is-leaving');
    window.setTimeout(() => {
      window.location.href = targetUrl.href;
    }, 280);
  });
})();
