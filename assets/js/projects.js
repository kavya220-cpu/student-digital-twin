/* projects.js */

document.addEventListener('DOMContentLoaded', () => {
  // Fetch Local Storage Data
  const profileData = localStorage.getItem('nexusED_profile');
  
  // Guard Clause: Redirect to Profile Setup if not configured
  if (!profileData) {
    window.toast.show('warning', 'Profile Setup Required', 'Please configure your profile twin to access the project portfolio.', 4000);
    setTimeout(() => {
      window.location.href = 'profile.html';
    }, 1500);
    return;
  }

  const profile = JSON.parse(profileData);
  let projects = JSON.parse(localStorage.getItem('nexusED_projects')) || [];

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

  // Render profile names/avatars in Sidebar
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

  // DOM cache
  const gridBox = document.getElementById('projects-grid-box');
  const searchInput = document.getElementById('project-search-input');
  const statusFilter = document.getElementById('project-status-filter');
  const sortSelect = document.getElementById('project-sort-select');
  
  const modalOverlay = document.getElementById('project-modal-overlay');
  const modalCard = document.getElementById('project-modal-card');
  const modalTitle = document.getElementById('project-modal-title');
  const modalForm = document.getElementById('project-modal-form');
  
  const addTrigger = document.getElementById('btn-add-project-trigger');
  const modalClose = document.getElementById('btn-modal-close');
  const modalCancel = document.getElementById('btn-modal-cancel');
  const modalSave = document.getElementById('btn-modal-save');
  
  const editOriginalName = document.getElementById('edit-original-name');
  
  const projNameInput = document.getElementById('modal-project-name');
  const projDescInput = document.getElementById('modal-project-desc');
  const projTechInput = document.getElementById('modal-project-tech');
  const projGithubInput = document.getElementById('modal-project-github');
  const projDemoInput = document.getElementById('modal-project-demo');
  const projStatusSelect = document.getElementById('modal-project-status');

  // Initial render
  renderProjectsGrid(projects);

  // --- Render Projects ---
  function renderProjectsGrid(projectsList) {
    gridBox.innerHTML = '';

    if (projectsList.length === 0) {
      gridBox.innerHTML = `
        <div class="col-12 text-center py-5 animate__animated animate__fadeIn">
          <i data-lucide="folder-git-2" class="text-muted mb-3" style="width: 48px; height: 48px;"></i>
          <p class="text-muted">No projects found matching the parameters.</p>
        </div>
      `;
      if (typeof lucide !== 'undefined') lucide.createIcons();
      return;
    }

    projectsList.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-xl-6 col-12 animate__animated animate__fadeInUp';

      // Tech tags pills
      const techList = p.techStack ? p.techStack.split(',').map(t => t.trim()) : [];
      let tagsMarkup = '';
      techList.forEach(t => {
        if (t) tagsMarkup += `<span class="tech-tag">${t}</span>`;
      });

      // Status Badge mapping
      const statusClass = `status-${p.status.toLowerCase()}`;
      let statusIcon = 'circle';
      if (p.status === 'Completed') statusIcon = 'check-circle-2';
      else if (p.status === 'Ongoing') statusIcon = 'activity';
      else if (p.status === 'Planned') statusIcon = 'calendar';

      // Links validation
      const githubMarkup = p.githubRepo ? `
        <a href="https://${p.githubRepo.replace('https://', '')}" target="_blank" class="project-link-btn" title="View Source Code">
          <i data-lucide="github"></i>
          <span>Repository</span>
        </a>
      ` : '';

      const demoMarkup = p.demoLink ? `
        <a href="https://${p.demoLink.replace('https://', '')}" target="_blank" class="project-link-btn" title="View Live Demo">
          <i data-lucide="external-link"></i>
          <span>Live Demo</span>
        </a>
      ` : '';

      col.innerHTML = `
        <article class="project-card">
          <div class="project-card-header">
            <h3 class="project-title">${p.name}</h3>
            <span class="project-status-badge ${statusClass}">
              <i data-lucide="${statusIcon}" style="width:13px; height:13px;"></i>
              <span>${p.status}</span>
            </span>
          </div>

          <p class="project-desc">${p.description}</p>

          <div class="project-tech-tags">
            ${tagsMarkup}
          </div>

          <div class="project-card-footer">
            <div class="project-links">
              ${githubMarkup}
              ${demoMarkup}
            </div>
            
            <div class="project-actions">
              <button type="button" class="btn-action-icon btn-edit" title="Edit project" onclick="openEditProjectModal('${p.name}')">
                <i data-lucide="edit-3"></i>
              </button>
              <button type="button" class="btn-action-icon btn-delete" title="Delete project" onclick="deleteProjectTrigger('${p.name}')">
                <i data-lucide="trash-2"></i>
              </button>
            </div>
          </div>
        </article>
      `;

      gridBox.appendChild(col);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // --- Filtering & Sorting ---
  function applyFilters() {
    const query = searchInput.value.toLowerCase().trim();
    const selectedStatus = statusFilter.value;
    const sortVal = sortSelect.value;

    let filtered = projects.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(query) || 
                          p.description.toLowerCase().includes(query) || 
                          (p.techStack && p.techStack.toLowerCase().includes(query));
      const matchStatus = selectedStatus === 'all' || p.status === selectedStatus;
      return matchSearch && matchStatus;
    });

    // Sorting
    if (sortVal === 'name-asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortVal === 'name-desc') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    renderProjectsGrid(filtered);
  }

  searchInput.addEventListener('input', applyFilters);
  statusFilter.addEventListener('change', applyFilters);
  sortSelect.addEventListener('change', applyFilters);

  // --- Modal Openers ---
  function openModal(titleText, editName = '') {
    modalTitle.textContent = titleText;
    editOriginalName.value = editName;
    
    // Reset forms
    modalForm.reset();
    
    projNameInput.disabled = false;
    
    // Load values if edit
    if (editName) {
      const p = projects.find(proj => proj.name.toLowerCase() === editName.toLowerCase());
      if (p) {
        projNameInput.value = p.name;
        projNameInput.disabled = true; // Protect key name changes
        projDescInput.value = p.description;
        projTechInput.value = p.techStack;
        projGithubInput.value = p.githubRepo;
        projDemoInput.value = p.demoLink;
        projStatusSelect.value = p.status;
      }
    }

    // Reset validations
    modalForm.querySelectorAll('.form-input').forEach(inp => inp.classList.remove('is-valid', 'is-invalid'));

    modalOverlay.style.display = 'flex';
    
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(modalOverlay, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(modalCard, { scale: 0.9, y: 20 }, { scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.5)' });
    }
  }

  function closeModal() {
    if (typeof gsap !== 'undefined') {
      gsap.to(modalCard, { scale: 0.9, y: 20, duration: 0.3 });
      gsap.to(modalOverlay, { opacity: 0, duration: 0.3, onComplete: () => {
        modalOverlay.style.display = 'none';
      }});
    } else {
      modalOverlay.style.display = 'none';
    }
  }

  addTrigger.addEventListener('click', () => {
    openModal('Register Project Node');
  });

  modalClose.addEventListener('click', closeModal);
  modalCancel.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // --- Edit exposed trigger ---
  window.openEditProjectModal = (name) => {
    openModal('Modify Project Parameters', name);
  };

  // --- Delete exposed trigger ---
  window.deleteProjectTrigger = (name) => {
    const matchedIdx = projects.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
    if (matchedIdx >= 0) {
      projects.splice(matchedIdx, 1);
      localStorage.setItem('nexusED_projects', JSON.stringify(projects));
      
      window.toast.show('success', 'Project Deleted', `${name} removed from your portfolio.`, 3000);
      
      applyFilters();
    }
  };

  // --- Modal save action ---
  modalSave.addEventListener('click', () => {
    const name = projNameInput.value.trim();
    const description = projDescInput.value.trim();
    const techStack = projTechInput.value.trim();
    const githubRepo = projGithubInput.value.trim();
    const demoLink = projDemoInput.value.trim();
    const status = projStatusSelect.value;

    let isValid = true;
    const inputs = [
      { el: projNameInput, val: name },
      { el: projDescInput, val: description },
      { el: projTechInput, val: techStack },
      { el: projStatusSelect, val: status }
    ];

    inputs.forEach(inp => {
      if (!inp.val) {
        inp.el.classList.add('is-invalid');
        isValid = false;
      } else {
        inp.el.classList.remove('is-invalid');
      }
    });

    if (!isValid) {
      window.toast.show('warning', 'Validation Error', 'Please complete all required fields.', 3000);
      return;
    }

    const isEdit = editOriginalName.value.length > 0;

    if (isEdit) {
      const idx = projects.findIndex(p => p.name.toLowerCase() === editOriginalName.value.toLowerCase());
      if (idx >= 0) {
        projects[idx].description = description;
        projects[idx].techStack = techStack;
        projects[idx].githubRepo = githubRepo;
        projects[idx].demoLink = demoLink;
        projects[idx].status = status;
      }
    } else {
      // Check duplicate name
      const exist = projects.some(p => p.name.toLowerCase() === name.toLowerCase());
      if (exist) {
        window.toast.show('error', 'Duplicate Project', `Project '${name}' is already registered.`, 3500);
        return;
      }

      projects.push({
        name,
        description,
        techStack,
        githubRepo,
        demoLink,
        status,
        imageUrl: ""
      });
    }

    localStorage.setItem('nexusED_projects', JSON.stringify(projects));
    
    window.toast.show('success', isEdit ? 'Project Updated' : 'Project Registered', `'${name}' details synced.`, 3000);

    closeModal();
    applyFilters();
  });

  // --- Logout trigger ---
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
