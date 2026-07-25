/* sidebar.js */

document.addEventListener('DOMContentLoaded', () => {
  const sidebarContainer = document.querySelector('.sidebar');
  if (!sidebarContainer) return;

  // 1. Updated Template HTML representation for auto-injection
  const template = `
    <div class="sidebar-brand">
      <div class="brand-icon-wrapper">
        <i data-lucide="layers"></i>
      </div>
      <span class="brand-name">NexusED</span>
    </div>

    <nav class="sidebar-menu">
      <!-- Core Navigation Link -->
      <a href="dashboard.html" class="sidebar-item" id="nav-dashboard">
        <i data-lucide="layout-dashboard"></i>
        <span>Dashboard</span>
      </a>

      <!-- Expandable Accordion: Learning & Portfolio -->
      <div class="sidebar-accordion-wrapper" id="learning-portfolio-accordion">
        <button type="button" class="sidebar-item sidebar-accordion-trigger" id="nav-learning-portfolio" aria-expanded="false" aria-controls="submenu-learning-portfolio">
          <i data-lucide="graduation-cap"></i>
          <span>Learning & Portfolio</span>
          <i data-lucide="chevron-down" class="accordion-arrow-icon"></i>
        </button>
        
        <div class="sidebar-submenu" id="submenu-learning-portfolio">
          <div class="sidebar-submenu-inner">
            <a href="roadmap.html" class="sidebar-submenu-item" id="nav-roadmap">
              <i data-lucide="compass"></i>
              <span>Roadmap</span>
            </a>
            <a href="skills.html" class="sidebar-submenu-item" id="nav-skills">
              <i data-lucide="award"></i>
              <span>Skill Tracker</span>
            </a>
            <a href="projects.html" class="sidebar-submenu-item" id="nav-projects">
              <i data-lucide="folder"></i>
              <span>Projects</span>
            </a>
            <a href="certificates.html" class="sidebar-submenu-item" id="nav-certificates">
              <i data-lucide="badge-check"></i>
              <span>Certificates</span>
            </a>
            <a href="study-assistant.html" class="sidebar-submenu-item" id="nav-study-assistant">
              <i data-lucide="book-open"></i>
              <span>AI Study Assistant</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Expandable Accordion: Career Hub -->
      <div class="sidebar-accordion-wrapper" id="career-hub-accordion">
        <button type="button" class="sidebar-item sidebar-accordion-trigger" id="nav-career-hub" aria-expanded="false" aria-controls="submenu-career-hub">
          <i data-lucide="briefcase"></i>
          <span>Career Hub</span>
          <i data-lucide="chevron-down" class="accordion-arrow-icon"></i>
        </button>
        
        <div class="sidebar-submenu" id="submenu-career-hub">
          <div class="sidebar-submenu-inner">
            <a href="resume-builder.html" class="sidebar-submenu-item" id="nav-resume-builder">
              <i data-lucide="file-text"></i>
              <span>Resume Builder</span>
            </a>
            <a href="resume-analyzer.html" class="sidebar-submenu-item" id="nav-resume-analyzer">
              <i data-lucide="bar-chart-2"></i>
              <span>Resume Analyzer</span>
            </a>
            <a href="interview.html" class="sidebar-submenu-item" id="nav-interview">
              <i data-lucide="help-circle"></i>
              <span>Interview Prep</span>
            </a>
            <a href="mock-interview.html" class="sidebar-submenu-item" id="nav-mock-interview">
              <i data-lucide="mic"></i>
              <span>AI Mock Interview</span>
            </a>
            <a href="opportunity-hub.html" class="sidebar-submenu-item" id="nav-opportunity-hub">
              <i data-lucide="compass"></i>
              <span>Opportunity Hub</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Performance & Goal Tracking Group -->
      <a href="coding-tracker.html" class="sidebar-item" id="nav-coding-tracker">
        <i data-lucide="code"></i>
        <span>Coding Tracker</span>
      </a>
      <a href="career-readiness.html" class="sidebar-item" id="nav-career-readiness">
        <i data-lucide="trending-up"></i>
        <span>Career Readiness</span>
      </a>
      <a href="recommendations.html" class="sidebar-item" id="nav-recommendations">
        <i data-lucide="sparkles"></i>
        <span>Recommendations</span>
      </a>
      <a href="daily-goals.html" class="sidebar-item" id="nav-daily-goals">
        <i data-lucide="list-todo"></i>
        <span>Daily Goals</span>
      </a>
      <a href="analytics.html" class="sidebar-item" id="nav-analytics">
        <i data-lucide="pie-chart"></i>
        <span>Analytics</span>
      </a>
      <a href="about.html" class="sidebar-item" id="nav-about">
        <i data-lucide="info"></i>
        <span>About NexusED</span>
      </a>
    </nav>

    <div class="sidebar-user mt-auto">
      <div class="user-avatar" id="sidebar-user-avatar"></div>
      <div class="user-info">
        <span class="user-name text-truncate" id="sidebar-user-name">Loading...</span>
        <span class="user-role text-truncate" id="sidebar-user-career">AI Student</span>
      </div>
      <button type="button" class="logout-btn ms-auto" id="logout-trigger" aria-label="Sign out">
        <i data-lucide="log-out"></i>
      </button>
    </div>
  `;

  // Inject template to sidebar container
  sidebarContainer.innerHTML = template;

  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Accordions Reference Map
  const accordions = {
    'learning-portfolio': {
      wrapper: document.getElementById('learning-portfolio-accordion'),
      trigger: document.getElementById('nav-learning-portfolio'),
      submenu: document.getElementById('submenu-learning-portfolio'),
      storageKey: 'nexusED_learning_portfolio_expanded'
    },
    'career-hub': {
      wrapper: document.getElementById('career-hub-accordion'),
      trigger: document.getElementById('nav-career-hub'),
      submenu: document.getElementById('submenu-career-hub'),
      storageKey: 'nexusED_career_hub_expanded'
    }
  };

  // Load User Details from Profile Storage
  const profileData = localStorage.getItem('nexusED_profile');
  if (profileData) {
    const profile = JSON.parse(profileData);
    const userName = document.getElementById('sidebar-user-name');
    const userRole = document.getElementById('sidebar-user-career');
    const userAvatar = document.getElementById('sidebar-user-avatar');

    if (userName) userName.textContent = profile.name || "Student";
    if (userRole) userRole.textContent = profile.selectedCareer || "AI Student";
    if (userAvatar) {
      if (profile.photo) {
        userAvatar.innerHTML = `<img src="${profile.photo}" alt="Student Profile picture">`;
      } else {
        const initials = (profile.name || "ST").split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        userAvatar.textContent = initials;
      }
    }
  }

  // Bind accordion actions with Mutual Exclusion
  Object.keys(accordions).forEach(key => {
    const acc = accordions[key];
    if (acc.trigger && acc.submenu) {
      acc.trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const isExpanded = acc.trigger.getAttribute('aria-expanded') === 'true';
        setAccordionState(key, !isExpanded);
      });
    }
  });

  // Accordion State Toggle Manager
  function setAccordionState(key, expand) {
    const acc = accordions[key];
    if (!acc) return;

    acc.trigger.setAttribute('aria-expanded', expand ? 'true' : 'false');
    if (expand) {
      acc.submenu.classList.add('expanded');
      localStorage.setItem(acc.storageKey, 'true');

      // Collapse other accordions (Mutual Exclusion)
      Object.keys(accordions).forEach(otherKey => {
        if (otherKey !== key) {
          setAccordionState(otherKey, false);
        }
      });
    } else {
      acc.submenu.classList.remove('expanded');
      localStorage.setItem(acc.storageKey, 'false');
    }
  }

  // 3. Highlight Active Menu Tab
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1);

  // Clear previous states
  document.querySelectorAll('.sidebar-item, .sidebar-submenu-item').forEach(el => {
    el.classList.remove('active');
  });

  // Selector map targeting active page route
  const activeSelectors = {
    'dashboard.html': '#nav-dashboard',
    'roadmap.html': '#nav-roadmap',
    'skills.html': '#nav-skills',
    'projects.html': '#nav-projects',
    'certificates.html': '#nav-certificates',
    'resume-builder.html': '#nav-resume-builder',
    'resume-analyzer.html': '#nav-resume-analyzer',
    'interview.html': '#nav-interview',
    'mock-interview.html': '#nav-mock-interview',
    'opportunity-hub.html': '#nav-opportunity-hub',
    'coding-tracker.html': '#nav-coding-tracker',
    'career-readiness.html': '#nav-career-readiness',
    'recommendations.html': '#nav-recommendations',
    'daily-goals.html': '#nav-daily-goals',
    'analytics.html': '#nav-analytics',
    'about.html': '#nav-about'
  };

  const activeId = activeSelectors[page];
  if (activeId) {
    const activeEl = document.getElementById(activeId.replace('#', ''));
    if (activeEl) {
      activeEl.classList.add('active');

      // Expand matching parent accordion on load
      if (activeEl.classList.contains('sidebar-submenu-item')) {
        const parentWrapper = activeEl.closest('.sidebar-accordion-wrapper');
        if (parentWrapper) {
          parentWrapper.classList.add('has-active-child');
          const accKey = parentWrapper.id.replace('-accordion', '');
          setAccordionState(accKey, true);
        }
      }
    }
  } else {
    // Restore saved open states on non-mapped pages
    Object.keys(accordions).forEach(key => {
      const saved = localStorage.getItem(accordions[key].storageKey);
      if (saved === 'true') {
        setAccordionState(key, true);
      }
    });
  }

  // 4. Logout trigger handling
  const logoutTrigger = document.getElementById('logout-trigger');
  if (logoutTrigger) {
    logoutTrigger.addEventListener('click', () => {
      localStorage.removeItem('nexusED_profile');
      window.toast.show('info', 'Signed Out', 'Tearing down twin session...', 2500);
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    });
  }
});
