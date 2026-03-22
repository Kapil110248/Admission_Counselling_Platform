const prisma = require('../prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createSystemNotification } = require('./notificationController');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret';

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, specialized } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, password are required.' });

    if (role === 'Admin') {
      return res.status(403).json({ error: 'Admin registration is not allowed publicly.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email already registered.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { 
        name, 
        email, 
        password: hashedPassword, 
        role: role || 'Student', 
        isVerified: role === 'Counsellor' ? false : true, 
        phone: phone || null, 
        specialized: specialized || null 
      }
    });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    
    try {
      const admins = await prisma.user.findMany({ where: { role: 'Admin' } });
      for (const admin of admins) {
        await createSystemNotification(admin.id, 'New Registration', `New user registered: ${user.name} (${user.role})`);
      }
    } catch (err) {
      console.error('Failed to notify admins:', err);
    }

    res.status(201).json({ message: 'User registered successfully!', token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error setups framing accurately layouts sets correctly.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials.' });

    if (user.role === 'Counsellor' && !user.isVerified) {
      return res.status(403).json({ error: 'Your account is pending approval from Admin.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: 'Login successful!', token, user: { id: user.id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified } });
  } catch (error) {
    res.status(500).json({ error: 'Server Error sets trigger dashboard trigger config setups accurately.' });
  }
};
