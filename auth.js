/* =========================================================================
   AUTH + ONBOARDING LOGIC (FRONTEND MVP)
   - Handles login
   - Handles multi-step registration (role-based)
   - File checks, live face capture, conditional fields
   - Persists to localStorage (swap with real backend later)
   ========================================================================= */

// ---------- Helpers ----------
const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

function show(el) { el.classList.remove('hidden'); }
function hide(el) { el.classList.add('hidden'); }
function toast(el, msg, ok = false) {
  el.textContent = msg;
  el.className = 'msg ' + (ok ? 'ok' : 'err');
}

function nextStep(current) {
  const steps = $$('.step');
  const i = steps.findIndex(s => s === current);
  if (i >= 0 && i < steps.length - 1) {
    steps[i].classList.remove('active');
    steps[i + 1].classList.add('active');
    window.scrollTo(0, 0);
  }
}

function prevStep(current) {
  const steps = $$('.step');
  const i = steps.findIndex(s => s === current);
  if (i > 0) {
    steps[i].classList.remove('active');
    steps[i - 1].classList.add('active');
    window.scrollTo(0, 0);
  }
}

// Persist user (demo only)
function saveUser(user) {
  const users = JSON.parse(localStorage.getItem('ap_users') || '[]');
  users.push(user);
  localStorage.setItem('ap_users', JSON.stringify(users));
}

// Find user (demo only)
function findUser(email) {
  const users = JSON.parse(localStorage.getItem('ap_users') || '[]');
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

// ---------- LOGIN ----------
const loginForm = $('#loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('#loginEmail').value.trim();
    const pass = $('#loginPassword').value;
    const role = $('#loginRole').value;
    const msg = $('#loginMsg');

    const user = findUser(email);
    if (!user) return toast(msg, 'No account found for this email.', false);
    if (user.password !== pass) return toast(msg, 'Incorrect password.', false);
    if (role && user.role !== role) return toast(msg, `This account is registered as ${user.role}.`, false);

    localStorage.setItem('ap_session', JSON.stringify({ email, ts: Date.now() }));
    toast(msg, 'Login successful. Redirecting…', true);

    // Route based on role (MVP)
    setTimeout(() => {
      if (user.role === 'client') window.location.href = 'listings.html';
      else window.location.href = 'agents.html';
    }, 600);
  });

  // Forgot link (demo)
  $('#forgotLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    const email = prompt('Enter your email to receive a reset link:');
    if (!email) return;
    alert('If this were live, we would email a secure reset link to: ' + email);
  });
}

