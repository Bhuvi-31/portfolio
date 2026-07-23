const { saveNewsletter } = require('../services/firebaseService');

/**
 * @desc    Subscribe to Newsletter
 * @route   POST /api/newsletter
 * @access  Public
 */
const handleNewsletterSubscription = async (req, res, next) => {
  try {
    const { email } = req.sanitizedBody || req.body;
    await saveNewsletter(email);

    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed to portfolio newsletter.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while subscribing to newsletter.',
    });
  }
};

module.exports = {
  handleNewsletterSubscription,
};
