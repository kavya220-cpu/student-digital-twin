/* assets/js/auth.js */

document.addEventListener('DOMContentLoaded', () => {
  // --- View Nodes ---
  const cards = {
    login: document.getElementById('login-card'),
    register: document.getElementById('register-card'),
    forgot: document.getElementById('forgot-card'),
    welcome: document.getElementById('welcome-card')
  };

  // --- Initialize Live Validations ---
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const forgotForm = document.getElementById('forgot-form');
  const onboardingForm = document.getElementById('onboarding-form');

  if (loginForm) ValidationSystem.initLiveValidation(loginForm);
  if (registerForm) ValidationSystem.initLiveValidation(registerForm);
  if (forgotForm) ValidationSystem.initLiveValidation(forgotForm);

  // --- Password Show/Hide Toggle ---
  const passwordToggles = document.querySelectorAll('.password-toggle-btn');
  passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const input = toggle.closest('.form-group').querySelector('.form-input');
      const lucideIcon = toggle.querySelector('i');
      
      if (input.type === 'password') {
        input.type = 'text';
        toggle.classList.add('password-toggle-active');
        if (lucideIcon) {
          lucideIcon.setAttribute('data-lucide', 'eye-off');
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }
      } else {
        input.type = 'password';
        toggle.classList.remove('password-toggle-active');
        if (lucideIcon) {
          lucideIcon.setAttribute('data-lucide', 'eye');
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }
      }
    });
  });

  // --- GSAP View Switcher ---
  function transitionView(fromCard, toCard) {
    if (!fromCard || !toCard) return;

    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline();
      
      // Scale and fade out from card
      tl.to(fromCard, {
        opacity: 0,
        scale: 0.95,
        y: -15,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          fromCard.style.display = 'none';
          fromCard.classList.remove('active');
          
          toCard.style.display = 'block';
          toCard.classList.add('active');
          
          // Re-trigger layout calculations for Lucide icons
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }
      });

      // Scale and fade in to card
      tl.fromTo(toCard, {
        opacity: 0,
        scale: 0.95,
        y: 15
      }, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.5,
        ease: 'back.out(1.2)',
        clearProps: 'transform,opacity'
      });
    } else {
      // Fallback
      fromCard.style.display = 'none';
      fromCard.classList.remove('active');
      toCard.style.display = 'block';
      toCard.classList.add('active');
    }
  }

  // --- Switch View Triggers ---
  const toRegisterBtns = document.querySelectorAll('.go-to-register');
  const toLoginBtns = document.querySelectorAll('.go-to-login');
  const toForgotBtns = document.querySelectorAll('.go-to-forgot');

  toRegisterBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    const activeCard = document.querySelector('.auth-card.active');
    transitionView(activeCard, cards.register);
  }));

  toLoginBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    const activeCard = document.querySelector('.auth-card.active');
    transitionView(activeCard, cards.login);
  }));

  toForgotBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    const activeCard = document.querySelector('.auth-card.active');
    transitionView(activeCard, cards.forgot);
  }));


  // ==========================================
  // LOGIN SUBMISSION FLOW
  // ==========================================
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailInput = loginForm.querySelector('input[type="email"]');
      const passInput = loginForm.querySelector('input[name="password"]');

      const isEmailVal = ValidationSystem.validateEmail(emailInput);
      const isPassVal = ValidationSystem.validatePassword(passInput);

      if (isEmailVal && isPassVal) {
        setBtnLoading(loginForm.querySelector('button[type="submit"]'), true);
        
        // Mock API Login delay
        setTimeout(() => {
          setBtnLoading(loginForm.querySelector('button[type="submit"]'), false);
          window.toast.show('success', 'Welcome Back!', 'Login successful. Redirecting to Profile Setup...', 3000);
          
          // Redirect to profile setup onboarding
          setTimeout(() => {
            window.location.href = 'profile.html';
          }, 1500);
        }, 1800);
      } else {
        window.toast.show('error', 'Authentication Failed', 'Please fix the highlighted form errors.', 4000);
      }
    });
  }


  // ==========================================
  // MULTI-STEP REGISTRATION FLOW
  // ==========================================
  let currentRegStep = 1;
  const regSteps = document.querySelectorAll('.reg-step-content');
  const stepNodes = document.querySelectorAll('.step-indicator-node');
  const stepLineFill = document.querySelector('.step-progress-fill');
  
  const regPrevBtn = document.getElementById('reg-prev');
  const regNextBtn = document.getElementById('reg-next');

  function updateRegStepper() {
    // Show/hide steps
    regSteps.forEach((step, idx) => {
      if (idx + 1 === currentRegStep) {
        step.classList.add('active');
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(step, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4 });
        }
      } else {
        step.classList.remove('active');
      }
    });

    // Update Node Classes
    stepNodes.forEach((node, idx) => {
      const stepNum = idx + 1;
      if (stepNum < currentRegStep) {
        node.className = 'step-indicator-node completed';
        node.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      } else if (stepNum === currentRegStep) {
        node.className = 'step-indicator-node active';
        node.innerHTML = stepNum;
      } else {
        node.className = 'step-indicator-node';
        node.innerHTML = stepNum;
      }
    });

    // Connect node lines progress
    const progressWidth = ((currentRegStep - 1) / (stepNodes.length - 1)) * 100;
    stepLineFill.style.width = `${progressWidth}%`;

    // Manage Buttons Labels & Icons
    if (currentRegStep === 1) {
      regPrevBtn.style.visibility = 'hidden';
    } else {
      regPrevBtn.style.visibility = 'visible';
    }

    if (currentRegStep === stepNodes.length) {
      regNextBtn.innerHTML = `<span>Create Account</span> <i data-lucide="check" class="arrow-icon"></i>`;
    } else {
      regNextBtn.innerHTML = `<span>Next Step</span> <i data-lucide="arrow-right" class="arrow-icon"></i>`;
    }
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // Handle registration wizard navigation clicks
  if (regNextBtn) {
    regNextBtn.addEventListener('click', () => {
      if (validateCurrentRegStep()) {
        if (currentRegStep < stepNodes.length) {
          currentRegStep++;
          updateRegStepper();
        } else {
          // Final Submit
          submitRegistration();
        }
      } else {
        window.toast.show('warning', 'Incomplete Form', 'Please fill in all required fields correctly before moving forward.', 3500);
      }
    });
  }

  if (regPrevBtn) {
    regPrevBtn.addEventListener('click', () => {
      if (currentRegStep > 1) {
        currentRegStep--;
        updateRegStepper();
      }
    });
  }

  // Validate step contents individually
  function validateCurrentRegStep() {
    if (currentRegStep === 1) {
      const nameInput = document.getElementById('reg-name');
      const emailInput = document.getElementById('reg-email');
      const phoneInput = document.getElementById('reg-phone');

      const isName = ValidationSystem.validateName(nameInput);
      const isEmail = ValidationSystem.validateEmail(emailInput);
      const isPhone = ValidationSystem.validatePhone(phoneInput);

      return isName && isEmail && isPhone;
    } 
    
    if (currentRegStep === 2) {
      const passInput = document.getElementById('reg-pass');
      const confirmInput = document.getElementById('reg-confirm');

      const isPassValid = ValidationSystem.validatePassword(passInput);
      
      // Match Check
      const matches = passInput.value === confirmInput.value;
      if (!matches) {
        ValidationSystem.setInputState(confirmInput, false, 'Passwords do not match.');
      } else if (confirmInput.value) {
        ValidationSystem.setInputState(confirmInput, true);
      }

      // Check strength score
      const strengthScore = ValidationSystem.checkPasswordStrength(passInput.value);
      const isStrongEnough = strengthScore >= 2; // Require at least a Medium strength password

      if (!isStrongEnough && passInput.value) {
        ValidationSystem.setInputState(passInput, false, 'Password is too weak. Please include letters, numbers, or symbols.');
      }

      return isPassValid && matches && isStrongEnough;
    }

    if (currentRegStep === 3) {
      // Avatar Step: Optional, so we allow proceeding
      return true;
    }

    if (currentRegStep === 4) {
      const termsCheck = document.getElementById('reg-terms');
      return termsCheck.checked;
    }

    return false;
  }

  // Password strength meter binding inside registration
  const regPassInput = document.getElementById('reg-pass');
  if (regPassInput) {
    const bars = document.querySelectorAll('.strength-bar');
    const txt = document.querySelector('.strength-text');
    regPassInput.addEventListener('input', () => {
      ValidationSystem.updateStrengthMeter(regPassInput, bars, txt);
    });
  }

  // Final registration creation handler
  function submitRegistration() {
    setBtnLoading(regNextBtn, true);
    
    setTimeout(() => {
      setBtnLoading(regNextBtn, false);
      
      // Replace register-form inner element with success check animation
      const cardBody = document.getElementById('register-form');
      const originalHTML = cardBody.innerHTML;
      
      cardBody.innerHTML = `
        <div class="text-center py-4 animate__animated animate__fadeIn">
          <div class="success-checkmark mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h3 class="mb-2" style="font-weight: 700; font-size: 1.4rem;">Account Created!</h3>
          <p class="text-muted mb-4">Congratulations, your NexusED profile is ready. Set up your growth tracking now.</p>
        </div>
      `;
      
      window.toast.show('success', 'Registration Completed', 'Profile initialized. Redirecting to onboarding setup...', 3000);
      
      setTimeout(() => {
        // Redirect to profile setup onboarding
        window.location.href = 'profile.html';
      }, 2000);
    }, 2000);
  }


  // ==========================================
  // DRAG & DROP PROFILE PICTURE
  // ==========================================
  const dropzone = document.getElementById('avatar-dropzone');
  const fileInput = document.getElementById('avatar-file-input');
  const previewWrapper = document.querySelector('.avatar-preview-wrapper');
  const previewImg = document.querySelector('.avatar-preview-img');
  const removeBtn = document.querySelector('.avatar-remove-btn');
  const uploadPlaceholder = document.querySelector('.avatar-upload-placeholder');

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      const files = e.dataTransfer.files;
      if (files.length) {
        fileInput.files = files;
        handleAvatarFile(files[0]);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length) {
        handleAvatarFile(fileInput.files[0]);
      }
    });
  }

  function handleAvatarFile(file) {
    if (!file.type.startsWith('image/')) {
      window.toast.show('error', 'File Type Error', 'Please select a valid image file (.png, .jpg, .jpeg)', 3500);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      previewWrapper.style.display = 'block';
      uploadPlaceholder.style.display = 'none';
      window.toast.show('info', 'Avatar Selected', 'Click Next Step to continue.', 2500);
    };
    reader.readAsDataURL(file);
  }

  if (removeBtn) {
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Avoid triggering dropzone click handler
      fileInput.value = '';
      previewImg.src = '';
      previewWrapper.style.display = 'none';
      uploadPlaceholder.style.display = 'block';
    });
  }


  // ==========================================
  // FORGOT PASSWORD FLOW (OTP & RESET)
  // ==========================================
  let forgotStep = 1; // 1: Email, 2: OTP, 3: New Passwords
  const forgotSections = {
    email: document.getElementById('forgot-sec-email'),
    otp: document.getElementById('forgot-sec-otp'),
    reset: document.getElementById('forgot-sec-reset')
  };
  const forgotBtn = document.getElementById('forgot-btn');
  const otpInputs = document.querySelectorAll('.otp-input');

  if (forgotBtn) {
    forgotBtn.addEventListener('click', () => {
      if (forgotStep === 1) {
        const emailInput = forgotSections.email.querySelector('input[type="email"]');
        if (ValidationSystem.validateEmail(emailInput)) {
          setBtnLoading(forgotBtn, true);
          setTimeout(() => {
            setBtnLoading(forgotBtn, false);
            window.toast.show('info', 'OTP Transmitted', `We sent a security code to ${emailInput.value}`, 4000);
            
            // Advance view to OTP
            forgotSections.email.style.display = 'none';
            forgotSections.otp.style.display = 'block';
            forgotStep = 2;
            forgotBtn.querySelector('span').textContent = 'Verify Security Code';
            
            // Focus first OTP field
            setTimeout(() => {
              if (otpInputs.length) otpInputs[0].focus();
            }, 300);
          }, 1500);
        }
      } 
      
      else if (forgotStep === 2) {
        // Validate OTP input is fully populated
        let otpCode = '';
        otpInputs.forEach(input => otpCode += input.value);

        if (otpCode.length === 6) {
          setBtnLoading(forgotBtn, true);
          setTimeout(() => {
            setBtnLoading(forgotBtn, false);
            window.toast.show('success', 'Identity Confirmed', 'Please input your new security passwords.', 3000);
            
            // Advance to New Passwords
            forgotSections.otp.style.display = 'none';
            forgotSections.reset.style.display = 'block';
            forgotStep = 3;
            forgotBtn.querySelector('span').textContent = 'Confirm Reset';
          }, 1500);
        } else {
          window.toast.show('warning', 'Invalid Code', 'Please input the full 6-digit verification code.', 3000);
        }
      } 
      
      else if (forgotStep === 3) {
        const pass1 = document.getElementById('reset-pass');
        const pass2 = document.getElementById('reset-confirm');

        const isP1 = ValidationSystem.validatePassword(pass1);
        const match = pass1.value === pass2.value;

        if (!match) {
          ValidationSystem.setInputState(pass2, false, 'Passwords do not match.');
        } else if (pass2.value) {
          ValidationSystem.setInputState(pass2, true);
        }

        if (isP1 && match) {
          setBtnLoading(forgotBtn, true);
          setTimeout(() => {
            setBtnLoading(forgotBtn, false);
            window.toast.show('success', 'Security Reset Complete', 'Your password was successfully updated.', 3000);
            
            // Transition back to Login card
            setTimeout(() => {
              transitionView(cards.forgot, cards.login);
              
              // Reset forgot password panels back to step 1
              setTimeout(() => {
                forgotStep = 1;
                forgotSections.email.style.display = 'block';
                forgotSections.otp.style.display = 'none';
                forgotSections.reset.style.display = 'none';
                forgotBtn.querySelector('span').textContent = 'Send Reset Code';
                // Reset inputs
                forgotForm.reset();
                forgotForm.querySelectorAll('.form-input').forEach(inp => {
                  inp.classList.remove('is-valid', 'is-invalid');
                });
              }, 600);
            }, 1000);
          }, 1800);
        }
      }
    });
  }

  // OTP inputs keyboard navigation loops
  otpInputs.forEach((input, index) => {
    // Jump focus forward
    input.addEventListener('input', (e) => {
      const val = input.value;
      if (val.length >= 1) {
        input.value = val.substring(0, 1); // Clamp length
        if (index < otpInputs.length - 1) {
          otpInputs[index + 1].focus();
        }
      }
    });

    // Handle delete/backspace cursor jumpback
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && index > 0) {
        otpInputs[index - 1].focus();
      }
    });

    // Capture copy/paste string block
    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasteData = e.clipboardData.getData('text').trim();
      if (/^\d{6}$/.test(pasteData)) {
        otpInputs.forEach((otpInp, idx) => {
          otpInp.value = pasteData[idx];
        });
        otpInputs[5].focus();
      }
    });
  });


  // ==========================================
  // STUDENT PROFILE ONBOARDING (WELCOME)
  // ==========================================
  const interestTags = document.querySelectorAll('.interest-tag-card');
  interestTags.forEach(tag => {
    tag.addEventListener('click', () => {
      tag.classList.toggle('active');
    });
  });

  const completeOnboardingBtn = document.getElementById('onboarding-finish');
  if (completeOnboardingBtn) {
    completeOnboardingBtn.addEventListener('click', () => {
      // Validate interest tags count
      const activeTags = document.querySelectorAll('.interest-tag-card.active');
      const gradYear = document.getElementById('onboard-grad').value;

      if (activeTags.length === 0) {
        window.toast.show('warning', 'Select Interests', 'Please select at least one growth domain domain to configure.', 3000);
        return;
      }

      if (!gradYear) {
        window.toast.show('warning', 'Academic Year', 'Please choose your expected graduation year.', 3000);
        return;
      }

      // Start Twin Initialization view within the welcome card
      const onboardingBody = document.getElementById('onboarding-body');
      const originalOnboardHTML = onboardingBody.innerHTML;

      onboardingBody.innerHTML = `
        <div class="twin-initialization-container text-center animate__animated animate__zoomIn">
          <div class="twin-graphic">
            <div class="twin-circle"></div>
            <div class="twin-circle-inner"></div>
            <div class="twin-core">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M12 6v6l4 2"></path></svg>
            </div>
          </div>
          <h3 class="mb-2" style="font-weight: 700;">Configuring Digital Twin...</h3>
          <p class="text-muted" style="font-size: 0.9rem;">Synthesizing academic trajectory models, portfolio roadmap configurations, and learning vectors.</p>
        </div>
      `;

      completeOnboardingBtn.style.display = 'none';

      // 2.5 seconds mock processing digital twin
      setTimeout(() => {
        onboardingBody.innerHTML = `
          <div class="text-center py-4 animate__animated animate__fadeIn">
            <div class="success-checkmark mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h3 class="mb-2" style="font-weight: 700; font-size: 1.4rem;">Digital Twin Sync Complete!</h3>
            <p class="text-muted mb-4">Your personalized growth parameters are calibrated. Welcome to NexusED.</p>
          </div>
        `;
        
        window.toast.show('success', 'Calibration Succeeded', 'Entering Growth Intelligence Platform...', 3500);

        setTimeout(() => {
          // Complete redirection (simulate dashboard load)
          window.location.reload();
        }, 2200);

      }, 2800);
    });
  }

  // --- Button Loading Spin Overlay UI Utility ---
  function setBtnLoading(button, isLoading) {
    if (!button) return;

    if (isLoading) {
      button.disabled = true;
      const text = button.querySelector('span');
      const textVal = text ? text.textContent : '';
      button.setAttribute('data-original-text', textVal);
      
      button.innerHTML = `
        <div class="spinner"></div>
        <span>Processing...</span>
      `;
    } else {
      button.disabled = false;
      const origText = button.getAttribute('data-original-text') || 'Submit';
      
      // Determine what arrow icon fits
      let iconMarkup = '';
      if (button.id === 'reg-next') {
        iconMarkup = `<i data-lucide="arrow-right" class="arrow-icon"></i>`;
      } else if (button.id === 'login-btn' || button.closest('#login-form')) {
        iconMarkup = `<i data-lucide="log-in" class="arrow-icon"></i>`;
      } else if (button.id === 'forgot-btn') {
        iconMarkup = `<i data-lucide="key-round" class="arrow-icon"></i>`;
      }

      button.innerHTML = `
        <span>${origText}</span>
        ${iconMarkup}
      `;
      
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  }

});
