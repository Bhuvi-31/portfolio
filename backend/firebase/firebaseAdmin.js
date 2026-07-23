const admin = require('firebase-admin');
const config = require('../config/db');
const logger = require('../utils/logger');

let db = null;
let auth = null;
let storage = null;

/**
 * Validate whether privateKey is a real formatted PEM key vs dummy placeholder
 */
const isValidPemKey = (key) => {
  if (!key || typeof key !== 'string') return false;
  if (
    key.includes('YOUR_PRIVATE_KEY') ||
    key.includes('dummy') ||
    key.includes('MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC')
  ) {
    return false;
  }
  return key.includes('-----BEGIN PRIVATE KEY-----') && key.includes('-----END PRIVATE KEY-----');
};

try {
  if (
    config.firebase.projectId &&
    config.firebase.clientEmail &&
    isValidPemKey(config.firebase.privateKey)
  ) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebase.projectId,
        clientEmail: config.firebase.clientEmail,
        privateKey: config.firebase.privateKey,
      }),
      storageBucket: config.firebase.storageBucket,
    });

    db = admin.firestore();
    auth = admin.auth();
    storage = admin.storage();
    logger.info('Firebase Admin SDK successfully initialized with active credentials.');
  } else {
    logger.warn(
      'Firebase Admin SDK credentials in backend/.env are using placeholder values. Operating in local fallback mode. Replace backend/.env variables with your real Firebase private key to connect live Firestore.'
    );
  }
} catch (err) {
  logger.error('Firebase Admin SDK Initialization Error:', err.message);
}

module.exports = {
  admin,
  db,
  auth,
  storage,
};