// ---------- REGISTRATION WIZARD ----------
const regForm = $('#registerForm');
if (regForm) {
  // Initialize step navigation
  function initializeStepNavigation() {
    // Next buttons
    $$('.next', regForm).forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const step = e.target.closest('.step');
        
        if (!step) return;

        // Validate current step
        const requiredFields = $$('input[required], select[required], textarea[required]', step);
        let isValid = true;
        
        for (const field of requiredFields) {
          if (!field.value || !field.checkValidity()) {
            isValid = false;
            field.style.borderColor = 'var(--err)';
            field.focus();
            break;
          } else {
            field.style.borderColor = '';
          }
        }

        if (!isValid) {
          toast($('#registerMsg'), 'Please complete all required fields.', false);
          return;
        }

        // Special handling for step 0 (initial registration)
        if (step.dataset.step === '0') {
          const p1 = $('#password').value;
          const p2 = $('#confirmPassword').value;
          
          if (p1 !== p2) {
            toast($('#registerMsg'), 'Passwords do not match.', false);
            $('#confirmPassword').style.borderColor = 'var(--err)';
            return;
          }
          
          if (p1.length < 6) {
            toast($('#registerMsg'), 'Password must be at least 6 characters.', false);
            $('#password').style.borderColor = 'var(--err)';
            return;
          }

          const role = $('#role').value;
          if (!role) {
            toast($('#registerMsg'), 'Please select a role.', false);
            $('#role').style.borderColor = 'var(--err)';
            return;
          }

          // Route to appropriate step based on role
          step.classList.remove('active');
          
          if (role === 'client') {
            $('[data-step="1-client"]').classList.add('active');
          } else {
            $('[data-step="1-verify"]').classList.add('active');
          }
          
          window.scrollTo(0, 0);
          return;
        }

        // Handle face verification step
        if (step.dataset.step === '2-face') {
          const role = $('#role').value;
          if (role !== 'client' && !$('#liveCanvas').classList.contains('hidden')) {
            // For non-clients, face capture is required
            if (!$('#liveCanvas').classList.contains('hidden')) {
              nextStep(step);
            } else {
              toast($('#registerMsg'), 'Please capture your face for verification.', false);
            }
            return;
          } else if (role === 'client') {
            // For clients, face verification is optional
            nextStep(step);
            return;
          }
        }

        // Regular next step
        nextStep(step);
      });
    });

    // Previous buttons
    $$('.prev', regForm).forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const step = e.target.closest('.step');
        prevStep(step);
      });
    });
  }

  // Diaspora conditional block
  const diasporaSelect = $('#isDiaspora');
  if (diasporaSelect) {
    diasporaSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      const block = $('#diasporaBlock');
      if (val === 'yes') show(block); else hide(block);
    });
  }

  // ---- Live Face Verification ----
  let stream = null;
  const liveVideo = $('#liveVideo');
  const liveCanvas = $('#liveCanvas');
  const faceMsg = $('#faceMsg');

  async function startCamera() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      liveVideo.srcObject = stream;
      toast(faceMsg, 'Camera started. Center your face and click Capture.', true);
    } catch (err) {
      console.error(err);
      toast(faceMsg, 'Camera access denied. Please allow camera permissions.', false);
    }
  }

  function captureFrame() {
    if (!liveVideo.srcObject) {
      toast(faceMsg, 'Start camera first.', false);
      return;
    }
    
    const canvas = document.createElement('canvas');
    canvas.width = liveVideo.videoWidth || 640;
    canvas.height = liveVideo.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(liveVideo, 0, 0, canvas.width, canvas.height);
    
    liveCanvas.width = canvas.width;
    liveCanvas.height = canvas.height;
    const destCtx = liveCanvas.getContext('2d');
    destCtx.drawImage(canvas, 0, 0);
    
    show(liveCanvas);
    toast(faceMsg, 'Face captured successfully!', true);
    $('#retake').classList.remove('hidden');
    
    const faceData = liveCanvas.toDataURL('image/png');
    localStorage.setItem('ap_face_verification', faceData);
  }

  function retake() {
    hide(liveCanvas);
    toast(faceMsg, 'Ready to capture again.', true);
  }

  // Attach face verification events
  $('#startCam')?.addEventListener('click', startCamera);
  $('#captureFace')?.addEventListener('click', captureFrame);
  $('#retake')?.addEventListener('click', retake);

  // ---- Submit Registration ----
  regForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const role = $('#role').value;
    const base = {
      fullName: $('#fullName').value.trim(),
      email: $('#email').value.trim(),
      password: $('#password').value,
      role,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      isVerified: role === 'client',
      verificationStatus: role === 'client' ? 'verified' : 'pending'
    };

    // Collect role-specific data
    let payload = {};
    
    if (role === 'client') {
      payload = {
        buyGoal: $('#buyGoal').value,
        timeline: $('#timeline').value,
        budget: parseInt($('#budget').value || '0', 10),
        stateToBuy: $('#stateToBuy').value,
        currentLocation: $('#currentLocation').value,
        isDiaspora: $('#isDiaspora').value === 'yes',
        diasporaInspector: $('#diasporaInspector').value || null,
        requireVideoInspection: $('#autoVideo').checked,
        preferences: {
          notifications: true,
          newsletter: false
        }
      };
    } else {
      // Realtor / Organization
      const idFile = $('#idUpload').files[0];
      const cacFile = $('#cacUpload').files[0];
      
      if (!idFile || !cacFile) { 
        toast($('#registerMsg'), 'Please upload required documents.', false);
        return; 
      }

      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(idFile.type) || !validTypes.includes(cacFile.type)) {
        toast($('#registerMsg'), 'Please upload valid document formats (JPG, PNG, PDF).', false);
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (idFile.size > maxSize || cacFile.size > maxSize) {
        toast($('#registerMsg'), 'Files must be under 5MB.', false);
        return;
      }

      payload = {
        companyName: $('#companyName').value,
        regNumber: $('#regNumber').value,
        officeAddress: $('#officeAddress').value,
        bio: $('#bio').value,
        idDocName: idFile.name,
        idDocType: idFile.type,
        idDocSize: idFile.size,
        cacDocName: cacFile.name,
        cacDocType: cacFile.type,
        cacDocSize: cFile.size,
        faceCaptured: !$('#liveCanvas').classList.contains('hidden'),
        verificationLevel: 'basic'
      };
    }

    if (!$('#agree').checked) {
      toast($('#registerMsg'), 'You must accept the Terms to proceed.', false);
      return;
    }

    if (findUser(base.email)) {
      toast($('#registerMsg'), 'An account with this email already exists.', false);
      return;
    }

    const user = { ...base, profile: payload };
    
    const faceData = localStorage.getItem('ap_face_verification');
    if (faceData) {
      user.faceVerification = {
        image: faceData,
        timestamp: new Date().toISOString(),
        verified: false
      };
    }

    saveUser(user);

    if (stream) { 
      stream.getTracks().forEach(t => t.stop()); 
    }

    toast($('#registerMsg'), 'Account created successfully! Redirecting…', true);
    localStorage.removeItem('ap_face_verification');
    
    setTimeout(() => {
      if (role === 'client') {
        window.location.href = 'listings.html';
      } else {
        window.location.href = 'agents.html';
      }
    }, 1500);
  });

  // Initialize navigation
  initializeStepNavigation();
}

