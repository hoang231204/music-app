document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('.validate-form');

  // Regex patterns
  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  };

  function showError(input, message) {
    input.classList.add('border-red-500');
    input.classList.remove('border-gray-300', 'dark:border-gray-600');

    const parentNode = input.parentNode;
    if (!parentNode) return;

    let errorSpan = parentNode.querySelector('.error-message');
    if (!errorSpan) {
      errorSpan = document.createElement('span');
      errorSpan.className = 'error-message text-red-500 text-xs mt-1 block';
      parentNode.appendChild(errorSpan);
    }
    errorSpan.textContent = message;
  }

  function clearError(input) {
    input.classList.remove('border-red-500');
    const parentNode = input.parentNode;
    if (!parentNode) return;

    const errorSpan = parentNode.querySelector('.error-message');
    if (errorSpan) {
      errorSpan.remove();
    }
  }

  function validateField(input) {
    const rulesStr = input.getAttribute('data-rules');
    if (!rulesStr) return true;

    const rules = rulesStr.split('|');
    const value = input.value.trim();

    for (const rule of rules) {
      if (rule === 'required') {
        if (!value) {
          showError(input, 'This field is required');
          return false;
        }
      } else if (rule === 'email') {
        if (value && !patterns.email.test(value)) {
          showError(input, 'Invalid email address');
          return false;
        }
      } else if (rule.startsWith('min:')) {
        const min = parseInt(rule.split(':')[1], 10);
        if (value && value.length < min) {
          showError(input, `Minimum length is ${min} characters`);
          return false;
        }
      } else if (rule.startsWith('max:')) {
        const max = parseInt(rule.split(':')[1], 10);
        if (value && value.length > max) {
          showError(input, `Maximum length is ${max} characters`);
          return false;
        }
      } else if (rule.startsWith('match:')) {
        const targetName = rule.split(':')[1];
        const form = input.form;
        if (form) {
          const targetInput = form.querySelector(`[name="${targetName}"]`);
          if (targetInput && value !== targetInput.value) {
            showError(input, 'Passwords do not match');
            return false;
          }
        }
      } else if (rule.startsWith('fileSize:')) {
        // In MB
        const maxMb = parseFloat(rule.split(':')[1]);
        if (input.files && input.files[0]) {
          const fileSizeMb = input.files[0].size / (1024 * 1024);
          if (fileSizeMb > maxMb) {
            showError(input, `File must be less than ${maxMb}MB`);
            return false;
          }
        }
      } else if (rule.startsWith('fileType:')) {
        const exts = rule.split(':')[1].split(',');
        if (input.files && input.files[0]) {
          const fileName = input.files[0].name;
          const ext = fileName.split('.').pop()?.toLowerCase() || '';
          if (!exts.includes(ext)) {
            showError(input, `Allowed types: ${exts.join(', ')}`);
            return false;
          }
        }
      }
    }

    clearError(input);
    return true;
  }

  forms.forEach((form) => {
    const inputs = form.querySelectorAll('[data-rules]');

    // Validate on blur, input, change
    inputs.forEach((input) => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => clearError(input));
      input.addEventListener('change', () => clearError(input));
    });

    // Validate on submit
    form.addEventListener('submit', (e) => {
      let isValid = true;
      let firstInvalidInput = null;

      for (const input of inputs) {
        if (!validateField(input)) {
          isValid = false;
          if (!firstInvalidInput) {
            firstInvalidInput = input;
          }
        }
      }

      if (!isValid) {
        e.preventDefault();
        if (firstInvalidInput) {
          firstInvalidInput.focus();
        }
      }
    });
  });
});