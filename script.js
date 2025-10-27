// Utility functions with error handling
const $ = (sel, ctx = document) => {
  try {
    return ctx.querySelector(sel);
  } catch (error) {
    console.error(`Error in $(): ${error.message}`);
    return null;
  }
};

const $$ = (sel, ctx = document) => {
  try {
    return Array.from(ctx.querySelectorAll(sel));
  } catch (error) {
    console.error(`Error in $$(): ${error.message}`);
    return [];
  }
};

// Throttle function for scroll/resize events
function throttle(callback, limit) {
  let waiting = false;
  return function() {
    if (!waiting) {
      callback.apply(this, arguments);
      waiting = true;
      setTimeout(() => {
        waiting = false;
      }, limit);
    }
  };
}

// Debounce function for window resize/scroll
function debounce(callback, wait) {
  let timeout;
  return (...args) => {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => callback.apply(context, args), wait);
  };
}

/* ---------- NAV TOGGLE ---------- */
(() => {
  try {
    const nav = $('.nav');
    const toggle = $('.nav-toggle');
    
    if (!nav || !toggle) {
      console.warn('Navigation elements not found');
      return;
    }

    // Enhanced toggle function with ARIA attributes
    const toggleNav = (expanded) => {
      const isExpanded = expanded ?? (toggle.getAttribute('aria-expanded') === 'true');
      toggle.setAttribute('aria-expanded', String(!isExpanded));
      nav.classList.toggle('open', !isExpanded);
      
      // Lock body scroll when mobile menu is open
      document.body.style.overflow = isExpanded ? '' : 'hidden';
      
      // Focus management
      if (!isExpanded) {
        const firstFocusable = nav.querySelector('a, button, [tabindex="0"]');
        if (firstFocusable) firstFocusable.focus();
      }
    };

    // Toggle on button click
    toggle.addEventListener('click', () => toggleNav());
    
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        toggleNav(true);
        toggle.focus();
      }
    });
    
    // Close when clicking outside or on a nav link
    const closeMenu = (e) => {
      if (nav.classList.contains('open') && 
          (!nav.contains(e.target) || e.target.closest('.nav-links a'))) {
        toggleNav(true);
      }
    };
    
    document.addEventListener('click', closeMenu);
    
    // Close menu when a nav link is clicked (for touch devices)
    const navLinks = nav.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (nav.classList.contains('open')) {
          toggleNav(true);
        }
      });
    });
    
  } catch (error) {
    console.error('Error in navigation:', error);
  }
})();

