const express = require('express');
const { getExams, createExam, updateExam, deleteExam } = require('../controllers/examController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
router.get('/', getExams);

// Protected routes below
router.use(authMiddleware);
router.post('/', createExam);
router.put('/:id', updateExam);
router.delete('/:id', deleteExam);

module.exports = router;
