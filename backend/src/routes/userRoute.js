const express = require('express');
const { getUsers, updateUser, deleteUser, getStats, getUser, changePassword, upgradePlan } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
router.use(authMiddleware);

router.get('/stats', getStats);
router.post('/change-password', changePassword); // Added password change endpoint
router.post('/upgrade', upgradePlan);
router.get('/', getUsers);
router.get('/:id', getUser); // Get single user data
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
