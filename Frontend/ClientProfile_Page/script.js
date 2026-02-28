// -------------------------
// NAVIGATION
// -------------------------
function navigate(page) {
    window.location.href = page;
}



// =======================
// ANALYTICS LOGIC
// =======================

document.addEventListener("DOMContentLoaded", function () {

    // Get stored data
    const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    const applications = JSON.parse(localStorage.getItem("applications")) || [];

    // Total counts
    const totalJobs = jobs.length;
    const totalApplications = applications.length;

    // Update KPI cards
    if (document.getElementById("totalJobs"))
        document.getElementById("totalJobs").textContent = totalJobs;

    if (document.getElementById("totalApplications"))
        document.getElementById("totalApplications").textContent = totalApplications;

    // Count statuses
    let pending = 0;
    let interview = 0;
    let accepted = 0;
    let rejected = 0;

    applications.forEach(app => {
        if (app.status === "Pending") pending++;
        if (app.status === "Interview-Scheduled") interview++;
        if (app.status === "Accepted") accepted++;
        if (app.status === "Rejected") rejected++;
    });

    // Update text counts (if elements exist)
    if (document.getElementById("pendingCount"))
        document.getElementById("pendingCount").textContent = pending;

    if (document.getElementById("interviewCount"))
        document.getElementById("interviewCount").textContent = interview;

    if (document.getElementById("acceptedCount"))
        document.getElementById("acceptedCount").textContent = accepted;

    if (document.getElementById("rejectedCount"))
        document.getElementById("rejectedCount").textContent = rejected;

    // Avoid division by zero
    if (totalApplications === 0) return;

    // Calculate percentages
    const pendingPercent = (pending / totalApplications) * 100;
    const interviewPercent = (interview / totalApplications) * 100;
    const acceptedPercent = (accepted / totalApplications) * 100;
    const rejectedPercent = (rejected / totalApplications) * 100;

    // Update bar widths (only if elements exist)
    if (document.getElementById("pendingBar"))
        document.getElementById("pendingBar").style.width = pendingPercent + "%";

    if (document.getElementById("interviewBar"))
        document.getElementById("interviewBar").style.width = interviewPercent + "%";

    if (document.getElementById("acceptedBar"))
        document.getElementById("acceptedBar").style.width = acceptedPercent + "%";

    if (document.getElementById("rejectedBar"))
        document.getElementById("rejectedBar").style.width = rejectedPercent + "%";

});



// -------------------------
// LOCAL STORAGE HELPERS
// -------------------------
function getJobs() {
    let jobs = localStorage.getItem("jobs");
    return jobs ? JSON.parse(jobs) : [];
}

function saveJob(job) {
    let jobs = getJobs();
    job.id = Date.now().toString(); // simple unique id
    jobs.push(job);
    localStorage.setItem("jobs", JSON.stringify(jobs));
}

function getProposals() {
    let proposals = localStorage.getItem("applications");
    return proposals ? JSON.parse(proposals) : [];
}

  function saveProposal(proposal) {
    let proposals = getProposals();   // get existing proposals

    proposal.id = Date.now().toString();  // generate unique id

    proposals.push(proposal);  // add new proposal

    localStorage.setItem("applications", JSON.stringify(proposals));  // save back
}








// -------------------------
// CREATE JOB FORM
// -------------------------
document.getElementById("jobForm")?.addEventListener("submit", function(e) {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const budget = document.getElementById("budget").value;

    saveJob({ title, description, budget });
    alert("Job Posted Successfully 🚀");
    navigate("job_listing.html");
});






