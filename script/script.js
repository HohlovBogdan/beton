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

// Плавная прокрутка к якорям
document.addEventListener("DOMContentLoaded", function () {
  // Добавляем плавную прокрутку для всех якорных ссылок
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});

// Бургер-меню с улучшенной анимацией
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuToggle && mobileMenu) {
    // Переключение меню
    menuToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      const isOpen = mobileMenu.classList.contains("opacity-100");

      if (isOpen) {
        mobileMenu.classList.remove(
          "opacity-100",
          "translate-y-0",
          "pointer-events-auto"
        );
        mobileMenu.classList.add(
          "opacity-0",
          "-translate-y-4",
          "pointer-events-none"
        );
      } else {
        mobileMenu.classList.remove(
          "opacity-0",
          "-translate-y-4",
          "pointer-events-none"
        );
        mobileMenu.classList.add(
          "opacity-100",
          "translate-y-0",
          "pointer-events-auto"
        );
      }
    });

    // Закрытие меню при клике на ссылку
    document.querySelectorAll("#mobile-menu a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove(
          "opacity-100",
          "translate-y-0",
          "pointer-events-auto"
        );
        mobileMenu.classList.add(
          "opacity-0",
          "-translate-y-4",
          "pointer-events-none"
        );
      });
    });

    // Закрытие меню при клике вне его области
    document.addEventListener("click", (e) => {
      if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        mobileMenu.classList.remove(
          "opacity-100",
          "translate-y-0",
          "pointer-events-auto"
        );
        mobileMenu.classList.add(
          "opacity-0",
          "-translate-y-4",
          "pointer-events-none"
        );
      }
    });
  }
});

// Анимация появления при скролле
function initScrollAnimations() {
  const fadeSections = document.querySelectorAll(".fade-in-section");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  fadeSections.forEach((section) => {
    observer.observe(section);
  });
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
  initScrollAnimations();
});
