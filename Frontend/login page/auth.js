// Register User
async function registerUser(event) {
  event.preventDefault();

  const role = document.getElementById("role").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User", // replace with actual name input later
        email,
        password,
        role
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Registration successful!");
      window.location.href = "login.html";
    } else {
      alert(data.error || "Registration failed");
    }

  } catch (error) {
    alert("Server error. Try again later.");
    console.error(error);
  }
}

// Login User
async function loginUser(event) {
  event.preventDefault();

  const role = document.getElementById("loginRole").value;
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("role", role);

  // ======= Correct relative redirect based on folder structure =======
  if (role === "client") {
    window.location.href = "../ClientProfile_Page/dashboard.html";
  } else {
    window.location.href = "../FreelancerProfile/dashboard.html";
  }
  // ==================================================================
}

// Role toggle for login & register
function setRole(role) {
  const roleInput = document.getElementById("role") || document.getElementById("loginRole");
  roleInput.value = role;

  const buttons = document.querySelectorAll(".role-toggle button");
  buttons.forEach(btn => btn.classList.remove("active"));

  if (role === "freelancer") {
    buttons[0].classList.add("active");
  } else {
    buttons[1].classList.add("active");
  }

  // Slider styling
  const slider = document.querySelector(".role-toggle");
  slider.classList.toggle("client-active", role === "client");

  // Update button text ONLY on Login page
  const btn = document.querySelector(".login-btn");
  if (btn && document.title.includes("Login")) {
    btn.textContent = role === "freelancer" ? "Sign in as Freelancer" : "Sign in as Client";
  }
}





