// Firebase Configuration Helper
// This file helps load environment variables safely

// For development/local environment with .env file
function loadEnvironmentVariables() {
    // In a real Node.js environment, you would use:
    // require('dotenv').config();
    
    // For client-side applications, you can use build tools like Vite, Webpack, or Parcel
    // that support environment variables. Here's how to handle different scenarios:
    
    let config = {};
    
    // Method 1: Using Vite (recommended for modern development)
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        config = {
            apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
            authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
            projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
            storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
            appId: import.meta.env.VITE_FIREBASE_APP_ID
        };
    }
    // Method 2: Using Webpack/Create React App
    else if (typeof process !== 'undefined' && process.env) {
        config = {
            apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
            authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
            storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.REACT_APP_FIREBASE_APP_ID
        };
    }
    // Method 3: Using environment variables injected at build time
    else if (typeof window !== 'undefined' && window.ENV) {
        config = {
            apiKey: window.ENV.FIREBASE_API_KEY,
            authDomain: window.ENV.FIREBASE_AUTH_DOMAIN,
            projectId: window.ENV.FIREBASE_PROJECT_ID,
            storageBucket: window.ENV.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: window.ENV.FIREBASE_MESSAGING_SENDER_ID,
            appId: window.ENV.FIREBASE_APP_ID
        };
    }
    // Method 4: Fallback to hardcoded values (not recommended for production)
    else {
        console.warn('Environment variables not found. Using fallback configuration.');
        config = {
            apiKey: "your_api_key_here",
            authDomain: "your_project_id.firebaseapp.com",
            projectId: "your_project_id",
            storageBucket: "your_project_id.appspot.com",
            messagingSenderId: "your_sender_id",
            appId: "your_app_id"
        };
    }
    
    // Validate configuration
    const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
    const missingKeys = requiredKeys.filter(key => !config[key] || config[key].includes('your_'));
    
    if (missingKeys.length > 0) {
        console.error('Missing Firebase configuration keys:', missingKeys);
        throw new Error('Firebase configuration is incomplete. Please check your environment variables.');
    }
    
    return config;
}

// Export the configuration
window.getFirebaseConfig = loadEnvironmentVariables;