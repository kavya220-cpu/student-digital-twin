/* career-readiness.js */

document.addEventListener('DOMContentLoaded', () => {
  // Fetch Local Storage Data
  const profileData = localStorage.getItem('nexusED_profile');
  
  // Guard Clause: Redirect to Profile Setup if not configured
  if (!profileData) {
    window.toast.show('warning', 'Profile Setup Required', 'Please configure your profile twin to access the readiness scorecard.', 4000);
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
  const textReadiness = document.getElementById('text-readiness-val');
  const ringReadiness = document.getElementById('ring-readiness');
  const badgeLevel = document.getElementById('readiness-level-badge');
  const descLevel = document.getElementById('readiness-level-desc');

  const statCgpa = document.getElementById('stat-cgpa');
  const statProjects = document.getElementById('stat-projects');
  const statCerts = document.getElementById('stat-certs');

  const barsBox = document.getElementById('breakdown-bars-box');
  const suggestionsBox = document.getElementById('readiness-suggestions-list');

  // Load current stats from local storage data structures
  const cgpa = parseFloat(profile.cgpa) || 0.0;
  
  const skillsList = JSON.parse(localStorage.getItem('nexusED_skills')) || [];
  const skillsCount = skillsList.length;

  const projectsList = JSON.parse(localStorage.getItem('nexusED_projects')) || [];
  const projectsCount = projectsList.length;

  const certsList = JSON.parse(localStorage.getItem('nexusED_certificates')) || [];
  const certsCount = certsList.length;

  const codingQuestions = JSON.parse(localStorage.getItem('nexusED_coding_questions')) || [];
  const codingProgress = Math.min((codingQuestions.length / 100) * 100, 100);

  // Resume Analyzer Score
  const resumeScore = parseInt(localStorage.getItem('nexusED_last_resume_analysis_score')) || 70;

  // Mock Interview Score
  const lastInterviewSession = JSON.parse(localStorage.getItem('nexusED_last_interview_session'));
  let interviewScore = 65;
  if (lastInterviewSession && lastInterviewSession.answers) {
    // If completed mock interview, evaluate score out of 100
    const answeredCount = Object.keys(lastInterviewSession.answers).length;
    interviewScore = answeredCount >= 3 ? 82 : 55;
  }

  // Run scoring calculations (matching CareerReadinessCalculator.java weights)
  const cgpaScore = (cgpa / 10) * 100;
  const skillsScore = Math.min((skillsCount / 8) * 100, 100);
  const projectsScore = Math.min((projectsCount / 3) * 100, 100);
  const certsScore = Math.min((certsCount / 2) * 100, 100);

  // Weighted sum
  const score = (cgpaScore * 0.15) +
                (skillsScore * 0.15) +
                (projectsScore * 0.15) +
                (certsScore * 0.10) +
                (codingProgress * 0.15) +
                (resumeScore * 0.15) +
                (interviewScore * 0.15);

  const finalScore = Math.round(score);

  // Populate mini labels
  statCgpa.textContent = cgpa.toFixed(1);
  statProjects.textContent = projectsCount;
  statCerts.textContent = certsCount;

  // Level thresholds
  let level = "Foundation Stage";
  let description = "";
  let badgeClass = "foundation";
  let suggestions = [];

  if (finalScore <= 40) {
    level = "Foundation Stage";
    badgeClass = "foundation";
    description = "The student is beginning their learning journey and needs to strengthen fundamental skills.";
    suggestions = [
      "Improve academic performance and class conceptual targets",
      "Complete basic programming tutorials (Java/Python)",
      "Build first software project node",
      "Earn first professional certification"
    ];
  } else if (finalScore <= 60) {
    level = "Developing";
    badgeClass = "developing";
    description = "The student has basic knowledge but should improve practical experience and consistency.";
    suggestions = [
      "Complete intermediate difficulty projects",
      "Improve daily coding tracker consistency",
      "Strengthen database SQL query structures and DSA concepts",
      "Practice camera-based mock interviews"
    ];
  } else if (finalScore <= 80) {
    level = "Placement Ready";
    badgeClass = "placement-ready";
    description = "The student is prepared for internships and placement drives but still has room for improvement.";
    suggestions = [
      "Complete advanced full-stack software projects",
      "Optimize and refine resume score above 85",
      "Practice mock interviews regularly to boost expression scores",
      "Add a clean GitHub repository profile portfolio"
    ];
  } else {
    level = "Industry Ready";
    badgeClass = "industry-ready";
    description = "The student demonstrates strong technical skills, practical experience, and career readiness.";
    suggestions = [
      "Apply actively for enterprise-grade internships",
      "Contribute to global open-source code repositories",
      "Build and host a premium portfolio website",
      "Prepare for advanced architecture design screenings"
    ];
  }

  // Populate gauge UI
  textReadiness.textContent = `${finalScore}%`;
  badgeLevel.textContent = level;
  badgeLevel.className = `level-indicator-badge ${badgeClass} mb-2`;
  descLevel.textContent = description;

  // SVG ring circumference = 603.18
  const circ = 603.18;
  setTimeout(() => {
    ringReadiness.style.strokeDashoffset = circ - (finalScore / 100) * circ;
  }, 200);

  // Render breakdowns list
  const breakdownList = [
    { name: "Academic Performance", value: cgpaScore, weight: 15 },
    { name: "Skills Tracker", value: skillsScore, weight: 15 },
    { name: "Projects Catalog", value: projectsScore, weight: 15 },
    { name: "Certifications Portfolio", value: certsScore, weight: 10 },
    { name: "Coding Practice Progress", value: codingProgress, weight: 15 },
    { name: "Resume Scorecard", value: resumeScore, weight: 15 },
    { name: "Mock Interview Rating", value: interviewScore, weight: 15 }
  ];

  barsBox.innerHTML = '';
  breakdownList.forEach(item => {
    const roundedVal = Math.round(item.value);
    
    const barRow = document.createElement('div');
    barRow.innerHTML = `
      <div class="d-flex justify-content-between font-size-xs mb-1" style="font-size:0.72rem;">
        <span class="text-secondary fw-semibold">${item.name} (${item.weight}% weight)</span>
        <span class="text-main fw-bold">${roundedVal}%</span>
      </div>
      <div class="progress-bar-container" style="height: 6px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow:hidden;">
        <div class="progress-bar-fill" style="width: 0%; background: var(--primary); height: 100%; transition: width 1s ease-out;" data-target="${roundedVal}"></div>
      </div>
    `;
    barsBox.appendChild(barRow);
  });

  // Animate contribution bars
  setTimeout(() => {
    document.querySelectorAll('#breakdown-bars-box .progress-bar-fill').forEach(bar => {
      const target = bar.getAttribute('data-target');
      bar.style.width = `${target}%`;
    });
  }, 300);

  // Render suggestions checklist
  suggestionsBox.innerHTML = '';
  suggestions.forEach(sug => {
    const li = document.createElement('li');
    li.innerHTML = `
      <i data-lucide="check-circle" style="width:14px; height:14px;"></i>
      <span>${sug}</span>
    `;
    suggestionsBox.appendChild(li);
  });

  if (typeof lucide !== 'undefined') lucide.createIcons();
});
