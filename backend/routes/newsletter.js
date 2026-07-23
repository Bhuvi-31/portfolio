const express = require('express');
const router = express.Router();
const { handleNewsletterSubscription } = require('../controllers/newsletterController');
const { validateNewsletterInput } = require('../middleware/validator');
const { apiLimiter } = require('../middleware/rateLimiter');

router.post('/', apiLimiter, validateNewsletterInput, handleNewsletterSubscription);

module.exports = router;
