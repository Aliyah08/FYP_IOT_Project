// Import needed functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCeTWTw_eOPHwEkcPLhEreLAIeEx8kf5_Y",
    authDomain: "fyp-iot-project-f89c1.firebaseapp.com",
    projectId: "fyp-iot-project-f89c1",
    storageBucket: "fyp-iot-project-f89c1.firebasestorage.app",
    messagingSenderId: "363047961236",
    appId: "1:363047961236:web:df1be11cfe6f38f390ea81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Export for use in other files
export { app, auth };
