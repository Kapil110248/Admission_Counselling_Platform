const express = require('express');
const { getScholarships, createScholarship, updateScholarship, deleteScholarship } = require('../controllers/scholarshipController');
const router = express.Router();

router.get('/', getScholarships);
router.post('/', createScholarship);
router.put('/:id', updateScholarship);
router.delete('/:id', deleteScholarship);

module.exports = router;
