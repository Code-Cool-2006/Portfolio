// Animated typing effect for hero section
const typedText = "Hi, I'm Rishab";
let i = 0;
const typedTextElement = document.getElementById("typed-text");
function typeWriter() {
  if (i < typedText.length) {
    typedTextElement.textContent += typedText.charAt(i);
    i++;
    setTimeout(typeWriter, 80);
  }
}
if (typedTextElement) {
  typedTextElement.textContent = "";
  typeWriter();
}

// Blinking cursor
setInterval(() => {
  const cursor = document.getElementById("cursor");
  cursor.style.opacity = cursor.style.opacity === "0" ? "1" : "0";
}, 500);

// Animate skill bars on scroll
function animateSkillBars() {
  document.querySelectorAll(".skill-bar").forEach((bar) => {
    const value = bar.getAttribute("data-skill");
    bar.style.width = value + "%";
  });
}

// Contact form validation and submission
document
  .querySelector(".contact-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const name = this.name.value.trim();
    const email = this.email.value.trim();
    const message = this.message.value.trim();

    if (!name || !email || !message) {
      alert("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // For now, just alert; in production, send to backend or service
    alert("Thank you for reaching out! I will get back to you soon.");
    this.reset();
  });

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Add scroll effect to header
window.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  if (window.scrollY > 100) {
    header.style.background = "rgba(10, 10, 10, 0.98)";
  } else {
    header.style.background = "rgba(20, 20, 20, 0.95)";
  }
});

// Mobile menu toggle
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Theme toggle
const themeToggle = document.querySelectorAll(".theme-toggle");
themeToggle.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    const isLight = document.body.classList.contains("light-theme");
    themeToggle.forEach((btn) => {
      btn.textContent = isLight ? "🌙" : "☀️";
    });
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });
});

// Load saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.classList.add("light-theme");
  themeToggle.forEach((btn) => (btn.textContent = "🌙"));
} else {
  themeToggle.forEach((btn) => (btn.textContent = "☀️"));
}

// Animate elements on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
      if (entry.target.classList.contains("skill-card")) {
        animateSkillBars();
      }
    }
  });
}, observerOptions);

// Observe all cards and sections
document
  .querySelectorAll(".skill-card, .project-card, section")
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

// Active nav link highlighting
const sectionIds = ["home", "about", "skills", "projects", "contact"];
const idToLink = new Map(
  sectionIds.map((id) => {
    return [id, document.querySelector(`.nav-links a[href="#${id}"]`)];
  })
);
const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        idToLink.forEach((link) => link && link.classList.remove("active"));
        const activeLink = idToLink.get(id);
        if (activeLink) activeLink.classList.add("active");
      }
    });
  },
  { threshold: 0.6 }
);
sectionIds.forEach((id) => {
  const sec = document.getElementById(id);
  if (sec) activeObserver.observe(sec);
});

/* Carousel functionality: autoplay, controls, indicators, touch and keyboard */
(function setupCarousel() {
  const carousel = document.querySelector(".carousel");
  if (!carousel) return;
  const track = carousel.querySelector(".carousel-track");
  const slides = Array.from(track.children);
  const prevBtn = carousel.querySelector(".carousel-button.prev");
  const nextBtn = carousel.querySelector(".carousel-button.next");
  const indicators = Array.from(
    carousel.querySelectorAll(".carousel-indicators button")
  );
  let current = 0;
  let autoplayInterval = null;
  const AUTOPLAY_DELAY = 4000;

  function goTo(index, animate = true) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    current = index;
    const offset = -index * carousel.clientWidth;
    if (!animate) track.style.transition = "none";
    track.style.transform = `translateX(${offset}px)`;
    window.requestAnimationFrame(() => {
      if (!animate) track.style.transition = "";
    });
    indicators.forEach((btn, i) => btn.classList.toggle("active", i === index));
  }

  function next() {
    goTo(current + 1);
  }
  function prev() {
    goTo(current - 1);
  }

  nextBtn.addEventListener("click", () => {
    next();
    resetAutoplay();
  });
  prevBtn.addEventListener("click", () => {
    prev();
    resetAutoplay();
  });

  indicators.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = Number(e.currentTarget.getAttribute("data-index"));
      goTo(idx);
      resetAutoplay();
    });
  });

  // Autoplay
  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(next, AUTOPLAY_DELAY);
  }
  function stopAutoplay() {
    if (autoplayInterval) clearInterval(autoplayInterval);
  }
  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // Resize handling to ensure correct transform
  window.addEventListener("resize", () => goTo(current, false));

  // Touch support (swipe)
  let touchStartX = 0;
  let touchDeltaX = 0;
  track.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    stopAutoplay();
  });
  track.addEventListener("touchmove", (e) => {
    touchDeltaX = e.touches[0].clientX - touchStartX;
  });
  track.addEventListener("touchend", () => {
    if (Math.abs(touchDeltaX) > 40) {
      if (touchDeltaX < 0) next();
      else prev();
    }
    touchDeltaX = 0;
    startAutoplay();
  });

  // Keyboard navigation
  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      prev();
      resetAutoplay();
    }
    if (e.key === "ArrowRight") {
      next();
      resetAutoplay();
    }
  });
  carousel.tabIndex = 0; // make focusable for keyboard events

  // Initialize
  goTo(0, false);
  startAutoplay();
})();

// Chatbot integration
(function () {
  if (!window.chatbase || window.chatbase("getState") !== "initialized") {
    window.chatbase = (...args) => {
      if (!window.chatbase.q) {
        window.chatbase.q = [];
      }
      window.chatbase.q.push(args);
    };
    window.chatbase = new Proxy(window.chatbase, {
      get(target, prop) {
        if (prop === "q") {
          return target.q;
        }
        return (...args) => target(prop, ...args);
      },
    });
  }
  const onLoad = function () {
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = "G8d3FvyYPlk2KmTSYX6gv";
    script.domain = "www.chatbase.co";
    document.body.appendChild(script);
  };
  if (document.readyState === "complete") {
    onLoad();
  } else {
    window.addEventListener("load", onLoad);
  }
})();
