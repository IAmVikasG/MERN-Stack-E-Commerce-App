const express = require('express');
const router = express.Router();

// Custom imports file
const { signup, signin, signout } = require('../controllers/auth');
const { userSignupValidator, userSigninValidator } = require('../validator/index');

router.post('/signup', userSignupValidator, signup);
router.post('/signin', userSigninValidator, signin);
router.get('/signout', signout);

module.exports = router;
