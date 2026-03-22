const prisma = require('../prisma');

exports.getNotifications = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching notifications tracking payloads.' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await prisma.notification.update({
      where: { id: parseInt(id) },
      data: { isRead: true }
    });
    res.json(notification);
  } catch (error) {
    res.status(400).json({ error: 'Failed to mark read setups.' });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
    res.json({ message: 'All marked as read correctly filters sets frameworks.' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to verify updates properly.' });
  }
};

// Exportable helper for other controllers
exports.createSystemNotification = async (userId, title, message) => {
  try {
    await prisma.notification.create({
      data: { userId: parseInt(userId), title, message }
    });
  } catch (error) {
    console.error('System Notification Error Setup Logging:', error);
  }
};