// -------------------------
// RENDER JOBS
// -------------------------
function renderJobs() {
    const container = document.getElementById("jobContainer");
    if (!container) return;
    const jobs = getJobs();
    container.innerHTML = "";

    if (jobs.length === 0) {
        container.innerHTML = "<p>No jobs posted yet.</p>";
        return;
    }

    jobs.forEach(job => {
        const proposalCount = getProposals().filter(p => p.jobId === job.id).length;

        const div = document.createElement("div");
        div.className = "job-card";

        div.innerHTML = `
            <div class="job-header">
                <h3>${job.title}</h3>
                <span class="price">$${job.budget}</span>
            </div>
            <p class="description">${job.description}</p>
            <div class="job-footer">
    <span>${proposalCount} proposals</span>
    <div style="display:flex; gap:8px;">
        <button class="apply-btn" onclick="viewProposals('${job.id}')">View Proposals</button>
        <button class="delete-btn" onclick="deleteJob('${job.id}')">Delete</button>
    </div>
</div>
        `;

        container.appendChild(div);
    });
}


//Delete job//

function deleteJob(jobId) {

    const confirmDelete = confirm(
        "This will permanently delete the job and all related proposals.\n\nAre you sure you want to continue?"
    );

    if (!confirmDelete) return;

    // Remove job
    let jobs = getJobs();
    jobs = jobs.filter(job => job.id !== jobId);
    localStorage.setItem("jobs", JSON.stringify(jobs));

    // Remove related proposals
    let proposals = getProposals();
    proposals = proposals.filter(p => p.jobId !== jobId);
    localStorage.setItem("applications", JSON.stringify(proposals));

    renderJobs();
}



// -------------------------
// VIEW PROPOSALS PAGE
// -------------------------
function viewProposals(jobId) {
    window.location.href = "proposals.html?jobId=" + jobId;
}



function convertTo12Hour(time24) {
    if (!time24) return "";

    let [hour, minute] = time24.split(":");
    hour = parseInt(hour);

    let ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;

    return `${hour}:${minute} ${ampm}`;
}







function renderProposals() {
    var container = document.getElementById("proposalList");
    if (!container) return;
    container.innerHTML = "";

    var params = new URLSearchParams(window.location.search);
    var jobId = params.get("jobId");

    var allProposals = getProposals();
    var filtered = allProposals.filter(p => String(p.jobId) === String(jobId));

    if (filtered.length === 0) {
        container.textContent = "No proposals for this job yet.";
        return;
    }

    filtered.forEach(p => {
        var div = document.createElement("div");
        div.className = "proposal-card " + p.status;

        var name = document.createElement("h3");
        name.textContent = p.name;
        div.appendChild(name);

        var skill = document.createElement("p");
        skill.innerHTML = "<strong>Skill:</strong> " + p.skill;
        div.appendChild(skill);

        var exp = document.createElement("p");
        exp.innerHTML = "<strong>Experience:</strong> " + p.experience;
        div.appendChild(exp);

        var status = document.createElement("p");
        var cleanStatus = p.status ? p.status.replace("-", " ") : "Pending";
        status.innerHTML = "<strong>Status:</strong> <span class='status-text'>" + cleanStatus + "</span>";
        div.appendChild(status);

        if (p.interview && p.interview.date && p.interview.time) {
            var interviewInfo = document.createElement("p");
            var formattedTime = convertTo12Hour(p.interview.time);
            interviewInfo.innerHTML =
                "<strong>Interview:</strong> " +
                p.interview.date + " at " +
                formattedTime + " (" +
                p.interview.mode + ")";
            div.appendChild(interviewInfo);
        }

        var actions = document.createElement("div");
        actions.className = "proposal-actions";

        // PENDING
        if (!p.status || p.status === "Pending") {

            var accept = document.createElement("button");
            accept.className = "accept-btn";
            accept.textContent = "Accept";
            accept.onclick = () => updateStatus(p.id, "Accepted");

            var reject = document.createElement("button");
            reject.className = "reject-btn";
            reject.textContent = "Reject";
            reject.onclick = () => updateStatus(p.id, "Rejected");

            actions.appendChild(accept);
            actions.appendChild(reject);
        }

        // ACCEPTED
        if (p.status === "Accepted") {

            var scheduleBtn = document.createElement("button");
            scheduleBtn.className = "primary-btn";
            scheduleBtn.textContent = "Schedule Interview";
            scheduleBtn.onclick = () => openScheduleModal(p);
            actions.appendChild(scheduleBtn);

            var undo = document.createElement("button");
            undo.className = "delete-btn";
            undo.textContent = "Undo";
            undo.onclick = () => updateStatus(p.id, "Pending");
            actions.appendChild(undo);
        }

        // REJECTED
        if (p.status === "Rejected") {

            var undoRejected = document.createElement("button");
            undoRejected.className = "delete-btn";
            undoRejected.textContent = "Undo";
            undoRejected.onclick = () => updateStatus(p.id, "Pending");
            actions.appendChild(undoRejected);
        }

        // INTERVIEW SCHEDULED
        if (p.status === "Interview-Scheduled") {

            var cancelBtn = document.createElement("button");
            cancelBtn.className = "delete-btn";
            cancelBtn.textContent = "Cancel Interview";
            cancelBtn.onclick = () => cancelInterviewSchedule(p.id);
            actions.appendChild(cancelBtn);
        }

        // VIEW PROFILE (always visible)
        var viewBtn = document.createElement("button");
        viewBtn.className = "primary-btn";
        viewBtn.textContent = "View Profile";
        viewBtn.onclick = () => {
            window.location.href =
                "freelancer_profile.html?proposalId=" + p.id;
        };
        actions.appendChild(viewBtn);

        div.appendChild(actions);
        container.appendChild(div);
    });
}










