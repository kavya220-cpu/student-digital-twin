/* profile.js */

document.addEventListener('DOMContentLoaded', () => {
  // Stepper Elements
  const form = document.getElementById('profile-setup-form');
  const steps = document.querySelectorAll('.profile-step');
  const stepNodes = document.querySelectorAll('.step-indicator-node');
  const progressFill = document.getElementById('profile-progress-fill');
  
  const prevBtn = document.getElementById('profile-prev');
  const nextBtn = document.getElementById('profile-next');

  let currentStep = 1;
  const totalSteps = steps.length;

  // File Upload Elements
  const photoZone = document.getElementById('prof-photo-zone');
  const photoInput = document.getElementById('prof-photo-input');
  const photoPlaceholder = document.getElementById('photo-placeholder');
  const photoPreviewWrap = document.getElementById('photo-preview-wrap');
  const photoPreview = document.getElementById('photo-preview');
  const photoRemoveBtn = document.getElementById('photo-remove-btn');

  const resumeZone = document.getElementById('prof-resume-zone');
  const resumeInput = document.getElementById('prof-resume-input');
  const resumePlaceholder = document.getElementById('resume-placeholder');
  const resumePreviewWrap = document.getElementById('resume-preview-wrap');
  const resumeFilename = document.getElementById('resume-filename');
  const resumeFilesize = document.getElementById('resume-filesize');
  const resumeRemoveBtn = document.getElementById('resume-remove-btn');

  // Cache data strings
  let base64PhotoData = '';
  let uploadedResumeName = '';

  // Initialize live validations
  ValidationSystem.initLiveValidation(form);

  // Focus tracking glow coordinates
  document.addEventListener('mousemove', (e) => {
    const glow = document.querySelector('.cursor-glow');
    if (glow) {
      window.requestAnimationFrame(() => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      });
    }
  });

  // --- Step Navigation Controllers ---
  function updateStepper() {
    // Reveal Active step
    steps.forEach((step, idx) => {
      if (idx + 1 === currentStep) {
        step.style.display = 'block';
        step.classList.add('active');
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(step, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4 });
        }
      } else {
        step.style.display = 'none';
        step.classList.remove('active');
      }
    });

    // Update Node classes
    stepNodes.forEach((node, idx) => {
      const stepNum = idx + 1;
      if (stepNum < currentStep) {
        node.className = 'step-indicator-node completed';
        node.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      } else if (stepNum === currentStep) {
        node.className = 'step-indicator-node active';
        node.innerHTML = stepNum;
      } else {
        node.className = 'step-indicator-node';
        node.innerHTML = stepNum;
      }
    });

    // Update Progress Bar Line width
    const progressWidth = ((currentStep - 1) / (totalSteps - 1)) * 100;
    progressFill.style.width = `${progressWidth}%`;

    // Manage Navigation Trigger States
    if (currentStep === 1) {
      prevBtn.style.visibility = 'hidden';
    } else {
      prevBtn.style.visibility = 'visible';
    }

    if (currentStep === totalSteps) {
      nextBtn.innerHTML = `<span>Generate Roadmap</span> <i data-lucide="check" class="arrow-icon"></i>`;
    } else {
      nextBtn.innerHTML = `<span>Next Step</span> <i data-lucide="arrow-right" class="arrow-icon"></i>`;
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // --- Step validation logic ---
  function validateStep() {
    if (currentStep === 1) {
      const nameInp = document.getElementById('prof-name');
      const emailInp = document.getElementById('prof-email');

      const isName = ValidationSystem.validateName(nameInp);
      const isEmail = ValidationSystem.validateEmail(emailInp);

      return isName && isEmail;
    }

    if (currentStep === 2) {
      const collegeInp = document.getElementById('prof-college');
      const branchInp = document.getElementById('prof-branch');
      const rollInp = document.getElementById('prof-roll');
      const yearInp = document.getElementById('prof-year');
      const semInp = document.getElementById('prof-semester');
      const cgpaInp = document.getElementById('prof-cgpa');

      // Non-empty checks
      const isCollege = collegeInp.value.trim().length > 0;
      const isBranch = branchInp.value.trim().length > 0;
      const isRoll = rollInp.value.trim().length > 0;
      const isYear = yearInp.value.length > 0;
      const isSem = semInp.value.length > 0;

      // Validate states visually
      ValidationSystem.setInputState(collegeInp, isCollege, isCollege ? '' : 'College name is required.');
      ValidationSystem.setInputState(branchInp, isBranch, isBranch ? '' : 'Branch is required.');
      ValidationSystem.setInputState(rollInp, isRoll, isRoll ? '' : 'Roll number is required.');
      ValidationSystem.setInputState(yearInp, isYear, isYear ? '' : 'Select year of study.');
      ValidationSystem.setInputState(semInp, isSem, isSem ? '' : 'Select semester.');

      // CGPA Check (0.0 to 10.0)
      const cgpaVal = parseFloat(cgpaInp.value);
      const isCgpaValid = !isNaN(cgpaVal) && cgpaVal >= 0 && cgpaVal <= 10;
      ValidationSystem.setInputState(cgpaInp, isCgpaValid, isCgpaValid ? '' : 'CGPA must be a value between 0.0 and 10.0');

      return isCollege && isBranch && isRoll && isYear && isSem && isCgpaValid;
    }

    if (currentStep === 3) {
      // Photo and Resume are optional, but we check size requirements if uploaded
      return true;
    }

    return false;
  }

  // --- Click Nav Listeners ---
  nextBtn.addEventListener('click', () => {
    if (validateStep()) {
      if (currentStep < totalSteps) {
        currentStep++;
        updateStepper();
      } else {
        submitProfileSetup();
      }
    } else {
      window.toast.show('warning', 'Invalid Input', 'Please fill in all details correctly to continue.', 3500);
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      updateStepper();
    }
  });


  // ==========================================
  // DRAG & DROP PHOTO UPLOAD HANDLERS
  // ==========================================
  if (photoZone && photoInput) {
    photoZone.addEventListener('click', () => photoInput.click());

    photoZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      photoZone.classList.add('dragover');
    });

    photoZone.addEventListener('dragleave', () => {
      photoZone.classList.remove('dragover');
    });

    photoZone.addEventListener('drop', (e) => {
      e.preventDefault();
      photoZone.classList.remove('dragover');
      if (e.dataTransfer.files.length) {
        photoInput.files = e.dataTransfer.files;
        processPhoto(e.dataTransfer.files[0]);
      }
    });

    photoInput.addEventListener('change', () => {
      if (photoInput.files.length) {
        processPhoto(photoInput.files[0]);
      }
    });
  }

  function processPhoto(file) {
    if (!file.type.startsWith('image/')) {
      window.toast.show('error', 'File Error', 'Please select an image file (.png, .jpg, .jpeg)', 3500);
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      window.toast.show('error', 'Size limit exceeded', 'Photo must be under 2MB.', 3500);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      base64PhotoData = e.target.result;
      photoPreview.src = base64PhotoData;
      photoPreviewWrap.style.display = 'block';
      photoPlaceholder.style.display = 'none';
      window.toast.show('success', 'Photo uploaded', 'Profile picture linked successfully.', 2500);
    };
    reader.readAsDataURL(file);
  }

  if (photoRemoveBtn) {
    photoRemoveBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      photoInput.value = '';
      base64PhotoData = '';
      photoPreview.src = '';
      photoPreviewWrap.style.display = 'none';
      photoPlaceholder.style.display = 'flex';
    });
  }


  // ==========================================
  // DRAG & DROP RESUME PDF HANDLERS
  // ==========================================
  if (resumeZone && resumeInput) {
    resumeZone.addEventListener('click', () => resumeInput.click());

    resumeZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      resumeZone.classList.add('dragover');
    });

    resumeZone.addEventListener('dragleave', () => {
      resumeZone.classList.remove('dragover');
    });

    resumeZone.addEventListener('drop', (e) => {
      e.preventDefault();
      resumeZone.classList.remove('dragover');
      if (e.dataTransfer.files.length) {
        resumeInput.files = e.dataTransfer.files;
        processResume(e.dataTransfer.files[0]);
      }
    });

    resumeInput.addEventListener('change', () => {
      if (resumeInput.files.length) {
        processResume(resumeInput.files[0]);
      }
    });
  }

  function processResume(file) {
    if (file.type !== 'application/pdf') {
      window.toast.show('error', 'File Error', 'Please upload a PDF document.', 3500);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      window.toast.show('error', 'Size limit exceeded', 'Resume PDF must be under 5MB.', 3500);
      return;
    }

    uploadedResumeName = file.name;
    resumeFilename.textContent = file.name;
    // Format file size
    const sizeKb = Math.round(file.size / 1024);
    resumeFilesize.textContent = sizeKb > 1000 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

    resumePreviewWrap.style.display = 'block';
    resumePlaceholder.style.display = 'none';
    window.toast.show('success', 'Resume Linked', 'PDF parsing models initialized.', 2500);
  }

  if (resumeRemoveBtn) {
    resumeRemoveBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      resumeInput.value = '';
      uploadedResumeName = '';
      resumePreviewWrap.style.display = 'none';
      resumePlaceholder.style.display = 'flex';
    });
  }


  // ==========================================
  // FINAL SUBMISSION ACTION
  // ==========================================
  function submitProfileSetup() {
    setBtnLoading(nextBtn, true);

    const name = document.getElementById('prof-name').value;
    const email = document.getElementById('prof-email').value;
    const college = document.getElementById('prof-college').value;
    const branch = document.getElementById('prof-branch').value;
    const year = document.getElementById('prof-year').value;
    const semester = document.getElementById('prof-semester').value;
    const roll = document.getElementById('prof-roll').value;
    const cgpa = document.getElementById('prof-cgpa').value;

    const studentProfile = {
      name,
      email,
      college,
      branch,
      year,
      semester,
      roll,
      cgpa,
      photo: base64PhotoData,
      resumeName: uploadedResumeName
    };

    // Save profile state to LocalStorage
    localStorage.setItem('nexusED_profile', JSON.stringify(studentProfile));

    setTimeout(() => {
      setBtnLoading(nextBtn, false);
      
      // Inject success checkmark inside card
      const card = document.querySelector('.profile-card');
      card.className = 'profile-card setup-completed text-center animate__animated animate__zoomIn';
      card.innerHTML = `
        <div class="success-checkmark mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h3 class="mb-2" style="font-size: 1.5rem; font-weight: 700;">Calibration Setup Complete</h3>
        <p class="text-muted mb-4" style="max-width: 400px; margin: 0 auto;">Profile verified successfully. Forwarding to the Career Goal Selection engine...</p>
      `;

      window.toast.show('success', 'Profile Verified', 'Forwarding to career selections...', 3000);

      // Redirect to Career Selection page
      setTimeout(() => {
        window.location.href = 'career.html';
      }, 1800);

    }, 2000);
  }

  // --- Button State Loader overlay ---
  function setBtnLoading(button, isLoading) {
    if (!button) return;

    if (isLoading) {
      button.disabled = true;
      const text = button.querySelector('span');
      const textVal = text ? text.textContent : '';
      button.setAttribute('data-original-text', textVal);
      button.innerHTML = `
        <div class="spinner"></div>
        <span>Saving...</span>
      `;
    } else {
      button.disabled = false;
      const origText = button.getAttribute('data-original-text') || 'Next Step';
      button.innerHTML = `
        <span>${origText}</span>
        <i data-lucide="arrow-right" class="arrow-icon"></i>
      `;
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  }

});
