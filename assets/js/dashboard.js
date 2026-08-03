/* dashboard.js */

document.addEventListener('DOMContentLoaded', () => {
  // Fetch Local Storage Data (Fallback guard)
  const profileData = localStorage.getItem('nexusED_profile');
  
  // Guard Clause: Redirect to Profile Setup if not configured locally and servlet is offline
  if (!profileData) {
    // We check if servlet is online first. If not, redirect.
    checkServletStatus().then(online => {
      if (!online) {
        window.toast.show('warning', 'Profile Setup Required', 'Please configure your profile twin to access the dashboard.', 4000);
        setTimeout(() => {
          window.location.href = 'profile.html';
        }, 1500);
      }
    });
  }

  // Setup cursor glow tracking
  document.addEventListener('mousemove', (e) => {
    const glow = document.querySelector('.cursor-glow');
    if (glow) {
      window.requestAnimationFrame(() => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      });
    }
  });

  // Load dashboard from Servlets
  loadDashboardData();
  loadDashboardOpportunities();

  function loadDashboardOpportunities() {
    const listEl = document.getElementById('dash-opportunities-list');
    if (!listEl) return;
    
    const API_BASE = window.location.port === '5500' ? 'http://localhost:8080' : '';
    
    fetch(API_BASE + '/api/opportunities?lat=12.9716&lng=77.5946&userId=1')
      .then(res => res.json())
      .then(data => {
        const events = data.recommended || data.events || [];
        renderDashboardOpportunityList(events);
      })
      .catch(err => {
        console.warn("[Dashboard] Opportunities servlet offline. Falling back to local mock listings.", err);
        // Load fallback mock list
        const fallbackList = [
          {
            title: "National Hackathon 2026",
            organizer: "TechLabs",
            location: "Bangalore, India",
            mode: "Offline",
            registrationDeadline: "2026-08-10",
            category: "Hackathon",
            companyLogo: "assets/images/techlabs.png"
          },
          {
            title: "Advanced Web Development",
            organizer: "Vercel Devs",
            location: "Online",
            mode: "Online",
            registrationDeadline: "2026-08-19",
            category: "Workshop",
            companyLogo: "assets/images/vercel.png"
          },
          {
            title: "Java Cloud Bootcamp",
            organizer: "Oracle Academy",
            location: "Bangalore, India",
            mode: "Hybrid",
            registrationDeadline: "2026-08-28",
            category: "Bootcamp",
            companyLogo: "assets/images/oracle.png"
          }
        ];
        renderDashboardOpportunityList(fallbackList);
      });

    function renderDashboardOpportunityList(events) {
      listEl.innerHTML = '';
      if (events.length === 0) {
        listEl.innerHTML = `
          <div class="col-12 text-center py-4">
            <p class="text-muted" style="font-size: 0.85rem;">No opportunities synced. Go to the Opportunity Hub to refresh.</p>
          </div>
        `;
        return;
      }

      events.slice(0, 3).forEach(e => {
        const col = document.createElement('div');
        col.className = 'col-md-4';
        
        const deadlineText = e.registrationDeadline ? `Deadline: ${e.registrationDeadline}` : 'No deadline';

        col.innerHTML = `
          <div class="opportunity-card" style="box-shadow: var(--shadow-sm); display: flex; flex-direction: column; height: 100%;">
            <div class="card-banner" style="background-image: url('${e.companyLogo || "assets/images/hackathon-banner.jpg"}'); height: 120px;">
              <div class="card-banner-overlay"></div>
              <span class="card-badge badge-${e.category.toLowerCase().replace(' ', '-')}" style="top: 8px; left: 8px; padding: 4px 8px; font-size: 0.7rem;">${e.category}</span>
            </div>
            <div class="card-body-content" style="padding: 12px 16px 16px 16px; display: flex; flex-direction: column; flex-grow: 1;">
              <h4 class="card-title text-truncate mb-1" style="font-size: 0.95rem; height: auto; -webkit-line-clamp: 1; min-height: unset; margin: 0;">${e.title}</h4>
              <span class="card-organizer mb-2" style="font-size: 0.75rem;">by ${e.organizer}</span>
              
              <div class="card-meta-list mb-3" style="gap: 4px;">
                <div class="meta-item" style="font-size: 0.75rem;">
                  <i data-lucide="map-pin" style="width: 12px; height: 12px;"></i>
                  <span>${e.location} (${e.mode})</span>
                </div>
                <div class="meta-item" style="font-size: 0.75rem;">
                  <i data-lucide="hourglass" style="width: 12px; height: 12px; color: var(--danger);"></i>
                  <span class="text-danger">${deadlineText}</span>
                </div>
              </div>

              <a href="opportunity-hub.html" class="btn-premium btn-premium-primary text-center text-decoration-none py-2 d-block mt-auto" style="font-size: 0.75rem; font-weight:600;">
                View & Register
              </a>
            </div>
          </div>
        `;
        listEl.appendChild(col);
      });

      if (typeof lucide !== 'undefined') lucide.createIcons({ node: listEl });
    }
  }

  function checkServletStatus() {
    return fetch('/api/dashboard')
      .then(res => res.ok)
      .catch(() => false);
  }

  function loadDashboardData() {
    fetch('/api/dashboard')
      .then(res => {
        if (!res.ok) throw new Error("Servlet server not active");
        return res.json();
      })
      .then(data => {
        renderDashboard(data);
      })
      .catch(err => {
        console.warn("[Dashboard] Servlet offline. Loading fallback local storage mocks:", err);
        // Local storage fallback
        loadLocalStorageMocks();
      });
  }

  function renderDashboard(data) {
    // 1. Populate Profile details
    document.getElementById('dash-student-name').textContent = data.profile.name;
    document.getElementById('hud-profile-name').textContent = data.profile.name;
    document.getElementById('hud-profile-career').textContent = data.profile.selectedCareer;
    
    const sidebarRole = document.getElementById('sidebar-user-career');
    if (sidebarRole) sidebarRole.textContent = data.profile.selectedCareer;
    
    const sidebarName = document.getElementById('sidebar-user-name');
    if (sidebarName) sidebarName.textContent = data.profile.name;

    document.getElementById('hud-college').textContent = "NexusED University";
    document.getElementById('hud-branch').textContent = "Computer Science & Eng";
    document.getElementById('hud-sem-year').textContent = "Sem 4 / Year 2";
    document.getElementById('hud-roll').textContent = "NEX-2026-101";
    document.getElementById('hud-cgpa').textContent = data.profile.cgpa.toFixed(2);

    // Avatar Images Load
    const avatarElements = [
      document.getElementById('sidebar-user-avatar'),
      document.getElementById('hud-avatar-box')
    ];
    avatarElements.forEach(el => {
      if (!el) return;
      // Initials fallback
      const initials = data.profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      el.textContent = initials;
    });

    // 2. Metrics Counts Sync
    document.getElementById('dash-skills-count').textContent = data.skillsCount;
    document.getElementById('dash-projects-count').textContent = data.projectsCount;
    document.getElementById('dash-certs-count').textContent = data.certsCount;

    // 3. Overall Readiness progress ring
    animateProgressRing(data.readiness.score);

    // 4. Render Linear Progress Bars (Static mock skills list for layout)
    const linearList = document.getElementById('dash-linear-progress-list');
    if (linearList) {
      linearList.innerHTML = `
        <div class="linear-progress-item">
          <div class="linear-progress-info">
            <span class="linear-progress-title">Java Core Programming <span class="badge-level fs-xs ms-1 text-muted">(Expert)</span></span>
            <span class="linear-progress-value">95%</span>
          </div>
          <div class="linear-progress-track"><div class="linear-progress-fill" style="width: 95%"></div></div>
        </div>
        <div class="linear-progress-item">
          <div class="linear-progress-info">
            <span class="linear-progress-title">SQL & DBMS Foundations <span class="badge-level fs-xs ms-1 text-muted">(Intermediate)</span></span>
            <span class="linear-progress-value">80%</span>
          </div>
          <div class="linear-progress-track"><div class="linear-progress-fill" style="width: 80%"></div></div>
        </div>
        <div class="linear-progress-item">
          <div class="linear-progress-info">
            <span class="linear-progress-title">Python & ML Basics <span class="badge-level fs-xs ms-1 text-muted">(Intermediate)</span></span>
            <span class="linear-progress-value">60%</span>
          </div>
          <div class="linear-progress-track"><div class="linear-progress-fill" style="width: 60%"></div></div>
        </div>
      `;
    }
  }

  function loadLocalStorageMocks() {
    if (!profileData) return;
    const profile = JSON.parse(profileData);
    const skills = JSON.parse(localStorage.getItem('nexusED_skills')) || [];
    const projects = JSON.parse(localStorage.getItem('nexusED_projects')) || [];
    const certificates = JSON.parse(localStorage.getItem('nexusED_certificates')) || [];

    document.getElementById('dash-student-name').textContent = profile.name;
    document.getElementById('hud-profile-name').textContent = profile.name;
    document.getElementById('hud-profile-career').textContent = profile.selectedCareer || "AI Student";
    
    const sidebarRole = document.getElementById('sidebar-user-career');
    if (sidebarRole) sidebarRole.textContent = profile.selectedCareer || "AI Student";
    
    const sidebarName = document.getElementById('sidebar-user-name');
    if (sidebarName) sidebarName.textContent = profile.name;

    document.getElementById('hud-college').textContent = profile.college || 'Not Linked';
    document.getElementById('hud-branch').textContent = profile.branch || 'Not Linked';
    
    const semText = profile.semester ? `Sem ${profile.semester}` : 'Sem -';
    const yearText = profile.year ? `Year ${profile.year}` : 'Year -';
    document.getElementById('hud-sem-year').textContent = `${semText} / ${yearText}`;
    document.getElementById('hud-roll').textContent = profile.roll || '-';
    document.getElementById('hud-cgpa').textContent = profile.cgpa ? parseFloat(profile.cgpa).toFixed(2) : '-';

    const avatarElements = [
      document.getElementById('sidebar-user-avatar'),
      document.getElementById('hud-avatar-box')
    ];
    avatarElements.forEach(el => {
      if (!el) return;
      if (profile.photo) {
        el.innerHTML = `<img src="${profile.photo}" alt="Student Profile picture">`;
      } else {
        const initials = profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        el.textContent = initials;
      }
    });

    document.getElementById('dash-skills-count').textContent = skills.length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;
    document.getElementById('dash-projects-count').textContent = completedProjects;
    document.getElementById('dash-certs-count').textContent = certificates.length;

    let skillsAvg = 0;
    if (skills.length > 0) {
      const skillsSum = skills.reduce((sum, s) => sum + s.progress, 0);
      skillsAvg = skillsSum / skills.length;
    }
    const projWeight = projects.length > 0 ? (completedProjects / projects.length) * 100 : 0;
    const certWeight = Math.min(100, certificates.length * 20);
    const overallSync = Math.round((skillsAvg * 0.5) + (projWeight * 0.3) + (certWeight * 0.2));

    animateProgressRing(overallSync);

    // Top 3 skills progress render
    const linearList = document.getElementById('dash-linear-progress-list');
    if (linearList) {
      linearList.innerHTML = '';
      const sortedSkills = [...skills].sort((a, b) => b.progress - a.progress).slice(0, 3);
      if (sortedSkills.length === 0) {
        linearList.innerHTML = `<p class="text-muted text-center py-3" style="font-size:0.85rem;">No skills registered.</p>`;
      } else {
        sortedSkills.forEach(s => {
          const item = document.createElement('div');
          item.className = 'linear-progress-item';
          item.innerHTML = `
            <div class="linear-progress-info">
              <span class="linear-progress-title">${s.name} <span class="badge-level fs-xs ms-1 text-muted">(${s.level})</span></span>
              <span class="linear-progress-value">${s.progress}%</span>
            </div>
            <div class="linear-progress-track">
              <div class="linear-progress-fill" style="width: 0%"></div>
            </div>
          `;
          linearList.appendChild(item);
          setTimeout(() => {
            const fill = item.querySelector('.linear-progress-fill');
            if (fill) fill.style.width = `${s.progress}%`;
          }, 150);
        });
      }
    }
  }

  // Progress ring animator (dasharray: 477.5)
  function animateProgressRing(percent) {
    const ringBar = document.getElementById('dash-progress-ring-bar');
    const ringText = document.getElementById('dash-progress-ring-text');
    if (!ringBar || !ringText) return;

    const radius = 76;
    const circumference = 2 * Math.PI * radius;
    
    const svgEl = document.querySelector('.progress-ring-svg');
    if (svgEl && !svgEl.querySelector('defs')) {
      svgEl.insertAdjacentHTML('afterbegin', `
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="var(--primary)" />
            <stop offset="100%" stop-color="var(--secondary)" />
          </linearGradient>
        </defs>
      `);
    }

    const offset = circumference - (percent / 100) * circumference;
    ringBar.style.strokeDashoffset = offset;

    let currentPercent = 0;
    const interval = setInterval(() => {
      if (currentPercent >= percent) {
        ringText.textContent = `${percent}%`;
        clearInterval(interval);
      } else {
        currentPercent++;
        ringText.textContent = `${currentPercent}%`;
      }
    }, 15);
  }

  // Logout trigger
  const logoutBtn = document.getElementById('logout-trigger');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('nexusED_profile');
      window.toast.show('info', 'Signed Out', 'Tearing down twin session...', 2500);
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
    });
  }

  // --- Achievements Widget Logic ---
  function loadAchievements() {
    const API_BASE = window.location.port === '5500' ? 'http://localhost:8080' : '';
    fetch(API_BASE + '/api/achievements?userId=1')
      .then(res => {
        if (!res.ok) throw new Error("Achievements servlet offline");
        return res.json();
      })
      .then(data => {
        renderAchievements(data);
      })
      .catch(err => {
        console.warn("[Dashboard] Achievements servlet offline. Loading fallback mocks.", err);
        const fallback = {
          totalXp: 135,
          currentLevel: 2,
          nextLevelXpThreshold: 100,
          nextLevelProgress: 35,
          achievements: [
            { badge_name: 'First Login', badge_icon: '🏅', category: 'Academic', description: 'Successfully logged into NexusED.', xp: 10, earned_date: '2026-07-24', status: 'Unlocked' },
            { badge_name: 'Coding Explorer', badge_icon: '💻', category: 'Coding', description: 'Solved your first coding problem.', xp: 15, earned_date: '2026-07-24', status: 'Unlocked' },
            { badge_name: 'Resume Ready', badge_icon: '📄', category: 'Resume', description: 'Generated your first professional resume.', xp: 50, earned_date: '2026-07-25', status: 'Unlocked' },
            { badge_name: 'Interview Beginner', badge_icon: '🎤', category: 'Interview', description: 'Completed your first mock interview.', xp: 60, earned_date: '2026-07-25', status: 'Unlocked' },
            { badge_name: 'Java Master', badge_icon: '🏆', category: 'Academic', description: 'Reached Advanced level in Java.', xp: 100, earned_date: null, status: 'Locked' },
            { badge_name: 'Cloud Explorer', badge_icon: '☁', category: 'Certificates', description: 'Completed Google Cloud Certification.', xp: 150, earned_date: null, status: 'Locked' },
            { badge_name: 'AI Learner', badge_icon: '🚀', category: 'Roadmap', description: 'Completed AI Engineer Roadmap Milestone.', xp: 80, earned_date: null, status: 'Locked' },
            { badge_name: 'Placement Ready', badge_icon: '🎯', category: 'Career', description: 'Career Readiness Index reached Industry Ready.', xp: 200, earned_date: null, status: 'Locked' }
          ]
        };
        renderAchievements(fallback);
      });
  }

  function renderAchievements(data) {
    const grid = document.getElementById('achievements-badges-grid');
    if (!grid) return;

    // 1. Update Mini XP Progress Ring
    document.getElementById('xp-count-display').textContent = `${data.totalXp} XP`;
    document.getElementById('xp-current-level').textContent = data.currentLevel;
    
    const circle = document.getElementById('xp-progress-circle');
    if (circle) {
      const radius = 13;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (data.nextLevelProgress / 100) * circumference;
      circle.style.strokeDasharray = `${circumference}`;
      circle.style.strokeDashoffset = `${offset}`;
    }

    // 2. Populate Badges Grid
    grid.innerHTML = '';
    data.achievements.forEach(a => {
      const col = document.createElement('div');
      col.className = 'col-md-6';
      
      const isLocked = a.status.toLowerCase() === 'locked';
      const statusClass = isLocked ? 'locked' : 'unlocked';
      const desc = isLocked ? 'Complete required milestone to unlock.' : a.description;
      const dateText = !isLocked && a.earned_date ? `<span class="badge-description text-muted mt-1" style="font-size: 8px;">Earned: ${a.earned_date}</span>` : '';

      col.innerHTML = `
        <div class="achievement-badge-card ${statusClass}">
          <div class="badge-icon-box">${a.badge_icon}</div>
          <div class="badge-meta">
            <span class="badge-category">${a.category}</span>
            <span class="badge-name">${a.badge_name}</span>
            <span class="badge-description mt-0.5">${desc}</span>
            ${dateText}
            <span class="badge-xp-tag">+ ${a.xp} XP</span>
          </div>
          ${isLocked ? `<div class="lock-overlay"><i data-lucide="lock" style="width:12px; height:12px;"></i></div>` : ''}
        </div>
      `;
      grid.appendChild(col);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons({ node: grid });
  }

  // --- Growth Timeline Widget Logic ---
  let timelineMilestones = [];

  function loadTimeline() {
    const API_BASE = window.location.port === '5500' ? 'http://localhost:8080' : '';
    fetch(API_BASE + '/api/timeline?userId=1')
      .then(res => {
        if (!res.ok) throw new Error("Timeline servlet offline");
        return res.json();
      })
      .then(data => {
        timelineMilestones = data;
        renderTimeline('all');
      })
      .catch(err => {
        console.warn("[Dashboard] Timeline servlet offline. Loading fallback mocks.", err);
        timelineMilestones = [
          { title: 'Joined NexusED', description: 'Initialized twin profile mapping parameters.', category: 'Achievements', event_date: '2026-07-24', related_module: 'Dashboard', completion_percentage: 10 },
          { title: 'Created Student Profile', description: 'Completed basic profile twin setup metrics.', category: 'Academic', event_date: '2026-07-24', related_module: 'Profile', completion_percentage: 20 },
          { title: 'Selected Career Goal', description: 'Set professional target to AI Engineer.', category: 'Career', event_date: '2026-07-24', related_module: 'Roadmap', completion_percentage: 30 },
          { title: 'Completed Java Basics', description: 'Finished syntax and inheritance fundamentals.', category: 'Skills', event_date: '2026-07-24', related_module: 'Skill Tracker', completion_percentage: 45 },
          { title: 'Learned SQL', description: 'Gained basic understanding of database relations.', category: 'Skills', event_date: '2026-07-24', related_module: 'Skill Tracker', completion_percentage: 55 },
          { title: 'Completed Google Cloud Certificate', description: 'Obtained verified GCP Foundational badge.', category: 'Certificates', event_date: '2026-07-25', related_module: 'Certificates', completion_percentage: 65 },
          { title: 'Built Smart Complaint Project', description: 'Deployed intelligent classifier solution with Github sync.', category: 'Projects', event_date: '2026-07-25', related_module: 'Projects', completion_percentage: 75 },
          { title: 'Completed Mock Interview', description: 'Passed initial Technical Screening session successfully.', category: 'Interview', event_date: '2026-07-25', related_module: 'AI Mock Interview', completion_percentage: 80 },
          { title: 'Resume ATS Score Improved to 86%', description: 'Enhanced resume keywords optimization.', category: 'Resume', event_date: '2026-07-25', related_module: 'Resume Analyzer', completion_percentage: 85 },
          { title: 'Solved 100 Coding Problems', description: 'Milestone completed in Coding Tracker.', category: 'Coding', event_date: '2026-07-26', related_module: 'Coding Tracker', completion_percentage: 90 },
          { title: 'Career Readiness reached 78%', description: 'Graduated to placement readiness stage.', category: 'Career', event_date: '2026-07-26', related_module: 'Career Readiness', completion_percentage: 95 },
          { title: 'Industry Ready', description: 'Unlocked peak technical alignment metrics.', category: 'Achievements', event_date: '2026-07-26', related_module: 'Career Readiness', completion_percentage: 100 }
        ];
        renderTimeline('all');
      });

    setupTimelineFilters();
  }

  function renderTimeline(filterCategory) {
    const list = document.getElementById('timeline-milestones-list');
    if (!list) return;

    list.innerHTML = '';
    const filtered = timelineMilestones.filter(m => {
      if (filterCategory === 'all') return true;
      return m.category.toLowerCase() === filterCategory.toLowerCase();
    });

    if (filtered.length === 0) {
      list.innerHTML = `
        <div class="text-center py-4">
          <p class="text-muted fs-xs">No milestones logged for this category.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(m => {
      const node = document.createElement('div');
      node.className = 'timeline-milestone-node animate__animated animate__fadeInUp';
      
      const moduleBadge = m.related_module ? `<span class="timeline-module-tag ms-2">${m.related_module}</span>` : '';

      node.innerHTML = `
        <div class="timeline-bullet"></div>
        <div class="timeline-milestone-card">
          <div class="timeline-card-category">${m.category}</div>
          <div class="timeline-card-header">
            <h4 class="timeline-card-title">${m.title}</h4>
            <span class="timeline-card-date">${m.event_date}</span>
          </div>
          <p class="timeline-card-description">${m.description}</p>
          <div class="d-flex align-items-center">
            <span class="text-white text-[9px] fw-bold">Progress: ${m.completion_percentage}%</span>
            ${moduleBadge}
          </div>
          <div class="timeline-progress-track">
            <div class="timeline-progress-fill" style="width: ${m.completion_percentage}%"></div>
          </div>
        </div>
      `;
      list.appendChild(node);
    });

    // Update vertical line height dynamically
    setTimeout(() => {
      const line = document.getElementById('timeline-line');
      if (line && list) {
        line.style.height = `${list.scrollHeight - 20}px`;
      }
    }, 100);
  }

  function setupTimelineFilters() {
    const wrapper = document.getElementById('timeline-category-filters');
    if (!wrapper) return;

    wrapper.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        wrapper.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterVal = btn.getAttribute('data-filter');
        renderTimeline(filterVal);
      });
    });
  }

  // Self-execute startup loaders
  loadAchievements();
  loadTimeline();
});
