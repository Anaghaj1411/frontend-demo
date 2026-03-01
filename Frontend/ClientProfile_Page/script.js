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

    // Extended fields from create_job.html
    const category = document.getElementById("category")?.value || "";
    const job_type = document.getElementById("job_type")?.value || "";
    const experience_level = document.getElementById("experience_level")?.value || "";
    const project_duration = document.getElementById("project_duration")?.value || "";
    const skills_required = document.getElementById("skills_required")?.value || "";
    const location = document.getElementById("location")?.value || "";
    const remote_allowed = !!document.getElementById("remote_allowed")?.checked;
    const deadline = document.getElementById("deadline")?.value || "";

    saveJob({
        title,
        description,
        budget,
        category,
        job_type,
        experience_level,
        project_duration,
        skills_required,
        location,
        remote_allowed,
        deadline
    });
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

    const categoryLabels = {
        web_development: "Web Development",
        mobile_development: "Mobile Development",
        design: "Design & Creative",
        writing: "Writing & Content",
        marketing: "Marketing & Sales",
        data_science: "Data Science & Analytics",
        devops: "DevOps & Cloud",
        other: "Other"
    };

    const experienceLabels = {
        entry: "Entry Level",
        intermediate: "Intermediate",
        expert: "Expert"
    };

    const jobTypeLabels = {
        freelance: "Freelance",
        contract: "Contract",
        part_time: "Part Time",
        full_time: "Full Time"
    };

    const durationLabels = {
        less_than_1_month: "Less than 1 month",
        "1_3_months": "1-3 months",
        "3_6_months": "3-6 months",
        more_than_6_months: "More than 6 months"
    };

    jobs.forEach(job => {
        const proposalCount = getProposals().filter(p => p.jobId === job.id).length;

        const div = document.createElement("div");
        div.className = "job-card";

        const categoryText = job.category ? (categoryLabels[job.category] || job.category) : "Not specified";
        const expText = job.experience_level ? (experienceLabels[job.experience_level] || job.experience_level) : "Any level";
        const typeText = job.job_type ? (jobTypeLabels[job.job_type] || job.job_type) : "Flexible";
        const durationText = job.project_duration ? (durationLabels[job.project_duration] || job.project_duration) : "Not specified";
        const skillsText = job.skills_required || "Not specified";
        const locationText = job.location || (job.remote_allowed ? "Remote" : "Not specified");
        const remoteText = job.remote_allowed ? "Remote allowed" : "On-site / TBD";
        const deadlineText = job.deadline ? job.deadline : "No deadline";

        div.innerHTML = `
            <div class="job-header">
                <h3>${job.title}</h3>
                <span class="price">$${job.budget}</span>
            </div>
            <p class="description">${job.description}</p>
            <div class="job-meta">
                <span><strong>Category:</strong> ${categoryText}</span>
                <span><strong>Type:</strong> ${typeText}</span>
                <span><strong>Experience:</strong> ${expText}</span>
                <span><strong>Duration:</strong> ${durationText}</span>
            </div>
            <div class="job-meta">
                <span><strong>Skills:</strong> ${skillsText}</span>
            </div>
            <div class="job-meta">
                <span><strong>Location:</strong> ${locationText}</span>
                <span><strong>Work Mode:</strong> ${remoteText}</span>
                <span><strong>Deadline:</strong> ${deadlineText}</span>
            </div>
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













// Chart instances (reused for updates)
let _analyticsStatusChart = null;
let _analyticsPerJobChart = null;

function updateAnalyticsCharts(jobs, applications, pending, interview, accepted, rejected) {
    if (typeof Chart === "undefined") return;
    const statusCanvas = document.getElementById("analyticsStatusChart");
    const perJobCanvas = document.getElementById("analyticsPerJobChart");
    if (!statusCanvas && !perJobCanvas) return;

    const totalApps = applications.length;
    const statusColors = ["#f59e0b", "#0ea5e9", "#10b981", "#ef4444"];
    const statusLabels = ["Pending", "Interview Scheduled", "Accepted", "Rejected"];
    const statusData = [pending, interview, accepted, rejected];

    // 1) Status breakdown (doughnut)
    if (statusCanvas) {
        if (_analyticsStatusChart) {
            _analyticsStatusChart.data.labels = statusLabels;
            _analyticsStatusChart.data.datasets[0].data = statusData;
            _analyticsStatusChart.update();
        } else {
            _analyticsStatusChart = new Chart(statusCanvas, {
                type: "doughnut",
                data: {
                    labels: statusLabels,
                    datasets: [{
                        data: statusData,
                        backgroundColor: statusColors,
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: { position: "bottom" }
                    }
                }
            });
        }
    }

    // 2) Applications per job (horizontal bar) – top 10 jobs only; scale fits large counts (e.g. 30+ applicants)
    if (perJobCanvas) {
        const jobCounts = jobs.map(j => ({
            job: j,
            count: applications.filter(a => String(a.jobId) === String(j.id)).length
        }));
        jobCounts.sort((a, b) => b.count - a.count);
        const topN = 10;
        const forChart = jobCounts.slice(0, topN);

        const jobTitles = forChart.map(({ job }) => {
            const t = job.title || "Untitled Job";
            return t.length > 28 ? t.slice(0, 25) + "…" : t;
        });
        const perJobCounts = forChart.map(({ count }) => count);
        const maxCount = Math.max(0, ...perJobCounts);
        const stepSize = maxCount > 20 ? (maxCount > 50 ? 10 : 5) : 1;

        const noteEl = document.getElementById("analyticsPerJobNote");
        if (noteEl) {
            noteEl.textContent = jobs.length > topN ? " (top " + topN + " of " + jobs.length + " jobs)" : "";
        }

        const xTicks = { beginAtZero: true, ticks: { stepSize } };

        if (_analyticsPerJobChart) {
            _analyticsPerJobChart.data.labels = jobTitles;
            _analyticsPerJobChart.data.datasets[0].data = perJobCounts;
            _analyticsPerJobChart.options.scales.x = xTicks;
            _analyticsPerJobChart.update();
        } else {
            _analyticsPerJobChart = new Chart(perJobCanvas, {
                type: "bar",
                data: {
                    labels: jobTitles,
                    datasets: [{
                        label: "Applications",
                        data: perJobCounts,
                        backgroundColor: "rgba(43, 187, 173, 0.7)",
                        borderColor: "#1fa59a",
                        borderWidth: 1
                    }]
                },
                options: {
                    indexAxis: "y",
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: { x: xTicks },
                    plugins: { legend: { display: false } }
                }
            });
        }
    }
}

function renderAnalytics() {

    const totalJobsEl = document.getElementById("totalJobs");
    if (!totalJobsEl) return;
    // Not on analytics page

    const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    const allApplications = JSON.parse(localStorage.getItem("applications")) || [];

    // Cards and pipeline always use FULL data (no filter)
    const applicationsForCounts = allApplications;

    // ===== KPI (always full totals) =====
    document.getElementById("totalJobs").textContent = jobs.length;
    document.getElementById("totalApplications").textContent = applicationsForCounts.length;

    // ===== Status counts (always full totals) =====
    let pending = 0;
    let interview = 0;
    let accepted = 0;
    let rejected = 0;

    applicationsForCounts.forEach(app => {
        if (app.status === "Pending" || !app.status) pending++;
        if (app.status === "Interview-Scheduled") interview++;
        if (app.status === "Accepted") accepted++;
        if (app.status === "Rejected") rejected++;
    });

    document.getElementById("pendingCount").textContent = pending;
    const pendingCard = document.getElementById("pendingCardCount");
    if (pendingCard) pendingCard.textContent = pending;

    document.getElementById("interviewCount").textContent = interview;
    document.getElementById("acceptedCount").textContent = accepted;
    document.getElementById("rejectedCount").textContent = rejected;

    const interviewCard = document.getElementById("interviewCardCount");
    if (interviewCard) interviewCard.textContent = interview;
    const acceptedCard = document.getElementById("acceptedCardCount");
    if (acceptedCard) acceptedCard.textContent = accepted;
    const rejectedCard = document.getElementById("rejectedCardCount");
    if (rejectedCard) rejectedCard.textContent = rejected;

    // ===== Applications Per Job (always full counts) =====
    const perJobContainer = document.getElementById("applicationsPerJob");
    if (perJobContainer) {
        perJobContainer.innerHTML = "";
        if (jobs.length === 0) {
            perJobContainer.innerHTML = "<p>No jobs available.</p>";
        } else {
            jobs.forEach(job => {
                const count = applicationsForCounts.filter(app =>
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
    }

    // ===== Pipeline bars (always full totals) =====
    const totalApplications = applicationsForCounts.length;
    if (totalApplications > 0) {
        const pendingPercent = (pending / totalApplications) * 100;
        const interviewPercent = (interview / totalApplications) * 100;
        const acceptedPercent = (accepted / totalApplications) * 100;
        const rejectedPercent = (rejected / totalApplications) * 100;
        document.getElementById("pendingBar").style.width = pendingPercent + "%";
        document.getElementById("interviewBar").style.width = interviewPercent + "%";
        document.getElementById("acceptedBar").style.width = acceptedPercent + "%";
        document.getElementById("rejectedBar").style.width = rejectedPercent + "%";
    } else {
        document.getElementById("pendingBar").style.width = "0%";
        document.getElementById("interviewBar").style.width = "0%";
        document.getElementById("acceptedBar").style.width = "0%";
        document.getElementById("rejectedBar").style.width = "0%";
    }

    // ===== Actions needed =====
    const actionsEl = document.getElementById("analyticsActionsContent");
    if (actionsEl) {
        const needReview = pending;
        const needSchedule = accepted; // accepted but not yet interview-scheduled in our simple model
        const totalActions = needReview + needSchedule;
        if (totalActions === 0) {
            actionsEl.innerHTML = "<p class=\"analytics-actions-empty\"><i class=\"fas fa-check-circle\"></i> All caught up! No applications need your action right now.</p>";
        } else {
            let html = "<div class=\"analytics-actions-row\">";
            if (needReview > 0) {
                html += "<span><strong>" + needReview + "</strong> pending review</span>";
                html += "<button type=\"button\" class=\"analytics-action-btn\" onclick=\"setAnalyticsFilter('Pending')\">View pending</button>";
            }
            if (needSchedule > 0) {
                if (needReview > 0) html += " ";
                html += "<span><strong>" + needSchedule + "</strong> accepted — schedule interview</span>";
                html += "<button type=\"button\" class=\"analytics-action-btn\" onclick=\"setAnalyticsFilter('Accepted')\">View accepted</button>";
            }
            html += "</div>";
            actionsEl.innerHTML = html;
        }
    }

    // ===== Insights (conversion, most popular, pipeline health) =====
    const insightsEl = document.getElementById("analyticsInsightsContent");
    if (insightsEl) {
        const totalApps = applicationsForCounts.length;
        const acceptanceRate = totalApps > 0 ? ((accepted / totalApps) * 100).toFixed(1) : "0";
        const interviewRate = totalApps > 0 ? ((interview / totalApps) * 100).toFixed(1) : "0";
        const rejectionRate = totalApps > 0 ? ((rejected / totalApps) * 100).toFixed(1) : "0";

        let mostPopularJob = null;
        let mostPopularCount = 0;
        jobs.forEach(job => {
            const c = applicationsForCounts.filter(a => String(a.jobId) === String(job.id)).length;
            if (c > mostPopularCount) {
                mostPopularCount = c;
                mostPopularJob = job;
            }
        });

        const maxStatus = totalApps > 0 ? Math.max(pending, interview, accepted, rejected) : 0;
        let bottleneck = "";
        if (totalApps > 0 && maxStatus > 0) {
            const pct = ((maxStatus / totalApps) * 100).toFixed(0);
            if (pending === maxStatus) bottleneck = "Most applications (" + pct + "%) are in <strong>Pending</strong> — review them to move the pipeline.";
            else if (interview === maxStatus) bottleneck = "Most applications (" + pct + "%) are <strong>Interview scheduled</strong>.";
            else if (accepted === maxStatus) bottleneck = "Most applications (" + pct + "%) are <strong>Accepted</strong> — schedule interviews to progress.";
            else if (rejected === maxStatus) bottleneck = pct + "% of applications are <strong>Rejected</strong>.";
        }

        let html = "<div class=\"analytics-insights-grid\">";
        html += "<div class=\"analytics-insight-item insight-acceptance\"><span class=\"insight-label\">Acceptance rate</span><span class=\"insight-value\">" + acceptanceRate + "%</span></div>";
        html += "<div class=\"analytics-insight-item insight-interview\"><span class=\"insight-label\">Interview rate</span><span class=\"insight-value\">" + interviewRate + "%</span></div>";
        html += "<div class=\"analytics-insight-item insight-rejection\"><span class=\"insight-label\">Rejection rate</span><span class=\"insight-value\">" + rejectionRate + "%</span></div>";
        html += "</div>";
        if (mostPopularJob && mostPopularCount > 0) {
            const title = (mostPopularJob.title || "Untitled Job").length > 40 ? (mostPopularJob.title || "Untitled Job").slice(0, 37) + "…" : (mostPopularJob.title || "Untitled Job");
            html += "<p class=\"analytics-most-popular\"><i class=\"fas fa-fire\"></i> Most applications: <strong>" + title + "</strong> (" + mostPopularCount + ")</p>";
        }
        if (bottleneck) {
            html += "<p class=\"analytics-bottleneck\"><i class=\"fas fa-info-circle\"></i> " + bottleneck + "</p>";
        }
        insightsEl.innerHTML = html;
    }

    // ===== Charts =====
    updateAnalyticsCharts(jobs, applicationsForCounts, pending, interview, accepted, rejected);

    // ===== Filtered applications list (by selected pill + search) =====
    const activeFilterBtn = document.querySelector(".analytics-filter-btn.active");
    const selectedStatus = activeFilterBtn ? activeFilterBtn.dataset.status : "all";

    let filteredApps = allApplications;
    if (selectedStatus !== "all") {
        filteredApps = allApplications.filter(app => {
            const status = app.status || "Pending";
            return status === selectedStatus;
        });
    }

    const searchInput = document.getElementById("analyticsListSearch");
    const searchQuery = (searchInput && searchInput.value.trim()) ? searchInput.value.trim().toLowerCase() : "";
    if (searchQuery) {
        filteredApps = filteredApps.filter(app => {
            const job = jobs.find(j => String(j.id) === String(app.jobId));
            const jobTitle = (job ? (job.title || "") : "").toLowerCase();
            const applicantName = (app.name || "").toLowerCase();
            return jobTitle.includes(searchQuery) || applicantName.includes(searchQuery);
        });
    }

    const listTitleEl = document.getElementById("analyticsListTitle");
    const listContainer = document.getElementById("analyticsApplicationList");
    if (listTitleEl) {
        const statusLabel = selectedStatus === "all" ? "All" : selectedStatus.replace("-", " ");
        listTitleEl.innerHTML = "<i class=\"fas fa-list-check\"></i> Applications — " + statusLabel + " (" + filteredApps.length + ")";
    }
    if (listContainer) {
        listContainer.innerHTML = "";
        if (filteredApps.length === 0) {
            listContainer.innerHTML = "<p class=\"analytics-list-empty\">No applications match your search.</p>";
        } else {
            filteredApps.forEach(app => {
                const job = jobs.find(j => String(j.id) === String(app.jobId));
                const jobTitle = job ? (job.title || "Untitled Job") : "Unknown job";
                const status = app.status || "Pending";
                const statusClass = "status-" + (status || "pending").toLowerCase().replace("-", "-");
                const row = document.createElement("div");
                row.className = "analytics-app-row";
                row.innerHTML = `
                    <span class="analytics-app-job">${jobTitle}</span>
                    <span class="analytics-app-name">${app.name || "—"}</span>
                    <span class="analytics-app-status ${statusClass}">${status.replace("-", " ")}</span>
                    <a href="proposals.html?jobId=${app.jobId}" class="analytics-app-link">View <i class="fas fa-arrow-right"></i></a>
                `;
                listContainer.appendChild(row);
            });
        }
    }
}

// Safe load
document.addEventListener("DOMContentLoaded", () => {
    renderAnalytics();

    const filterButtons = document.querySelectorAll(".analytics-filter-btn");
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderAnalytics();
        });
    });

    const listSearch = document.getElementById("analyticsListSearch");
    if (listSearch) {
        listSearch.addEventListener("input", renderAnalytics);
    }
});

function setAnalyticsFilter(status) {
    const btn = document.querySelector(".analytics-filter-btn[data-status=\"" + status + "\"]");
    if (btn) {
        document.querySelectorAll(".analytics-filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderAnalytics();
        const panel = document.getElementById("analyticsApplicationListPanel");
        if (panel) panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}







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