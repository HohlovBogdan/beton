// tailwind.config
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        rubik: ["Rubik", "sans-serif"],
      },
      colors: {
        "header-blue": "rgba(0, 98, 134, 1)",
      },
    },
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const allLinks = document.querySelectorAll('nav a[href^="#"], #mobile-menu a[href^="#"]');
  let menuOpen = false;

  // === Бургер-иконка ===
  const burgerIcon = menuToggle.querySelector("svg");
  burgerIcon.innerHTML = `
        <g stroke-linecap="round" stroke-width="2">
            <line class="line top" x1="4" y1="6" x2="20" y2="6" />
            <line class="line middle" x1="4" y1="12" x2="20" y2="12" />
            <line class="line bottom" x1="4" y1="18" x2="20" y2="18" />
        </g>
    `;

  // === Стили ===
  const style = document.createElement("style");
  style.innerHTML = `
        #menu-toggle svg { transition: transform 0.3s ease; }
        #menu-toggle .line { transition: all 0.3s ease; }
        #menu-toggle.open .top {
            transform: translateY(6px) rotate(45deg);
            transform-origin: center;
        }
        #menu-toggle.open .middle {
            opacity: 0;
        }
        #menu-toggle.open .bottom {
            transform: translateY(-6px) rotate(-45deg);
            transform-origin: center;
        }

        /* Подсветка активной ссылки — yellow-300 */
        nav a.active,
        #mobile-menu a.active {
            color: rgb(253 224 71); /* соответствует text-yellow-300 в Tailwind */
        }
    `;
  document.head.appendChild(style);

  // === Открытие/закрытие меню ===
  function openMenu() {
    menuOpen = true;
    menuToggle.classList.add("open");
    mobileMenu.classList.remove("opacity-0", "-translate-y-4", "pointer-events-none");
    mobileMenu.classList.add("opacity-100", "translate-y-0");
  }

  function closeMenu() {
    menuOpen = false;
    menuToggle.classList.remove("open");
    mobileMenu.classList.add("opacity-0", "-translate-y-4", "pointer-events-none");
    mobileMenu.classList.remove("opacity-100", "translate-y-0");
  }

  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    menuOpen ? closeMenu() : openMenu();
  });

  // === Закрытие при клике вне меню ===
  document.addEventListener("click", (e) => {
    if (menuOpen && !mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      closeMenu();
    }
  });

  // === Закрытие при клике на ссылку ===
  mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => closeMenu());
  });

  // === Подсветка активной ссылки ===
  function setActiveLink(targetId) {
    allLinks.forEach(link => link.classList.remove("active"));
    const activeLinks = document.querySelectorAll(`a[href="${targetId}"]`);
    activeLinks.forEach(link => link.classList.add("active"));
  }

  // === Плавный скролл ===
  allLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (targetId && targetId !== "#") {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top: offsetTop, behavior: "smooth" });
          setActiveLink(targetId);
        }
      }
    });
  });

  // === Подсветка при скролле ===
  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    let scrollPos = window.scrollY + 100;
    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
        setActiveLink(`#${sec.id}`);
      }
    });
  });

  // === Анимация появления секций ===
  const fadeSections = document.querySelectorAll(".fade-in-section");
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("opacity-100", "translate-y-0");
        entry.target.classList.remove("opacity-0", "translate-y-10");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeSections.forEach(section => {
    section.classList.add("opacity-0", "translate-y-10", "transition-all", "duration-700");
    observer.observe(section);
  });
});




