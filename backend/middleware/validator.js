const validator = require('validator');

/**
 * Validate and sanitize contact form input payload
 */
const validateContactInput = (req, res, next) => {
  let { name, email, subject, message } = req.body;

  // Trim and convert to string
  name = name ? validator.trim(String(name)) : '';
  email = email ? validator.trim(String(email)) : '';
  subject = subject ? validator.trim(String(subject)) : '';
  message = message ? validator.trim(String(message)) : '';

  // Check required / empty values
  if (validator.isEmpty(name)) {
    return res.status(400).json({
      success: false,
      message: 'Name field is required and cannot be empty.',
    });
  }

  if (validator.isEmpty(email)) {
    return res.status(400).json({
      success: false,
      message: 'Email field is required and cannot be empty.',
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email address format.',
    });
  }

  if (validator.isEmpty(subject)) {
    return res.status(400).json({
      success: false,
      message: 'Subject field is required and cannot be empty.',
    });
  }

  if (validator.isEmpty(message)) {
    return res.status(400).json({
      success: false,
      message: 'Message field is required and cannot be empty.',
    });
  }

  // Length validations
  if (!validator.isLength(name, { min: 2, max: 100 })) {
    return res.status(400).json({
      success: false,
      message: 'Name must be between 2 and 100 characters.',
    });
  }

  if (!validator.isLength(subject, { min: 3, max: 200 })) {
    return res.status(400).json({
      success: false,
      message: 'Subject must be between 3 and 200 characters.',
    });
  }

  if (!validator.isLength(message, { min: 10, max: 5000 })) {
    return res.status(400).json({
      success: false,
      message: 'Message must be between 10 and 5000 characters.',
    });
  }

  // Escape sanitized inputs
  req.sanitizedBody = {
    name: validator.escape(name),
    email: validator.normalizeEmail(email),
    subject: validator.escape(subject),
    message: validator.escape(message),
  };

  next();
};

/**
 * Validate newsletter subscription input
 */
const validateNewsletterInput = (req, res, next) => {
  let { email } = req.body;
  email = email ? validator.trim(String(email)) : '';

  if (validator.isEmpty(email) || !validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.',
    });
  }

  req.sanitizedBody = {
    email: validator.normalizeEmail(email),
  };

  next();
};

module.exports = {
  validateContactInput,
  validateNewsletterInput,
};