// -------------------------
// PROPOSAL STATUS UPDATE
// -------------------------
function updateStatus(id, newStatus) {
    let proposals = JSON.parse(localStorage.getItem("applications")) || [];

    proposals = proposals.map(p => {
        if (p.id === id) {
            p.status = newStatus;
        }
        return p;
    });

    localStorage.setItem("applications", JSON.stringify(proposals));

    renderProposals(); 
}














// -------------------------
// SCHEDULE INTERVIEW MODAL
// -------------------------
let currentProposal = null;

function openScheduleModal(proposal) {

    if (proposal.status !== "Accepted") {
        alert("You must accept the proposal before scheduling an interview.");
        return;
    }

    currentProposal = proposal;

    const modal = document.getElementById("scheduleModal");
    if (!modal) {
        console.error("scheduleModal not found in HTML");
        return;
    }

    document.getElementById("scheduleName").textContent = proposal.name;
    document.getElementById("interviewDate").value = proposal.interview?.date || "";
    document.getElementById("interviewMode").value = proposal.interview?.mode || "Online";
    document.getElementById("interviewInstructions").value = proposal.interview?.instructions || "";

    // ✅ Properly load stored time into hour/minute/AMPM
    if (proposal.interview && proposal.interview.time) {

        let [hour24, minute] = proposal.interview.time.split(":");
        hour24 = parseInt(hour24);

        let ampm = hour24 >= 12 ? "PM" : "AM";
        let hour12 = hour24 % 12 || 12;

        document.getElementById("interviewHour").value = hour12;
        document.getElementById("interviewMinute").value = minute;
        document.getElementById("interviewAmPm").value = ampm;

    } else {
        document.getElementById("interviewHour").value = "";
        document.getElementById("interviewMinute").value = "";
        document.getElementById("interviewAmPm").value = "AM";
    }

    modal.classList.add("active");
}




function closeScheduleModal() {
    const modal = document.getElementById("scheduleModal");
    if (modal) modal.classList.remove("active");
    currentProposal = null;
}







function confirmInterview() {
    if (!currentProposal) return;

    const date = document.getElementById("interviewDate").value;
    const hour = document.getElementById("interviewHour").value;
    const minute = document.getElementById("interviewMinute").value;
    const ampm = document.getElementById("interviewAmPm").value;
    const mode = document.getElementById("interviewMode").value;
    const instructions = document.getElementById("interviewInstructions").value;

    if (!date || !hour || !minute) {
        alert("Please enter date, hour, and minute.");
        return;
    }

    let hour24 = parseInt(hour);

    if (hour24 < 1 || hour24 > 12) {
        alert("Hour must be between 1 and 12.");
        return;
    }

    if (parseInt(minute) < 0 || parseInt(minute) > 59) {
        alert("Minute must be between 0 and 59.");
        return;
    }

    // Convert to 24-hour format for storage
    if (ampm === "PM" && hour24 !== 12) hour24 += 12;
    if (ampm === "AM" && hour24 === 12) hour24 = 0;

    const time = 
        hour24.toString().padStart(2, "0") + ":" +
        minute.padStart(2, "0");

    let proposals = getProposals();

    proposals = proposals.map(p => {
        if (p.id === currentProposal.id) {
            p.interview = { date, time, mode, instructions };
            p.status = "Interview-Scheduled";
        }
        return p;
    });

    localStorage.setItem("applications", JSON.stringify(proposals));

    closeScheduleModal();
    renderProposals();
}