// ---------- PASSWORD VISIBILITY TOGGLE ----------
function addPasswordToggle() {
  const passwordInputs = $$('input[type="password"]');
  passwordInputs.forEach(input => {
    if (input.parentNode.querySelector('.toggle-password')) return;
    
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'toggle-password';
    toggleBtn.innerHTML = '👁';
    toggleBtn.style.cssText = 'position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 18px; color: var(--muted);';
    
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position: relative;';
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);
    wrapper.appendChild(toggleBtn);
    
    let visible = false;
    toggleBtn.addEventListener('click', () => {
      visible = !visible;
      input.type = visible ? 'text' : 'password';
      toggleBtn.innerHTML = visible ? '🙈' : '👁';
    });
  });
}

// ---------- REAL-TIME VALIDATION ----------
function addRealTimeValidation() {
  // Email validation
  const emailInput = $('#email');
  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      const email = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email)) {
        toast($('#registerMsg'), 'Please enter a valid email address.', false);
        emailInput.style.borderColor = 'var(--err)';
      } else {
        emailInput.style.borderColor = '';
      }
    });
  }

  // Password strength indicator
  const passwordInput = $('#password');
  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      const password = passwordInput.value;
      const strength = calculatePasswordStrength(password);
      updatePasswordStrengthIndicator(strength);
    });
  }

  // Confirm password validation
  const confirmInput = $('#confirmPassword');
  if (confirmInput) {
    confirmInput.addEventListener('input', () => {
      const password = $('#password').value;
      const confirm = confirmInput.value;
      if (password && confirm && password !== confirm) {
        confirmInput.style.borderColor = 'var(--err)';
      } else {
        confirmInput.style.borderColor = '';
      }
    });
  }
}

function calculatePasswordStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  return Math.min(strength, 4);
}

function updatePasswordStrengthIndicator(strength) {
  const indicator = $('#passwordStrength');
  if (!indicator) return;
  
  const levels = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
  const colors = ['#ff5252', '#ffcc00', '#1ea7ff', '#1fbf75', '#00ffc6'];
  
  indicator.textContent = levels[strength] || 'Very Weak';
  indicator.style.color = colors[strength] || '#ff5252';
}

// ---------- INITIALIZATION ----------
document.addEventListener('DOMContentLoaded', () => {
  addPasswordToggle();
  addRealTimeValidation();
  
  // Add password strength indicator
  const passwordField = $('#password')?.parentNode;
  if (passwordField) {
    const strengthIndicator = document.createElement('div');
    strengthIndicator.id = 'passwordStrength';
    strengthIndicator.style.cssText = 'font-size: 0.8rem; margin-top: 5px; color: var(--muted);';
    passwordField.appendChild(strengthIndicator);
  }
});
