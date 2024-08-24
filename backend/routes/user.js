const express = require('express');
const router = express.Router();

// Custom imports file
const { index } = require('../controllers/user');

router.get('/', index);

module.exports = router;
