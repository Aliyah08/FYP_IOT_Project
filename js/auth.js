import { auth } from './firebase_config.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Section toggling
const loginSection = document.getElementById('login-section');
const signupSection = document.getElementById('signup-section');
const showSignup = document.getElementById('showSignupBtn');
const showLogin = document.getElementById('showLoginBtn');

showSignup.addEventListener('click', (e) => {
  e.preventDefault();
  loginSection.style.display = 'none';
  signupSection.style.display = 'block';
});
showLogin.addEventListener('click', (e) => {
  e.preventDefault();
  signupSection.style.display = 'none';
  loginSection.style.display = 'block';
});

// LOGIN
const loginForm = document.getElementById('loginForm');
const loginEmailInput = document.getElementById('loginEmail');
const loginPasswordInput = document.getElementById('loginPassword');
const loginBtn = document.getElementById('loginBtn');
const loginBtnText = document.getElementById('loginBtnText');
const loginLoadingSpinner = document.getElementById('loginLoadingSpinner');
const loginError = document.getElementById('loginError');

function setLoginLoading(isLoading) {
  if (isLoading) {
    loginLoadingSpinner.style.display = 'inline-block';
    loginBtnText.textContent = 'Logging in...';
    loginBtn.disabled = true;
  } else {
    loginLoadingSpinner.style.display = 'none';
    loginBtnText.textContent = 'Log in';
    loginBtn.disabled = false;
  }
}

function showLoginError(message) {
  loginError.textContent = message;
  loginError.style.display = 'block';
  setTimeout(() => {
    loginError.style.display = 'none';
  }, 5000);
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = loginEmailInput.value.trim();
  const password = loginPasswordInput.value;
  if (!email || !password) {
    showLoginError('Please fill in all fields');
    return;
  }
  setLoginLoading(true);
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "home.html"; // or your dashboard page
  } catch (error) {
    let errorMsg = 'Login failed. Please try again.';
    switch (error.code) {
      case 'auth/user-not-found':
        errorMsg = 'No account found with this email.';
        break;
      case 'auth/wrong-password':
        errorMsg = 'Incorrect password.';
        break;
      case 'auth/invalid-email':
        errorMsg = 'Invalid email address.';
        break;
      case 'auth/user-disabled':
        errorMsg = 'This account has been disabled.';
        break;
      case 'auth/too-many-requests':
        errorMsg = 'Too many failed attempts. Please try again later.';
        break;
    }
    showLoginError(errorMsg);
  } finally {
    setLoginLoading(false);
  }
});

// SIGNUP
const signupForm = document.getElementById('signupForm');
const signupNameInput = document.getElementById('signupName');
const signupEmailInput = document.getElementById('signupEmail');
const signupPasswordInput = document.getElementById('signupPassword');
const signupBtn = document.getElementById('signupBtn');
const signupBtnText = document.getElementById('signupBtnText');
const signupLoadingSpinner = document.getElementById('signupLoadingSpinner');
const signupError = document.getElementById('signupError');
const passwordToggle = document.getElementById('passwordToggle');

// Password eye functionality
let isPasswordVisible = false;
signupPasswordInput.addEventListener('input', function() {
  if (this.value.length > 0) {
    passwordToggle.style.display = 'flex';
  } else {
    passwordToggle.style.display = 'none';
    isPasswordVisible = false;
    this.type = 'password';
    passwordToggle.classList.remove('visible');
    passwordToggle.querySelector('.toggle-icon').textContent = '👁️';
  }
});
passwordToggle.addEventListener('click', function() {
  isPasswordVisible = !isPasswordVisible;
  if (isPasswordVisible) {
    signupPasswordInput.type = 'text';
    this.classList.add('visible');
    this.querySelector('.toggle-icon').textContent = '👁️‍🗨️';
  } else {
    signupPasswordInput.type = 'password';
    this.classList.remove('visible');
    this.querySelector('.toggle-icon').textContent = '👁️';
  }
});

function setSignupLoading(isLoading) {
  if (isLoading) {
    signupLoadingSpinner.style.display = 'inline-block';
    signupBtnText.textContent = 'Creating account...';
    signupBtn.disabled = true;
  } else {
    signupLoadingSpinner.style.display = 'none';
    signupBtnText.textContent = 'Sign up';
    signupBtn.disabled = false;
  }
}

function showSignupError(message) {
  signupError.textContent = message;
  signupError.style.display = 'block';
  setTimeout(() => {
    signupError.style.display = 'none';
  }, 5000);
}

function validatePassword(password) {
  if (password.length < 6) return 'Password must be at least 6 characters long.';
  return null;
}
function validateName(name) {
  if (name.trim().length < 2) return 'Name must be at least 2 characters long.';
  return null;
}

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = signupNameInput.value.trim();
  const email = signupEmailInput.value.trim();
  const password = signupPasswordInput.value;

  if (!name || !email || !password) {
    showSignupError('Please fill in all fields');
    return;
  }

  const nameError = validateName(name);
  if (nameError) {
    showSignupError(nameError);
    return;
  }
  const passwordError = validatePassword(password);
  if (passwordError) {
    showSignupError(passwordError);
    return;
  }

  setSignupLoading(true);
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    window.location.href = "home.html"; // or your dashboard page
  } catch (error) {
    let errorMsg = 'Failed to create account. Please try again.';
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMsg = 'An account with this email already exists.';
        break;
      case 'auth/invalid-email':
        errorMsg = 'Invalid email address.';
        break;
      case 'auth/weak-password':
        errorMsg = 'Password is too weak. Please choose a stronger password.';
        break;
      case 'auth/operation-not-allowed':
        errorMsg = 'Email/password accounts are not enabled. Please contact support.';
        break;
      case 'auth/too-many-requests':
        errorMsg = 'Too many attempts. Please try again later.';
        break;
    }
    showSignupError(errorMsg);
  } finally {
    setSignupLoading(false);
  }
});

// UX stuff for focus and entrance animations
document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.main-container');
  if (container) {
    container.style.opacity = '0';
    container.style.transform = 'translateY(30px)';
    setTimeout(() => {
      container.style.transition = 'all 0.8s ease';
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
    }, 100);
  }
  // Focus animation for inputs
  const inputs = document.querySelectorAll('.form-input');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.style.transform = 'scale(1.02)';
    });
    input.addEventListener('blur', function() {
      this.parentElement.style.transform = 'scale(1)';
    });
  });
});

// Optional: Clear errors on typing
document.querySelectorAll('.form-input').forEach(input => {
  input.addEventListener('input', function () {
    if (loginError) loginError.style.display = "none";
    if (signupError) signupError.style.display = "none";
    this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
  });
});
