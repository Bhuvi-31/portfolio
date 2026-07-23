const { db } = require('../firebase/firebaseAdmin');
const logger = require('../utils/logger');

// In-memory fallback if Firestore is not connected yet
const inMemoryContacts = [];
const inMemoryNewsletters = [];

/**
 * Save contact submission into Firestore 'contacts' collection
 */
const saveContact = async ({ name, email, subject, message, ipAddress }) => {
  const contactData = {
    name,
    email,
    subject,
    message,
    createdAt: new Date().toISOString(),
    ipAddress,
    status: 'new',
  };

  if (db) {
    try {
      const docRef = await db.collection('contacts').add(contactData);
      logger.info(`Contact saved to Firestore with ID: ${docRef.id}`);
      return { id: docRef.id, ...contactData };
    } catch (err) {
      logger.error(`Firestore save error: ${err.message}`);
      throw err;
    }
  } else {
    logger.warn('Firestore db instance unavailable. Storing contact in fallback storage.');
    const mockId = `mock-${Date.now()}`;
    const record = { id: mockId, ...contactData };
    inMemoryContacts.push(record);
    return record;
  }
};

/**
 * Save newsletter subscription
 */
const saveNewsletter = async (email) => {
  const record = {
    email,
    subscribedAt: new Date().toISOString(),
    status: 'active',
  };

  if (db) {
    try {
      const docRef = await db.collection('newsletters').add(record);
      logger.info(`Newsletter subscriber saved with ID: ${docRef.id}`);
      return { id: docRef.id, ...record };
    } catch (err) {
      logger.error(`Firestore newsletter error: ${err.message}`);
      throw err;
    }
  } else {
    inMemoryNewsletters.push(record);
    return { id: `mock-news-${Date.now()}`, ...record };
  }
};

module.exports = {
  saveContact,
  saveNewsletter,
};