function cancelInterviewSchedule(id) {

    const confirmCancel = confirm(
        "Are you sure you want to cancel this interview?"
    );

    if (!confirmCancel) return;

    let proposals = getProposals();

    proposals = proposals.map(p => {
        if (p.id === id) {
            p.status = "Accepted";   // revert back
            delete p.interview;      // remove interview data
        }
        return p;
    });

    localStorage.setItem("applications", JSON.stringify(proposals));

    renderProposals();
}







// -------------------------
// FREELANCER PROFILE PAGE
// -------------------------
function renderFreelancerProfile() {
    const container = document.getElementById("freelancerName");
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const proposalId = params.get("proposalId");
    if (!proposalId) return;

    const proposals = getProposals();
    const freelancer = proposals.find(p => p.id === proposalId);
    if (!freelancer) return;

    document.getElementById("freelancerName").textContent = freelancer.name || "Freelancer";
    document.getElementById("freelancerRole").textContent = freelancer.role || "Freelancer";
    document.getElementById("freelancerEmail").textContent = freelancer.email || "N/A";
    document.getElementById("freelancerAbout").textContent = freelancer.about || "No description provided.";
    document.getElementById("freelancerExperience").textContent = freelancer.experience || "N/A";

    document.getElementById("freelancerAvatar").textContent =
        freelancer.name ? freelancer.name.charAt(0).toUpperCase() : "F";

    // Skills
    const skillsContainer = document.getElementById("freelancerSkills");
    skillsContainer.innerHTML = "";
    if (freelancer.skill) {
        freelancer.skill.split(",").forEach(skill => {
            const span = document.createElement("span");
            span.className = "freelancer-skill-badge";
            span.textContent = skill.trim();
            skillsContainer.appendChild(span);
        });
    }

    // Location
    document.getElementById("freelancerLocation").textContent = freelancer.location || "Not specified";

    // Total Projects
    document.getElementById("freelancerProjects").textContent = freelancer.totalProjects || "0";

    // Education
    const eduContainer = document.getElementById("freelancerEducation");
    eduContainer.innerHTML = "";
    if (freelancer.education) {
        freelancer.education.forEach(e => {
            const div = document.createElement("div");
            div.innerHTML = `<strong>${e.degree}</strong> - ${e.institution} (${e.year})`;
            eduContainer.appendChild(div);
        });
    }

    // Certifications
    const certContainer = document.getElementById("freelancerCertifications");
    certContainer.innerHTML = "";
    if (freelancer.certifications) {
        freelancer.certifications.forEach(c => {
            const div = document.createElement("div");
            div.textContent = c;
            certContainer.appendChild(div);
        });
    }

    // Languages
    const langContainer = document.getElementById("freelancerLanguages");
    langContainer.innerHTML = "";
    if (freelancer.languages) {
        freelancer.languages.forEach(l => {
            const span = document.createElement("span");
            span.className = "freelancer-skill-badge";
            span.textContent = l;
            langContainer.appendChild(span);
        });
    }
}

function goBack() {
    window.history.back();
}










//Dashboard stats//

function updateDashboardStats() {

    const jobs = getJobs();
    const proposals = getProposals();

    const activeProjects = jobs.length;
    const pendingProposals = proposals.filter(p => 
        !p.status || p.status === "Pending"
    ).length;

    const activeEl = document.getElementById("activeProjectsCount");
    const pendingEl = document.getElementById("pendingProposalsCount");

    if (activeEl) activeEl.textContent = activeProjects;
    if (pendingEl) pendingEl.textContent = pendingProposals;
}




