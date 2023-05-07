const express = require('express');

const chat = require('../controllers/chat');
const authenticate = require('../middleware/auth');

const router = express.Router();

router.get('/getChats', chat.getChats);

router.post('/postChat', authenticate.authenticate, chat.postChat);

module.exports = router;