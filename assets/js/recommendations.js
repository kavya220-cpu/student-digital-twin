/* recommendations.js */

document.addEventListener('DOMContentLoaded', () => {
  // Fetch Local Storage Data
  const profileData = localStorage.getItem('nexusED_profile');
  
  // Guard Clause: Redirect to Profile Setup if not configured
  if (!profileData) {
    window.toast.show('warning', 'Profile Setup Required', 'Please configure your profile twin to access growth recommendations.', 4000);
    setTimeout(() => {
      window.location.href = 'profile.html';
    }, 1500);
    return;
  }

  const profile = JSON.parse(profileData);
  
  // Sidebar user credentials load
  const sidebarRole = document.getElementById('sidebar-user-career');
  if (sidebarRole) sidebarRole.textContent = profile.selectedCareer || "AI Student";
  
  const sidebarName = document.getElementById('sidebar-user-name');
  if (sidebarName) sidebarName.textContent = profile.name;

  const sidebarAvatar = document.getElementById('sidebar-user-avatar');
  if (sidebarAvatar) {
    if (profile.photo) {
      sidebarAvatar.innerHTML = `<img src="${profile.photo}" alt="Student Profile picture">`;
    } else {
      const initials = profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      sidebarAvatar.textContent = initials;
    }
  }

  // Setup cursor glow coordinates tracking
  document.addEventListener('mousemove', (e) => {
    const glow = document.querySelector('.cursor-glow');
    if (glow) {
      window.requestAnimationFrame(() => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      });
    }
  });

  // DOM Elements
  const deck = document.getElementById('recommendations-deck');
  
  const filterPriority = document.getElementById('rec-filter-priority');
  const filterStatus = document.getElementById('rec-filter-status');

  const countHigh = document.getElementById('count-high-recs');
  const countMedium = document.getElementById('count-medium-recs');
  const countLow = document.getElementById('count-low-recs');

  // Load current stats from local storage
  const cgpa = parseFloat(profile.cgpa) || 0.0;
  
  const skillsList = JSON.parse(localStorage.getItem('nexusED_skills')) || [];
  const skillsCount = skillsList.length;
  
  // Find Java level
  const javaSkill = skillsList.find(s => s.name && s.name.toLowerCase().includes('java'));
  const javaSkillLevel = javaSkill ? javaSkill.level : "Beginner";

  const projectsList = JSON.parse(localStorage.getItem('nexusED_projects')) || [];
  const projectsCount = projectsList.length;

  const certsList = JSON.parse(localStorage.getItem('nexusED_certificates')) || [];
  const certsCount = certsList.length;

  const codingQuestions = JSON.parse(localStorage.getItem('nexusED_coding_questions')) || [];
  const codingQuestionsCount = codingQuestions.length;

  const resumeScore = parseInt(localStorage.getItem('nexusED_last_resume_analysis_score')) || 70;

  const lastInterviewSession = JSON.parse(localStorage.getItem('nexusED_last_interview_session'));
  let interviewScore = 65;
  if (lastInterviewSession && lastInterviewSession.answers) {
    const answeredCount = Object.keys(lastInterviewSession.answers).length;
    interviewScore = answeredCount >= 3 ? 82 : 55;
  }

  // Initialize saved recommendation statuses from Local Storage
  let recStatuses = JSON.parse(localStorage.getItem('nexusED_recommendation_statuses')) || {};

  // Rule-based Generator (Matching RecommendationEngine.java rules)
  let baseRecommendations = [];
  let recIdCount = 1;

  if (cgpa < 7.5) {
    baseRecommendations.push({
      id: "rec_" + (recIdCount++),
      text: "Improve academic CGPA. Focus on target exam concepts to maintain a minimum threshold of 7.5 for corporate placement eligibility.",
      priority: "High",
      category: "Academics",
      targetUrl: "profile.html"
    });
  }

  if (projectsCount < 2) {
    baseRecommendations.push({
      id: "rec_" + (recIdCount++),
      text: "Build at least two core software projects. Add another Java backend or full-stack project to demonstrate application engineering.",
      priority: "High",
      category: "Projects",
      targetUrl: "projects.html"
    });
  }

  if (certsCount === 0) {
    baseRecommendations.push({
      id: "rec_" + (recIdCount++),
      text: "Earn a professional cloud or technology certification (e.g. AWS, Oracle Java, GCP) to validate your profile credentials.",
      priority: "Medium",
      category: "Certifications",
      targetUrl: "certificates.html"
    });
  }

  if (codingQuestionsCount < 100) {
    baseRecommendations.push({
      id: "rec_" + (recIdCount++),
      text: "Boost metrics on your daily Coding Practice Tracker. Target solving 50-100 additional DSA questions across key topics.",
      priority: "High",
      category: "Coding",
      targetUrl: "coding-tracker.html"
    });
  }

  if (javaSkillLevel === "Beginner" || javaSkillLevel === "") {
    baseRecommendations.push({
      id: "rec_" + (recIdCount++),
      text: "Complete Java Fundamentals. Elevate your backend skills tracker parameters from Beginner to Intermediate.",
      priority: "Medium",
      category: "Skills",
      targetUrl: "skills.html"
    });
  }

  if (resumeScore < 70) {
    baseRecommendations.push({
      id: "rec_" + (recIdCount++),
      text: "Optimize your resume profile score. Enhance your resume summary section and align keywords using the Resume Analyzer dashboard.",
      priority: "Medium",
      category: "Resume",
      targetUrl: "resume-analyzer.html"
    });
  }

  if (interviewScore < 60) {
    baseRecommendations.push({
      id: "rec_" + (recIdCount++),
      text: "Improve your Mock Interview parameters. Practice answering industry-level questions, tracking your eye contact and posture stability.",
      priority: "High",
      category: "Interviews",
      targetUrl: "mock-interview.html"
    });
  }

  // Fallbacks
  if (cgpa >= 7.5 && projectsCount >= 2 && codingQuestionsCount >= 5) {
    baseRecommendations.push({
      id: "rec_" + (recIdCount++),
      text: "Add GitHub repository hyperlinks to your projects listing to demonstrate code validation and public commits history.",
      priority: "Low",
      category: "Portfolio",
      targetUrl: "projects.html"
    });
    baseRecommendations.push({
      id: "rec_" + (recIdCount++),
      text: "Host a personal developer portfolio website to showcase project node links, certifications list, and resume access.",
      priority: "Low",
      category: "Portfolio",
      targetUrl: "projects.html"
    });
  }

  // Map user status updates
  const finalRecs = baseRecommendations.map(r => {
    return {
      ...r,
      status: recStatuses[r.id] || "Pending" // Default to Pending
    };
  });

  // KPI count binds
  countHigh.textContent = finalRecs.filter(r => r.priority === "High").length;
  countMedium.textContent = finalRecs.filter(r => r.priority === "Medium").length;
  countLow.textContent = finalRecs.filter(r => r.priority === "Low").length;

  // Listeners
  filterPriority.addEventListener('change', renderDeck);
  filterStatus.addEventListener('change', renderDeck);

  renderDeck();

  // --- Render Recommendations ---
  function renderDeck() {
    deck.innerHTML = '';
    
    const activePriority = filterPriority.value;
    const activeStatus = filterStatus.value;

    let filtered = finalRecs;

    if (activePriority !== 'all') {
      filtered = filtered.filter(r => r.priority === activePriority);
    }
    if (activeStatus !== 'all') {
      filtered = filtered.filter(r => r.status === activeStatus);
    }

    if (filtered.length === 0) {
      deck.innerHTML = `
        <div class="col-12 text-center py-5">
          <div class="dash-panel py-5">
            <i data-lucide="sparkles" class="text-success mb-2 animate__animated animate__pulse animate__infinite" style="width:40px; height:40px; margin: 0 auto; display:block;"></i>
            <p class="text-success fw-semibold">Awesome! No pending priority gaps found. Your digital twin profile is well aligned!</p>
          </div>
        </div>
      `;
      if (typeof lucide !== 'undefined') lucide.createIcons();
      return;
    }

    filtered.forEach((r, idx) => {
      const col = document.createElement('div');
      col.className = 'col-md-4 col-12 animate__animated animate__fadeInUp';
      col.style.animationDelay = `${idx * 0.05}s`;

      const priorityClass = r.priority.toLowerCase();
      const statusClass = r.status.toLowerCase().replace(" ", "-");

      col.innerHTML = `
        <div class="rec-card">
          <div>
            <div class="rec-pills-row mb-3">
              <span class="priority-pill ${priorityClass}">${r.priority}</span>
              <span class="status-pill ${statusClass}" id="status-pill-${r.id}">${r.status}</span>
            </div>
            
            <p class="rec-text-body">${r.text}</p>
            <span class="rec-category-badge">${r.category}</span>
          </div>

          <div class="d-flex flex-column gap-2 mt-3">
            <a href="${r.targetUrl}" class="btn-premium btn-premium-primary btn-rec-action">
              <span>Go to ${r.category}</span>
              <i data-lucide="arrow-right" style="width:12px; height:12px;"></i>
            </a>
            
            <div class="d-flex gap-1">
              <button type="button" class="btn-premium btn-premium-secondary btn-rec-action w-50" style="padding: 6px;" onclick="updateRecStatus('${r.id}', 'In Progress')">
                In Progress
              </button>
              <button type="button" class="btn-premium btn-premium-secondary btn-rec-action w-50" style="padding: 6px; border-color:var(--success); color:var(--success);" onclick="updateRecStatus('${r.id}', 'Completed')">
                Completed
              </button>
            </div>
          </div>
        </div>
      `;

      deck.appendChild(col);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // Exposed global status modification
  window.updateRecStatus = (id, newStatus) => {
    recStatuses[id] = newStatus;
    localStorage.setItem('nexusED_recommendation_statuses', JSON.stringify(recStatuses));
    
    // Update local object array
    const target = finalRecs.find(item => item.id === id);
    if (target) {
      target.status = newStatus;
    }

    window.toast.show('success', 'Status Updated', `Task status marked as ${newStatus}.`, 1500);
    renderDeck();
  };
});
