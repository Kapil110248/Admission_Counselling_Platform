const prisma = require('../prisma');
const { createSystemNotification } = require('./notificationController');

exports.createEnquiry = async (req, res) => {
  try {
    const { studentId, counsellorId, subject, query } = req.body;
    if (!studentId || !counsellorId || !subject || !query) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const enquiry = await prisma.counsellingEnquiry.create({
      data: {
        studentId: parseInt(studentId),
        counsellorId: parseInt(counsellorId),
        subject,
        query,
        status: 'Pending'
      },
      include: { student: true }
    });

    // Notify the counsellor
    await createSystemNotification(
      counsellorId,
      'New Counselling Enquiry',
      `${enquiry.student.name} has sent a new enquiry regarding ${subject}.`
    );

    res.status(201).json(enquiry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit enquiry' });
  }
};

exports.getCounsellorEnquiries = async (req, res) => {
  try {
    const { counsellorId } = req.params;
    const enquiries = await prisma.counsellingEnquiry.findMany({
      where: { counsellorId: parseInt(counsellorId) },
      include: { student: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
};

exports.getStudentEnquiries = async (req, res) => {
  try {
    const { studentId } = req.params;
    const enquiries = await prisma.counsellingEnquiry.findMany({
      where: { studentId: parseInt(studentId) },
      orderBy: { createdAt: 'desc' }
    });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
};

exports.updateEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Approved, Rejected

    const updated = await prisma.counsellingEnquiry.update({
      where: { id: parseInt(id) },
      data: { status },
      include: { counsellor: true }
    });

    // Notify the student
    await createSystemNotification(
      updated.studentId,
      `Enquiry ${status}`,
      `Your mentorship enquiry for ${updated.subject} has been ${status} by ${updated.counsellor.name}.`
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update enquiry status' });
  }
};
