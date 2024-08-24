const express = require('express');
const router = express.Router();

// Custom imports file
const { signup, signin } = require('../controllers/user');
const { userSignupValidator, userSigninValidator } = require('../validator/index');

router.post('/signup', userSignupValidator, signup);
router.post('/signin', userSigninValidator, signin);

module.exports = router;
