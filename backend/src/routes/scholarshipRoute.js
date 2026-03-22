const express = require('express');
const { getScholarships, createScholarship, updateScholarship, deleteScholarship } = require('../controllers/scholarshipController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
router.get('/', getScholarships);

// Protected routes
router.use(authMiddleware);
router.post('/', createScholarship);
router.put('/:id', updateScholarship);
router.delete('/:id', deleteScholarship);

module.exports = router;
