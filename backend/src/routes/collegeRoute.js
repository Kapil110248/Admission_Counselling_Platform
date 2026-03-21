const express = require('express');
const { getColleges, createCollege, updateCollege, deleteCollege, predict, getCutoffs, createCutoff, updateCutoff, deleteCutoff } = require('../controllers/collegeController');
const router = express.Router();

router.get('/', getColleges);
router.post('/', createCollege);
router.put('/:id', updateCollege);
router.delete('/:id', deleteCollege);

// Predict matchings endpoint trigger
router.get('/cutoffs/list', getCutoffs); 
router.post('/cutoffs', createCutoff); // Added create cutoff
router.put('/cutoffs/:id', updateCutoff); // Added update cutoff
router.delete('/cutoffs/:id', deleteCutoff); // Added delete cutoff
router.post('/predict', predict);

module.exports = router;