/* ---------- YEAR STAMP ---------- */
(() => {
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

/* ---------- STATS COUNTER (IO) ---------- */
(() => {
  const counters = $$('[data-count]');
  if (!counters.length) return;

  const ease = t => 1 - Math.pow(1 - t, 3);

  function animateCount(el) {
    const target   = Number(el.dataset.count);
    const isFloat  = !Number.isInteger(target);
    const start    = performance.now();
    const duration = 1400;

    function frame(now) {
      const p   = Math.min(1, (now - start) / duration);
      const val = target * ease(p);
      el.textContent = isFloat ? val.toFixed(1) : Math.floor(val);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(c => io.observe(c));
})();

/* ---------- SERVICES ACCORDION: only one open ---------- */
(() => {
  $$('#services details').forEach(d => {
    d.addEventListener('toggle', () => {
      if (d.open) {
        $$('#services details').forEach(o => { if (o !== d) o.open = false; });
      }
    });
  });
})();

/* ---------- VIDEO PLAY OVERLAY ---------- */
(() => {
  const playBtn = $('.play-btn');
  const video   = $('#beepayVideo');
  if (!playBtn || !video) return;

  playBtn.addEventListener('click', () => {
    video.play();
    playBtn.style.display = 'none';
  });

  // subtle loaded state for styling
  window.addEventListener('load', () => {
    $('.video')?.classList.add('loaded');
  });
})();

/* ---------- SECTION REVEAL (IntersectionObserver) ---------- */
(() => {
  const toReveal = $$('.scroll-animate, .scroll-fade, .scroll-left, .scroll-right, .scroll-zoom, .scroll-stagger');
  if (!toReveal.length) return;

  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.2 });

  toReveal.forEach(el => revealIO.observe(el));
})();

/* ---------- PHONE CARD / FRAME VISIBILITY (IO) ---------- */
(() => {
  const revealTargets = $$('.phone-card, .phone-frame, .testimonials-inner, .faq-section');
  if (!revealTargets.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.2 });

  revealTargets.forEach(t => io.observe(t));
})();

/* ---------- TESTIMONIALS NAV ---------- */
(() => {
  const items = $$('.testimonial');
  const next  = $('#next');
  const prev  = $('#prev');
  if (!items.length || !next || !prev) return;

  let idx = 0;
  const show = (i) => {
    items[idx]?.classList.remove('active');
    idx = (i + items.length) % items.length;
    items[idx].classList.add('active', 'fade');
  };

  next.addEventListener('click', () => show(idx + 1));
  prev.addEventListener('click', () => show(idx - 1));
})();

/* ---------- LANGUAGE SWITCHER (robust, with fallbacks) ---------- */
(() => {
  const langBtn  = $('#lang-btn');
  const langMenu = $('#lang-menu');
  if (!langBtn || !langMenu) return;

  const translations = {
    en: { title: "SEND MONEY IN SECONDS!", tagline: "Transparent, secure, and effortless.BeePay puts you in control.Instant, smart, and secure digital payments." },
    es: { title: "ENVÍA DINERO EN SEGUNDOS!", tagline: "Transparente, seguro y sin esfuerzo. BeePay te da el control. Pagos digitales instantáneos, inteligentes y seguros." },
    fr: { title: "ENVOYEZ DE L’ARGENT EN QUELQUES SECONDES!", tagline: "Transparent, sécurisé et sans effort. BeePay vous donne le contrôle. Paiements numériques instantanés, intelligents et sûrs." },
    de: { title: "SENDEN SIE GELD IN SEKUNDEN!", tagline: "Transparent, sicher und mühelos. BeePay gibt dir die Kontrolle. Sofortige, intelligente und sichere digitale Zahlungen.Sofortige, intelligente und sichere digitale Zahlungen." },
    sw: { title: "TUMA PESA KWA SEKUNDE!", tagline: "Malipo ya haraka, bora, na salama mtandaoni." }
  };

  function changeLanguage(code) {
    const t = translations[code]; if (!t) return;
    const titleEl   = document.querySelector('#title')   || document.querySelector('.hero h1');
    const taglineEl = document.querySelector('#tagline') || document.querySelector('.hero .sub');
    if (titleEl)   titleEl.textContent   = t.title;
    if (taglineEl) taglineEl.textContent = t.tagline;
    localStorage.setItem('preferredLang', code);
  }

  langBtn.addEventListener('click', () => langMenu.classList.toggle('show'));

  langMenu.addEventListener('click', (e) => {
    const lang = e.target?.dataset?.lang;
    if (!lang) return;
    langBtn.textContent = lang.toUpperCase();
    langMenu.classList.remove('show');
    changeLanguage(lang);
  });

  function changeLanguage(code) {
  const t = translations[code]; 
  if (!t) return;
  
  const titleEl = document.querySelector('#hero-heading') || document.querySelector('.hero h1');
  const taglineEl = document.querySelector('.sub') || document.querySelector('.hero p');
  
  if (titleEl) {
    titleEl.textContent = t.title;
    titleEl.closest('[lang]').setAttribute('lang', code);
  }
  if (taglineEl) {
    taglineEl.textContent = t.tagline;
    taglineEl.closest('[lang]').setAttribute('lang', code);
  }
  
  document.documentElement.lang = code; // Set language on html element
  localStorage.setItem('preferredLang', code);
}


  // Close on outside click / ESC
  document.addEventListener('click', (e) => {
    if (!langMenu.contains(e.target) && e.target !== langBtn) langMenu.classList.remove('show');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') langMenu.classList.remove('show');
  });

  // Init
  window.addEventListener('load', () => {
    const saved = localStorage.getItem('preferredLang') || 'en';
    langBtn.textContent = saved.toUpperCase();
    changeLanguage(saved);
  });
})();

/* ---------- FLOATING PHONES (respect reduced motion) ---------- */
(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const phones = $$('.phone');
  if (!phones.length) return;

  // inject unique keyframes once
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float0 { from { transform: translateY(0); } to { transform: translateY(-15px); } }
    @keyframes float1 { from { transform: translateY(-40px); } to { transform: translateY(-55px); } }
    @keyframes float2 { from { transform: translateY(0); } to { transform: translateY(-20px); } }
  `;
  document.head.appendChild(style);

  phones.forEach((phone, i) => {
    phone.style.animation = `float${i} 5s ease-in-out ${i * 0.6}s infinite alternate`;
  });
})();

/* ---------- PRELOADER FADE-OUT ---------- */
(() => {
  const preloader = $('#preloader');
  if (!preloader) return;
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('fade-out'), 300);
    setTimeout(() => preloader.remove(), 900);
  });
})();

/* ---------- DARK / LIGHT THEME TOGGLE ---------- */
(() => {
  const toggleBtn = document.getElementById("theme-toggle");
  if (!toggleBtn) return;

  // Load saved preference or default to dark mode
  const currentTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.classList.toggle("light-theme", currentTheme === "light");
  toggleBtn.textContent = currentTheme === "light" ? "🌞" : "🌙";

  toggleBtn.addEventListener("click", () => {
    const isLight = document.documentElement.classList.toggle("light-theme");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    toggleBtn.textContent = isLight ? "🌞" : "🌙";
  });
})();

(() => {
  const section = document.querySelector('.beepay-brand-section');
  if (!section) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) section.classList.add('visible');
    });
  }, { threshold: 0.3 });
  observer.observe(section);
})();

document.querySelectorAll('.faq-list details').forEach((el, i) => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(30px)';
  setTimeout(() => {
    el.style.transition = 'all 0.6s ease';
    el.style.opacity = 1;
    el.style.transform = 'translateY(0)';
  }, i * 100);
});

(() => {
  const section = document.querySelector('#advantage');
  if (!section) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) section.classList.add('visible');
    });
  }, { threshold: 0.3 });
  observer.observe(section);
})();
