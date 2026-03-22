const express = require('express');
const { getColleges, createCollege, updateCollege, deleteCollege, predictColleges, getCutoffs, createCutoff, updateCutoff, deleteCutoff } = require('../controllers/collegeController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
router.get('/', getColleges);
router.get('/cutoffs/list', getCutoffs); 
router.post('/predict', predictColleges); // Publicly accessible prediction

// Protected routes (Admin/Counsellor only usually, but let's just keep as auth for now)
router.use(authMiddleware);

router.post('/', createCollege);
router.put('/:id', updateCollege);
router.delete('/:id', deleteCollege);
router.post('/cutoffs', createCutoff); 
router.put('/cutoffs/:id', updateCutoff); 
router.delete('/cutoffs/:id', deleteCutoff);

module.exports = router;
