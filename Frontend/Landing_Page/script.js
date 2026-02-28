document.addEventListener("DOMContentLoaded", () => {

  // ===== Display user role from localStorage =====
  const role = localStorage.getItem("role") || "Guest";
  const badgeElement = document.querySelector(".badge");
  if (badgeElement) {
    badgeElement.textContent = role.charAt(0).toUpperCase() + role.slice(1);
  }

  // ===== Logout functionality =====
  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "../login%20page/login.html";
    });
  }

  // ===== Button handlers =====
  const primaryBtns = document.querySelectorAll(".primary-btn");
  const secondaryBtns = document.querySelectorAll(".secondary-btn");

  primaryBtns.forEach(btn => {
    if (btn.textContent.includes("Get Started")) {
      btn.addEventListener("click", () => {
        window.location.href = "../login%20page/register.html"; // ✅ fixed
      });
    } else if (btn.textContent.includes("Client")) {
      btn.addEventListener("click", () => {
        localStorage.setItem("role", "client");
        window.location.href = "../login%20page/login.html";
      });
    }
  });

  secondaryBtns.forEach(btn => {
    if (btn.textContent.includes("Login")) {
      btn.addEventListener("click", () => {
        window.location.href = "../login%20page/login.html";
      });
    } else if (btn.textContent.includes("Freelancer")) {
      btn.addEventListener("click", () => {
        localStorage.setItem("role", "freelancer");
        window.location.href = "../login%20page/login.html";
      });
    }
  });

  // ===== Navbar shadow on scroll =====
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.style.boxShadow =
        window.scrollY > 10 ? "0 4px 10px rgba(0,0,0,0.1)" : "none";
    });
  }

});
