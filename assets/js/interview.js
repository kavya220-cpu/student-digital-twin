/* interview.js */

document.addEventListener('DOMContentLoaded', () => {
  // Fetch Local Storage Data
  const profileData = localStorage.getItem('nexusED_profile');
  
  // Guard Clause: Redirect to Profile Setup if not configured
  if (!profileData) {
    window.toast.show('warning', 'Profile Setup Required', 'Please configure your profile twin to access the interview preparation cockpit.', 4000);
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

  // Questions database metadata mapping for progress calculations
  const questionDatabase = [
    // Technical
    { id: "tech1", category: "Technical", subject: "Java", title: "Java Abstract vs Interface" },
    { id: "tech2", category: "Technical", subject: "Java", title: "Java Garbage Collection" },
    { id: "tech3", category: "Technical", subject: "Python", title: "Python Global Interpreter Lock (GIL)" },
    { id: "tech4", category: "Technical", subject: "Python", title: "Python List vs Tuple" },
    { id: "tech5", category: "Technical", subject: "C++", title: "C++ Virtual Functions" },
    { id: "tech6", category: "Technical", subject: "DBMS", title: "DBMS ACID Properties" },
    { id: "tech7", category: "Technical", subject: "SQL", title: "SQL Inner vs Left Joins" },
    { id: "tech8", category: "Technical", subject: "SQL", title: "SQL Group By and Having" },
    { id: "tech9", category: "Technical", subject: "OOP", title: "OOP Four Core Pillars" },
    { id: "tech10", category: "Technical", subject: "Computer Networks", title: "TCP vs UDP Protcols" },
    
    // Coding
    { id: "code1", category: "Coding", subject: "Data Structures", title: "Reverse a Linked List" },
    { id: "code2", category: "Coding", subject: "Data Structures", title: "Detect Loop in Linked List" },
    { id: "code3", category: "Coding", subject: "Algorithms", title: "Binary Search Implementation" },
    { id: "code4", category: "Coding", subject: "Algorithms", title: "Quick Sort vs Merge Sort" },
    { id: "code5", category: "Coding", subject: "Algorithms", title: "Fibonacci Dynamic Programming" },
    { id: "code6", category: "Coding", subject: "Machine Learning", title: "Overfitting vs Underfitting" },
    { id: "code7", category: "Coding", subject: "Machine Learning", title: "Supervised vs Unsupervised" },
    { id: "code8", category: "Coding", subject: "Cloud Computing", title: "SaaS vs PaaS vs IaaS" },

    // HR
    { id: "hr1", category: "HR", subject: "Behavioral", title: "Handling Project Conflict" },
    { id: "hr2", category: "HR", subject: "Behavioral", title: "Describe a Major Failure" },
    { id: "hr3", category: "HR", subject: "Situational", title: "Handling Tight Deadlines" },
    { id: "hr4", category: "HR", subject: "Communication", title: "Explain Tech Concept simply" },
    { id: "hr5", category: "HR", subject: "Leadership", title: "Leading a Diverse Team" },

    // GD
    { id: "gd1", category: "GD", subject: "Technology Trends", title: "AI Impact on Software Jobs" },
    { id: "gd2", category: "GD", subject: "Technology Trends", title: "Web3 and Decentralization" },
    { id: "gd3", category: "GD", subject: "Current Affairs", title: "Remote Work vs Hybrid Models" },
    { id: "gd4", category: "GD", subject: "Business Topics", title: "Gig Economy growth vectors" },

    // Aptitude
    { id: "apt1", category: "Aptitude", subject: "Quantitative Aptitude", title: "Train Speed Calculation" },
    { id: "apt2", category: "Aptitude", subject: "Quantitative Aptitude", title: "Time and Work equations" },
    { id: "apt3", category: "Aptitude", subject: "Quantitative Aptitude", title: "Simple Interest rate" },
    { id: "apt4", category: "Aptitude", subject: "Logical Reasoning", title: "Number Sequence patterns" },
    { id: "apt5", category: "Aptitude", subject: "Logical Reasoning", title: "Blood Relations mapping" },
    { id: "apt6", category: "Aptitude", subject: "Data Interpretation", title: "CAGR formula calculation" }
  ];

  // DOM Elements
  const kpiCompleted = document.getElementById('prep-completed-count');
  const kpiRemaining = document.getElementById('prep-remaining-count');
  const kpiFavorites = document.getElementById('prep-favorites-count');
  const kpiReadiness = document.getElementById('prep-readiness-index');

  const bookmarksBox = document.getElementById('prep-bookmarks-list');

  // Load progress keys from LocalStorage
  const completedList = JSON.parse(localStorage.getItem('nexusED_completed_questions')) || [];
  const bookmarkedList = JSON.parse(localStorage.getItem('nexusED_bookmarked_questions')) || [];

  updateDashboardStats();

  function updateDashboardStats() {
    const totalQs = questionDatabase.length;
    const completedQs = completedList.length;
    const remainingQs = Math.max(totalQs - completedQs, 0);
    const readiness = Math.round((completedQs / totalQs) * 100);

    // Populate KPIs
    kpiCompleted.textContent = completedQs;
    kpiRemaining.textContent = remainingQs;
    kpiFavorites.textContent = bookmarkedList.length;
    kpiReadiness.textContent = `${readiness}%`;

    // Calculate Track completions
    calculateTrackProgress();

    // Populate bookmarks
    renderBookmarks();
  }

  // Calculate percentage progress for each Category
  function calculateTrackProgress() {
    const tracks = {
      Technical: { total: 0, completed: 0, bar: document.querySelector('.technical-fill'), text: document.getElementById('progress-technical-text') },
      Coding: { total: 0, completed: 0, bar: document.querySelector('.coding-fill'), text: document.getElementById('progress-coding-text') },
      HR: { total: 0, completed: 0, bar: document.querySelector('.hr-fill'), text: document.getElementById('progress-hr-text') },
      GD: { total: 0, completed: 0, bar: document.querySelector('.gd-fill'), text: document.getElementById('progress-gd-text') },
      Aptitude: { total: 0, completed: 0, bar: document.querySelector('.aptitude-fill'), text: document.getElementById('progress-aptitude-text') }
    };

    questionDatabase.forEach(q => {
      const cat = q.category; // Technical, Coding, HR, GD, Aptitude
      if (tracks[cat]) {
        tracks[cat].total++;
        if (completedList.includes(q.id)) {
          tracks[cat].completed++;
        }
      }
    });

    // Animate bars
    Object.keys(tracks).forEach(key => {
      const track = tracks[key];
      const pct = track.total > 0 ? Math.round((track.completed / track.total) * 100) : 0;
      
      if (track.text) track.text.textContent = `${pct}%`;
      
      setTimeout(() => {
        if (track.bar) track.bar.style.width = `${pct}%`;
      }, 150);
    });
  }

  // Render bookmarked questions
  function renderBookmarks() {
    bookmarksBox.innerHTML = '';
    
    if (bookmarkedList.length === 0) {
      bookmarksBox.innerHTML = `<p class="text-muted fs-xs text-center py-3">No questions bookmarked yet.</p>`;
      return;
    }

    // Find and draw bookmarked questions details
    bookmarkedList.forEach(qId => {
      const q = questionDatabase.find(item => item.id === qId);
      if (q) {
        const row = document.createElement('a');
        row.className = 'bookmark-link-row';
        row.href = `question-bank.html?subject=${q.subject}&expand=${q.id}`;
        row.innerHTML = `
          <span class="bookmark-title-text text-truncate">${q.title}</span>
          <span class="bookmark-subj-badge">${q.subject}</span>
        `;
        bookmarksBox.appendChild(row);
      }
    });
  }
});
