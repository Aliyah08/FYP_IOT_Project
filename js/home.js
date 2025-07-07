// /js/home.js

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
    // Display name and email
    document.getElementById('welcomeTitle').textContent =
      `Welcome, ${user.displayName || "User"}!`;
    document.getElementById('welcomeEmail').textContent =
      `${user.email || ""}`;
  }
});

// Logout button
document.getElementById('logoutBtn').addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = 'index.html';
});

// DEMO device toggles (you can replace this with your IoT logic!)
const lightStatusSpan = document.querySelector('#lightStatus span');
const fanStatusSpan = document.querySelector('#fanStatus span');
let lightOn = false, fanOn = false;

document.getElementById('toggleLight').addEventListener('click', () => {
  lightOn = !lightOn;
  lightStatusSpan.textContent = lightOn ? 'ON' : 'OFF';
  lightStatusSpan.style.color = lightOn ? '#22c55e' : '';
});
document.getElementById('toggleFan').addEventListener('click', () => {
  fanOn = !fanOn;
  fanStatusSpan.textContent = fanOn ? 'ON' : 'OFF';
  fanStatusSpan.style.color = fanOn ? '#38bdf8' : '';
});