// -------------------------
// DASHBOARD JOBS
// -------------------------
function renderDashboardJobsAdvanced() {

    const container = document.getElementById("dashboardJobs");
    if (!container) return;

    container.innerHTML = "";

    const jobs = getJobs();
    const proposals = getProposals();

    if (!jobs || jobs.length === 0) {
        container.innerHTML = "<p>No jobs posted yet.</p>";
        return;
    }

    // Show newest 3 jobs
    const recentJobs = jobs.slice(-3).reverse();

    recentJobs.forEach(job => {

        // Count proposals for this job
        const proposalCount = proposals.filter(p => 
            p.jobId === job.id
        ).length;

        const div = document.createElement("div");
        div.className = "job-item";

        div.innerHTML = `
            <h4 class="clickable-job">${job.title}</h4>
            <p>${proposalCount} proposal(s)</p>
            <span class="status">Active</span>
        `;

        // Make job clickable
        div.querySelector(".clickable-job").addEventListener("click", () => {
            localStorage.setItem("selectedJobId", job.id);
            navigate("job_listing.html");
        });

        container.appendChild(div);
    });
}













function renderAnalytics() {

    const totalJobsEl = document.getElementById("totalJobs");
    if (!totalJobsEl) return; 
    // Not on analytics page

    const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    const applications = JSON.parse(localStorage.getItem("applications")) || [];

    // ===== KPI =====
    document.getElementById("totalJobs").textContent = jobs.length;
    document.getElementById("totalApplications").textContent = applications.length;

    // ===== Status Counts =====
    let pending = 0;
    let interview = 0;
    let accepted = 0;
    let rejected = 0;

    applications.forEach(app => {
        if (app.status === "Pending" || !app.status) pending++;
        if (app.status === "Interview-Scheduled") interview++;
        if (app.status === "Accepted") accepted++;
        if (app.status === "Rejected") rejected++;
    });

    // Update counts
    document.getElementById("pendingCount").textContent = pending;

const pendingCard = document.getElementById("pendingCardCount");
if (pendingCard) {
    pendingCard.textContent = pending;
}
    document.getElementById("interviewCount").textContent = interview;
    document.getElementById("acceptedCount").textContent = accepted;
    document.getElementById("rejectedCount").textContent = rejected;

    // ===== Applications Per Job =====
    const perJobContainer = document.getElementById("applicationsPerJob");
    if (perJobContainer) {

        perJobContainer.innerHTML = "";

        if (jobs.length === 0) {
            perJobContainer.innerHTML = "<p>No jobs available.</p>";
        }

        jobs.forEach(job => {

            const count = applications.filter(app =>
                String(app.jobId) === String(job.id)
            ).length;

            const div = document.createElement("div");
            div.className = "job-row";

            div.innerHTML = `
                <span>${job.title || "Untitled Job"}</span>
                <strong>${count} applications</strong>
            `;

            perJobContainer.appendChild(div);
        });
    }

    // ===== Pipeline Bars =====

    const totalApplications = applications.length;
    if (totalApplications === 0) return;

    const pendingPercent = (pending / totalApplications) * 100;
    const interviewPercent = (interview / totalApplications) * 100;
    const acceptedPercent = (accepted / totalApplications) * 100;
    const rejectedPercent = (rejected / totalApplications) * 100;

    document.getElementById("pendingBar").style.width = pendingPercent + "%";
    document.getElementById("interviewBar").style.width = interviewPercent + "%";
    document.getElementById("acceptedBar").style.width = acceptedPercent + "%";
    document.getElementById("rejectedBar").style.width = rejectedPercent + "%";
}

// Safe load
document.addEventListener("DOMContentLoaded", renderAnalytics);







// -------------------------
// PAGE INIT
// -------------------------
document.addEventListener("DOMContentLoaded", () => {
    renderJobs();
    renderProposals();
    renderFreelancerProfile(); 
    updateDashboardStats();
    renderDashboardJobsAdvanced();
});