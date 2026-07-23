const express = require('express');
const router = express.Router();
const { getCertificates } = require('../controllers/certificatesController');

router.get('/', getCertificates);

module.exports = router;
