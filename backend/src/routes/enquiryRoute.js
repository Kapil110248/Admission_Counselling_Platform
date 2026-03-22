const express = require('express');
const { createEnquiry, getCounsellorEnquiries, getStudentEnquiries, updateEnquiryStatus } = require('../controllers/enquiryController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.post('/', createEnquiry);
router.get('/counsellor/:counsellorId', getCounsellorEnquiries);
router.get('/student/:studentId', getStudentEnquiries);
router.put('/:id', updateEnquiryStatus);

module.exports = router;
