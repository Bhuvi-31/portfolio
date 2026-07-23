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

  // Requirement 13: Log Incoming Request
  logger.info(`Incoming Request: ${JSON.stringify({ name, email, subject, message, ipAddress })}`);
  console.log('Incoming Request:', { name, email, subject, message, ipAddress });

  try {
    // Requirement 13: Log Saving Firestore...
    logger.info('Saving Firestore...');
    console.log('Saving Firestore...');

    const savedContact = await saveContact({
      name,
      email,
      subject,
      message,
      ipAddress,
    });

    // Requirement 13: Log Firestore Saved
    logger.info(`Firestore Saved: ${savedContact.id}`);
    console.log('Firestore Saved:', savedContact.id);

    // Requirement 13: Log Sending Email...
    logger.info('Sending Email...');
    console.log('Sending Email...');

    const emailResult = await sendContactNotification({
      name,
      email,
      subject,
      message,
      timestamp,
      ipAddress,
    });

    if (emailResult.success) {
      // Requirement 13: Log Email Sent
      logger.info(`Email Sent: ${emailResult.messageId || 'Success'}`);
      console.log('Email Sent:', emailResult.messageId || 'Success');
    } else {
      logger.warn(`Email Failed: ${emailResult.error}`);
      console.log('Email Failed:', emailResult.error);
    }

    // Requirement 9 & 13: Log API Success & Return Response
    const successResponse = {
      success: true,
      message: 'Message Sent Successfully',
    };

    logger.info(`API Success: ${JSON.stringify(successResponse)}`);
    console.log('API Success:', successResponse);

    return res.status(200).json(successResponse);
  } catch (error) {
    const errorMsg = error.message || 'Failed to submit contact message';

    logger.error(`Contact Form Error: ${errorMsg}`);
    console.log('API Error:', errorMsg);

    const failureResponse = {
      success: false,
      error: errorMsg,
    };

    logger.info(`API Response Error: ${JSON.stringify(failureResponse)}`);
    console.log('API Response Error:', failureResponse);

    return res.status(400).json(failureResponse);
  }
};

module.exports = {
  handleContactForm,
};
