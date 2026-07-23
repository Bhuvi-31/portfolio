const admin = require('firebase-admin');
const config = require('../config/db');
const logger = require('../utils/logger');

let db = null;
let auth = null;
let storage = null;

try {
  if (config.firebase.projectId && config.firebase.clientEmail && config.firebase.privateKey) {
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
    logger.info('Firebase Admin SDK successfully initialized.');
  } else {
    logger.warn(
      'Firebase environment variables missing or incomplete. Operating in mock/fallback mode.'
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
