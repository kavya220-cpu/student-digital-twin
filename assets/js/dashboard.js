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
        window.location.href = 'index.html';
      }, 1500);
    });
  }
});
