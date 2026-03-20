const prisma = require('../prisma');

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

    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};
