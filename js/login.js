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
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const loginBtnText = document.getElementById('loginBtnText');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');

// Show/Hide Loading State
function setLoading(isLoading) {
    if (isLoading) {
        loadingSpinner.style.display = 'inline-block';
        loginBtnText.textContent = 'Logging in...';
        loginBtn.disabled = true;
    } else {
        loadingSpinner.style.display = 'none';
        loginBtnText.textContent = 'Log in';
        loginBtn.disabled = false;
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

// Handle Form Submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }

    setLoading(true);

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        console.log('Login successful:', user);
        
        // Redirect to dashboard
        alert('Login successful! Redirecting to dashboard...');
        // window.location.href = 'dashboard.html';
        
    } catch (error) {
        console.error('Login error:', error);
        
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
        
        showError(errorMsg);
    } finally {
        setLoading(false);
    }
});

// Navigate to Sign Up
function goToSignup() {
    alert('Redirecting to sign up page...');
    window.location.href = 'signup.html';
}

// Add entrance animation
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
});

// Auth State Observer
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('User is signed in:', user.email);
        // User is already logged in, redirect to dashboard
       // window.location.href = 'signup.html';
    }
});