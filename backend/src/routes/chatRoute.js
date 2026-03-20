const express = require('express');
const { getMessages, sendMessage } = require('../controllers/chatController');
const router = express.Router();

router.get('/:user1Id/:user2Id', getMessages);
router.post('/', sendMessage);

module.exports = router;
