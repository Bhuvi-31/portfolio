const { saveContact } = require('../services/firebaseService');
const { sendContactNotification } = require('../services/emailService');
const logger = require('../utils/logger');

/**
 * @desc    Submit Contact Form
 * @route   POST /api/contact
 * @access  Public
 */
const handleContactForm = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.sanitizedBody || req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const timestamp = new Date().toLocaleString();

    // 1. Save to Firestore
    await saveContact({
      name,
      email,
      subject,
      message,
      ipAddress,
    });

    // 2. Send email notification asynchronously
    sendContactNotification({
      name,
      email,
      subject,
      message,
      timestamp,
      ipAddress,
    }).catch((err) => {
      logger.error('Background email dispatch failed:', err.message);
    });

    // 3. Return success API response
    return res.status(200).json({
      success: true,
      message: 'Message sent successfully',
    });
  } catch (error) {
    logger.error('Contact Form Controller Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};

module.exports = {
  handleContactForm,
};
