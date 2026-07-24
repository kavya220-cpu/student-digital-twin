/* resume-builder.js */

document.addEventListener('DOMContentLoaded', () => {
  // Fetch Local Storage Data
  const profileData = localStorage.getItem('nexusED_profile');
  
  // Guard Clause: Redirect to Profile Setup if not configured
  if (!profileData) {
    window.toast.show('warning', 'Profile Setup Required', 'Please configure your profile twin to access the resume builder.', 4000);
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

  // State Management (Default Resume Data structure)
  let resumeData = {
    name: profile.name || "",
    title: profile.selectedCareer || "Software Engineer",
    email: profile.email || "",
    phone: profile.phone || "",
    linkedin: "",
    github: "",
    portfolio: "",
    summary: "",
    techSkills: "",
    softSkills: "",
    languages: "English",
    education: [],
    projects: [],
    certifications: [],
    experience: [],
    achievements: []
  };

  // Cache existing localStorage data if available
  const cachedData = localStorage.getItem('nexusED_resume_data');
  if (cachedData) {
    resumeData = JSON.parse(cachedData);
  } else {
    // Populate twin defaults first-time
    loadTwinDefaults();
  }

  // DOM Elements
  const accordionContainer = document.getElementById('builder-accordion-container');
  const previewTarget = document.getElementById('resume-preview-target');
  
  const eduBox = document.getElementById('education-entries-box');
  const projBox = document.getElementById('project-entries-box');
  const certBox = document.getElementById('certification-entries-box');
  const expBox = document.getElementById('experience-entries-box');
  const achBox = document.getElementById('achievement-entries-box');

  // Accordion Logic
  accordionContainer.addEventListener('click', (e) => {
    const header = e.target.closest('.accordion-header');
    if (!header) return;
    
    const item = header.parentElement;
    const isActive = item.classList.contains('active');
    
    // Collapse all
    accordionContainer.querySelectorAll('.accordion-item').forEach(el => el.classList.remove('active'));
    
    // Toggle active
    if (!isActive) {
      item.classList.add('active');
    }
  });

  // Load Form Data Values
  populateFormInputs();
  renderDynamicLists();
  updateLivePreview();

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

  // Pull Twin defaults from local storage
  function loadTwinDefaults() {
    // 1. Education
    resumeData.education = [{
      school: profile.college || "University Institute",
      degree: `${profile.branch || "Computer Science"} (Semester ${profile.semester || 1})`,
      year: profile.year || "2026",
      cgpa: profile.cgpa || "N/A"
    }];

    // 2. Projects
    const twinProjects = JSON.parse(localStorage.getItem('nexusED_projects')) || [];
    resumeData.projects = twinProjects.map(p => ({
      name: p.name,
      desc: p.description,
      tech: p.techStack,
      github: p.githubRepo || "",
      demo: p.demoLink || ""
    }));

    // 3. Certifications
    const twinCerts = JSON.parse(localStorage.getItem('nexusED_certificates')) || [];
    resumeData.certifications = twinCerts.map(c => ({
      name: c.name,
      course: c.course || "",
      platform: c.platform,
      credits: c.credits || "3",
      id: c.credentialId
    }));

    // 4. Skills
    const twinSkills = JSON.parse(localStorage.getItem('nexusED_skills')) || [];
    resumeData.techSkills = twinSkills.map(s => s.name).join(', ');
  }

  // Populate form inputs based on state
  function populateFormInputs() {
    document.getElementById('resume-name').value = resumeData.name;
    document.getElementById('resume-title').value = resumeData.title;
    document.getElementById('resume-email').value = resumeData.email;
    document.getElementById('resume-phone').value = resumeData.phone;
    document.getElementById('resume-linkedin').value = resumeData.linkedin;
    document.getElementById('resume-github').value = resumeData.github;
    document.getElementById('resume-portfolio').value = resumeData.portfolio;
    document.getElementById('resume-summary').value = resumeData.summary;
    document.getElementById('resume-tech-skills').value = resumeData.techSkills;
    document.getElementById('resume-soft-skills').value = resumeData.softSkills;
    document.getElementById('resume-languages').value = resumeData.languages;
  }

  // Render arrays of educations, projects, certifications, internships, achievements
  function renderDynamicLists() {
    // 1. Education
    eduBox.innerHTML = '';
    resumeData.education.forEach((edu, idx) => {
      const div = createEntryCard(idx, 'education');
      div.innerHTML = `
        <button type="button" class="btn-remove-entry" onclick="removeEntry('education', ${idx})">&times;</button>
        <div class="row g-2">
          <div class="col-md-6 col-12">
            <div class="form-group mb-0">
              <input type="text" value="${edu.school}" class="form-input" placeholder=" " oninput="updateEntry('education', ${idx}, 'school', this.value)" required>
              <label class="form-label">School / University</label>
            </div>
          </div>
          <div class="col-md-6 col-12">
            <div class="form-group mb-0">
              <input type="text" value="${edu.degree}" class="form-input" placeholder=" " oninput="updateEntry('education', ${idx}, 'degree', this.value)" required>
              <label class="form-label">Degree / Branch</label>
            </div>
          </div>
          <div class="col-md-6 col-12">
            <div class="form-group mb-0">
              <input type="text" value="${edu.year}" class="form-input" placeholder=" " oninput="updateEntry('education', ${idx}, 'year', this.value)" required>
              <label class="form-label">Graduation Year</label>
            </div>
          </div>
          <div class="col-md-6 col-12">
            <div class="form-group mb-0">
              <input type="text" value="${edu.cgpa}" class="form-input" placeholder=" " oninput="updateEntry('education', ${idx}, 'cgpa', this.value)" required>
              <label class="form-label">CGPA / Percentage</label>
            </div>
          </div>
        </div>
      `;
      eduBox.appendChild(div);
    });

    // 2. Projects
    projBox.innerHTML = '';
    resumeData.projects.forEach((proj, idx) => {
      const div = createEntryCard(idx, 'projects');
      div.innerHTML = `
        <button type="button" class="btn-remove-entry" onclick="removeEntry('projects', ${idx})">&times;</button>
        <div class="row g-2">
          <div class="col-md-6 col-12">
            <div class="form-group mb-0">
              <input type="text" value="${proj.name}" class="form-input" placeholder=" " oninput="updateEntry('projects', ${idx}, 'name', this.value)" required>
              <label class="form-label">Project Title</label>
            </div>
          </div>
          <div class="col-md-6 col-12">
            <div class="form-group mb-0">
              <input type="text" value="${proj.tech}" class="form-input" placeholder=" " oninput="updateEntry('projects', ${idx}, 'tech', this.value)" required>
              <label class="form-label">Tech Stack (comma separated)</label>
            </div>
          </div>
          <div class="col-12">
            <div class="form-group mb-0">
              <textarea class="form-input" style="min-height:60px;" placeholder=" " oninput="updateEntry('projects', ${idx}, 'desc', this.value)" required>${proj.desc}</textarea>
              <label class="form-label">Project Description</label>
            </div>
          </div>
          <div class="col-md-6 col-12">
            <div class="form-group mb-0">
              <input type="text" value="${proj.github}" class="form-input" placeholder=" " oninput="updateEntry('projects', ${idx}, 'github', this.value)">
              <label class="form-label">GitHub Link</label>
            </div>
          </div>
          <div class="col-md-6 col-12">
            <div class="form-group mb-0">
              <input type="text" value="${proj.demo}" class="form-input" placeholder=" " oninput="updateEntry('projects', ${idx}, 'demo', this.value)">
              <label class="form-label">Live Demo Link</label>
            </div>
          </div>
        </div>
      `;
      projBox.appendChild(div);
    });

    // 3. Certifications
    certBox.innerHTML = '';
    resumeData.certifications.forEach((cert, idx) => {
      const div = createEntryCard(idx, 'certifications');
      div.innerHTML = `
        <button type="button" class="btn-remove-entry" onclick="removeEntry('certifications', ${idx})">&times;</button>
        <div class="row g-2">
          <div class="col-md-6 col-12">
            <div class="form-group mb-0">
              <input type="text" value="${cert.name}" class="form-input" placeholder=" " oninput="updateEntry('certifications', ${idx}, 'name', this.value)" required>
              <label class="form-label">Certificate Title</label>
            </div>
          </div>
          <div class="col-md-6 col-12">
            <div class="form-group mb-0">
              <input type="text" value="${cert.course}" class="form-input" placeholder=" " oninput="updateEntry('certifications', ${idx}, 'course', this.value)" required>
              <label class="form-label">Associated Course Name</label>
            </div>
          </div>
          <div class="col-md-4 col-12">
            <div class="form-group mb-0">
              <input type="text" value="${cert.platform}" class="form-input" placeholder=" " oninput="updateEntry('certifications', ${idx}, 'platform', this.value)" required>
              <label class="form-label">Platform Vendor</label>
            </div>
          </div>
          <div class="col-md-4 col-12">
            <div class="form-group mb-0">
              <input type="number" value="${cert.credits}" class="form-input" placeholder=" " oninput="updateEntry('certifications', ${idx}, 'credits', this.value)" required>
              <label class="form-label">Credits</label>
            </div>
          </div>
          <div class="col-md-4 col-12">
            <div class="form-group mb-0">
              <input type="text" value="${cert.id}" class="form-input" placeholder=" " oninput="updateEntry('certifications', ${idx}, 'id', this.value)" required>
              <label class="form-label">Credential ID</label>
            </div>
          </div>
        </div>
      `;
      certBox.appendChild(div);
    });

    // 4. Experience / Internships
    expBox.innerHTML = '';
    resumeData.experience.forEach((exp, idx) => {
      const div = createEntryCard(idx, 'experience');
      div.innerHTML = `
        <button type="button" class="btn-remove-entry" onclick="removeEntry('experience', ${idx})">&times;</button>
        <div class="row g-2">
          <div class="col-md-6 col-12">
            <div class="form-group mb-0">
              <input type="text" value="${exp.company}" class="form-input" placeholder=" " oninput="updateEntry('experience', ${idx}, 'company', this.value)" required>
              <label class="form-label">Company / Organization</label>
            </div>
          </div>
          <div class="col-md-6 col-12">
            <div class="form-group mb-0">
              <input type="text" value="${exp.role}" class="form-input" placeholder=" " oninput="updateEntry('experience', ${idx}, 'role', this.value)" required>
              <label class="form-label">Role / Designation</label>
            </div>
          </div>
          <div class="col-md-12 col-12">
            <div class="form-group mb-0">
              <input type="text" value="${exp.duration}" class="form-input" placeholder=" " oninput="updateEntry('experience', ${idx}, 'duration', this.value)" required>
              <label class="form-label">Duration (e.g. Jun 2025 - Aug 2025)</label>
            </div>
          </div>
          <div class="col-12">
            <div class="form-group mb-0">
              <textarea class="form-input" style="min-height:60px;" placeholder=" " oninput="updateEntry('experience', ${idx}, 'desc', this.value)" required>${exp.desc}</textarea>
              <label class="form-label">Responsibilities & Outcomes</label>
            </div>
          </div>
        </div>
      `;
      expBox.appendChild(div);
    });

    // 5. Achievements
    achBox.innerHTML = '';
    resumeData.achievements.forEach((ach, idx) => {
      const div = createEntryCard(idx, 'achievements');
      div.innerHTML = `
        <button type="button" class="btn-remove-entry" onclick="removeEntry('achievements', ${idx})">&times;</button>
        <div class="form-group mb-0">
          <input type="text" value="${ach}" class="form-input" placeholder=" " oninput="updateAchievement(${idx}, this.value)" required>
          <label class="form-label">Achievement / Honor Detail</label>
        </div>
      `;
      achBox.appendChild(div);
    });
  }

  function createEntryCard(idx, section) {
    const div = document.createElement('div');
    div.className = 'entry-card-row mt-2';
    div.dataset.index = idx;
    return div;
  }

  // --- Accordion Event Syncing & Form updates ---
  const fieldMappings = [
    { id: 'resume-name', key: 'name' },
    { id: 'resume-title', key: 'title' },
    { id: 'resume-email', key: 'email' },
    { id: 'resume-phone', key: 'phone' },
    { id: 'resume-linkedin', key: 'linkedin' },
    { id: 'resume-github', key: 'github' },
    { id: 'resume-portfolio', key: 'portfolio' },
    { id: 'resume-summary', key: 'summary' },
    { id: 'resume-tech-skills', key: 'techSkills' },
    { id: 'resume-soft-skills', key: 'softSkills' },
    { id: 'resume-languages', key: 'languages' }
  ];

  fieldMappings.forEach(map => {
    const el = document.getElementById(map.id);
    if (el) {
      el.addEventListener('input', () => {
        resumeData[map.key] = el.value.trim();
        saveAndSync();
      });
    }
  });

  // Dynamic lists helper actions
  window.updateEntry = (section, idx, field, val) => {
    resumeData[section][idx][field] = val;
    saveAndSync();
  };

  window.updateAchievement = (idx, val) => {
    resumeData.achievements[idx] = val;
    saveAndSync();
  };

  window.removeEntry = (section, idx) => {
    resumeData[section].splice(idx, 1);
    renderDynamicLists();
    saveAndSync();
    window.toast.show('info', 'Entry Removed', `Deleted item from ${section}.`, 2000);
  };

  // Add Entries
  document.getElementById('btn-add-education').addEventListener('click', () => {
    resumeData.education.push({ school: "", degree: "", year: "", cgpa: "" });
    renderDynamicLists();
    saveAndSync();
  });

  document.getElementById('btn-add-project').addEventListener('click', () => {
    resumeData.projects.push({ name: "", desc: "", tech: "", github: "", demo: "" });
    renderDynamicLists();
    saveAndSync();
  });

  document.getElementById('btn-add-certification').addEventListener('click', () => {
    resumeData.certifications.push({ name: "", course: "", platform: "", credits: "3", id: "" });
    renderDynamicLists();
    saveAndSync();
  });

  document.getElementById('btn-add-experience').addEventListener('click', () => {
    resumeData.experience.push({ company: "", role: "", duration: "", desc: "" });
    renderDynamicLists();
    saveAndSync();
  });

  document.getElementById('btn-add-achievement').addEventListener('click', () => {
    resumeData.achievements.push("");
    renderDynamicLists();
    saveAndSync();
  });

  // Sync twin data button
  document.getElementById('btn-sync-twin').addEventListener('click', () => {
    loadTwinDefaults();
    populateFormInputs();
    renderDynamicLists();
    saveAndSync();
    window.toast.show('success', 'Twin Database Synced', 'Updated skills, projects, and credentials from your profile twin.', 3500);
  });

  // AI professional summary suggestions
  document.getElementById('btn-ai-summary').addEventListener('click', () => {
    const career = profile.selectedCareer || "AI Engineer";
    const name = profile.name || "Student";
    
    // Mocking high-quality career templates matching Poppins
    let summaryText = "";
    if (career.toLowerCase().includes('ai') || career.toLowerCase().includes('machine')) {
      summaryText = `Calibrated AI Engineer trainee at NexusED. Proficient in designing machine learning pipelines, optimizing neural networks, and utilizing SQL for database indexing. Demonstrated competence in automated model validations through verified projects and Google Cloud certifications.`;
    } else if (career.toLowerCase().includes('cloud') || career.toLowerCase().includes('devops')) {
      summaryText = `DevOps & Cloud Engineer student at NexusED. Experienced in configuring container orchestration frameworks, automated CI/CD pipelines, and cloud security architecture. Confirmed expertise through Linux Foundation and Microsoft credentials.`;
    } else {
      summaryText = `Detail-oriented Software Developer student at NexusED. Proficient in Java, data structures, and full-stack software development. Skilled at building scalable rule-based engines and projects aligned with target digital twin profiles.`;
    }

    resumeData.summary = summaryText;
    document.getElementById('resume-summary').value = summaryText;
    saveAndSync();
    window.toast.show('success', 'AI Summary Configured', `Synthesized professional bio for ${career} trajectory.`, 3000);
  });

  // Save state and refresh A4 preview
  function saveAndSync() {
    localStorage.setItem('nexusED_resume_data', JSON.stringify(resumeData));
    updateLivePreview();
  }

  // --- Live rendering in Right Preview Panel ---
  function updateLivePreview() {
    let eduMarkup = '';
    resumeData.education.forEach(edu => {
      if (edu.school || edu.degree) {
        eduMarkup += `
          <div class="preview-item">
            <div class="preview-item-header">
              <span>${edu.degree || 'Degree Title'}</span>
              <span>${edu.year || 'Graduation'}</span>
            </div>
            <div class="preview-item-sub">${edu.school || 'Institution'}</div>
            ${edu.cgpa ? `<div class="preview-item-desc">CGPA / Performance: ${edu.cgpa}</div>` : ''}
          </div>
        `;
      }
    });

    let projMarkup = '';
    resumeData.projects.forEach(p => {
      if (p.name || p.desc) {
        projMarkup += `
          <div class="preview-item">
            <div class="preview-item-header">
              <span>${p.name || 'Project Name'}</span>
              <span>${p.tech || 'Tech Stack'}</span>
            </div>
            <div class="preview-item-desc">${p.desc || 'Brief description of achievements and tools.'}</div>
            ${p.github ? `<div class="preview-item-desc" style="color:var(--primary); font-size:0.7rem;">Repo: ${p.github}</div>` : ''}
          </div>
        `;
      }
    });

    let certMarkup = '';
    resumeData.certifications.forEach(c => {
      if (c.name || c.platform) {
        certMarkup += `
          <div class="preview-item">
            <div class="preview-item-header">
              <span>${c.name || 'Certificate Name'}</span>
              <span>${c.platform || 'Platform Vendor'}</span>
            </div>
            <div class="preview-item-sub">Course Node: ${c.course || 'Core Subject'}</div>
            <div class="preview-item-desc">Credits: ${c.credits || '3'} | Credential ID: ${c.id || 'N/A'}</div>
          </div>
        `;
      }
    });

    let expMarkup = '';
    resumeData.experience.forEach(e => {
      if (e.company || e.role) {
        expMarkup += `
          <div class="preview-item">
            <div class="preview-item-header">
              <span>${e.role || 'Role'}</span>
              <span>${e.duration || 'Duration'}</span>
            </div>
            <div class="preview-item-sub">${e.company || 'Company'}</div>
            <div class="preview-item-desc">${e.desc || 'Key contributions and outcomes.'}</div>
          </div>
        `;
      }
    });

    let achMarkup = '';
    resumeData.achievements.forEach(a => {
      if (a) {
        achMarkup += `<li style="font-size:0.75rem; color:#4B5563; margin-bottom:4px;">${a}</li>`;
      }
    });

    // Outer sheet templates structure
    previewTarget.innerHTML = `
      <header class="preview-header">
        <div>
          <h2 class="preview-name">${resumeData.name || 'Your Full Name'}</h2>
          <div class="preview-title">${resumeData.title || 'Target Job Title'}</div>
        </div>
        <div class="preview-contact">
          <div>Email: ${resumeData.email || 'email@provider.com'}</div>
          <div>Phone: ${resumeData.phone || '+00 00000 00000'}</div>
          ${resumeData.linkedin ? `<div>LinkedIn: ${resumeData.linkedin}</div>` : ''}
          ${resumeData.github ? `<div>GitHub: ${resumeData.github}</div>` : ''}
          ${resumeData.portfolio ? `<div>Portfolio: ${resumeData.portfolio}</div>` : ''}
        </div>
      </header>

      ${resumeData.summary ? `
        <section>
          <div class="preview-section-title">Professional Summary</div>
          <div class="preview-item-desc" style="line-height:1.4;">${resumeData.summary}</div>
        </section>
      ` : ''}

      ${eduMarkup ? `
        <section>
          <div class="preview-section-title">Education</div>
          ${eduMarkup}
        </section>
      ` : ''}

      ${projMarkup ? `
        <section>
          <div class="preview-section-title">Academic & Personal Projects</div>
          ${projMarkup}
        </section>
      ` : ''}

      ${certMarkup ? `
        <section>
          <div class="preview-section-title">Professional Certifications</div>
          ${certMarkup}
        </section>
      ` : ''}

      ${expMarkup ? `
        <section>
          <div class="preview-section-title">Internships & Professional Experience</div>
          ${expMarkup}
        </section>
      ` : ''}

      ${resumeData.techSkills || resumeData.softSkills ? `
        <section>
          <div class="preview-section-title">Skills & Languages</div>
          <div style="font-size:0.75rem; color:#4B5563;">
            ${resumeData.techSkills ? `<div><strong>Technical Skills:</strong> ${resumeData.techSkills}</div>` : ''}
            ${resumeData.softSkills ? `<div><strong>Soft Skills:</strong> ${resumeData.softSkills}</div>` : ''}
            ${resumeData.languages ? `<div><strong>Languages:</strong> ${resumeData.languages}</div>` : ''}
          </div>
        </section>
      ` : ''}

      ${achMarkup ? `
        <section>
          <div class="preview-section-title">Achievements & Honors</div>
          <ul style="margin: 0; padding-left: 18px;">
            ${achMarkup}
          </ul>
        </section>
      ` : ''}
    `;

    // Reinitialize dynamic Lucide icons inside preview if any
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // --- Template Swapping ---
  const templateButtons = document.querySelectorAll('.btn-template-select');
  templateButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      templateButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const theme = btn.dataset.template; // modern, professional, minimal, creative, ats
      
      // Reset classes and apply selected theme
      previewTarget.className = 'resume-preview-sheet';
      previewTarget.classList.add(`template-${theme}`);
      window.toast.show('info', 'Template Configured', `Applied ${theme.toUpperCase()} resume styling layout.`, 1500);
    });
  });

  // Export PDF / Print trigger
  document.getElementById('btn-export-pdf').addEventListener('click', () => {
    window.print();
  });
});
