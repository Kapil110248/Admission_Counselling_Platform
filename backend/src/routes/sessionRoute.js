const express = require('express');
const prisma = require('../prisma');
const { createSystemNotification } = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

// Create Session 
router.post('/', async (req, res) => {
  try {
     const { studentId, counsellorId, topic, date, time, url } = req.body;
     const session = await prisma.session.create({
       data: { 
         studentId: parseInt(studentId), 
         counsellorId: parseInt(counsellorId), 
         topic, 
         date, 
         time, 
         url 
       }
     });

     try {
       await createSystemNotification(studentId, 'Session Scheduled', `You successfully scheduled a session on ${topic}.`);
       await createSystemNotification(counsellorId, 'New Session Booking', `A student booked a session with you on ${date} at ${time}.`);
     } catch (err) { console.error('Failed session notifications:', err); }

     res.status(201).json(session);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// Get Sessions
router.get('/', async (req, res) => {
  try {
     const { counsellorId, studentId } = req.query;
     const where = {};
     if (counsellorId) where.counsellorId = parseInt(counsellorId);
     if (studentId) where.studentId = parseInt(studentId);

     const sessions = await prisma.session.findMany({
       where,
       include: { 
         student: { select: { name: true, email: true, specialized: true } },
         counsellor: { select: { name: true, email: true } }
       }
     });
     res.json(sessions);
  } catch (e) { res.status(500).json({ error: 'Fetch sessions failed.' }); }
});

module.exports = router;
