const { saveContact } = require('../services/firebaseService');
const { sendContactNotification } = require('../services/emailService');
const logger = require('../utils/logger');

/**
 * @desc    Submit Contact Form
 * @route   POST /api/contact
 * @access  Public
 */
const handleContactForm = async (req, res, next) => {
  const body = req.sanitizedBody || req.body;
  const { name, email, subject, message } = body;
  const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const timestamp = new Date().toLocaleString();

  // Step 11: Log Incoming Request
  logger.info(`Incoming Request: ${JSON.stringify({ name, email, subject, message, ipAddress })}`);
  console.log('Incoming Request:', { name, email, subject, message, ipAddress });

  try {
    // Step 8 & 4: 1. Save data to Firestore collection 'contacts'
    const savedContact = await saveContact({
      name,
      email,
      subject,
      message,
      ipAddress,
    });

    // Step 8: 2. Only after successful save, send email notification
    const emailResult = await sendContactNotification({
      name,
      email,
      subject,
      message,
      timestamp,
      ipAddress,
    });

    if (!emailResult.success) {
      logger.warn(`Email Dispatch Notice: ${emailResult.error}`);
    }

    // Step 9: Return API response
    const successResponse = {
      success: true,
      message: 'Message Sent Successfully',
    };

    logger.info(`API Response: ${JSON.stringify(successResponse)}`);
    console.log('API Response:', successResponse);

    return res.status(200).json(successResponse);
  } catch (error) {
    const errorMsg = error.message || 'Failed to submit contact message';

    logger.error(`Contact Form Error: ${errorMsg}`);
    console.log('Firestore Save Failed:', errorMsg);

    const failureResponse = {
      success: false,
      error: errorMsg,
    };

    logger.info(`API Response: ${JSON.stringify(failureResponse)}`);
    console.log('API Response:', failureResponse);

    return res.status(400).json(failureResponse);
  }
};

module.exports = {
  handleContactForm,
};
