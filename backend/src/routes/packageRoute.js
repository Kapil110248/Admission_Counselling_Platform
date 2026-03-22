const express = require('express');
const { getPackages, createPackage, updatePackage, deletePackage } = require('../controllers/packageController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
router.get('/', getPackages);

// Protected routes (Admin only)
router.use(authMiddleware);
router.post('/', createPackage);
router.put('/:id', updatePackage);
router.delete('/:id', deletePackage);

module.exports = router;
