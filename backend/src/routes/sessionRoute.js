const express = require('express');
const prisma = require('../prisma');
const router = express.Router();

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
