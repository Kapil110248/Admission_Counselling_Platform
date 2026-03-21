const express = require('express');
const { getUsers, updateUser, deleteUser, getStats, getUser, changePassword } = require('../controllers/userController');
const router = express.Router();

router.get('/stats', getStats);
router.post('/change-password', changePassword); // Added password change endpoint
router.get('/', getUsers);
router.get('/:id', getUser); // Get single user data
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
