const { db } = require('../firebase/firebaseAdmin');
const logger = require('../utils/logger');

// In-memory fallback if Firestore is operating without live credentials
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
      logger.info(`Firestore Save Success: ${docRef.id}`);
      console.log('Firestore Save Success:', docRef.id);
      return { id: docRef.id, ...contactData };
    } catch (err) {
      logger.error(`Firestore Save Failed: ${err.message}`);
      console.log('Firestore Save Failed:', err.message);
      throw new Error(`Firestore Save Error: ${err.message}`);
    }
  } else {
    // If db is not initialized, log warning and store in fallback
    const mockId = `local-${Date.now()}`;
    logger.warn(`Firestore unavailable (using local fallback). ID: ${mockId}`);
    console.log('Firestore Save Success (Local Fallback):', mockId);
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
      throw new Error(`Firestore Error: ${err.message}`);
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
