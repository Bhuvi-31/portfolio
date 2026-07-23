const express = require('express');
const router = express.Router();
const { handleContactForm } = require('../controllers/contactController');
const { validateContactInput } = require('../middleware/validator');
const { contactLimiter } = require('../middleware/rateLimiter');

router.post('/', contactLimiter, validateContactInput, handleContactForm);

module.exports = router;
