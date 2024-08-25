const express = require('express');
const router = express.Router();

// Custom imports file
const { userById } = require('../controllers/user');
const { requireSignin } = require('../controllers/auth');

router.get('/secret/:userId', requireSignin, (req, res, next) =>
{
    res.json({
        user: req.profile
    });
});

router.param('userId', userById);

module.exports = router;
