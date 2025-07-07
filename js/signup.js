// Firebase Configuration (Replace with your actual config)
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// DOM Elements
const signupForm = document.getElementById('signupForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const signupBtn = document.getElementById('signupBtn');
const signupBtnText = document.getElementById('signupBtnText');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const passwordToggle = document.getElementById('passwordToggle');

// Password visibility toggle functionality
let isPasswordVisible = false;

// Show/Hide password toggle button based on input
passwordInput.addEventListener('input', function() {
    if (this.value.length > 0) {
        passwordToggle.style.display = 'flex';
    } else {
        passwordToggle.style.display = 'none';
        // Reset to hidden state when input is empty
        isPasswordVisible = false;
        this.type = 'password';
        passwordToggle.classList.remove('visible');
        passwordToggle.querySelector('.toggle-icon').textContent = '👁️';
    }
});

// Toggle password visibility
passwordToggle.addEventListener('click', function() {
    isPasswordVisible = !isPasswordVisible;
    
    if (isPasswordVisible) {
        passwordInput.type = 'text';
        this.classList.add('visible');
        this.querySelector('.toggle-icon').textContent = '👁️‍🗨️';
    } else {
        passwordInput.type = 'password';
        this.classList.remove('visible');
        this.querySelector('.toggle-icon').textContent = '👁️';
    }
});

// Show/Hide Loading State
function setLoading(isLoading) {
    if (isLoading) {
        loadingSpinner.style.display = 'inline-block';
        signupBtnText.textContent = 'Creating account...';
        signupBtn.disabled = true;
    } else {
        loadingSpinner.style.display = 'none';
        signupBtnText.textContent = 'Sign up';
        signupBtn.disabled = false;
    }
}

// Show Error Message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

// Validate password strength
function validatePassword(password) {
    if (password.length < 6) {
        return 'Password must be at least 6 characters long.';
    }
    return null;
}

// Validate name
function validateName(name) {
    if (name.trim().length < 3) {
        return 'Name must be at least 3 characters long.';
    }
    return null;
}

// Handle Form Submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Validation
    if (!name || !email || !password) {
        showError('Please fill in all fields');
        return;
    }

    const nameError = validateName(name);
    if (nameError) {
        showError(nameError);
        return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
        showError(passwordError);
        return;
    }

    setLoading(true);

    try {
        // Create user account
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Update user profile with name
        await user.updateProfile({
            displayName: name
        });

        console.log('Account created successfully:', user);
        
        // Store additional user data if needed
        // You can add code here to store user data in Firebase Firestore or Realtime Database
        
        // Redirect to DeviceSelection page
        alert('Account created successfully! Redirecting to device selection...');
        window.location.href = 'DeviceSelection.html';
        
    } catch (error) {
        console.error('Signup error:', error);
        
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
        
        showError(errorMsg);
    } finally {
        setLoading(false);
    }
});

// Navigate to Login
function goToLogin() {
    window.location.href = 'login.html';
}

// Add entrance animation and input focus effects
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.main-container');
    container.style.opacity = '0';
    container.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        container.style.transition = 'all 0.8s ease';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 100);

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

    // Real-time validation feedback
    emailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        if (email && !email.includes('@')) {
            this.style.borderColor = '#ef4444';
        } else {
            this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
    });

    nameInput.addEventListener('blur', function() {
        const name = this.value.trim();
        if (name && name.length < 2) {
            this.style.borderColor = '#ef4444';
        } else {
            this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
    });

    passwordInput.addEventListener('blur', function() {
        const password = this.value;
        if (password && password.length < 6) {
            this.style.borderColor = '#ef4444';
        } else {
            this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
    });
});

// Auth State Observer
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('User is signed in:', user.email);
        // If user is already logged in, you might want to redirect them
        // window.location.href = 'deviceSelection.html';
    }
});

// Clear error messages when user starts typing
[nameInput, emailInput, passwordInput].forEach(input => {
    input.addEventListener('input', function() {
        if (errorMessage.style.display === 'block') {
            errorMessage.style.display = 'none';
        }
        // Reset border color on typing
        this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    });
});