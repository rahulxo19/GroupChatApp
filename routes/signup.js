const express = require('express');

const signup = require('../controllers/signup');
const chat = require('../controllers/chat');

const router = express.Router();

router.get('/chat', chat.loggedIn);

router.get('/latestChats?:createdAt', chat.latestChats)

router.post('/postChats', chat.postChats);

router.get('/getChats', chat.getChats);

router.post('/signup', signup.signup);

router.post('/signin', signup.signin);

module.exports = router;