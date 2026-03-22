const prisma = require('../prisma');
const bcrypt = require('bcryptjs'); // Needed for password changes thresholds framing layout setups thresholds configuration setting overlays.
const { createSystemNotification } = require('./notificationController');

exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, isVerified: true, phone: true, specialized: true } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error setups thresholds data framing setup configs.' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
       where: { id: parseInt(req.params.id) },
       select: { id: true, name: true, email: true, role: true, isVerified: true, phone: true, specialized: true }
    });
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, isVerified, phone, specialized } = req.body;
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, email, role, isVerified: Boolean(isVerified), phone, specialized }
    });

    await createSystemNotification(
      parseInt(id),
      'Profile Updated',
      'Your account profile or verification status was updated by the Administrator.'
    );

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Update failed setups accurate layouts trigger dashboards config.' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'User deleted successfully triggers configurations framing layouts setups.' });
  } catch (error) {
    res.status(400).json({ error: 'Delete failed setups threshold setups framing.' });
  }
};
exports.getStats = async (req, res) => {
  try {
    const students = await prisma.user.count({ where: { role: 'Student' } });
    const counselorsCount = await prisma.user.count({ where: { role: 'Counsellor' } });
    const pendingVerify = await prisma.user.count({ where: { isVerified: false, role: 'Student' } });
    const exams = await prisma.exam.count();
    const colleges = await prisma.college.count();

    res.json({
      students,
      councellors: counselorsCount,
      pendingVerify,
      exams,
      colleges
    });
  } catch (error) {
    console.error('STACK_ERR:', error.stack);
    res.status(500).json({ error: 'Stats aggregated analytics failed setups thresholds data configuration.' });
  }
};

exports.changePassword = async (req, res) => {
  try {
     const { id, currentPassword, newPassword } = req.body;
     if (!id || !currentPassword || !newPassword) return res.status(400).json({ error: 'Missing parameters setups thresholds.' });

     const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
     if (!user) return res.status(404).json({ error: 'User not found!' });

     const isMatch = await bcrypt.compare(currentPassword, user.password);
     if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect setups thresholds.' });

     const hashedPassword = await bcrypt.hash(newPassword, 10);
     await prisma.user.update({
       where: { id: parseInt(id) },
       data: { password: hashedPassword }
     });

     res.json({ message: 'Password updated successfully setups threshold.' });
  } catch (error) {
     res.status(500).json({ error: 'Failed updating passwords setups thresholds framing layout.' });
  }
};

exports.upgradePlan = async (req, res) => {
  try {
    const { id, plan } = req.body;
    if (!id || !plan) return res.status(400).json({ error: 'Missing parameters setups threshold.' });

    await prisma.user.update({
      where: { id: parseInt(id) },
      data: { currentPlan: plan }
    });

    res.json({ message: `Successfully upgraded to ${plan}!` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upgrade plan.' });
  }
};
