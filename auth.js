// ================= REGISTER =================
function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const role = document.querySelector('input[name="role"]:checked');

  if (!email || !password || !confirmPassword || !role) {
    alert("Please fill all fields and select a role.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const userExists = users.find((user) => user.email === email);
  if (userExists) {
    alert("User already exists. Please login.");
    window.location.href = "login.html";
    return;
  }

  const newUser = {
    email: email,
    password: password,
    role: role.value,
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  // ✅ Do NOT auto-login; go to login page instead
  alert("Registration successful! Please log in.");
  window.location.href = "login.html";
}

// ================= LOGIN =================
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (!user) {
    alert("Invalid email or password.");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));

  // ✅ Redirect based on role
  if (user.role === "freelancer") {
    window.location.href = "freelancer-dashboard.html";
  } else {
    window.location.href = "recruiter-dashboard.html";
  }
}

// ================= LOGOUT =================
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}