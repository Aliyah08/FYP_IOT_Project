function handleLogin() {
    // Redirect to login page
    window.location.href = 'login.html';
}

function handleGuestAccess() {
    // Redirect to guest page
    window.location.href = 'guest.html';
}

// Add dynamic particle creation
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    
    const colors = [
        'rgba(34, 197, 94, 0.3)',
        'rgba(59, 130, 246, 0.3)',
        'rgba(168, 85, 247, 0.3)'
    ];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    document.querySelector('.particles').appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 15000);
}

// Create particles periodically
setInterval(createParticle, 1000);

// Initial particles
for (let i = 0; i < 5; i++) {
    setTimeout(createParticle, i * 1000);
}