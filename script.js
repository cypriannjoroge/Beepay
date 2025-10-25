const nav = document.querySelector('.nav');
const toggle = document.querySelector('.nav-toggle');
toggle.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!expanded));
  nav.classList.toggle('open');
});

document.getElementById('year').textContent = new Date().getFullYear();

const counters = document.querySelectorAll('[data-count]');
const ease = t => 1 - Math.pow(1 - t, 3);

function animateCount(el){
  const target = Number(el.dataset.count);
  const isFloat = !Number.isInteger(target);
  const start = performance.now();
  const duration = 1400;

  function frame(now){
    const p = Math.min(1, (now - start) / duration);
    const val = target * ease(p);
    el.textContent = isFloat ? val.toFixed(1) : Math.floor(val);
    if(p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting){
      animateCount(e.target);
      observer.unobserve(e.target);
    }
  });
}, {threshold: .6});

counters.forEach(c => observer.observe(c));

document.querySelectorAll('#services details').forEach(d => {
  d.addEventListener('toggle', () => {
    if(d.open){
      document.querySelectorAll('#services details').forEach(other => {
        if(other !== d) other.open = false;
      });
    }
  });
});

const playBtn = document.querySelector('.play-btn');
const beepayVideo = document.getElementById('beepayVideo');

if (playBtn && beepayVideo) {
  playBtn.addEventListener('click', () => {
    beepayVideo.play();
    playBtn.style.display = 'none';
  });
}

window.addEventListener('load', () => {
  const videoSection = document.querySelector('.video');
  if (videoSection) {
    setTimeout(() => videoSection.classList.add('loaded'), 300);
  }
});

window.addEventListener("scroll", () => {
  const card = document.querySelector(".phone-card");
  const rect = card.getBoundingClientRect();
  if (rect.top < window.innerHeight - 100) {
    card.classList.add("visible");
  }
});

window.addEventListener("scroll", () => {
  const phone = document.querySelector(".phone-frame");
  const rect = phone.getBoundingClientRect();
  if (rect.top < window.innerHeight - 100) {
    phone.classList.add("visible");
  }
});

// Testimonial navigatio  n
const testimonials = document.querySelectorAll(".testimonial");
let index = 0;

document.getElementById("next").addEventListener("click", () => {
  testimonials[index].classList.remove("active");
  index = (index + 1) % testimonials.length;
  testimonials[index].classList.add("active", "fade");
});

document.getElementById("prev").addEventListener("click", () => {
  testimonials[index].classList.remove("active");
  index = (index - 1 + testimonials.length) % testimonials.length;
  testimonials[index].classList.add("active", "fade");
});

window.addEventListener("scroll", () => {
  const section = document.querySelector(".testimonials-inner");
  const rect = section.getBoundingClientRect();
  if (rect.top < window.innerHeight - 150) {
    section.classList.add("visible");
  }
});

window.addEventListener("scroll", () => {
  const faq = document.querySelector(".faq-section");
  const rect = faq.getBoundingClientRect();
  if (rect.top < window.innerHeight - 150) {
    faq.classList.add("visible");
  }
});

document.getElementById("year").textContent = new Date().getFullYear();

const langBtn = document.getElementById("lang-btn");
const langMenu = document.getElementById("lang-menu");

langBtn.addEventListener("click", () => {
  langMenu.classList.toggle("show");
});

langMenu.addEventListener("click", (e) => {
  if (e.target.dataset.lang) {
    const selectedLang = e.target.dataset.lang.toUpperCase();
    langBtn.textContent = selectedLang;
    langMenu.classList.remove("show");
    changeLanguage(e.target.dataset.lang);
  }
});

const translations = {
  en: {
    title: "Welcome to BeePay",
    tagline: "Instant, smart, and secure digital payments."
  },
  es: {
    title: "Bienvenido a BeePay",
    tagline: "Pagos digitales instantáneos, inteligentes y seguros."
  },
  fr: {
    title: "Bienvenue sur BeePay",
    tagline: "Paiements numériques instantanés, intelligents et sécurisés."
  },
  de: {
    title: "Willkommen bei BeePay",
    tagline: "Sofortige, intelligente und sichere digitale Zahlungen."
  },
  sw: {
    title: "Karibu BeePay",
    tagline: "Malipo ya haraka, bora, na salama mtandaoni."
  },
};


function changeLanguage(lang) {
  const t = translations[lang];
  if (!t) return;

  document.querySelector("#title").textContent = t.title;
  document.querySelector("#tagline").textContent = t.tagline;

  
  localStorage.setItem("preferredLang", lang);
}


window.addEventListener("load", () => {
  const savedLang = localStorage.getItem("preferredLang") || "en";
  langBtn.textContent = savedLang.toUpperCase();
  changeLanguage(savedLang);
});

const phones = document.querySelectorAll(".phone");
phones.forEach((phone, i) => {
  phone.style.animation = `float${i} 5s ease-in-out ${i * 0.6}s infinite alternate`;
});

const style = document.createElement("style");
style.textContent = `
@keyframes float0 { from { transform: translateY(0); } to { transform: translateY(-15px); } }
@keyframes float1 { from { transform: translateY(-40px); } to { transform: translateY(-55px); } }
@keyframes float2 { from { transform: translateY(0); } to { transform: translateY(-20px); } }
`;
document.head.appendChild(style);


const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.scroll-animate, .scroll-fade, .scroll-left, .scroll-right, .scroll-zoom, .scroll-stagger')
  .forEach(el => scrollObserver.observe(el));

window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  setTimeout(() => {
    preloader.classList.add("fade-out");
  }, 600);
});


 