import { auth } from './firebase_config.js';
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Auth check + greeting
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = 'auth.html';
  } else {
    document.getElementById('welcomeTitle').textContent =
      `Welcome, ${user.displayName || "User"}!`;
    document.getElementById('welcomeEmail').textContent =
      `${user.email || ""}`;
  }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = 'index.html';
});

// Device toggles & UI Effects
const lightStatusSpan = document.querySelector('#lightStatus span');
const fanStatusSpan = document.querySelector('#fanStatus span');
const lightStatusDot = document.getElementById('lightStatusDot');
const fanStatusDot = document.getElementById('fanStatusDot');
const lightIcon = document.getElementById('lightIcon');
const fanIcon = document.getElementById('fanIcon');

let lightOn = false, fanOn = false;

function updateLightUI() {
  lightStatusSpan.textContent = lightOn ? 'ON' : 'OFF';
  lightStatusSpan.style.color = lightOn ? '#fbbf24' : '';
  lightStatusDot.className = "status-dot " + (lightOn ? "on" : "off");
  if (lightOn) {
    lightIcon.classList.add("on");
    lightIcon.classList.remove("off");
  } else {
    lightIcon.classList.remove("on");
    lightIcon.classList.add("off");
  }
}
function updateFanUI() {
  fanStatusSpan.textContent = fanOn ? 'ON' : 'OFF';
  fanStatusSpan.style.color = fanOn ? '#38bdf8' : '';
  fanStatusDot.className = "status-dot " + (fanOn ? "on" : "off");
  if (fanOn) {
    fanIcon.classList.add("spinning");
  } else {
    fanIcon.classList.remove("spinning");
  }
}

document.getElementById('toggleLight').addEventListener('click', () => {
  lightOn = !lightOn;
  updateLightUI();
});
document.getElementById('toggleFan').addEventListener('click', () => {
  fanOn = !fanOn;
  updateFanUI();
});

// Initial state
updateLightUI();
updateFanUI();
