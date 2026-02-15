// freelancer.js
document.addEventListener("DOMContentLoaded", function () {
  // ===== Current User =====
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || currentUser.role !== "freelancer") {
    window.location.href = "login.html";
    return;
  }

  // ===== Display Freelancer Name =====
  const nameEl = document.getElementById("freelancerName");
  if (nameEl) {
    nameEl.textContent = currentUser.name || currentUser.email;
  }

  // ===== Jobs & Applications =====
  let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
  let applications = JSON.parse(localStorage.getItem("applications")) || [];

  // ===== Section Switch =====
  window.showSection = function (sectionId) {
    const sections = [
      "dashboardSection",
      "profileSection",
      "jobsSection",
      "applicationsSection",
    ];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.add("hidden");
    });

    const active = document.getElementById(sectionId);
    if (active) active.classList.remove("hidden");

    if (sectionId === "applicationsSection") {
      renderApplications();
    } else if (sectionId === "jobsSection") {
      renderJobs();
    } else if (sectionId === "profileSection") {
      loadProfile();
    }

    updateStats();
  };

  // ===== Stats (Total Jobs / Applications) =====
  function updateStats() {
    const totalJobsEl = document.getElementById("totalJobs");
    const totalApplicationsEl = document.getElementById("totalApplications");

    if (totalJobsEl) totalJobsEl.textContent = jobs.length;

    const myAppsCount = applications.filter(
      (app) => app.freelancerEmail === currentUser.email
    ).length;

    if (totalApplicationsEl) totalApplicationsEl.textContent = myAppsCount;
  }

  // ===== Save Profile =====
  window.saveProfile = function () {
    const name = document.getElementById("name").value.trim();
    const experience = document.getElementById("experience").value.trim();
    const education = document.getElementById("education").value.trim();
    const skills = document.getElementById("skills").value.trim();
    const tech = document.getElementById("tech").value.trim();

    if (!name || !experience || !education || !skills || !tech) {
      alert("Please fill all fields");
      return;
    }

    const profile = { name, experience, education, skills, tech };
    localStorage.setItem("freelancerProfile", JSON.stringify(profile));
    alert("Profile saved!");
  };

  // ===== Load Profile (now always clears the fields) =====
  function loadProfile() {
    // Do NOT prefill from localStorage; clear everything
    document.getElementById("name").value = "";
    document.getElementById("experience").value = "";
    document.getElementById("education").value = "";
    document.getElementById("skills").value = "";
    document.getElementById("tech").value = "";
  }

  // ===== Logout =====
  window.logout = function () {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  };

  // ===== Render Jobs =====
  function renderJobs() {
    const container = document.getElementById("jobsContainer");
    if (!container) return;

    container.innerHTML = "";

    if (jobs.length === 0) {
      container.innerHTML = "<p>No jobs available right now.</p>";
      return;
    }

    jobs.forEach((job) => {
      const alreadyApplied = applications.some(
        (app) =>
          (app.jobId ? app.jobId === job.id : app.jobTitle === job.title) &&
          app.freelancerEmail === currentUser.email
      );

      const div = document.createElement("div");
      div.className = "job-card";
      div.innerHTML = `
        <h3>${job.title}</h3>
        ${job.company ? `<p><strong>Company:</strong> ${job.company}</p>` : ""}
        ${job.location ? `<p><strong>Location:</strong> ${job.location}</p>` : ""}
        ${job.description ? `<p>${job.description}</p>` : ""}
        ${job.skills ? `<p><strong>Skills:</strong> ${job.skills}</p>` : ""}
        ${
          job.pay
            ? `<p><strong>Pay per hour:</strong> $${job.pay}</p>`
            : ""
        }
        ${
          alreadyApplied
            ? `<button class="btn btn-danger" disabled>Applied</button>`
            : `<button class="btn btn-primary" onclick="applyJob('${
                job.id || job.title
              }')">I'm Interested</button>`
        }
      `;
      container.appendChild(div);
    });
  }

  // ===== Apply To Job =====
  window.applyJob = function (jobKey) {
    const job = jobs.find((j) => j.id === jobKey || j.title === jobKey);
    if (!job) {
      alert("Job not found.");
      return;
    }

    const alreadyApplied = applications.some(
      (app) =>
        (app.jobId ? app.jobId === job.id : app.jobTitle === job.title) &&
        app.freelancerEmail === currentUser.email
    );

    if (alreadyApplied) {
      alert("You have already applied for this job.");
      return;
    }

    const newApplication = {
      id: Date.now().toString(),
      jobId: job.id || null,
      jobTitle: job.title,
      freelancerEmail: currentUser.email,
      status: "Pending",
    };

    applications.push(newApplication);
    localStorage.setItem("applications", JSON.stringify(applications));
    alert("Applied successfully!");

    renderJobs();
    updateStats();
  };

  // ===== Render Applications =====
  function renderApplications() {
    const container = document.getElementById("applicationsContainer");
    if (!container) return;

    container.innerHTML = "";

    const myApps = applications.filter(
      (app) => app.freelancerEmail === currentUser.email
    );

    if (myApps.length === 0) {
      container.innerHTML = "<p>You haven't applied to any jobs yet.</p>";
      return;
    }

    myApps.forEach((app) => {
      const job = jobs.find(
        (j) => j.id === app.jobId || j.title === app.jobTitle
      );

      let statusClass = "pending";
      if (app.status === "Accepted") statusClass = "accepted";
      if (app.status === "Rejected") statusClass = "rejected";

      const div = document.createElement("div");
      div.className = "job-card";

      div.innerHTML = `
        <h3>${job ? job.title : app.jobTitle || "Job Removed"}</h3>
        <p>
          <strong>Status:</strong>
          <span class="badge ${statusClass}">${app.status}</span>
        </p>
      `;

      container.appendChild(div);
    });
  }

  // ===== Initialize =====
  loadProfile();          // ensures fields start empty on first load
  renderJobs();
  renderApplications();
  updateStats();
  showSection("dashboardSection");
});