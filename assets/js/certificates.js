/* certificates.js */

document.addEventListener('DOMContentLoaded', () => {
  // Fetch Local Storage Data
  const profileData = localStorage.getItem('nexusED_profile');
  
  // Guard Clause: Redirect to Profile Setup if not configured
  if (!profileData) {
    window.toast.show('warning', 'Profile Setup Required', 'Please configure your profile twin to access the certification registry.', 4000);
    setTimeout(() => {
      window.location.href = 'profile.html';
    }, 1500);
    return;
  }

  const profile = JSON.parse(profileData);
  let certificates = JSON.parse(localStorage.getItem('nexusED_certificates')) || [];

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
  const gridBox = document.getElementById('certs-grid-box');
  const searchInput = document.getElementById('cert-search-input');
  
  const kpiTotal = document.getElementById('certs-kpi-total');
  const kpiCredits = document.getElementById('certs-kpi-credits');
  const kpiResume = document.getElementById('certs-kpi-resume');
  const platformSplitBox = document.getElementById('certs-platform-split-box');
  
  const modalOverlay = document.getElementById('cert-modal-overlay');
  const modalCard = document.getElementById('cert-modal-card');
  const modalTitle = document.getElementById('cert-modal-title');
  const modalForm = document.getElementById('cert-modal-form');
  
  const addTrigger = document.getElementById('btn-add-cert-trigger');
  const modalClose = document.getElementById('btn-modal-close');
  const modalCancel = document.getElementById('btn-modal-cancel');
  const modalSave = document.getElementById('btn-modal-save');
  
  const editOriginalId = document.getElementById('edit-original-id');
  
  const certNameInput = document.getElementById('modal-cert-name');
  const certCourseInput = document.getElementById('modal-cert-course');
  const certPlatformSelect = document.getElementById('modal-cert-platform');
  const certCreditsSelect = document.getElementById('modal-cert-credits');
  const certDateInput = document.getElementById('modal-cert-date');
  const certIdInput = document.getElementById('modal-cert-id');
  const certLinkInput = document.getElementById('modal-cert-link');

  // Modal Drag & Drop Elements
  const fileDropzone = document.getElementById('cert-file-dropzone');
  const fileInput = document.getElementById('modal-cert-file-input');
  const dropzoneText = document.getElementById('cert-dropzone-text');
  const scanLoader = document.getElementById('cert-scan-loader');
  
  // Compact file banner elements
  const scannedFileBanner = document.getElementById('cert-scanned-file-banner');
  const scannedFileName = document.getElementById('scanned-file-name');
  const btnRemoveScannedFile = document.getElementById('btn-remove-scanned-file');

  const valueReport = document.getElementById('cert-value-report');
  const reportResume = document.getElementById('report-resume-boost');
  const reportCredits = document.getElementById('report-credits');
  const reportVector = document.getElementById('report-vector');
  const reportSync = document.getElementById('report-sync-impact');

  // Initial render
  updateDashboardRegistry();

  function updateDashboardRegistry() {
    renderCertificatesGrid(certificates);
    renderPlatformAnalytics();
  }

  // Helper to sync .has-value class for floating labels
  function checkInputValues() {
    modalForm.querySelectorAll('.form-input').forEach(input => {
      // For selects or text inputs
      if (input.value && input.value !== "") {
        input.classList.add('has-value');
      } else {
        input.classList.remove('has-value');
      }
    });
  }

  // Bind keyup and change events to form inputs to reactively trigger floating label checks
  modalForm.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', checkInputValues);
    input.addEventListener('change', checkInputValues);
  });

  // --- Render Certificates ---
  function renderCertificatesGrid(certsList) {
    gridBox.innerHTML = '';
    
    if (certsList.length === 0) {
      gridBox.innerHTML = `
        <div class="col-12 text-center py-4 animate__animated animate__fadeIn">
          <div class="cert-file-uploader-box py-5" id="main-certs-dropzone" style="max-width: 480px; margin: 0 auto; border-color: var(--primary); padding: 36px; background: rgba(108, 99, 255, 0.02);">
            <i data-lucide="upload-cloud" class="mb-3 text-primary animate-pulse" style="width: 48px; height: 48px; margin: 0 auto 12px; display:block;"></i>
            <h3 class="fs-sm fw-bold text-main mb-2">Upload Certificate / Hackathon Node</h3>
            <p class="text-muted fs-xs mb-3">Drag & drop your credential file here or click to browse files.</p>
            <span class="badge-level level-intermediate" style="font-size:0.65rem;">Supports PDF, PNG, JPG</span>
            <input type="file" id="main-certs-file-input" style="display:none;" accept="image/*,.pdf">
          </div>
          
          <!-- Scanning indicator inside the main screen -->
          <div id="main-certs-scan-loader" style="display:none; max-width: 480px; margin: 0 auto;" class="py-5">
            <div class="spinner mb-3" style="margin: 0 auto;"></div>
            <div class="fs-xs fw-semibold text-primary animate-pulse">AI Agent scanning certificate & verifying credential details...</div>
          </div>
        </div>
      `;
      
      if (typeof lucide !== 'undefined') lucide.createIcons();
      
      // Bind Main Uploader Listeners immediately
      bindMainUploaderEvents();
      return;
    }

    certsList.forEach(c => {
      const course = c.course || "Google Cloud Fundamentals";
      const credits = c.credits || 3;

      const col = document.createElement('div');
      col.className = 'col-md-6 col-12 animate__animated animate__fadeInUp';

      // Platform badge class
      const platformLower = c.platform ? c.platform.toLowerCase() : 'fallback';
      const initialLetter = c.platform ? c.platform[0].toUpperCase() : 'C';

      // Verification link
      const verifyLinkMarkup = c.credentialLink ? `
        <a href="https://${c.credentialLink.replace('https://', '')}" target="_blank" class="cert-verify-link">
          <i data-lucide="external-link"></i>
          <span>Verify Credential</span>
        </a>
      ` : '<span class="text-muted fs-xs">No link provided</span>';

      col.innerHTML = `
        <article class="cert-card">
          <div class="cert-platform-icon-box ${platformLower}">
            ${initialLetter}
          </div>
          
          <div class="cert-details-wrap">
            <span class="cert-meta-platform">${c.platform}</span>
            <h3 class="cert-title-text text-truncate" title="${c.name}">${c.name}</h3>
            
            <div class="cert-meta-info">
              <div class="cert-meta-row" title="Course Subject">
                <i data-lucide="book-open"></i>
                <span class="text-truncate">Course: ${course}</span>
              </div>
              <div class="cert-meta-row" title="Academic Credits">
                <i data-lucide="award"></i>
                <span>Credits: ${credits} Academic Credit${credits !== 1 ? 's' : ''}</span>
              </div>
              <div class="cert-meta-row">
                <i data-lucide="hash"></i>
                <span class="text-truncate">ID: ${c.credentialId}</span>
              </div>
              <div class="cert-meta-row">
                <i data-lucide="calendar"></i>
                <span>Issued: ${c.issueDate}</span>
              </div>
            </div>

            <div class="cert-card-footer">
              ${verifyLinkMarkup}
              
              <div class="project-actions">
                <button type="button" class="btn-action-icon btn-edit" title="Edit certificate" onclick="openEditCertModal('${c.credentialId}')">
                  <i data-lucide="edit-3"></i>
                </button>
                <button type="button" class="btn-action-icon btn-delete" title="Delete certificate" onclick="deleteCertTrigger('${c.credentialId}')">
                  <i data-lucide="trash-2"></i>
                </button>
              </div>
            </div>
          </div>
        </article>
      `;

      gridBox.appendChild(col);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // Bind Listeners for the Main Screen dropzone
  function bindMainUploaderEvents() {
    const mainDropzone = document.getElementById('main-certs-dropzone');
    const mainFileInput = document.getElementById('main-certs-file-input');
    const mainLoader = document.getElementById('main-certs-scan-loader');

    if (!mainDropzone) return;

    mainDropzone.addEventListener('click', () => {
      mainFileInput.click();
    });

    mainDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      mainDropzone.classList.add('dragover');
    });

    ['dragleave', 'dragend', 'drop'].forEach(evt => {
      mainDropzone.addEventListener(evt, () => {
        mainDropzone.classList.remove('dragover');
      });
    });

    mainDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        processMainPageFile(file, mainDropzone, mainLoader);
      }
    });

    mainFileInput.addEventListener('change', () => {
      const file = mainFileInput.files[0];
      if (file) {
        processMainPageFile(file, mainDropzone, mainLoader);
      }
    });
  }

  // Process file upload on the main dashboard screen
  function processMainPageFile(file, dropzone, loader) {
    dropzone.style.display = 'none';
    loader.style.display = 'block';

    setTimeout(() => {
      loader.style.display = 'none';
      dropzone.style.display = 'flex';

      // Open verification modal with scanned values
      openModal('Verify Scanned Credential');

      // Autofills mock details
      let title = "Advanced AWS Infrastructure Architecture";
      let course = "Cloud Engineering & Solutions Architecture";
      let platform = "Amazon Web Services";
      let credits = 4;
      let date = new Date().toISOString().split('T')[0];
      let credId = "AWS-SAP-8921";
      let link = "aws.amazon.com/verify/AWS-SAP-8921";

      const nameLower = file.name.toLowerCase();
      if (nameLower.includes('hackathon') || nameLower.includes('sih') || nameLower.includes('project')) {
        title = "Smart India Hackathon Certification of Merit";
        course = "National Scale AI Solutions & Engineering";
        platform = "SIH Coordinator Board";
        credits = 5;
        credId = "SIH-2026-8872";
        link = "sih.gov.in/verify/sih-2026-8872";
      } else if (nameLower.includes('python') || nameLower.includes('coursera')) {
        title = "Python for Machine Learning and Data Science";
        course = "Supervised Machine Learning & Feature Optimization";
        platform = "Coursera / Stanford";
        credits = 3;
        credId = "COURSERA-88372";
        link = "coursera.org/verify/COURSERA-88372";
      }

      // Populate
      certNameInput.value = title;
      certCourseInput.value = course;
      certPlatformSelect.value = platform;
      certCreditsSelect.value = credits;
      certDateInput.value = date;
      certIdInput.value = credId;
      certLinkInput.value = link;

      // Update OCR dropzone indicator inside modal (compact mode)
      fileDropzone.style.display = 'none';
      scannedFileName.textContent = file.name;
      scannedFileBanner.style.display = 'flex';

      // Check floating labels and update report
      checkInputValues();
      updateValueReport();

      window.toast.show('success', 'AI Scan Complete', 'Auto-populated credentials from file details. Review form inside the modal.', 4000);
    }, 2200);
  }

  // --- Render Platform Split & KPI Analytics ---
  function renderPlatformAnalytics() {
    kpiTotal.textContent = certificates.length;
    
    // 1. Calculate Total Credits
    let totalCredits = 0;
    certificates.forEach(c => {
      totalCredits += parseInt(c.credits || 3);
    });
    kpiCredits.textContent = totalCredits;

    // 2. Calculate Resume Strength Index Boost
    let resumeBoost = 0;
    certificates.forEach(c => {
      const credits = parseInt(c.credits || 3);
      let platformBonus = 3;
      const plat = (c.platform || '').toLowerCase();
      if (plat === 'google' || plat === 'microsoft') platformBonus = 5;
      else if (plat === 'coursera' || plat === 'nptel') platformBonus = 4;
      
      resumeBoost += (credits * 2) + platformBonus;
    });
    kpiResume.textContent = `+${resumeBoost}%`;

    platformSplitBox.innerHTML = '';

    const platforms = ["Google", "Microsoft", "Coursera", "NPTEL", "Udemy", "Cisco", "Oracle", "Other"];
    
    // Count occurrences
    const counts = {};
    platforms.forEach(p => counts[p] = 0);
    
    certificates.forEach(c => {
      const match = platforms.find(p => p.toLowerCase() === (c.platform || '').toLowerCase());
      if (match && match !== 'Other') {
        counts[match]++;
      } else {
        counts["Other"]++;
      }
    });

    // Render platform split progress bars
    platforms.forEach(p => {
      const count = counts[p];
      if (count > 0 || certificates.length === 0) {
        const percent = certificates.length > 0 ? (count / certificates.length) * 100 : 0;
        
        const row = document.createElement('div');
        row.className = 'platform-row';
        row.innerHTML = `
          <div class="platform-info">
            <span class="platform-name">${p}</span>
            <span class="platform-count">${count} cert${count !== 1 ? 's' : ''}</span>
          </div>
          <div class="platform-bar-track">
            <div class="platform-bar-fill" style="width: 0%"></div>
          </div>
        `;
        platformSplitBox.appendChild(row);

        // Fill bar dynamically
        setTimeout(() => {
          const fill = row.querySelector('.platform-bar-fill');
          if (fill) fill.style.width = `${percent}%`;
        }, 150);
      }
    });

    if (platformSplitBox.innerHTML === '') {
      platformSplitBox.innerHTML = `<p class="text-muted text-center py-3" style="font-size:0.85rem;">No platform credentials. Open "Verify Certificate" to add.</p>`;
    }
  }

  // --- Live Search ---
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    
    const filtered = certificates.filter(c => {
      const course = c.course || "";
      return c.name.toLowerCase().includes(query) || 
             c.platform.toLowerCase().includes(query) ||
             c.credentialId.toLowerCase().includes(query) ||
             course.toLowerCase().includes(query);
    });

    renderCertificatesGrid(filtered);
  });

  // --- Modal Drag & Drop Listeners ---
  if (fileDropzone) {
    fileDropzone.addEventListener('click', () => {
      fileInput.click();
    });

    fileDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      fileDropzone.classList.add('dragover');
    });

    ['dragleave', 'dragend', 'drop'].forEach(evt => {
      fileDropzone.addEventListener(evt, () => {
        fileDropzone.classList.remove('dragover');
      });
    });

    fileDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        processUploadedFile(file);
      }
    });

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (file) {
        processUploadedFile(file);
      }
    });
  }

  // Remove uploaded scanned file and return to dropzone
  if (btnRemoveScannedFile) {
    btnRemoveScannedFile.addEventListener('click', (e) => {
      e.stopPropagation();
      scannedFileBanner.style.display = 'none';
      fileDropzone.style.display = 'flex';
      fileInput.value = ''; // Reset file input
      dropzoneText.textContent = "Drag & drop certificate image/PDF or click to upload";
    });
  }

  // Process File Upload and Simulate OCR Scan inside modal
  function processUploadedFile(file) {
    fileDropzone.style.display = 'none';
    scanLoader.style.display = 'block';
    valueReport.style.display = 'none';

    setTimeout(() => {
      scanLoader.style.display = 'none';
      
      // Hide uploader and show the slim file strip instead to prevent modal height overflow!
      scannedFileName.textContent = file.name;
      scannedFileBanner.style.display = 'flex';

      // Mock OCR Autofills
      let title = "Advanced AWS Infrastructure Architecture";
      let course = "Cloud Engineering & Solutions Architecture";
      let platform = "Amazon Web Services";
      let credits = 4;
      let date = new Date().toISOString().split('T')[0];
      let credId = "AWS-SAP-8921";
      let link = "aws.amazon.com/verify/AWS-SAP-8921";

      const nameLower = file.name.toLowerCase();
      if (nameLower.includes('hackathon') || nameLower.includes('sih') || nameLower.includes('project')) {
        title = "Smart India Hackathon Certification of Merit";
        course = "National Scale AI Solutions & Engineering";
        platform = "SIH Coordinator Board";
        credits = 5;
        credId = "SIH-2026-8872";
        link = "sih.gov.in/verify/sih-2026-8872";
      } else if (nameLower.includes('python') || nameLower.includes('coursera')) {
        title = "Python for Machine Learning and Data Science";
        course = "Supervised Machine Learning & Feature Optimization";
        platform = "Coursera / Stanford";
        credits = 3;
        credId = "COURSERA-88372";
        link = "coursera.org/verify/COURSERA-88372";
      }

      // Populate form
      certNameInput.value = title;
      certCourseInput.value = course;
      certPlatformSelect.value = platform;
      certCreditsSelect.value = credits;
      certDateInput.value = date;
      certIdInput.value = credId;
      certLinkInput.value = link;

      // Check floating labels and update report
      checkInputValues();
      updateValueReport();
      
      window.toast.show('success', 'AI Scan Complete', 'Auto-populated credentials from file details.', 3000);
    }, 2200);
  }

  // Calculate dynamic report card values
  function updateValueReport() {
    const credits = parseInt(certCreditsSelect.value) || 0;
    const platform = certPlatformSelect.value || '';

    if (credits === 0) {
      valueReport.style.display = 'none';
      return;
    }

    let platformBonus = 3;
    const platLower = platform.toLowerCase();
    if (platLower === 'google' || platLower === 'microsoft') platformBonus = 5;
    else if (platLower === 'coursera' || platLower === 'nptel') platformBonus = 4;

    const resumeBoost = Math.round((credits * 2.5) + platformBonus);
    const syncImpact = Math.round(credits * 1.5);
    const vectorText = credits >= 4 ? "High-Impact Skill Node" : "Core Skill Connector";

    // Inject values
    reportResume.textContent = `+${resumeBoost}%`;
    reportCredits.textContent = `${credits} Credit${credits !== 1 ? 's' : ''}`;
    reportVector.textContent = vectorText;
    reportSync.textContent = `+${syncImpact}% Overall`;

    valueReport.style.display = 'block';
  }

  // Bind key fields to dynamic value calculator on user change
  [certCreditsSelect, certPlatformSelect].forEach(el => {
    if (el) {
      el.addEventListener('change', updateValueReport);
    }
  });

  // --- Modal Openers ---
  function openModal(titleText, editId = '') {
    modalTitle.textContent = titleText;
    editOriginalId.value = editId;
    
    modalForm.reset();
    certIdInput.disabled = false;
    valueReport.style.display = 'none';
    
    // Reset file banner & show dropzone
    scannedFileBanner.style.display = 'none';
    fileDropzone.style.display = 'flex';
    fileInput.value = '';
    dropzoneText.textContent = "Drag & drop certificate image/PDF or click to upload";

    if (editId) {
      const c = certificates.find(cert => cert.credentialId.toLowerCase() === editId.toLowerCase());
      if (c) {
        certNameInput.value = c.name;
        certCourseInput.value = c.course || '';
        certPlatformSelect.value = c.platform;
        certCreditsSelect.value = c.credits || '3';
        certDateInput.value = c.issueDate;
        certIdInput.value = c.credentialId;
        certIdInput.disabled = true; // Protect key credential ID changes
        certLinkInput.value = c.credentialLink;

        // Display report on edit
        updateValueReport();
      }
    }

    // Reset validations & sync has-value classes
    modalForm.querySelectorAll('.form-input').forEach(inp => inp.classList.remove('is-valid', 'is-invalid'));
    setTimeout(checkInputValues, 50);

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
    openModal('Verify Certificate Node');
  });

  modalClose.addEventListener('click', closeModal);
  modalCancel.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // --- Edit exposed trigger ---
  window.openEditCertModal = (credentialId) => {
    openModal('Modify Certificate Parameters', credentialId);
  };

  // --- Delete exposed trigger ---
  window.deleteCertTrigger = (credentialId) => {
    const matchedIdx = certificates.findIndex(c => c.credentialId.toLowerCase() === credentialId.toLowerCase());
    if (matchedIdx >= 0) {
      const name = certificates[matchedIdx].name;
      certificates.splice(matchedIdx, 1);
      localStorage.setItem('nexusED_certificates', JSON.stringify(certificates));
      
      window.toast.show('success', 'Certificate Deleted', `'${name}' removed from twin registry.`, 3000);
      
      updateDashboardRegistry();
    }
  };

  // --- Modal save action ---
  modalSave.addEventListener('click', () => {
    const name = certNameInput.value.trim();
    const course = certCourseInput.value.trim();
    const platform = certPlatformSelect.value;
    const credits = parseInt(certCreditsSelect.value);
    const date = certDateInput.value;
    const credentialId = certIdInput.value.trim();
    const link = certLinkInput.value.trim();

    let isValid = true;
    const inputs = [
      { el: certNameInput, val: name },
      { el: certCourseInput, val: course },
      { el: certPlatformSelect, val: platform },
      { el: certCreditsSelect, val: credits },
      { el: certDateInput, val: date },
      { el: certIdInput, val: credentialId }
    ];

    inputs.forEach(inp => {
      if (!inp.val && inp.val !== 0) {
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

    const isEdit = editOriginalId.value.length > 0;

    if (isEdit) {
      const idx = certificates.findIndex(c => c.credentialId.toLowerCase() === editOriginalId.value.toLowerCase());
      if (idx >= 0) {
        certificates[idx].name = name;
        certificates[idx].course = course;
        certificates[idx].platform = platform;
        certificates[idx].credits = credits;
        certificates[idx].issueDate = date;
        certificates[idx].credentialLink = link;
      }
    } else {
      // Check duplicate ID
      const exist = certificates.some(c => c.credentialId.toLowerCase() === credentialId.toLowerCase());
      if (exist) {
        window.toast.show('error', 'Duplicate Credential', `Credential ID '${credentialId}' already registered.`, 3500);
        return;
      }

      certificates.push({
        name,
        course,
        platform,
        credits,
        issueDate: date,
        credentialId,
        credentialLink: link,
        imageUrl: ""
      });
    }

    certificates = certificates.filter(c => c.credentialId !== ""); // Clean empty entries if any

    localStorage.setItem('nexusED_certificates', JSON.stringify(certificates));
    
    window.toast.show('success', isEdit ? 'Certificate Updated' : 'Credential Verified', `'${name}' synced to twin.`, 3000);

    closeModal();
    updateDashboardRegistry();
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
