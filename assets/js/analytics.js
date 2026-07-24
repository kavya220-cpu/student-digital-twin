/* analytics.js */

document.addEventListener('DOMContentLoaded', () => {
  // Fetch Local Storage Profile just for header names sync
  const profileData = localStorage.getItem('nexusED_profile');
  let fallbackName = "Student";
  let fallbackCareer = "AI Student";
  let fallbackAvatarInitials = "ST";

  if (profileData) {
    const profileObj = JSON.parse(profileData);
    fallbackName = profileObj.name || fallbackName;
    fallbackCareer = profileObj.selectedCareer || fallbackCareer;
    fallbackAvatarInitials = fallbackName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    // Populate sidebar user details
    const sidebarRole = document.getElementById('sidebar-user-career');
    if (sidebarRole) sidebarRole.textContent = fallbackCareer;
    
    const sidebarName = document.getElementById('sidebar-user-name');
    if (sidebarName) sidebarName.textContent = fallbackName;

    const sidebarAvatar = document.getElementById('sidebar-user-avatar');
    if (sidebarAvatar) {
      if (profileObj.photo) {
        sidebarAvatar.innerHTML = `<img src="${profileObj.photo}" alt="Student Profile picture">`;
      } else {
        sidebarAvatar.textContent = fallbackAvatarInitials;
      }
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

  // Fetch real analytics data from Java Servlet
  fetch('/api/analytics')
    .then(res => {
      if (!res.ok) throw new Error("Servlet server not active");
      return res.json();
    })
    .then(data => {
      renderAnalytics(data);
    })
    .catch(err => {
      console.warn("[Analytics] Servlet API failed, loading local mocks validation:", err);
      // Mock validation matching standard student dashboard
      const mockData = {
        skillsCompletion: 73,
        totalSkills: 4,
        totalCertificates: 2,
        resumeScore: 82,
        interviewScore: 81,
        readinessScore: 81,
        readinessLevel: "Placement Ready",
        projectStats: { total: 2, completed: 1, ongoing: 1 },
        cgpaTrend: [
          { semester: 1, sgpa: 8.20 },
          { semester: 2, sgpa: 8.55 },
          { semester: 3, sgpa: 8.10 },
          { semester: 4, sgpa: 8.80 }
        ]
      };
      renderAnalytics(mockData);
    });

  function renderAnalytics(data) {
    // 1. Render Skills Completion Bar
    const skillsBar = document.getElementById('skills-progress-bar');
    const skillsLabel = document.getElementById('skills-progress-label');
    if (skillsBar && skillsLabel) {
      skillsLabel.textContent = `${data.skillsCompletion}%`;
      setTimeout(() => {
        skillsBar.style.width = `${data.skillsCompletion}%`;
      }, 150);
    }

    // 2. Render Stat boxes
    document.getElementById('stat-skills-count').textContent = data.totalSkills;
    document.getElementById('stat-certs-count').textContent = data.totalCertificates;
    document.getElementById('stat-projects-count').textContent = data.projectStats.total;

    // 3. Render Profile Assessment Ratings
    document.getElementById('rate-resume-score').textContent = `${data.resumeScore}/100`;
    setTimeout(() => {
      document.getElementById('rate-resume-bar').style.width = `${data.resumeScore}%`;
    }, 200);

    document.getElementById('rate-interview-score').textContent = `${data.interviewScore}/100`;
    setTimeout(() => {
      document.getElementById('rate-interview-bar').style.width = `${data.interviewScore}%`;
    }, 250);

    // 4. Donut Chart (dasharray: 440)
    const donutCircle = document.getElementById('readiness-donut');
    const percentText = document.getElementById('readiness-percent-text');
    const readinessBadge = document.getElementById('readiness-badge');
    
    if (donutCircle && percentText) {
      percentText.textContent = `${data.readinessScore}%`;
      const offset = 440 - (data.readinessScore / 100) * 440;
      setTimeout(() => {
        donutCircle.style.strokeDashoffset = offset;
      }, 300);
    }

    if (readinessBadge) {
      readinessBadge.textContent = data.readinessLevel;
      readinessBadge.className = 'badge-stage-tag';
      if (data.readinessScore < 40) {
        readinessBadge.classList.add('foundation');
      } else if (data.readinessScore < 60) {
        readinessBadge.classList.add('developing');
      } else if (data.readinessScore < 80) {
        readinessBadge.classList.add('ready');
      } else {
        readinessBadge.classList.add('industry');
      }
    }

    // 5. Draw CGPA Trend Line (Semester SGPA)
    const trendPath = document.getElementById('trend-line-path');
    const pointsGroup = document.getElementById('trend-points-group');

    if (trendPath && pointsGroup && data.cgpaTrend && data.cgpaTrend.length > 0) {
      let pathCoords = "";
      pointsGroup.innerHTML = "";

      // We map semesters on X axis from x=50 to x=470
      // We map SGPA on Y axis from y=180 (for SGPA=4) to y=30 (for SGPA=10)
      // Math: y = 180 - ((sgpa - 4.0) / 6.0) * 150
      const spacing = 420 / (data.cgpaTrend.length - 1 || 1);

      data.cgpaTrend.forEach((pt, index) => {
        const x = 50 + (index * spacing);
        const sgpa = parseFloat(pt.sgpa);
        const y = 180 - ((sgpa - 4.0) / 6.0) * 150;

        if (index === 0) {
          pathCoords += `M ${x} ${y}`;
        } else {
          pathCoords += ` L ${x} ${y}`;
        }

        // Add circle node
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", 5);
        circle.setAttribute("class", "chart-point");
        
        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.textContent = `Sem ${pt.semester}: SGPA ${sgpa.toFixed(2)}`;
        circle.appendChild(title);
        
        pointsGroup.appendChild(circle);

        // Add X Axis label text
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x - 15);
        text.setAttribute("y", 200);
        text.setAttribute("fill", "#9CA3AF");
        text.setAttribute("font-size", "9");
        text.textContent = `Sem ${pt.semester}`;
        pointsGroup.appendChild(text);
      });

      trendPath.setAttribute("d", pathCoords);
    }
  }
});
