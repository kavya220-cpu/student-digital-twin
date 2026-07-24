/* resume-analyzer.js */

document.addEventListener('DOMContentLoaded', () => {
  // Fetch Local Storage Data
  const profileData = localStorage.getItem('nexusED_profile');
  
  // Guard Clause: Redirect to Profile Setup if not configured
  if (!profileData) {
    window.toast.show('warning', 'Profile Setup Required', 'Please configure your profile twin to access the resume analyzer.', 4000);
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

  // DOM elements
  const dropzone = document.getElementById('resume-dropzone');
  const fileInput = document.getElementById('resume-file-input');
  const scanLoader = document.getElementById('analyzer-scan-loader');
  
  const ringAts = document.getElementById('ring-ats');
  const ringCompletion = document.getElementById('ring-completion');
  const textAts = document.getElementById('text-ats');
  const textCompletion = document.getElementById('text-completion');
  
  const labelStrength = document.getElementById('label-strength');
  const textSectionsCount = document.getElementById('text-sections-count');
  
  const listStrengths = document.getElementById('list-strengths');
  const listWeaknesses = document.getElementById('list-weaknesses');
  const checklistBox = document.getElementById('checklist-box');

  const btnAnalyzeGenerated = document.getElementById('btn-analyze-generated');

  // Trigger uploader file explorer click
  dropzone.addEventListener('click', () => {
    fileInput.click();
  });

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  ['dragleave', 'dragend', 'drop'].forEach(evt => {
    dropzone.addEventListener(evt, () => {
      dropzone.classList.remove('dragover');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      runAnalyzerLoader(file.name);
    }
  });

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
      runAnalyzerLoader(file.name);
    }
  });

  // Analyze Generated Resume button click
  btnAnalyzeGenerated.addEventListener('click', () => {
    const builderData = localStorage.getItem('nexusED_resume_data');
    if (!builderData) {
      window.toast.show('warning', 'No Resume Found', 'Please fill out some builder parameters first before running the analysis.', 4000);
      return;
    }
    runAnalyzerLoader("Generated Builder Resume");
  });

  // Run simulated rule-based scanner
  function runAnalyzerLoader(sourceName) {
    dropzone.style.display = 'none';
    scanLoader.style.display = 'block';

    setTimeout(() => {
      scanLoader.style.display = 'none';
      dropzone.style.display = 'block';

      // Load builder data or mock fallback data
      let resume = {
        name: profile.name,
        title: profile.selectedCareer,
        email: profile.email || "",
        phone: profile.phone || "",
        linkedin: "",
        github: "",
        summary: "",
        techSkills: "",
        softSkills: "",
        education: [],
        projects: [],
        certifications: [],
        experience: [],
        achievements: []
      };

      const builderData = localStorage.getItem('nexusED_resume_data');
      if (builderData && sourceName === "Generated Builder Resume") {
        resume = JSON.parse(builderData);
      } else {
        // Mock fallback parsed file attributes
        resume.email = "candidate@nexused.edu";
        resume.phone = "+91 98765 43210";
        resume.summary = "A calibrated trainee engineer specializing in target software structures.";
        resume.techSkills = "Python, Java, OOP, SQL";
        resume.education = [{ school: profile.college || "Nexus Tech", degree: "B.Tech", year: "2026", cgpa: "8.5" }];
        resume.projects = [{ name: "Growth Analyzer Dashboard", desc: "Automated analysis tool", tech: "Java, JS" }];
      }

      evaluateResumeATS(resume);
      window.toast.show('success', 'Analysis Complete', `ATS evaluation generated from '${sourceName}'.`, 3000);
    }, 2200);
  }

  // Core Rule-Based Evaluator
  function evaluateResumeATS(resume) {
    let score = 0;
    let completedCount = 0;
    const totalSections = 8;

    let strengths = [];
    let weaknesses = [];
    let suggestions = [];

    // 1. Personal Details
    if (resume.email && resume.phone) {
      score += 15;
      completedCount++;
      strengths.push("Contact credentials are fully present.");
    } else {
      weaknesses.push("Missing complete email and phone contacts.");
      suggestions.push({ text: "Add direct contact details (email/phone)", value: 15 });
    }

    if (resume.linkedin || resume.github) {
      score += 10;
      strengths.push("Social profiles (GitHub/LinkedIn) are linked.");
    } else {
      weaknesses.push("No GitHub or LinkedIn URLs identified.");
      suggestions.push({ text: "Link GitHub Profile & LinkedIn URL", value: 10 });
    }

    // 2. Summary
    if (resume.summary && resume.summary.trim() !== "") {
      completedCount++;
      if (resume.summary.trim().length > 100) {
        score += 15;
        strengths.push("Detailed professional summary statement.");
      } else {
        score += 5;
        weaknesses.push("Summary statement is too brief.");
        suggestions.push({ text: "Expand professional summary to show core values", value: 10 });
      }
    } else {
      weaknesses.push("Summary section is completely missing.");
      suggestions.push({ text: "Write professional summary statement", value: 15 });
    }

    // 3. Skills
    const techCount = resume.techSkills ? resume.techSkills.split(',').length : 0;
    if (techCount > 0) {
      completedCount++;
      if (techCount >= 4) {
        score += 15;
        strengths.push("Comprehensive technical skills listed.");
      } else {
        score += 8;
        weaknesses.push("Very few technical skills identified.");
        suggestions.push({ text: "List at least 4 key technical skills", value: 7 });
      }
    } else {
      weaknesses.push("Technical skills section is missing.");
      suggestions.push({ text: "Add core technical skills to skills section", value: 15 });
    }

    // 4. Education
    if (resume.education && resume.education.length > 0) {
      completedCount++;
      score += 15;
      strengths.push("Academic background details are present.");
    } else {
      weaknesses.push("No education qualifications listed.");
      suggestions.push({ text: "Add college education and GPA", value: 15 });
    }

    // 5. Projects
    if (resume.projects && resume.projects.length > 0) {
      completedCount++;
      if (resume.projects.length >= 2) {
        score += 15;
        strengths.push("Robust projects portfolio showing development skill.");
      } else {
        score += 8;
        weaknesses.push("Only one project listed in portfolio.");
        suggestions.push({ text: "Include at least two engineering projects", value: 7 });
      }
    } else {
      weaknesses.push("Projects portfolio is missing.");
      suggestions.push({ text: "Include software projects in portfolio", value: 15 });
    }

    // 6. Certifications
    if (resume.certifications && resume.certifications.length > 0) {
      completedCount++;
      score += 10;
      strengths.push("Verified professional certifications listed.");
    } else {
      weaknesses.push("No certifications listed.");
      suggestions.push({ text: "Add verified certifications from Google or Microsoft", value: 10 });
    }

    // 7. Experience / Internships
    if (resume.experience && resume.experience.length > 0) {
      completedCount++;
      score += 5;
      strengths.push("Work experience / internships are listed.");
    } else {
      weaknesses.push("No internships or work experiences listed.");
      suggestions.push({ text: "List internship roles or field projects", value: 5 });
    }

    // 8. Achievements
    if (resume.achievements && resume.achievements.length > 0) {
      completedCount++;
      strengths.push("Academic achievements and accolades are present.");
    } else {
      suggestions.push({ text: "Add quantified achievements and honors", value: 5 });
    }

    // Render Lists
    renderLists(strengths, weaknesses);
    
    // Render dynamic optimization checklist
    renderChecklist(suggestions, score, completedCount, totalSections);
  }

  function renderLists(strengths, weaknesses) {
    listStrengths.innerHTML = '';
    if (strengths.length === 0) {
      listStrengths.innerHTML = `<li class="text-muted fs-xs">No specific strengths detected.</li>`;
    } else {
      strengths.forEach(s => {
        const li = document.createElement('li');
        li.innerHTML = `<i data-lucide="check" style="width:14px; height:14px; flex-shrink:0;"></i><span>${s}</span>`;
        listStrengths.appendChild(li);
      });
    }

    listWeaknesses.innerHTML = '';
    if (weaknesses.length === 0) {
      listWeaknesses.innerHTML = `<li class="text-muted fs-xs" style="color:var(--success);">Flawless resume! No significant weaknesses found.</li>`;
    } else {
      weaknesses.forEach(w => {
        const li = document.createElement('li');
        li.innerHTML = `<i data-lucide="alert-circle" style="width:14px; height:14px; flex-shrink:0;"></i><span>${w}</span>`;
        listWeaknesses.appendChild(li);
      });
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // Render suggestion checklists with active recalculations
  function renderChecklist(suggestions, initialScore, initialCompletion, totalSections) {
    checklistBox.innerHTML = '';
    
    let currentScore = initialScore;
    let currentSections = initialCompletion;
    
    // Initial Ring updates
    updateCircularRings(currentScore, currentSections, totalSections);

    if (suggestions.length === 0) {
      checklistBox.innerHTML = `<p class="text-success fs-xs fw-semibold">✔ Resume is fully optimized for screening!</p>`;
      return;
    }

    suggestions.forEach((sug, idx) => {
      const item = document.createElement('div');
      item.className = 'checklist-item animate__animated animate__fadeInUp';
      item.style.animationDelay = `${idx * 0.05}s`;
      
      item.innerHTML = `
        <div class="checklist-checkbox">
          <i data-lucide="check"></i>
        </div>
        <span class="checklist-text">${sug.text} (+${sug.value}%)</span>
      `;

      // Check click listener to dynamically re-score ATS metrics in real-time!
      item.addEventListener('click', () => {
        const isChecked = item.classList.contains('checked');
        
        if (!isChecked) {
          item.classList.add('checked');
          currentScore = Math.min(currentScore + sug.value, 100);
          // Increment sections completion if relevant suggestion checked
          if (sug.text.toLowerCase().includes('write') || sug.text.toLowerCase().includes('add') || sug.text.toLowerCase().includes('include')) {
            currentSections = Math.min(currentSections + 1, totalSections);
          }
          window.toast.show('success', 'Recalculating ATS', `Optimized: Score boosted to ${currentScore}%!`, 1500);
        } else {
          item.classList.remove('checked');
          currentScore = Math.max(currentScore - sug.value, 0);
          if (sug.text.toLowerCase().includes('write') || sug.text.toLowerCase().includes('add') || sug.text.toLowerCase().includes('include')) {
            currentSections = Math.max(currentSections - 1, 0);
          }
        }

        updateCircularRings(currentScore, currentSections, totalSections);
      });

      checklistBox.appendChild(item);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // Update SVG circular dash-offsets in real-time
  function updateCircularRings(score, completedCount, totalSections) {
    const completionPercent = Math.round((completedCount / totalSections) * 100);
    
    // Animate Text
    textAts.textContent = `${score}%`;
    textCompletion.textContent = `${completionPercent}%`;
    
    // Calibrate Level labels
    if (score >= 75) {
      labelStrength.textContent = "Strong";
      labelStrength.className = "badge-level level-expert";
    } else if (score >= 50) {
      labelStrength.textContent = "Medium";
      labelStrength.className = "badge-level level-intermediate";
    } else {
      labelStrength.textContent = "Weak";
      labelStrength.className = "badge-level level-beginner";
    }

    textSectionsCount.textContent = `${completedCount} / ${totalSections} Sections`;

    // SVG dashoffsets calculations (Circumference = 2 * PI * r = 276.46)
    const circ = 276.46;
    
    setTimeout(() => {
      ringAts.style.strokeDashoffset = circ - (score / 100) * circ;
      ringCompletion.style.strokeDashoffset = circ - (completionPercent / 100) * circ;
    }, 50);
  }
});
