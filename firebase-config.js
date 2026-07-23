/**
 * Frontend Firebase Web SDK Configuration
 * Reads configuration strictly from environment variables.
 * No hardcoded keys or backend admin credentials are contained here.
 */

const getEnvValue = (key, fallbackKey) => {
  // Support Vite environment variables (import.meta.env)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    if (import.meta.env[key]) return import.meta.env[key];
    if (fallbackKey && import.meta.env[fallbackKey]) return import.meta.env[fallbackKey];
  }
  // Support standard process.env (Node / Webpack / Create React App)
  if (typeof process !== 'undefined' && process.env) {
    if (process.env[key]) return process.env[key];
    if (fallbackKey && process.env[fallbackKey]) return process.env[fallbackKey];
  }
  // Support global window runtime config
  if (typeof window !== 'undefined' && window.__ENV__) {
    if (window.__ENV__[key]) return window.__ENV__[key];
    if (fallbackKey && window.__ENV__[fallbackKey]) return window.__ENV__[fallbackKey];
  }
  return '';
};

const firebaseConfig = {
  apiKey: getEnvValue('VITE_FIREBASE_API_KEY', 'FIREBASE_API_KEY'),
  authDomain: getEnvValue('VITE_FIREBASE_AUTH_DOMAIN', 'FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvValue('VITE_FIREBASE_PROJECT_ID', 'FIREBASE_PROJECT_ID'),
  storageBucket: getEnvValue('VITE_FIREBASE_STORAGE_BUCKET', 'FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvValue('VITE_FIREBASE_MESSAGING_SENDER_ID', 'FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvValue('VITE_FIREBASE_APP_ID', 'FIREBASE_APP_ID'),
  measurementId: getEnvValue('VITE_FIREBASE_MEASUREMENT_ID', 'FIREBASE_MEASUREMENT_ID')
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = firebaseConfig;
}

export default firebaseConfig;
