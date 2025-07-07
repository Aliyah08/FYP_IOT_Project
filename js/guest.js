// Firebase Configuration (Replace with your actual config)
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// DOM Elements
const connectionStatus = document.getElementById('connectionStatus');
const connectionText = document.getElementById('connectionText');
const loadingOverlay = document.getElementById('loadingOverlay');

// Light Elements
const lightStatus = document.getElementById('lightStatus');
const lightEnergyValue = document.getElementById('lightEnergyValue');
const lightLastUpdate = document.getElementById('lightLastUpdate');

// Fan Elements
const fanStatus = document.getElementById('fanStatus');
const fanEnergyValue = document.getElementById('fanEnergyValue');
const fanTempValue = document.getElementById('fanTempValue');
const fanSpeedValue = document.getElementById('fanSpeedValue');
const fanLastUpdate = document.getElementById('fanLastUpdate');
const fanBlades = document.getElementById('fanBlades');

// Connection Status
let isConnected = false;

// Update Connection Status
function updateConnectionStatus(connected) {
    isConnected = connected;
    if (connected) {
        connectionStatus.classList.add('connected');
        connectionText.textContent = 'Online';
    } else {
        connectionStatus.classList.remove('connected');
        connectionText.textContent = 'Offline';
    }
}

// Format timestamp
function formatTimestamp(timestamp) {
    if (!timestamp) return '--';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
        hour12: true, 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// Update Light Status
function updateLightStatus(data) {
    if (!data) return;
    
    const { status, energyUsage, lastUpdated } = data;
    
    // Update status
    if (status) {
        lightStatus.className = `device-status ${status.toLowerCase()}`;
        lightStatus.querySelector('.status-text').textContent = status.toUpperCase();
    }
    
    // Update energy usage
    if (energyUsage !== undefined) {
        lightEnergyValue.textContent = energyUsage.toFixed(1);
    }
    
    // Update last updated time
    if (lastUpdated) {
        lightLastUpdate.textContent = formatTimestamp(lastUpdated);
    }
}

// Update Fan Status
function updateFanStatus(data) {
    if (!data) return;
    
    const { status, energyUsage, temperature, speedLevel, lastUpdated } = data;
    
    // Update status
    if (status) {
        fanStatus.className = `device-status ${status.toLowerCase()}`;
        fanStatus.querySelector('.status-text').textContent = status.toUpperCase();
        
        // Control fan animation based on status
        if (status.toLowerCase() === 'on') {
            fanBlades.classList.add('spinning');
        } else {
            fanBlades.classList.remove('spinning');
        }
    }
    
    // Update energy usage
    if (energyUsage !== undefined) {
        fanEnergyValue.textContent = energyUsage.toFixed(1);
    }
    
    // Update temperature
    if (temperature !== undefined) {
        fanTempValue.textContent = temperature;
    }
    
    // Update speed level
    if (speedLevel !== undefined) {
        fanSpeedValue.textContent = `Level ${speedLevel}`;
    }
    
    // Update last updated time
    if (lastUpdated) {
        fanLastUpdate.textContent = formatTimestamp(lastUpdated);
    }
}

// Set up Firebase Real-time Listeners
function setupRealtimeListeners() {
    console.log('Setting up Firebase real-time listeners...');
    
    // Light data listener
    const lightRef = database.ref('devices/light');
    lightRef.on('value', (snapshot) => {
        const lightData = snapshot.val();
        console.log('Light data updated:', lightData);
        updateLightStatus(lightData);
    }, (error) => {
        console.error('Light data error:', error);
    });
    
    // Fan data listener
    const fanRef = database.ref('devices/fan');
    fanRef.on('value', (snapshot) => {
        const fanData = snapshot.val();
        console.log('Fan data updated:', fanData);
        updateFanStatus(fanData);
    }, (error) => {
        console.error('Fan data error:', error);
    });
    
    // Connection state listener
    const connectedRef = database.ref('.info/connected');
    connectedRef.on('value', (snapshot) => {
        updateConnectionStatus(snapshot.val());
        if (snapshot.val()) {
            hideLoading();
        }
    });
}

// Hide loading overlay
function hideLoading() {
    setTimeout(() => {
        loadingOverlay.classList.add('hidden');
    }, 1500); // Show loading for at least 1.5 seconds for better UX
}

// Navigation functions
function goToHomepage() {
    window.location.href = 'index.html'; // or whatever your homepage file is named
}

// Refresh data manually
function refreshData() {
    console.log('Refreshing data...');
    
    // Show brief loading state
    const refreshBtn = document.querySelector('.info-btn.secondary');
    const originalText = refreshBtn.innerHTML;
    refreshBtn.innerHTML = '🔄 Refreshing...';
    refreshBtn.disabled = true;
    
    // Simulate refresh (in real implementation, you might want to force re-fetch)
    setTimeout(() => {
        refreshBtn.innerHTML = originalText;
        refreshBtn.disabled = false;
        
        // Force update by triggering listeners (optional)
        database.ref('devices').once('value').then((snapshot) => {
            const data = snapshot.val();
            if (data) {
                if (data.light) updateLightStatus(data.light);
                if (data.fan) updateFanStatus(data.fan);
            }
        }).catch((error) => {
            console.error('Refresh error:', error);
        });
    }, 1000);
}

// Initialize the dashboard
function initializeDashboard() {
    console.log('Initializing guest dashboard...');
    
    // Set up real-time listeners
    setupRealtimeListeners();
    
    // Add entrance animation
    const cards = document.querySelectorAll('.device-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200 + 500);
    });
}

// Demo data simulation (for testing purposes)
function simulateRealtimeData() {
    // This function simulates real-time data changes for demo purposes
    // Remove this in production when you have actual IoT device data
    
    setInterval(() => {
        // Simulate light data changes
        const lightData = {
            status: Math.random() > 0.3 ? 'ON' : 'OFF',
            energyUsage: Math.random() * 0.5 + 0.1, // 0.1 to 0.6 kW
            lastUpdated: Date.now()
        };
        
        // Simulate fan data changes
        const fanData = {
            status: Math.random() > 0.4 ? 'ON' : 'OFF',
            energyUsage: Math.random() * 1.2 + 0.2, // 0.2 to 1.4 kW
            temperature: Math.floor(Math.random() * 8) + 22, // 22-30°C
            speedLevel: Math.floor(Math.random() * 3) + 1, // 1-3
            lastUpdated: Date.now()
        };
        
        // Update Firebase (in demo mode)
        // In production, this data would come from your actual IoT devices
        database.ref('devices/light').set(lightData);
        database.ref('devices/fan').set(fanData);
        
    }, 5000); // Update every 5 seconds for demo
}

// Page load event
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    
    // Start demo simulation (remove in production)
    // Uncomment the line below for demo purposes
    // simulateRealtimeData();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible' && isConnected) {
        // Refresh data when page becomes visible again
        refreshData();
    }
});

// Handle network connectivity changes
window.addEventListener('online', function() {
    console.log('Network connection restored');
    updateConnectionStatus(true);
    refreshData();
});

window.addEventListener('offline', function() {
    console.log('Network connection lost');
    updateConnectionStatus(false);
});

// Clean up listeners when page unloads
window.addEventListener('beforeunload', function() {
    // Remove Firebase listeners to prevent memory leaks
    database.ref('devices/light').off();
    database.ref('devices/fan').off();
    database.ref('.info/connected').off();
});