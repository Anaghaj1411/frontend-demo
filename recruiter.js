document.addEventListener("DOMContentLoaded", function () {
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || currentUser.role !== "recruiter") {
    window.location.href = "login.html";
    return;
  }

  let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
  let applications = JSON.parse(localStorage.getItem("applications")) || [];
  let editId = null;

  window.showSection = function (sectionId) {
    document.getElementById("dashboardSection").classList.add("hidden");
    document.getElementById("postsSection").classList.add("hidden");
    document.getElementById("applicationsSection").classList.add("hidden");

    document.getElementById(sectionId).classList.remove("hidden");

    if (sectionId === "applicationsSection") {
      renderApplications();
    }

    updateStats();
  };

  function updateStats() {
    const myJobs = jobs.filter((j) => j.recruiterEmail === currentUser.email);
    const myApps = applications.filter((a) => {
      const job = jobs.find((j) => j.id === a.jobId);
      return job && job.recruiterEmail === currentUser.email;
    });

    const totalJobsEl = document.getElementById("totalJobs");
    const totalApplicationsEl = document.getElementById("totalApplications");

    if (totalJobsEl) totalJobsEl.innerText = myJobs.length;
    if (totalApplicationsEl) totalApplicationsEl.innerText = myApps.length;
  }

  function renderJobs(filter = "") {
    const container = document.getElementById("jobsContainer");
    if (!container) return;

    container.innerHTML = "";
    let myJobs = jobs.filter((j) => j.recruiterEmail === currentUser.email);

    if (filter) {
      myJobs = myJobs.filter((j) =>
        j.title.toLowerCase().includes(filter.toLowerCase())
      );
    }

    myJobs.forEach((job) => {
      const count = applications.filter((a) => a.jobId === job.id).length;

      const div = document.createElement("div");
      div.className = "job-card";

      div.innerHTML = `
        <div class="job-header">
          <div>
            <h3>${job.title}</h3>
            <small>Applications: ${count}</small>
          </div>
        </div>
      `;
      container.appendChild(div);
    });
  }

  window.openModal = function () {
    document.getElementById("jobModal").style.display = "flex";
  };

  window.closeModal = function () {
    document.getElementById("jobModal").style.display = "none";
    editId = null;
  };

  window.saveJob = function () {
    const title = document.getElementById("jobTitle").value;
    const company = document.getElementById("companyName").value;
    const description = document.getElementById("description").value;

    if (!title || !company || !description) {
      showToast("Fill required fields");
      return;
    }

    jobs.push({
      id: Date.now().toString(),
      title,
      company,
      description,
      recruiterEmail: currentUser.email,
    });

    localStorage.setItem("jobs", JSON.stringify(jobs));
    closeModal();
    renderJobs();
    updateStats();
  };

  window.searchJobs = function () {
    renderJobs(document.getElementById("search").value);
  };

  function showToast(msg) {
    const t = document.getElementById("toast");
    t.innerText = msg;
    t.style.display = "block";
    setTimeout(() => (t.style.display = "none"), 2000);
  }

  window.logout = function () {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  };

  function renderApplications() {
    const container = document.getElementById("applicationsContainer");
    if (!container) return;

    container.innerHTML = "";

    const myJobs = jobs.filter((j) => j.recruiterEmail === currentUser.email);

    const myApplications = applications.filter((app) => {
      return myJobs.some((job) => job.id === app.jobId);
    });

    if (myApplications.length === 0) {
      container.innerHTML = "<p>No applications yet.</p>";
      return;
    }

    myApplications.forEach((app) => {
      const job = jobs.find((j) => j.id === app.jobId);

      const div = document.createElement("div");
      div.className = "job-card";
      div.innerHTML = `
        <h3>${app.freelancerEmail}</h3>
        <p><strong>Applied For:</strong> ${
          job ? job.title : "Unknown Job"
        }</p>
        <p><strong>Status:</strong> ${app.status || "Pending"}</p>
      `;

      container.appendChild(div);
    });
  }

  // Initialize
  updateStats();
  renderJobs();
  showSection("dashboardSection");
});