const express = require('express');
const { getMessages, sendMessage, getConversations } = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
router.use(authMiddleware);

router.get('/conversations/:userId', getConversations);
router.get('/:user1Id/:user2Id', getMessages);
router.post('/', sendMessage);

module.exports = router;
