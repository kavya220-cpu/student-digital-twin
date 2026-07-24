/* assets/js/validation.js */

const ValidationSystem = {
  // Regex Patterns
  patterns: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+?[\d\s-]{10,15}$/,
    name: /^[a-zA-Z\s]{2,50}$/
  },

  // Highlight input validity states
  setInputState(input, isValid, errorMsg = '') {
    const group = input.closest('.form-group');
    const errorDisplay = group.querySelector('.error-msg');
    
    if (isValid) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      if (errorDisplay) {
        errorDisplay.classList.remove('active');
        errorDisplay.textContent = '';
      }
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      if (errorDisplay) {
        errorDisplay.classList.add('active');
        errorDisplay.textContent = errorMsg;
      }
    }
  },

  validateEmail(input) {
    const val = input.value.trim();
    if (!val) {
      this.setInputState(input, false, 'Email is required.');
      return false;
    }
    const isValid = this.patterns.email.test(val);
    this.setInputState(input, isValid, isValid ? '' : 'Please enter a valid email address.');
    return isValid;
  },

  validatePhone(input) {
    const val = input.value.trim();
    if (!val) {
      this.setInputState(input, false, 'Phone number is required.');
      return false;
    }
    const isValid = this.patterns.phone.test(val);
    this.setInputState(input, isValid, isValid ? '' : 'Enter a valid phone number (10-15 digits).');
    return isValid;
  },

  validateName(input) {
    const val = input.value.trim();
    if (!val) {
      this.setInputState(input, false, 'Name is required.');
      return false;
    }
    const isValid = this.patterns.name.test(val);
    this.setInputState(input, isValid, isValid ? '' : 'Name must contain only letters and be at least 2 characters.');
    return isValid;
  },

  validatePassword(input) {
    const val = input.value;
    if (!val) {
      this.setInputState(input, false, 'Password is required.');
      return false;
    }
    const isValid = val.length >= 8;
    this.setInputState(input, isValid, isValid ? '' : 'Password must be at least 8 characters long.');
    return isValid;
  },

  checkPasswordStrength(password) {
    let score = 0;
    if (!password) return 0;

    // Award points for criteria
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score; // 0 to 4
  },

  updateStrengthMeter(input, strengthBars, strengthText) {
    const score = this.checkPasswordStrength(input.value);
    
    // Clear previous classes
    strengthBars.forEach(bar => {
      bar.className = 'strength-bar';
    });

    let statusText = 'Very Weak';
    let statusClass = 'weak';

    if (score === 0) {
      statusText = 'Enter password';
    } else if (score === 1) {
      statusText = 'Weak ⚠️';
      statusClass = 'weak';
      strengthBars[0].classList.add('weak');
    } else if (score === 2) {
      statusText = 'Medium ⚡';
      statusClass = 'medium';
      strengthBars[0].classList.add('medium');
      strengthBars[1].classList.add('medium');
    } else if (score === 3) {
      statusText = 'Good 👍';
      statusClass = 'medium';
      strengthBars[0].classList.add('medium');
      strengthBars[1].classList.add('medium');
      strengthBars[2].classList.add('medium');
    } else if (score === 4) {
      statusText = 'Strong 💪';
      statusClass = 'strong';
      strengthBars[0].classList.add('strong');
      strengthBars[1].classList.add('strong');
      strengthBars[2].classList.add('strong');
      strengthBars[3].classList.add('strong');
    }

    if (strengthText) {
      strengthText.textContent = `Strength: ${statusText}`;
      strengthText.className = `strength-text ${statusClass}`;
    }

    return score >= 2; // Return true if at least Medium strength is met
  },

  // Setup Live Validation Listeners
  initLiveValidation(form) {
    const inputs = form.querySelectorAll('.form-input');
    inputs.forEach(input => {
      const type = input.getAttribute('type');
      const name = input.getAttribute('name');

      input.addEventListener('blur', () => {
        if (name === 'email' || type === 'email') this.validateEmail(input);
        if (name === 'phone' || type === 'tel') this.validatePhone(input);
        if (name === 'fullname') this.validateName(input);
        if (name === 'password' && !input.closest('#register-form')) this.validatePassword(input);
      });

      // Quick check on input (typing) only if already validated once
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid') || input.classList.contains('is-valid')) {
          if (name === 'email' || type === 'email') this.validateEmail(input);
          if (name === 'phone' || type === 'tel') this.validatePhone(input);
          if (name === 'fullname') this.validateName(input);
          if (name === 'password' && !input.closest('#register-form')) this.validatePassword(input);
        }
      });
    });
  }
};

window.ValidationSystem = ValidationSystem;
