// Firebase Configuration
function getFirebaseConfig() {
    const config = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID
    };
    
    // Validate configuration
    const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
    const missingKeys = requiredKeys.filter(key => !config[key]);
    
    if (missingKeys.length > 0) {
        console.error('Missing Firebase configuration keys:', missingKeys);
        console.error('Available env vars:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));
        throw new Error('Firebase configuration is incomplete. Please check your environment variables.');
    }
    
    return config;
}
// Export the configuration
window.getFirebaseConfig = getFirebaseConfig;