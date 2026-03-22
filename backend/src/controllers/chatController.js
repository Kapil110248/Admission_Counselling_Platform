const prisma = require('../prisma');
const { createSystemNotification } = require('./notificationController');

exports.getMessages = async (req, res) => {
  try {
    const { user1Id, user2Id } = req.params;
    const u1 = parseInt(user1Id);
    const u2 = parseInt(user2Id);

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: u1, receiverId: u2 },
          { senderId: u2, receiverId: u1 }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;
    if (!senderId || !receiverId || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId: parseInt(senderId),
        receiverId: parseInt(receiverId),
        content
      }
    });

    const senderData = await prisma.user.findUnique({ where: { id: parseInt(senderId) }, select: { name: true } });
    const senderName = senderData ? senderData.name : 'Someone';
    await createSystemNotification(
      parseInt(receiverId),
      'New Message Received',
      `You have a new message from ${senderName}.`
    );

    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const { userId } = req.params;
    const uid = parseInt(userId);

    const messages = await prisma.message.findMany({
      where: { OR: [{ senderId: uid }, { receiverId: uid }] },
      include: {
        sender: { select: { id: true, name: true, email: true, specialized: true, isVerified: true } },
        receiver: { select: { id: true, name: true, email: true, specialized: true, isVerified: true } }
      }
    });

    const usersMap = new Map();
    messages.forEach(m => {
      const otherUser = m.senderId === uid ? m.receiver : m.sender;
      if (otherUser && otherUser.id !== uid) {
        usersMap.set(otherUser.id, otherUser);
      }
    });

    res.json(Array.from(usersMap.values()));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};
