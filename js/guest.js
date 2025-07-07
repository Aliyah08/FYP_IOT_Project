// No Firebase, no live data for guests! Just static/demo data and navigation.
function goToHomepage() {
    window.location.href = 'index.html';
}
function goToLogin() {
    window.location.href = 'auth.html';
}

// You may want to animate the device cards on page load:
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.device-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(.4,2.1,.9,.8)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200 + 300);
    });
});
