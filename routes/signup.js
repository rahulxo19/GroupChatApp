const express = require('express');

const signup = require('../controllers/signup');

const router = express.Router();

router.post('/signup', signup.signup);

router.post('/signin', signup.signin);

module.exports = router;