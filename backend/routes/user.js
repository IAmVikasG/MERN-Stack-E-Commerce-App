const express = require('express');
const router = express.Router();

// Custom imports file
const { signup } = require('../controllers/user');

router.post('/signup', signup);

module.exports = router;
